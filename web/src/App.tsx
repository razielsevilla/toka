import { Target, Trophy, TrendingUp, Shield, Brain, Zap, PieChart, CheckCircle, Gift, ArrowRight, Activity, Users, Map, Lock, Award, Briefcase } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <a href="/" className="logo">Toka.</a>

        <div className="nav-links">
          <a href="#problem" className="nav-link">Market Need</a>
          <a href="#solution" className="nav-link">The Solution</a>
          <a href="#business-model" className="nav-link">Business Model</a>
          <a href="#roadmap" className="nav-link">Roadmap</a>
        </div>

        <button className="cta-button" aria-label="View Investor Deck">
          <Briefcase size={16} style={{ marginRight: '8px' }} /> Pitch Deck
        </button>
      </nav>

      <main>
        {/* HERO SECTION (Investor Focused) */}
        <section className="hero">
          <div className="hero-content">
            <div className="badge">Wadhwani Foundation Project</div>
            <h1 className="hero-title">
              Redefining family productivity through <br />
              <span className="text-gradient">behavioral economics.</span>
            </h1>
            <p className="hero-subtitle">
              Toka handles the modern parenting crisis by gamifying chores, introducing early financial literacy, and completely eliminating the friction of household management.
            </p>
            <div className="hero-buttons">
              <button className="cta-button">Try Live Prototype</button>
              <button className="secondary-button">Watch Pitch Video</button>
            </div>

            <div className="quick-metrics">
              <div className="metric">
                <span className="metric-val">$10B+</span>
                <span className="metric-label">Family Tech TAM</span>
              </div>
              <div className="metric divider"></div>
              <div className="metric">
                <span className="metric-val">85%</span>
                <span className="metric-label">Target Engagement Rate</span>
              </div>
              <div className="metric divider"></div>
              <div className="metric">
                <span className="metric-val">B2B2C</span>
                <span className="metric-label">Scalable Model</span>
              </div>
            </div>
          </div>
          <div className="hero-image-container">
            <img src="/hero.png" alt="Toka App Dashboard Overview" className="hero-image" loading="lazy" />
          </div>
        </section>

        {/* THE CRISIS (Market Need) */}
        <section id="problem" className="problem-solution">
          <div className="section-container text-center">
            <h2 className="section-title">The Parenting Crisis at Scale</h2>
            <p className="section-subtitle">
              Modern parents are burning out. Screen time is surging, financial literacy is rarely taught in primary schools, and managing family responsibilities has become a second full-time job.
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <Activity className="stat-icon" />
                <h3>74%</h3>
                <p>Of parents report daily arguments over chores and responsibilities.</p>
              </div>
              <div className="stat-card">
                <TrendingUp className="stat-icon" />
                <h3>$140B</h3>
                <p>Global "Pocket Money" economy remains entirely un-digitized and untracked.</p>
              </div>
              <div className="stat-card">
                <Brain className="stat-icon" />
                <h3>#1</h3>
                <p>Cause of parent burnout is the "mental load" of household management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* THE SOLUTION (Product Walkthrough) */}
        <section id="solution" className="features">
          <h2 className="section-title text-center">The Toka Solution</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-content">
                <div className="icon-wrapper tasks-icon">
                  <CheckCircle size={28} />
                </div>
                <div className="feature-badge">Phase 1 Active</div>
                <h3>Frictionless Gamification</h3>
                <p>We replace nagging with agency. Toka’s dual-interface allows parents to architect digital chore templates, while giving children a gamified, autonomous dashboard to execute them.</p>
                <ul className="feature-list">
                  <li><CheckCircle size={16} /> Instant dopamine hits via visual progress tracking</li>
                  <li><CheckCircle size={16} /> Automated recurring chore pipelines</li>
                  <li><CheckCircle size={16} /> Real-time parental oversight dashboard</li>
                </ul>
              </div>
              <img src="/tasks.png" alt="Gamified Tasks" className="feature-image" loading="lazy" />
            </article>

            <article className="feature-card">
              <div className="feature-content">
                <div className="icon-wrapper rewards-icon">
                  <Gift size={28} />
                </div>
                <div className="feature-badge">Phase 1 Active</div>
                <h3>The "Micro-Economy" Engine</h3>
                <p>We transform completed tasks into internal currency (Coins), introducing fundamental financial literacy. Kids learn the connection between effort and earning in a safe, closed-loop marketplace.</p>
                <ul className="feature-list">
                  <li><CheckCircle size={16} /> Flexible reward structures (Screen time, goods, allowance)</li>
                  <li><CheckCircle size={16} /> Goal-setting and savings mechanics</li>
                  <li><CheckCircle size={16} /> Delayed gratification training</li>
                </ul>
              </div>
              <img src="/rewards.png" alt="Rewards Marketplace" className="feature-image" loading="lazy" />
            </article>
          </div>
        </section>

        {/* THE SECRET SAUCE */}
        <section className="secret-sauce">
          <div className="section-container text-center">
            <h2 className="section-title">The Behavioral Science Edge</h2>
            <p className="section-subtitle">Why Toka works where traditional methods fail.</p>
            <div className="sauce-grid">
              <div className="sauce-item">
                <div className="sauce-icon"><Zap size={24} /></div>
                <h4>Immediate Reinforcement</h4>
                <p>Digital coins bridge the gap between long-term habits and short-term attention spans.</p>
              </div>
              <div className="sauce-item">
                <div className="sauce-icon"><Shield size={24} /></div>
                <h4>Autonomy Paradigm</h4>
                <p>Kids shift from being managed to becoming independent economic actors within the family unit.</p>
              </div>
              <div className="sauce-item">
                <div className="sauce-icon"><PieChart size={24} /></div>
                <h4>Data-Driven Parenting</h4>
                <p>Parents gain actionable insights into which incentives drive the highest compliance rates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS MODEL */}
        <section id="business-model" className="business-model">
          <h2 className="section-title text-center">How We Scale Revenue</h2>
          <div className="model-grid section-container">
            <div className="model-card free">
              <div className="model-header">
                <h3>Toka Basic</h3>
                <div className="price">Free</div>
                <p>Acquisition Engine</p>
              </div>
              <ul className="model-features">
                <li><CheckCircle size={16} /> Up to 2 child profiles</li>
                <li><CheckCircle size={16} /> Basic task templates</li>
                <li><CheckCircle size={16} /> Standard virtual rewards</li>
              </ul>
            </div>

            <div className="model-card premium">
              <div className="popular-badge">High Margin SaaS</div>
              <div className="model-header">
                <h3>Toka+ (Premium)</h3>
                <div className="price">$4.99<span>/mo</span></div>
                <p>Core Revenue Stream</p>
              </div>
              <ul className="model-features">
                <li><CheckCircle size={16} /> Unlimited child profiles</li>
                <li><CheckCircle size={16} /> AI-assisted chore schedules</li>
                <li><CheckCircle size={16} /> Advanced financial literacy modules</li>
                <li><CheckCircle size={16} /> Direct allowances & chore linking</li>
              </ul>
            </div>

            <div className="model-card enterprise">
              <div className="model-header">
                <h3>Toka B2B2C</h3>
                <div className="price">Fintech/Edu</div>
                <p>Future Expansion</p>
              </div>
              <ul className="model-features">
                <li><CheckCircle size={16} /> White-label APIs for youth debit cards</li>
                <li><CheckCircle size={16} /> School district integrations</li>
                <li><CheckCircle size={16} /> Brand partnerships in Rewards Store</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRODUCT ROADMAP */}
        <section id="roadmap" className="roadmap">
          <div className="section-container">
            <h2 className="section-title text-center">The Path to Scale</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker complete"><CheckCircle size={20} /></div>
                <div className="timeline-content">
                  <h3>Phase 1: Gamified Chores (Current)</h3>
                  <p>Establish the core behavioral loop. Launch the React Native dual-interface prototype. Validate user stickiness and task completion metrics.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker active"><Map size={20} /></div>
                <div className="timeline-content">
                  <h3>Phase 2: Toka+ Subscriptions</h3>
                  <p>Introduce AI chore generation, advanced reporting, and unlimited profiles. Begin monetizing highly engaged "super-user" families.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"><Lock size={20} /></div>
                <div className="timeline-content">
                  <h3>Phase 3: The Family Fintech Layer</h3>
                  <p>Integrate real debit cards for older children. Chores auto-fund allowances via ACH. Toka becomes the OS for the family economy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section id="team" className="team">
          <div className="section-container text-center">
            <h2 className="section-title">The Founding Team</h2>
            <p className="section-subtitle">We possess the technical capability and domain passion to execute this vision.</p>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">
                  <Users size={40} className="avatar-placeholder" />
                </div>
                <h3>Raziel Sevilla</h3>
                <p className="team-role">Lead Developer & Visionary</p>
                <p className="team-bio">Executing rapid full-stack deployment using React Native, Expo, and Firebase. Focused on scalable, gamified architectures.</p>
              </div>
              {/* Note: Add more Wadhwani team members here as needed */}
              <div className="team-card empty-state">
                <div className="team-avatar">
                  <Users size={40} className="avatar-placeholder" />
                </div>
                <h3>Team Member 2</h3>
                <p className="team-role">Product / Marketing</p>
                <p className="team-bio">Insert team member expertise and role here.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL INVESTOR CTA */}
        <section className="final-cta">
          <div className="cta-container">
            <h2>Ready to back the future of Family Tech?</h2>
            <p>We are actively seeking feedback, mentorship, and seed opportunities.</p>
            <div className="hero-buttons" style={{ justifyContent: 'center' }}>
              <button className="cta-button large-cta">
                <Target size={20} className="inline-icon" style={{ marginRight: '8px', marginLeft: 0 }} /> Review Pitch Deck
              </button>
              <button className="secondary-button large-cta">
                <ArrowRight size={20} className="inline-icon" style={{ marginRight: '8px', marginLeft: 0 }} /> Try Prototype
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo" style={{ fontSize: '1.8rem' }}>Toka.</div>
            <p className="footer-text mt-2">A Wadhwani Foundation Hackathon Project.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Pitch Materials</h4>
              <a href="#">Executive Summary</a>
              <a href="#">Investor Deck (PDF)</a>
              <a href="#">Demo Video</a>
            </div>
            <div className="link-column">
              <h4>Contact</h4>
              <a href="#">Email the Team</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub Repo</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-text">© {new Date().getFullYear()} Toka. Built for the Wadhwani Foundation.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
