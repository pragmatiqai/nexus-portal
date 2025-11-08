import React from 'react';
import './MessageCard.css';

function MessageCard({ message, messageNumber }) {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="message-exchange">
      {/* User Message */}
      <div className="chat-message user-message">
        <div className="message-header-simple">
          <span className="sender">{message.username || 'User'}</span>
          <span className="time">{formatTime(message.requestTime)}</span>
        </div>
        <div className="message-text">
          {message.userQuestion || 'No question'}
        </div>
      </div>

      {/* AI Response */}
      <div className="chat-message ai-message">
        <div className="message-header-simple">
          <span className="sender">AI Assistant</span>
          <span className="time">{formatTime(message.requestTime)}</span>
        </div>
        <div className="message-text">
          {message.parsedResponse || 'No response'}
        </div>
      </div>
    </div>
  );
}

export default MessageCard;
