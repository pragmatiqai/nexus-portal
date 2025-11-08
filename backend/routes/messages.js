const express = require('express');
const router = express.Router();
const esClient = require('../config/elasticsearch');
const { CONVERSATIONS_INDEX, updateRiskAssessment } = require('../services/conversationSync');

const INDEX_NAME = process.env.ES_INDEX || 'ai-proxy-message';

// Helper function to extract conversation ID from rawResponse
function extractConversationId(rawResponse) {
  if (!rawResponse) return null;

  // Look for conversation_id in the rawResponse text
  const match = rawResponse.match(/"conversation_id":\s*"([^"]+)"/);
  return match ? match[1] : null;
}

// Get list of conversations with optional user filter and pagination
// Now reads from the conversations index instead of grouping on the fly
router.get('/conversations', async (req, res) => {
  try {
    const { username, page = 1, size = 50 } = req.query;
    const from = (page - 1) * size;

    // Check if conversations index exists
    const indexExists = await esClient.indices.exists({ index: CONVERSATIONS_INDEX });

    if (!indexExists) {
      return res.status(404).json({
        error: 'Conversations index not found',
        message: 'Please run sync first using POST /api/sync/sync'
      });
    }

    // Build query
    const query = username ? {
      term: { 'username': username }
    } : { match_all: {} };

    // Fetch from conversations index
    const response = await esClient.search({
      index: CONVERSATIONS_INDEX,
      body: {
        query: query,
        sort: [{ lastMessageTime: { order: 'desc' } }],
        from: from,
        size: parseInt(size)
      }
    });

    const conversations = response.hits.hits.map(hit => ({
      conversationId: hit._source.conversationId,
      username: hit._source.username,
      firstQuestion: hit._source.firstQuestion,
      lastQuestion: hit._source.lastQuestion,
      lastMessageTime: hit._source.lastMessageTime,
      firstMessageTime: hit._source.firstMessageTime,
      messageCount: hit._source.messageCount,
      model: hit._source.model,
      clientIp: hit._source.clientIp,
      riskAssessment: hit._source.riskAssessment || null
    }));

    res.json({
      conversations,
      total: response.hits.total.value,
      page: parseInt(page),
      size: parseInt(size),
      totalPages: Math.ceil(response.hits.total.value / size)
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations', message: error.message });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    const response = await esClient.search({
      index: INDEX_NAME,
      body: {
        query: { match_all: {} },
        sort: [{ requestTime: { order: 'asc' } }],
        size: 10000,
        _source: true
      }
    });

    // Filter messages that belong to this conversation
    const messages = response.hits.hits
      .filter(hit => {
        const convId = extractConversationId(hit._source.rawResponse);
        return convId === conversationId;
      })
      .map(hit => ({
        id: hit._id,
        username: hit._source.username,
        userQuestion: hit._source.userQuestion,
        parsedResponse: hit._source.parsedResponse,
        requestTime: hit._source.requestTime,
        requestId: hit._source.requestId,
        clientIp: hit._source.clientIp,
        conversationId: conversationId
      }));

    res.json({
      conversationId,
      messages,
      messageCount: messages.length
    });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({ error: 'Failed to fetch conversation messages', message: error.message });
  }
});

// Get all messages with optional user filter and pagination
router.get('/', async (req, res) => {
  try {
    const { username, page = 1, size = 50 } = req.query;
    const from = (page - 1) * size;

    const query = {
      bool: {
        must: []
      }
    };

    // Add user filter if provided
    if (username) {
      query.bool.must.push({
        term: { 'username.keyword': username }
      });
    }

    const response = await esClient.search({
      index: INDEX_NAME,
      body: {
        query: query.bool.must.length > 0 ? query : { match_all: {} },
        sort: [{ requestTime: { order: 'desc' } }],
        from: from,
        size: parseInt(size)
      }
    });

    const messages = response.hits.hits.map(hit => ({
      id: hit._id,
      username: hit.fields?.username?.[0] || hit._source?.username,
      userQuestion: hit.fields?.userQuestion?.[0] || hit._source?.userQuestion,
      parsedResponse: hit.fields?.parsedResponse?.[0] || hit._source?.parsedResponse,
      requestTime: hit.fields?.requestTime?.[0] || hit._source?.requestTime,
      requestId: hit.fields?.requestId?.[0] || hit._source?.requestId,
      clientIp: hit.fields?.clientIp?.[0] || hit._source?.clientIp
    }));

    res.json({
      messages,
      total: response.hits.total.value,
      page: parseInt(page),
      size: parseInt(size),
      totalPages: Math.ceil(response.hits.total.value / size)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total messages count
    const totalMessagesResponse = await esClient.count({
      index: INDEX_NAME
    });
    const totalMessages = totalMessagesResponse.count;

    // Get total conversations count
    const conversationsIndexExists = await esClient.indices.exists({ index: CONVERSATIONS_INDEX });
    let totalConversations = 0;
    let conversationsLast30Days = 0;
    let criticalIssuesLast30Days = 0;
    let highRiskIssuesLast30Days = 0;

    if (conversationsIndexExists) {
      // Total conversations
      const totalConversationsResponse = await esClient.count({
        index: CONVERSATIONS_INDEX
      });
      totalConversations = totalConversationsResponse.count;

      // Conversations in last 30 days
      const conversationsLast30Response = await esClient.count({
        index: CONVERSATIONS_INDEX,
        body: {
          query: {
            range: {
              lastMessageTime: {
                gte: thirtyDaysAgo.toISOString()
              }
            }
          }
        }
      });
      conversationsLast30Days = conversationsLast30Response.count;

      // Critical issues in last 30 days
      const criticalIssuesResponse = await esClient.count({
        index: CONVERSATIONS_INDEX,
        body: {
          query: {
            bool: {
              must: [
                {
                  term: {
                    'riskAssessment.overall_risk_level': 'CRITICAL'
                  }
                },
                {
                  range: {
                    lastMessageTime: {
                      gte: thirtyDaysAgo.toISOString()
                    }
                  }
                }
              ]
            }
          }
        }
      });
      criticalIssuesLast30Days = criticalIssuesResponse.count;

      // High risk issues in last 30 days
      const highRiskIssuesResponse = await esClient.count({
        index: CONVERSATIONS_INDEX,
        body: {
          query: {
            bool: {
              must: [
                {
                  term: {
                    'riskAssessment.overall_risk_level': 'HIGH'
                  }
                },
                {
                  range: {
                    lastMessageTime: {
                      gte: thirtyDaysAgo.toISOString()
                    }
                  }
                }
              ]
            }
          }
        }
      });
      highRiskIssuesLast30Days = highRiskIssuesResponse.count;
    }

    res.json({
      totalConversations,
      totalMessages,
      conversationsLast30Days,
      criticalIssuesLast30Days,
      highRiskIssuesLast30Days
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics', message: error.message });
  }
});

// Get unique users
router.get('/users', async (req, res) => {
  try {
    const response = await esClient.search({
      index: INDEX_NAME,
      body: {
        size: 0,
        aggs: {
          unique_users: {
            terms: {
              field: 'username.keyword',
              size: 1000,
              order: { _key: 'asc' }
            }
          }
        }
      }
    });

    const users = response.aggregations.unique_users.buckets.map(bucket => ({
      username: bucket.key,
      count: bucket.doc_count
    }));

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// Get message by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await esClient.get({
      index: INDEX_NAME,
      id: id
    });

    res.json({
      id: response._id,
      ...response._source
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message', message: error.message });
  }
});

// Update risk assessment for a conversation
router.post('/conversations/:conversationId/risk-assessment', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const riskAssessmentData = req.body;

    console.log('=== Backend: Risk Assessment Request Received ===');
    console.log('Conversation ID:', conversationId);
    console.log('Request body:', JSON.stringify(riskAssessmentData, null, 2));

    // Validate required fields
    if (!riskAssessmentData.overall_risk_level) {
      console.error('Validation failed: Missing overall_risk_level');
      return res.status(400).json({
        error: 'Missing required field: overall_risk_level',
        received: riskAssessmentData
      });
    }

    console.log('Validation passed, updating conversation...');

    // Update the conversation with risk assessment
    const result = await updateRiskAssessment(conversationId, riskAssessmentData);

    console.log('Update result:', result);
    console.log('=== Backend: Risk Assessment Stored Successfully ===');

    res.json(result);
  } catch (error) {
    console.error('=== Backend: Risk Assessment Error ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    res.status(500).json({
      error: 'Failed to update risk assessment',
      message: error.message
    });
  }
});

module.exports = router;
