require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const authConfig = process.env.ES_API_KEY
  ? { apiKey: process.env.ES_API_KEY }
  : {
      username: process.env.ES_USERNAME || 'elastic',
      password: process.env.ES_PASSWORD || ''
    };

const client = new Client({
  node: process.env.ES_NODE,
  auth: authConfig
});

async function testConnection() {
  console.log('Testing connection to:', process.env.ES_NODE);
  console.log('Using API Key authentication');

  try {
    // Test cluster health
    console.log('\n1. Testing cluster health...');
    const health = await client.cluster.health();
    console.log('✓ Cluster health:', health.status);
    console.log('  Cluster name:', health.cluster_name);
    console.log('  Number of nodes:', health.number_of_nodes);

    // Check if index exists
    console.log('\n2. Checking if ai-proxy-message index exists...');
    const indexExists = await client.indices.exists({ index: 'ai-proxy-message' });
    console.log('✓ Index exists:', indexExists);

    if (indexExists) {
      // Get index stats
      console.log('\n3. Getting index statistics...');
      const stats = await client.indices.stats({ index: 'ai-proxy-message' });
      const docCount = stats._all.primaries.docs.count;
      console.log('✓ Document count:', docCount);

      // Get sample document
      console.log('\n4. Fetching sample documents...');
      const search = await client.search({
        index: 'ai-proxy-message',
        size: 1
      });
      console.log('✓ Sample document retrieved');
      if (search.hits.hits.length > 0) {
        const doc = search.hits.hits[0];
        console.log('  Document ID:', doc._id);
        console.log('  Fields available:', Object.keys(doc._source || doc.fields || {}));
      }
    }

    console.log('\n✓ Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Connection test failed!');
    console.error('Error:', error.message);
    if (error.meta) {
      console.error('Status:', error.meta.statusCode);
      console.error('Body:', JSON.stringify(error.meta.body, null, 2));
    }
    process.exit(1);
  }
}

testConnection();
