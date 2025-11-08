import React from 'react';
import './UserFilter.css';

function UserFilter({ users, selectedUser, onUserChange }) {
  return (
    <div className="user-filter">
      <label htmlFor="user-select">Filter by User:</label>
      <select
        id="user-select"
        value={selectedUser}
        onChange={(e) => onUserChange(e.target.value)}
        className="user-select"
      >
        <option value="">All Users</option>
        {users.map(user => (
          <option key={user.username} value={user.username}>
            {user.username} ({user.count})
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserFilter;
