import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <a href="/" className="logo">Toka.</a>

        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how" className="nav-link">How It Works</a>
          <a href="#about" className="nav-link">About</a>
        </div>

        <button className="cta-button" aria-label="Download the App">
          Get Started
        </button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Turn chores into <br />
              <span style={{ color: 'var(--accent-purple)' }}>magical rewards.</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate app where parents and kids collaborate. Manage tasks, earn coins, and redeem them for real-life rewards in a fun, gamified experience.
            </p>
            <div className="hero-buttons">
              <button className="cta-button">Download Toka</button>
              <button className="secondary-button">Watch Video</button>
            </div>
          </div>
          <div className="hero-image-container">
            <img src="/hero.png" alt="Toka App Dashboard Overview" className="hero-image" loading="lazy" />
          </div>
        </section>

        <section id="features" className="features">
          <h2 className="section-title">Why parents and kids love Toka</h2>

          <div className="feature-grid">
            <article className="feature-card">
              <img src="/tasks.png" alt="Gamified Tasks" className="feature-image" loading="lazy" />
              <div className="feature-info tasks">
                <h3>Fun & Easy Tasks</h3>
                <p>Track chores daily with interactive progress bars and cute animations. Completing tasks has never felt this rewarding.</p>
              </div>
            </article>

            <article className="feature-card">
              <img src="/rewards.png" alt="Rewards Marketplace" className="feature-image" loading="lazy" />
              <div className="feature-info rewards">
                <h3>Vibrant Marketplace</h3>
                <p>Kids can spend their hard-earned coins on custom rewards set by parents—like screen time, special treats, or allowances!</p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="logo" style={{ fontSize: '1.4rem' }}>Toka.</div>
        <p className="footer-text">© {new Date().getFullYear()} Toka Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
