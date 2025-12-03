import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Secure, Transparent Voting Platform</h1>
          <p className="hero-subtitle">
            Empower your community with fair, transparent, and secure digital voting.
            Create polls, cast votes, and see real-time results instantly.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="ballot-box">🗳️</div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose VoteHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Advanced encryption ensures your vote is protected and anonymous.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Results</h3>
            <p>Watch live results update as votes come in. See the data instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics & Insights</h3>
            <p>Comprehensive charts and insights for every poll and election.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Responsive</h3>
            <p>Vote from anywhere, anytime on any device seamlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Scheduled Deadlines</h3>
            <p>Automatic voting deadlines ensure fair voting periods.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Export & Share</h3>
            <p>Export results in multiple formats and share insights easily.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up with your email and create your profile</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create Poll</h3>
            <p>Admin creates a new poll or election with options</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Cast Vote</h3>
            <p>Users vote once and see real-time results</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>View Results</h3>
            <p>See comprehensive results and analytics</p>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-item">
          <h3>10K+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Polls Created</p>
        </div>
        <div className="stat-item">
          <h3>50K+</h3>
          <p>Votes Cast</p>
        </div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>Satisfaction</p>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Start Voting?</h2>
        <p>Join thousands of users who trust VoteHub for secure and transparent voting.</p>
        <Link to="/signup" className="btn btn-large">
          Create Account Now
        </Link>
      </section>
    </div>
  );
};

export default Landing;
