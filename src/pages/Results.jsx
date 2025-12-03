import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPollById } from '../store/pollsSlice';
import Chart from 'chart.js/auto';
import './Results.css';

const Results = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedPoll, loading, error } = useSelector(state => state.polls);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const poll = selectedPoll;

  useEffect(() => {
    dispatch(fetchPollById(pollId));
  }, [pollId, dispatch]);

  useEffect(() => {
    if (!poll && !loading) {
      navigate('/dashboard');
      return;
    }

    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = poll.options.map(opt => opt.text);
    const data = poll.options.map(opt => opt.votes);
    const colors = [
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#4facfe',
      '#43e97b',
      '#fa709a',
      '#feca57',
      '#48dbfb',
    ];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: '#fff',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 14, weight: 600 },
              padding: 20,
              color: '#2d3436',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 14, weight: 600 },
            bodyFont: { size: 13 },
            displayColors: true,
            callbacks: {
              label: function (context) {
                const total = data.reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? ((context.parsed || 0) / total * 100).toFixed(1) : 0;
                return `Votes: ${context.parsed || 0} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [poll, navigate]);

  if (!poll) {
    return <div className="loading">Loading...</div>;
  }

  const now = new Date();
  const deadline = new Date(poll.deadline);
  const isEnded = deadline <= now;
  const timeRemaining = isEnded ? 'Ended' : 
    (() => {
      const diff = deadline - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
    })();

  const winner = [...poll.options].sort((a, b) => b.votes - a.votes)[0];

  const handleExport = () => {
    const pollData = {
      title: poll.title,
      description: poll.description,
      totalVotes: poll.totalVotes,
      results: poll.options.map(opt => ({
        option: opt.text,
        votes: opt.votes,
        percentage: poll.totalVotes > 0 ? ((opt.votes / poll.totalVotes) * 100).toFixed(2) : 0,
      })),
      exportDate: new Date().toLocaleString(),
    };

    const csvContent = [
      ['Poll Results Export'],
      [],
      ['Title', poll.title],
      ['Description', poll.description],
      ['Total Votes', poll.totalVotes],
      ['Exported', new Date().toLocaleString()],
      [],
      ['Option', 'Votes', 'Percentage'],
      ...pollData.results.map(r => [r.option, r.votes, `${r.percentage}%`]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `poll-results-${poll._id || poll.id}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <div className="results-header">
          <h1>{poll.title}</h1>
          <p>{poll.description}</p>
          <div className="results-meta">
            <span className={`status ${isEnded ? 'ended' : 'active'}`}>
              {isEnded ? '✓ Ended' : '● Active'}
            </span>
            <span className="time-info">⏱️ {timeRemaining} left</span>
            <span className="total-votes">📊 {poll.totalVotes} total votes</span>
          </div>
        </div>

        <div className="results-content">
          <div className="chart-section">
            <h2>Vote Distribution</h2>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="stats-section">
            <h2>Results Summary</h2>
            {winner && (
              <div className="winner-box">
                <span className="winner-label">🏆 Leading:</span>
                <span className="winner-text">{winner.text}</span>
                <span className="winner-votes">{winner.votes} votes</span>
              </div>
            )}

            <div className="results-table">
              <h3>Detailed Results</h3>
              <div className="table-container">
                {poll.options.map((option, index) => {
                  const percentage = poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0;
                  const isWinner = (option._id || option.id) === (winner?._id || winner?.id);

                  return (
                    <div key={option._id || option.id} className={`result-row ${isWinner ? 'winner' : ''}`}>
                      <div className="rank">{index + 1}</div>
                      <div className="result-option">{option.text}</div>
                      <div className="result-bar-container">
                        <div className="result-bar">
                          <div
                            className="result-bar-fill"
                            style={{
                              width: `${percentage}%`,
                              background: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'][index % 5],
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="result-stats">
                        <span className="result-votes">{option.votes}</span>
                        <span className="result-percent">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="actions">
              <button className="btn-back" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
              <button className="btn-export" onClick={handleExport}>
                📥 Export Results
              </button>
            </div>
          </div>
        </div>

        <div className="insights-section">
          <h2>Key Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Voter Participation</h3>
              <p>{poll.totalVotes} people participated in this poll.</p>
            </div>
            <div className="insight-card">
              <h3>Leading Option</h3>
              <p>{winner?.text} is leading with {winner?.votes} votes.</p>
            </div>
            <div className="insight-card">
              <h3>Most Popular</h3>
              <p>
                {winner?.text} received{' '}
                {poll.totalVotes > 0
                  ? ((winner.votes / poll.totalVotes) * 100).toFixed(1)
                  : 0}
                % of votes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
