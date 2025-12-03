import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitVote, fetchPollById } from '../store/pollsSlice';
import './PollVoting.css';

const PollVoting = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedPoll, userVotes, loading, error } = useSelector(state => state.polls);
  const { user } = useSelector(state => state.auth);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  const poll = selectedPoll;

  useEffect(() => {
    dispatch(fetchPollById(pollId));
  }, [pollId, dispatch]);

  useEffect(() => {
    if (!poll && !loading) {
      navigate('/dashboard');
    }
  }, [poll, navigate, loading]);

  useEffect(() => {
    if (!poll) return;

    const timer = setInterval(() => {
      const now = new Date();
      const deadline = new Date(poll.deadline);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeRemaining('Voting has ended');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m left`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s left`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  if (!poll) {
    return <div className="loading">Loading...</div>;
  }

  const hasVoted = (poll._id || poll.id) in userVotes;

  if (hasVoted) {
    return (
      <div className="poll-voting">
        <div className="already-voted">
          <div className="check-icon">✓</div>
          <h2>Thank You for Voting!</h2>
          <p>You have already voted on this poll. Each person can vote only once.</p>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn-results" onClick={() => navigate(`/results/${poll._id || poll.id}`)}>
            View Results
          </button>
        </div>
      </div>
    );
  }

  const handleVote = async () => {
    if (selectedOption === null) {
      alert('Please select an option');
      return;
    }

    const result = await dispatch(submitVote({
      pollId: poll._id || poll.id,
      optionId: selectedOption,
    }));

    if (result.type === 'polls/vote/fulfilled') {
      alert('Your vote has been recorded!');
      navigate(`/results/${poll._id || poll.id}`);
    } else if (result.type === 'polls/vote/rejected') {
      alert('Failed to submit vote: ' + result.payload);
    }
  };

  return (
    <div className="poll-voting">
      <div className="voting-container">
        <div className="voting-header">
          <h1 className="poll-title">{poll.title}</h1>
          <p className="poll-desc">{poll.description}</p>
          <div className="voting-info">
            <span className="time-remaining">⏱️ {timeRemaining}</span>
            <span className="votes-count">📊 {poll.totalVotes} votes cast</span>
          </div>
        </div>

        <div className="voting-content">
          <h2>Select your choice:</h2>
          <div className="options-container">
            {poll.options.map(option => (
              <label key={option.id} className="option-label">
                <input
                  type="radio"
                  name="poll"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="option-input"
                />
                <div className={`option-box ${selectedOption === option.id ? 'selected' : ''}`}>
                  <div className="option-text">
                    <span className="option-circle"></span>
                    <span className="option-title">{option.text}</span>
                  </div>
                  <div className="option-meta">
                    <span className="current-votes">{option.votes} votes</span>
                    <span className="percentage">
                      ({poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill"
                      style={{
                        width: `${poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="voting-actions">
            <button
              className="btn-vote-confirm"
              onClick={handleVote}
              disabled={selectedOption === null}
            >
              Confirm Vote
            </button>
            <button
              className="btn-vote-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>

          <div className="voting-footer">
            <p className="voting-note">
              ⚠️ This is your only vote. Please choose carefully. Your vote is anonymous and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollVoting;
