import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewPoll, fetchAllPolls } from '../store/pollsSlice';
import './Dashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { polls, loading, error } = useSelector(state => state.polls);
  const { user } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    options: ['', ''],
  });

  useEffect(() => {
    dispatch(fetchAllPolls());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.deadline) {
      alert('Please fill all fields');
      return;
    }

    const validOptions = formData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    const result = await dispatch(createNewPoll({
      title: formData.title,
      description: formData.description,
      deadline: new Date(formData.deadline).toISOString(),
      options: validOptions,
    }));

    if (result.type === 'polls/create/fulfilled') {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        options: ['', ''],
      });
      setShowModal(false);
    } else {
      alert('Failed to create poll');
    }
  };

  const stats = {
    total: polls.length,
    active: polls.filter(p => p.status === 'active').length,
    totalVotes: polls.reduce((sum, p) => sum + p.totalVotes, 0),
  };

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Create and manage polls and elections</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Polls</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Active Polls</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>{stats.totalVotes}</h3>
            <p>Total Votes</p>
          </div>
        </div>
      </div>

      <div className="create-poll-section">
        <button className="btn-create" onClick={() => setShowModal(true)}>
          + Create New Poll
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Poll</h2>
            <form onSubmit={handleSubmit} className="poll-form">
              <div className="form-group">
                <label>Poll Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter poll title"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter poll description"
                  className="form-input"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Deadline *</label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Poll Options *</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="form-input"
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeOption(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-option"
                  onClick={addOption}
                >
                  + Add Option
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-poll">
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <div className="polls-list">
        <h2>Your Polls</h2>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading polls...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="empty-state">
            <p>No polls created yet. Create your first poll!</p>
          </div>
        ) : (
          <div className="admin-polls-grid">
            {polls.map(poll => (
              <div key={poll.id} className="admin-poll-card">
                <h3>{poll.title}</h3>
                <p className="poll-desc">{poll.description}</p>
                <div className="admin-poll-stats">
                  <span>📊 {poll.totalVotes} votes</span>
                  <span>📋 {poll.options.length} options</span>
                  <span>{poll.status === 'active' ? '🟢 Active' : '🔴 Closed'}</span>
                </div>
                <button className="btn-view-results">View Full Results</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
