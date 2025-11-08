import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationList from './components/ConversationList';
import ConversationDetail from './components/ConversationDetail';
import UserFilter from './components/UserFilter';
import Pagination from './components/Pagination';
import SyncButton from './components/SyncButton';
import './App.css';

function App() {
  const [view, setView] = useState('conversations'); // 'conversations' or 'detail'
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 50,
    total: 0,
    totalPages: 0
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch conversations when page or user filter changes
  useEffect(() => {
    if (view === 'conversations') {
      fetchConversations();
    }
  }, [pagination.page, selectedUser, view]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/messages/users');
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size
      };
      if (selectedUser) {
        params.username = selectedUser;
      }

      const response = await axios.get('/api/messages/conversations', { params });
      setConversations(response.data.conversations);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages
      }));
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to fetch conversations. Please check your Elasticsearch connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (username) => {
    setSelectedUser(username);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setView('detail');
  };

  const handleBackToConversations = () => {
    setView('conversations');
    setSelectedConversationId(null);
  };

  const handleSyncComplete = (syncData) => {
    // Refresh conversations after sync
    fetchConversations();
    fetchUsers();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Proxy Message Viewer</h1>
      </header>

      <main className="app-main">
        {view === 'conversations' ? (
          <>
            <div className="controls">
              <div className="controls-left">
                <UserFilter
                  users={users}
                  selectedUser={selectedUser}
                  onUserChange={handleUserChange}
                />
                <SyncButton onSyncComplete={handleSyncComplete} />
              </div>

              <div className="stats">
                <span>Total Conversations: {pagination.total}</span>
                {selectedUser && (
                  <span className="filter-badge">
                    Filtered by: {selectedUser}
                    <button
                      className="clear-filter"
                      onClick={() => handleUserChange('')}
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading">Loading conversations...</div>
            ) : (
              <>
                <ConversationList
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                />

                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <ConversationDetail
            conversationId={selectedConversationId}
            onBack={handleBackToConversations}
          />
        )}
      </main>
    </div>
  );
}

export default App;
