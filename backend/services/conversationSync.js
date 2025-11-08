require('dotenv').config();
const esClient = require('../config/elasticsearch');

const MESSAGES_INDEX = process.env.ES_INDEX || 'ai-proxy-message';
const CONVERSATIONS_INDEX = 'ai-proxy-conversations';

// Helper function to extract conversation ID from rawResponse
function extractConversationId(rawResponse) {
  if (!rawResponse) return null;
  const match = rawResponse.match(/"conversation_id":\s*"([^"]+)"/);
  return match ? match[1] : null;
}

// Helper function to extract model information
function extractModel(rawResponse) {
  if (!rawResponse) return null;
  const match = rawResponse.match(/"model_slug":\s*"([^"]+)"/);
  return match ? match[1] : null;
}

// Create or update the conversations index with proper mapping
async function initializeConversationsIndex() {
  try {
    // Check if index already exists
    const indexExists = await esClient.indices.exists({ index: CONVERSATIONS_INDEX });

    if (!indexExists) {
      console.log(`Creating index: ${CONVERSATIONS_INDEX}`);

      await esClient.indices.create({
        index: CONVERSATIONS_INDEX,
        body: {
          mappings: {
            properties: {
              conversationId: { type: 'keyword' },
              username: { type: 'keyword' },
              firstMessageTime: { type: 'date' },
              lastMessageTime: { type: 'date' },
              messageCount: { type: 'integer' },
              firstQuestion: { type: 'text' },
              lastQuestion: { type: 'text' },
              model: { type: 'keyword' },
              clientIp: { type: 'keyword' },
              totalTokens: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
              messageIds: { type: 'keyword' }
            }
          },
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0
          }
        }
      });

      console.log(`✓ Index ${CONVERSATIONS_INDEX} created successfully`);
      return { created: true, message: 'Index created successfully' };
    } else {
      console.log(`Index ${CONVERSATIONS_INDEX} already exists`);
      return { created: false, message: 'Index already exists' };
    }
  } catch (error) {
    console.error('Error initializing conversations index:', error);
    throw error;
  }
}

// Sync conversations from messages index
async function syncConversations() {
  const syncStart = new Date();
  console.log(`Starting conversation sync at ${syncStart.toISOString()}`);

  try {
    // Ensure conversations index exists
    await initializeConversationsIndex();

    // Fetch all messages
    console.log('Fetching messages from source index...');
    const response = await esClient.search({
      index: MESSAGES_INDEX,
      body: {
        query: { match_all: {} },
        sort: [{ requestTime: { order: 'asc' } }],
        size: 10000,
        _source: true
      }
    });

    const messages = response.hits.hits;
    console.log(`Found ${messages.length} messages to process`);

    // Group messages by conversation ID
    const conversationsMap = new Map();

    messages.forEach(hit => {
      const source = hit._source;
      const conversationId = extractConversationId(source.rawResponse);

      if (!conversationId) {
        console.log(`Skipping message ${hit._id} - no conversation ID found`);
        return;
      }

      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          conversationId,
          username: source.username,
          firstMessageTime: source.requestTime,
          lastMessageTime: source.requestTime,
          messageCount: 0,
          firstQuestion: source.userQuestion,
          lastQuestion: source.userQuestion,
          model: extractModel(source.rawResponse),
          clientIp: source.clientIp,
          messageIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      const conversation = conversationsMap.get(conversationId);
      conversation.messageCount++;
      conversation.messageIds.push(hit._id);
      conversation.lastQuestion = source.userQuestion;
      conversation.updatedAt = new Date().toISOString();

      // Update last message time if this message is more recent
      const messageTime = new Date(source.requestTime);
      const currentLastTime = new Date(conversation.lastMessageTime);
      if (messageTime > currentLastTime) {
        conversation.lastMessageTime = source.requestTime;
      }

      // Update first message time if this message is older
      const currentFirstTime = new Date(conversation.firstMessageTime);
      if (messageTime < currentFirstTime) {
        conversation.firstMessageTime = source.requestTime;
        conversation.firstQuestion = source.userQuestion;
      }
    });

    console.log(`Grouped into ${conversationsMap.size} conversations`);

    // Bulk index conversations
    const bulkOperations = [];
    conversationsMap.forEach((conversation, conversationId) => {
      // Use conversationId as document ID for idempotent updates
      bulkOperations.push({
        index: {
          _index: CONVERSATIONS_INDEX,
          _id: conversationId
        }
      });
      bulkOperations.push(conversation);
    });

    if (bulkOperations.length > 0) {
      console.log('Indexing conversations...');
      const bulkResponse = await esClient.bulk({
        body: bulkOperations,
        refresh: true
      });

      if (bulkResponse.errors) {
        const erroredDocuments = bulkResponse.items.filter(item => item.index && item.index.error);
        console.error(`Encountered ${erroredDocuments.length} errors during bulk indexing`);
        erroredDocuments.forEach(doc => {
          console.error('Error:', doc.index.error);
        });
      } else {
        console.log(`✓ Successfully indexed ${conversationsMap.size} conversations`);
      }
    }

    const syncEnd = new Date();
    const duration = (syncEnd - syncStart) / 1000;

    const stats = {
      success: true,
      syncStartTime: syncStart.toISOString(),
      syncEndTime: syncEnd.toISOString(),
      durationSeconds: duration,
      messagesProcessed: messages.length,
      conversationsFound: conversationsMap.size,
      conversationsIndexed: conversationsMap.size
    };

    console.log('Sync completed successfully:', stats);
    return stats;

  } catch (error) {
    console.error('Error during conversation sync:', error);
    throw error;
  }
}

// Delete the conversations index (for cleanup/reset)
async function deleteConversationsIndex() {
  try {
    const indexExists = await esClient.indices.exists({ index: CONVERSATIONS_INDEX });

    if (indexExists) {
      await esClient.indices.delete({ index: CONVERSATIONS_INDEX });
      console.log(`✓ Index ${CONVERSATIONS_INDEX} deleted successfully`);
      return { deleted: true, message: 'Index deleted successfully' };
    } else {
      console.log(`Index ${CONVERSATIONS_INDEX} does not exist`);
      return { deleted: false, message: 'Index does not exist' };
    }
  } catch (error) {
    console.error('Error deleting conversations index:', error);
    throw error;
  }
}

// Get sync statistics
async function getSyncStats() {
  try {
    const indexExists = await esClient.indices.exists({ index: CONVERSATIONS_INDEX });

    if (!indexExists) {
      return {
        indexExists: false,
        conversationCount: 0,
        message: 'Conversations index does not exist'
      };
    }

    const countResponse = await esClient.count({ index: CONVERSATIONS_INDEX });
    const statsResponse = await esClient.indices.stats({ index: CONVERSATIONS_INDEX });

    return {
      indexExists: true,
      conversationCount: countResponse.count,
      indexSize: statsResponse.indices[CONVERSATIONS_INDEX].total.store.size_in_bytes,
      documentCount: statsResponse.indices[CONVERSATIONS_INDEX].total.docs.count
    };
  } catch (error) {
    console.error('Error getting sync stats:', error);
    throw error;
  }
}

module.exports = {
  initializeConversationsIndex,
  syncConversations,
  deleteConversationsIndex,
  getSyncStats,
  CONVERSATIONS_INDEX
};
