import React from 'react';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="glass-container fade-in" style={{ maxWidth: '600px' }}>
      <div className="dashboard-header">
        <h2 style={{ color: 'white', marginBottom: '8px' }}>Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to your FacePass portal</p>
      </div>

      <div className="profile-card">
        <div className="profile-stat" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h3 style={{ color: 'var(--accent-color)' }}>{user.name}</h3>
          <span className="status-badge">Verified</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
          {user.email}
        </p>

        <div className="profile-stat">
          <span className="stat-label">Roll Number</span>
          <span className="stat-value">{user.rollNumber}</span>
        </div>
        <div className="profile-stat">
          <span className="stat-label">Department</span>
          <span className="stat-value">{user.department || 'N/A'}</span>
        </div>
        <div className="profile-stat">
          <span className="stat-label">Year</span>
          <span className="stat-value">{user.year || 'N/A'}</span>
        </div>
      </div>

      <div>
        <h4 style={{ color: 'white', marginBottom: '8px' }}>Facial Identity</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Your facial embedding is securely stored and linked to your college ID.
        </p>
        <div className="face-placeholder">
          <div style={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
              <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              <rect x="8" y="8" width="8" height="8" rx="2" ry="2"></rect>
              <path d="M12 12v.01"></path>
            </svg>
            <span>Scan Active</span>
          </div>
        </div>
      </div>

      <button 
        onClick={logout} 
        className="btn" 
        style={{ marginTop: '30px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
