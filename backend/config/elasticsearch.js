require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

// Support both API Key and username/password authentication
const authConfig = process.env.ES_API_KEY
  ? { apiKey: process.env.ES_API_KEY }
  : {
      username: process.env.ES_USERNAME || 'elastic',
      password: process.env.ES_PASSWORD || ''
    };

const client = new Client({
  node: process.env.ES_NODE || 'http://localhost:9200',
  auth: authConfig
});

// Test connection
async function testConnection() {
  try {
    const health = await client.cluster.health();
    console.log('Elasticsearch connection successful:', health.status);
    return true;
  } catch (error) {
    console.error('Elasticsearch connection failed:', error.message);
    return false;
  }
}

testConnection();

module.exports = client;
