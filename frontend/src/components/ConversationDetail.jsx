import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageCard from './MessageCard';
import './ConversationDetail.css';

function ConversationDetail({ conversationId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messagesExpanded, setMessagesExpanded] = useState(true);

  useEffect(() => {
    fetchConversationMessages();
  }, [conversationId]);

  const fetchConversationMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/messages/conversations/${conversationId}`);
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
      setError('Failed to load conversation messages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="conversation-detail">
        <button className="back-btn" onClick={onBack}>← Back to Conversations</button>
        <div className="loading">Loading conversation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-detail">
        <button className="back-btn" onClick={onBack}>← Back to Conversations</button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="conversation-detail">
      <div className="conversation-detail-header">
        <button className="back-btn" onClick={onBack}>← Back to Conversations</button>
        <div className="conversation-info">
          <h2>Conversation Messages</h2>
          <div className="conversation-meta-info">
            <span className="meta-item">
              <strong>Conversation ID:</strong> {conversationId}
            </span>
            <span className="meta-item">
              <strong>Messages:</strong> {messages.length}
            </span>
            {messages.length > 0 && (
              <span className="meta-item">
                <strong>User:</strong> {messages[0].username}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="messages-section">
        <div className="messages-header" onClick={() => setMessagesExpanded(!messagesExpanded)}>
          <h3>Messages</h3>
          <button className="collapse-btn">
            {messagesExpanded ? '−' : '+'}
          </button>
        </div>

        {messagesExpanded && (
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">No messages found in this conversation.</div>
            ) : (
              messages.map((message, index) => (
                <MessageCard key={message.id} message={message} messageNumber={index + 1} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationDetail;
