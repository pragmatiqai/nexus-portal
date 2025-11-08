import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationList from './components/ConversationList';
import ConversationDetail from './components/ConversationDetail';
import UserFilter from './components/UserFilter';
import RiskFilter from './components/RiskFilter';
import Pagination from './components/Pagination';
import SyncButton from './components/SyncButton';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'conversations' or 'detail'
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 50,
    total: 0,
    totalPages: 0
  });

  // Authentication handlers
  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setView('dashboard');
  };

  // Fetch users on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

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

  // Filter conversations by risk level
  useEffect(() => {
    if (!selectedRisk) {
      setFilteredConversations(conversations);
    } else if (selectedRisk === 'NOT_ASSESSED') {
      setFilteredConversations(conversations.filter(conv => !conv.riskAssessment));
    } else {
      setFilteredConversations(
        conversations.filter(conv =>
          conv.riskAssessment?.overall_risk_level === selectedRisk
        )
      );
    }
  }, [conversations, selectedRisk]);

  const handleUserChange = (username) => {
    setSelectedUser(username);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleRiskChange = (risk) => {
    setSelectedRisk(risk);
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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <img
              src="https://static.tildacdn.net/tild6239-3039-4366-b234-663533363332/Frame_7_2.svg"
              alt="NexusAI Logo"
              className="logo"
            />
            <h1>AI Compliance Platform</h1>
          </div>
          <div className="header-right">
            <span className="user-name">{currentUser?.name}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-button ${view === 'conversations' ? 'active' : ''}`}
          onClick={() => setView('conversations')}
        >
          Conversations
        </button>
      </nav>

      <main className="app-main">
        {view === 'dashboard' ? (
          <Dashboard />
        ) : view === 'conversations' ? (
          <>
            <div className="controls">
              <div className="controls-left">
                <UserFilter
                  users={users}
                  selectedUser={selectedUser}
                  onUserChange={handleUserChange}
                />
                <RiskFilter
                  selectedRisk={selectedRisk}
                  onRiskChange={handleRiskChange}
                />
                <SyncButton onSyncComplete={handleSyncComplete} />
              </div>

              <div className="stats">
                <span>Total Conversations: {pagination.total}</span>
                {selectedRisk && (
                  <span className="filter-badge filter-badge-risk">
                    Risk Level: {selectedRisk === 'NOT_ASSESSED' ? 'Not Assessed' : selectedRisk}
                    <button
                      className="clear-filter"
                      onClick={() => handleRiskChange('')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedUser && (
                  <span className="filter-badge">
                    User: {selectedUser}
                    <button
                      className="clear-filter"
                      onClick={() => handleUserChange('')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {(selectedUser || selectedRisk) && (
                  <span className="filtered-count">
                    Showing: {filteredConversations.length}
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
                  conversations={filteredConversations}
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
