import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About VoteHub</h1>
        <p>Empowering Democracy Through Technology</p>
      </section>

      <section className="about-section">
        <div className="content-wrapper">
          <div className="about-content">
            <h2>Our Mission</h2>
            <p>
              VoteHub is dedicated to making voting and polling accessible, secure, and transparent
              for everyone. We believe that technology can strengthen democratic processes and make
              collective decision-making easier and more inclusive.
            </p>
          </div>
          <div className="about-image">
            <div className="image-placeholder">🎯</div>
          </div>
        </div>
      </section>

      <section className="about-section alt">
        <div className="content-wrapper">
          <div className="about-image">
            <div className="image-placeholder">🔐</div>
          </div>
          <div className="about-content">
            <h2>Our Values</h2>
            <ul className="values-list">
              <li>
                <strong>Security:</strong> We use industry-leading encryption to protect your votes
                and personal information.
              </li>
              <li>
                <strong>Transparency:</strong> All poll results are visible in real-time, ensuring
                complete transparency.
              </li>
              <li>
                <strong>Inclusivity:</strong> Our platform is accessible to everyone, regardless
                of technical expertise.
              </li>
              <li>
                <strong>Integrity:</strong> One person, one vote. Our system prevents duplicate
                voting and ensures fair elections.
              </li>
              <li>
                <strong>Innovation:</strong> We continuously improve our platform with new features
                and better technology.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="content-wrapper">
          <div className="about-content">
            <h2>How It Started</h2>
            <p>
              VoteHub was born from a simple idea: voting and polling should be easy, secure, and
              accessible to everyone. Our team of developers and democracy enthusiasts came together
              with a shared vision to create a platform that makes participation in decision-making
              accessible to all.
            </p>
            <p>
              Since our launch, we've served thousands of users across various organizations,
              communities, and institutions, helping them conduct fair and transparent elections
              and polls.
            </p>
          </div>
          <div className="about-image">
            <div className="image-placeholder">📱</div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👨‍💼</div>
            <h3>John Smith</h3>
            <p className="role">Founder & CEO</p>
            <p className="bio">10+ years in software development and civic tech</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍💻</div>
            <h3>Sarah Johnson</h3>
            <p className="role">CTO</p>
            <p className="bio">Expert in security and blockchain technology</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍🎨</div>
            <h3>Mike Chen</h3>
            <p className="role">Design Lead</p>
            <p className="bio">Passionate about user experience and accessibility</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍⚖️</div>
            <h3>Emily Davis</h3>
            <p className="role">Legal Advisor</p>
            <p className="bio">Ensures compliance with voting regulations</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2>By The Numbers</h2>
        <div className="stats-grid">
          <div className="stat">
            <h3>10,000+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat">
            <h3>500+</h3>
            <p>Successful Polls</p>
          </div>
          <div className="stat">
            <h3>50,000+</h3>
            <p>Votes Cast</p>
          </div>
          <div className="stat">
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Join Us In Building The Future Of Voting</h2>
        <p>
          Whether you're an individual, organization, or institution, VoteHub is here to make
          your voting process secure, transparent, and efficient.
        </p>
        <a href="/signup" className="cta-btn">Get Started Today</a>
      </section>
    </div>
  );
};

export default About;
