import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    conversationsLast30Days: 0,
    criticalIssuesLast30Days: 0,
    highRiskIssuesLast30Days: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/messages/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalConversations.toLocaleString()}</div>
            <div className="stat-label">Total Conversations</div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMessages.toLocaleString()}</div>
            <div className="stat-label">Total Messages</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.conversationsLast30Days.toLocaleString()}</div>
            <div className="stat-label">Conversations (Last 30 Days)</div>
          </div>
        </div>

        <div className="stat-card stat-card-danger">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <div className="stat-value">{stats.criticalIssuesLast30Days.toLocaleString()}</div>
            <div className="stat-label">Critical Issues (Last 30 Days)</div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.highRiskIssuesLast30Days.toLocaleString()}</div>
            <div className="stat-label">High Risk Issues (Last 30 Days)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
