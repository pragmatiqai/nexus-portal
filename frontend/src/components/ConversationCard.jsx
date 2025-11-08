import React from 'react';
import './ConversationCard.css';

function ConversationCard({ conversation, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="conversation-card" onClick={onClick}>
      <div className="conversation-header">
        <div className="conversation-meta">
          <span className="conversation-username">{conversation.username || 'Unknown'}</span>
          <span className="conversation-count">{conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}</span>
          {conversation.riskAssessment && (
            <span className={`risk-badge risk-badge-${conversation.riskAssessment.overall_risk_level?.toLowerCase()}`}>
              {conversation.riskAssessment.overall_risk_level}
            </span>
          )}
        </div>
        <span className="conversation-time">{formatDate(conversation.lastMessageTime)}</span>
      </div>

      <div className="conversation-preview">
        <div className="preview-label">First question:</div>
        <div className="preview-text">
          {truncateText(conversation.firstQuestion || 'No question available')}
        </div>
      </div>

      <div className="conversation-footer">
        <span className="conversation-id">ID: {conversation.conversationId.substring(0, 20)}...</span>
        <button className="view-btn">View Conversation →</button>
      </div>
    </div>
  );
}

export default ConversationCard;
