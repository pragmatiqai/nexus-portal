const express = require('express');
const router = express.Router();
const {
  initializeConversationsIndex,
  syncConversations,
  deleteConversationsIndex,
  getSyncStats
} = require('../services/conversationSync');

// Initialize the conversations index
router.post('/init', async (req, res) => {
  try {
    const result = await initializeConversationsIndex();
    res.json(result);
  } catch (error) {
    console.error('Error initializing conversations index:', error);
    res.status(500).json({ error: 'Failed to initialize index', message: error.message });
  }
});

// Trigger conversation sync
router.post('/sync', async (req, res) => {
  try {
    const stats = await syncConversations();
    res.json(stats);
  } catch (error) {
    console.error('Error syncing conversations:', error);
    res.status(500).json({ error: 'Failed to sync conversations', message: error.message });
  }
});

// Get sync statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getSyncStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting sync stats:', error);
    res.status(500).json({ error: 'Failed to get sync stats', message: error.message });
  }
});

// Delete conversations index (use with caution!)
router.delete('/index', async (req, res) => {
  try {
    const result = await deleteConversationsIndex();
    res.json(result);
  } catch (error) {
    console.error('Error deleting conversations index:', error);
    res.status(500).json({ error: 'Failed to delete index', message: error.message });
  }
});

// Full reset: delete and recreate
router.post('/reset', async (req, res) => {
  try {
    await deleteConversationsIndex();
    await initializeConversationsIndex();
    const stats = await syncConversations();
    res.json({ message: 'Reset and sync completed', stats });
  } catch (error) {
    console.error('Error resetting conversations:', error);
    res.status(500).json({ error: 'Failed to reset conversations', message: error.message });
  }
});

module.exports = router;
