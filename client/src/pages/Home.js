// Homepage.js
import React from 'react';
import '../styles/Home.scss';

function Homepage() {
  return (
    <div className="homepage">
      <header className="homepage__header">
        <h1 className="homepage__title">Welcome to Campaign Manager</h1>
        <p className="homepage__subtitle">Organize your Tabletop campaigns and characters with ease</p>
      </header>
      <main className="homepage__content">
        <section className="homepage__section">
          <h2 className="homepage__section-title">Campaign Management</h2>
          <p className="homepage__section-description">
            Create and manage your campaigns effortlessly. Keep track of campaign details, sessions, and player characters all in one place.
          </p>
        </section>
        <section className="homepage__section">
          <h2 className="homepage__section-title">Character Creation</h2>
          <p className="homepage__section-description">
            Build and customize your player characters with our intuitive character creation tools. Choose from a variety of races, classes, and abilities to bring your characters to life.
          </p>
        </section>
        <section className="homepage__section">
          <h2 className="homepage__section-title">Collaborative Play</h2>
          <p className="homepage__section-description">
            Invite your friends to join your campaigns and collaborate in real-time. Share character sheets, notes, and campaign updates seamlessly.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Homepage;