import React from 'react';
import MessageCard from './MessageCard';
import './MessageList.css';

function MessageList({ messages }) {
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <p>No messages found.</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map(message => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
