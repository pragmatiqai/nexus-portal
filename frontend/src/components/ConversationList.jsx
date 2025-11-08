import React from 'react';
import ConversationCard from './ConversationCard';
import './ConversationList.css';

function ConversationList({ conversations, onSelectConversation }) {
  if (conversations.length === 0) {
    return (
      <div className="empty-state">
        <p>No conversations found.</p>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {conversations.map(conversation => (
        <ConversationCard
          key={conversation.conversationId}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation.conversationId)}
        />
      ))}
    </div>
  );
}

export default ConversationList;
