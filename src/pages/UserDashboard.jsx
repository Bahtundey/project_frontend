import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllPolls } from '../store/pollsSlice';
import './Dashboard.css';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { polls, loading, error, userVotes } = useSelector(state => state.polls);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllPolls());
  }, [dispatch]);

  const now = new Date();
  const activePoll = (poll) => {
    const deadline = new Date(poll.deadline);
    return deadline > now && poll.status === 'active';
  };
  const hasVoted = (pollId) => pollId in userVotes;

  const safePolls = Array.isArray(polls) ? polls : [];

const filteredPolls = safePolls.filter(poll => {
  if (filter === 'all') return true;
  if (filter === 'active') return activePoll(poll);
  if (filter === 'voted') return hasVoted(poll._id);
  if (filter === 'pending') return activePoll(poll) && !hasVoted(poll._id);
  return true;
});


  const getTimeRemaining = (deadline) => {
    const diff = new Date(deadline) - now;
    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Voting Dashboard</h1>
        <p>Cast your vote on active polls and view results</p>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Polls ({polls.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Need Your Vote
        </button>
        <button
          className={`filter-btn ${filter === 'voted' ? 'active' : ''}`}
          onClick={() => setFilter('voted')}
        >
          Your Votes
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading polls...</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {!loading && filteredPolls.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No polls found</h3>
          <p>Check back soon for new polls or try a different filter.</p>
        </div>
      ) : !loading && (
        <div className="polls-grid">
          {filteredPolls.map(poll => (
            <div key={poll._id} className="poll-card">
              <div className="poll-header">
                <div>
                  <h3 className="poll-title">{poll.title}</h3>
                  <p className="poll-description">{poll.description}</p>
                </div>
                {hasVoted(poll._id) && (
                  <div className="voted-badge">✓ Voted</div>
                )}
              </div>

              <div className="poll-info">
                <div className="info-item">
                  <span className="info-label">Options:</span>
                  <span className="info-value">{poll.options.length}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Votes:</span>
                  <span className="info-value">{poll.totalVotes}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time Left:</span>
                  <span className="info-value">{getTimeRemaining(poll.deadline)}</span>
                </div>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${poll.options[0] ? (poll.options[0].votes / Math.max(poll.totalVotes, 1)) * 100 : 0}%`
                  }}
                ></div>
              </div>

              <div className="poll-actions">
                {activePoll(poll) && !hasVoted(poll._id) ? (
                  <Link to={`/poll/${poll._id}`} className="btn-vote">
                    Cast Vote
                  </Link>
                ) : (
                  <Link to={`/results/${poll._id}`} className="btn-results">
                    View Results
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
