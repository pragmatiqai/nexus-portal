import React, { useState } from 'react';
import axios from 'axios';
import './SyncButton.css';

function SyncButton({ onSyncComplete }) {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);

    try {
      const response = await axios.post('/api/sync/sync');
      setLastSync(response.data);

      // Notify parent component that sync is complete
      if (onSyncComplete) {
        onSyncComplete(response.data);
      }
    } catch (err) {
      console.error('Error syncing:', err);
      setError('Failed to sync conversations');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="sync-button-container">
      <button
        className="sync-button"
        onClick={handleSync}
        disabled={syncing}
      >
        {syncing ? 'Syncing...' : 'Sync Conversations'}
      </button>

      {lastSync && (
        <div className="sync-status">
          <span className="sync-success">
            ✓ Synced {lastSync.conversationsIndexed} conversations
            ({lastSync.messagesProcessed} messages processed)
          </span>
        </div>
      )}

      {error && (
        <div className="sync-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default SyncButton;
