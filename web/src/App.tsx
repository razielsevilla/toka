import React, { useState } from 'react';
import {
  Target, Shield, Brain, CheckCircle, Gift, ArrowRight,
  Users, Briefcase, Smartphone, Database, Globe, DollarSign,
  Activity, XCircle, Megaphone, Rocket, PieChart, Code,
  Play, X, Calendar, Star, Linkedin, Github, MessageSquareQuote, Award
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import './App.css';

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle body scroll when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const roadmapSteps = [
    { date: "Q3 2025", title: "Customer Discovery", desc: "Interviewed 100+ parents, identifying the 74% 'mental load' burnout rate." },
    { date: "Q4 2025", title: "Functional MVP Validated", desc: "Core gamification loop built using React Native & Firebase." },
    { date: "Q1 2026", title: "Closed Beta Launch", desc: "Onboarding first 500 waitlist families for live stress-testing." },
    { date: "Q3 2026", title: "Market Growth & B2B", desc: "Targeting 10,000 MAU and elementary school PTA pilot programs." }
  ];

  const teamMembers = [
    { name: "Raziel Sevilla", role: "Chief Executive Officer", desc: "Visionary leader driving product strategy and full-stack architecture.", icon: Rocket, color: "text-purple" },
    { name: "Kurt Joshua Cayaga", role: "Chief Technology Officer", desc: "Lead engineer managing backend scalability and database integrations.", icon: Code, color: "text-blue" },
    { name: "Emiel James Escuzar", role: "Chief Financial Officer", desc: "Orchestrating financial modeling, monetization strategy, and operations.", icon: PieChart, color: "text-green" },
    { name: "Charles Platon", role: "Chief Marketing Officer", desc: "Directing go-to-market strategy, user acquisition, and brand loyalty.", icon: Megaphone, color: "text-pink" }
  ];

  const testimonials = [
    { quote: "Finally, an app that speaks my kid's language. I haven't had to yell about taking out the trash in weeks.", author: "Sarah M.", role: "Mother of two (8 & 11)" },
    { quote: "The virtual economy is genius. My son asks for chores to earn his Roblox gift cards. Incredible.", author: "David T.", role: "Tech-Dad of one (10)" },
    { quote: "Toka gamifies the friction out of parenting. It's like a video game for keeping a clean house and building habits.", author: "Elena R.", role: "Early Beta Tester" }
  ];

  return (
    <div className="app-container">
      {/* Dynamic Background Orbs */}
      <div className="orb-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <nav className="navbar" role="navigation" aria-label="main navigation">
        <a href="/" className="logo">Toka.</a>

        <div className="nav-links">
          <a href="#problem" className="nav-link">The Problem</a>
          <a href="#solution" className="nav-link">Solution MVP</a>
          <a href="#market" className="nav-link">Market</a>
          <a href="#business" className="nav-link">Business Model</a>
          <a href="#team" className="nav-link">Team</a>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button" aria-label="View Investor Deck"
        >
          <Briefcase size={16} style={{ marginRight: '8px' }} /> Pitch Deck
        </motion.button>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="hero-content"
          >
            <motion.div variants={fadeInUp} className="badge">
              <span className="sparkle">✨</span> Wadhwani Foundation Project
            </motion.div>

            <motion.h2 variants={fadeInUp} className="high-level-concept">
              "The Duolingo for Family Productivity"
            </motion.h2>

            <motion.h1 variants={fadeInUp} className="hero-title">
              Turn daily chores into <br />
              <span className="text-gradient">magical rewards.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="hero-subtitle">
              <strong>Why Now?</strong> The digital generation needs digital incentives. Toka bridges the gap between household responsibilities and financial literacy using behavioral economics.
            </motion.p>

            <motion.div variants={fadeInUp} className="hero-buttons">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(139, 92, 246, 0.4)" }}
                onClick={() => setIsModalOpen(true)}
                className="cta-button pulse-btn"
              >
                <Play size={18} style={{ marginRight: '8px' }} /> Try MVP Prototype
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                className="secondary-button"
              >
                Watch Pitch Video
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image-container"
          >
            <div className="glass-ring"></div>
            <img src="/hero.png" alt="Toka App Dashboard Overview" className="hero-image" loading="lazy" />
          </motion.div>
        </section>

        {/* MODULE 1: PROBLEM IDENTIFICATION */}
        <section id="problem" className="module-section bg-secondary relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container"
          >
            <motion.div variants={fadeInUp} className="text-center mb-4">
              <h2 className="section-title">The Problem & The Gap</h2>
              <p className="section-subtitle">
                <strong>Problem Statement:</strong> Modern parents face constant friction and burnout when managing children's chores, while kids lack engaging incentives and financial literacy.
              </p>
            </motion.div>

            <div className="grid-2 gap-4 mt-4">
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: "rgba(139, 92, 246, 0.4)" }}
                className="glass-card interactive-card"
              >
                <h3 className="card-title text-purple"><Activity className="icon-purple" /> Empathy Evidence</h3>
                <p>During our <em>Customer Discovery</em> phase, the core insight was jarring: <strong>74% of parents report the "mental load" of nagging is worse than doing the chore themselves.</strong></p>
                <div className="quote-box mt-2 float-anim-slow">
                  "Existing solutions like fridge whiteboards or basic list apps feel like homework to kids. There's a massive engagement gap."
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.4)" }}
                className="glass-card interactive-card"
              >
                <h3 className="card-title text-blue"><Users className="icon-blue" /> Customer Personas</h3>
                <motion.div whileHover={{ scale: 1.02 }} className="persona-box">
                  <strong className="text-blue">Primary: Tech-Savvy Parents (Age 28-45)</strong>
                  <p>Seeking to reduce household friction and teach kids responsibility without constant nagging.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="persona-box mt-2">
                  <strong className="text-cyan">Secondary: Children (Age 6-12)</strong>
                  <p>Digital natives who respond to gamification, instant feedback, and digital currency.</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* TESTIMONIALS SLIDER */}
        <section className="module-section relative z-10 pt-0 bg-secondary">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container"
          >
            <div className="grid-3">
              {testimonials.map((test, idx) => (
                <motion.div key={idx} variants={scaleIn} whileHover={{ y: -5 }} className="glass-card testimonial-card text-center">
                  <MessageSquareQuote size={30} className="text-purple mx-auto mb-2 opacity-50" />
                  <p className="italic mb-2 text-sm text-secondary">"{test.quote}"</p>
                  <div className="flex-center mt-auto" style={{ justifyContent: 'center', display: 'flex' }}>
                    <Star size={14} className="text-yellow fill-yellow" />
                    <Star size={14} className="text-yellow fill-yellow" />
                    <Star size={14} className="text-yellow fill-yellow" />
                    <Star size={14} className="text-yellow fill-yellow" />
                    <Star size={14} className="text-yellow fill-yellow" />
                  </div>
                  <h4 className="mt-1">{test.author}</h4>
                  <p className="text-xs text-secondary">{test.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* MODULE 2: VALUE PROPOSITION */}
        <section className="module-section relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container text-center"
          >
            <motion.h2 variants={fadeInUp} className="section-title">Value Proposition Design</motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle">
              <strong>Unique Value Proposition (UVP):</strong> A frictionless, dual-interface platform that transforms chores into an engaging micro-economy.
            </motion.p>

            <div className="grid-3 mt-4">
              <motion.div variants={scaleIn} whileHover={{ y: -10 }} className="glass-card text-left tilt-card">
                <div className="icon-wrapper bounce-icon bg-pink-light"><XCircle className="text-pink" /></div>
                <h4 className="mt-2 text-pink">Pain Relievers</h4>
                <ul className="benefit-list mt-2">
                  <li>Eliminates verbal nagging</li>
                  <li>Automates allowance tracking</li>
                  <li>Reduces parent-child conflict</li>
                </ul>
              </motion.div>

              <motion.div variants={scaleIn} whileHover={{ y: -10 }} className="glass-card text-left tilt-card border-glow">
                <div className="icon-wrapper bounce-icon bg-green-light"><CheckCircle className="text-green" /></div>
                <h4 className="mt-2 text-green">Gain Creators</h4>
                <ul className="benefit-list mt-2">
                  <li>Instills financial literacy early</li>
                  <li>Builds consistent habits</li>
                  <li>Fosters child independence</li>
                </ul>
              </motion.div>

              <motion.div variants={scaleIn} whileHover={{ y: -10 }} className="glass-card text-left tilt-card">
                <div className="icon-wrapper bounce-icon bg-yellow-light"><Brain className="text-yellow" /></div>
                <h4 className="mt-2 text-yellow">Behavioral Engine</h4>
                <ul className="benefit-list mt-2">
                  <li>Visual progress tracking</li>
                  <li>Immediate coin reinforcement</li>
                  <li>Delayed gratification training</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* MODULE 3: SOLUTION MVP */}
        <section id="solution" className="module-section bg-secondary relative z-10 overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container"
          >
            <motion.h2 variants={fadeInUp} className="section-title text-center">Solution & The MVP</motion.h2>
            <div className="feature-grid mt-4">
              <article className="feature-card">
                <motion.div variants={fadeInUp} className="feature-content">
                  <div className="badge pulse-border">MVP Active Showcase</div>
                  <h3 className="text-gradient">Frictionless Gamification Loop</h3>
                  <p>Our Minimum Viable Product solves the core problem through a synchronized dual-interface network.</p>

                  <motion.ul variants={staggerContainer} className="feature-list">
                    <motion.li variants={fadeInUp} whileHover={{ x: 5 }}><CheckCircle className="text-purple" size={18} /> <strong>Gamified Task Engine:</strong> Kids complete chores to earn virtual 'Coins'.</motion.li>
                    <motion.li variants={fadeInUp} whileHover={{ x: 5 }}><Gift className="text-purple" size={18} /> <strong>Rewards Marketplace:</strong> Parents set custom rewards purchased with earned Coins.</motion.li>
                    <motion.li variants={fadeInUp} whileHover={{ x: 5 }}><Shield className="text-purple" size={18} /> <strong>Real-time Sync:</strong> Cloud-based parent approval dashboard.</motion.li>
                  </motion.ul>

                  <div className="tech-stack mt-2">
                    <strong>Tech Stack Foundation:</strong>
                    <div className="tech-icons">
                      <motion.span whileHover={{ scale: 1.1 }} className="tech-pill bg-blue-dark text-blue-light"><Smartphone size={14} /> React Native</motion.span>
                      <motion.span whileHover={{ scale: 1.1 }} className="tech-pill bg-purple-dark text-purple-light"><Code size={14} /> TypeScript</motion.span>
                      <motion.span whileHover={{ scale: 1.1 }} className="tech-pill bg-yellow-dark text-yellow-light"><Database size={14} /> Firebase</motion.span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="interactive-mockup"
                >
                  <img src="/tasks.png" alt="MVP Tasks" className="feature-image float-anim" loading="lazy" />
                </motion.div>
              </article>
            </div>
          </motion.div>
        </section>

        {/* MODULE 4: MARKET VALIDATION */}
        <section id="market" className="module-section relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container text-center"
          >
            <motion.h2 variants={fadeInUp} className="section-title">Market Validation</motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mb-4">A massive, un-digitized market ripe for gamified disruption.</motion.p>

            <div className="grid-3">
              <motion.div variants={scaleIn} whileHover={{ y: -5 }} className="market-card stat-tilt">
                <Globe size={40} className="text-blue mx-auto mb-1 stat-icon" />
                <h3 className="counter-text text-blue">$140B</h3>
                <p className="label">TAM</p>
                <p className="desc">Total Addressable Market (Global pocket money economy)</p>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ y: -5 }} className="market-card stat-tilt">
                <Target size={40} className="text-purple mx-auto mb-1 stat-icon" />
                <h3 className="counter-text text-purple">$4.2B</h3>
                <p className="label">SAM</p>
                <p className="desc">Serviceable Addressable Market (Family tech productivity)</p>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ y: -5 }} className="market-card stat-tilt">
                <PieChart size={40} className="text-green mx-auto mb-1 stat-icon" />
                <h3 className="counter-text text-green">$42M</h3>
                <p className="label">SOM</p>
                <p className="desc">Serviceable Obtainable Market (First 3 years, 1% capture)</p>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="competitive-matrix mt-5 glass-card interactive-card mx-auto" style={{ maxWidth: '900px' }}>
              <h3 className="text-gradient">Competitive Analysis</h3>
              <div className="matrix-table-container mt-2">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th><span className="text-purple font-bold" style={{ fontSize: '1.2rem' }}>Toka</span></th>
                      <th>Physical Boards</th>
                      <th>Basic To-Do Apps</th>
                    </tr>
                  </thead>
                  <tbody>
                    <motion.tr whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <td>Child-Centric Gaming UI</td>
                      <td><div className="icon-wrapper matrix-icon mx-auto bg-green-light"><CheckCircle className="text-green" size={20} /></div></td>
                      <td><XCircle className="text-red mx-auto" size={20} /></td>
                      <td><XCircle className="text-red mx-auto" size={20} /></td>
                    </motion.tr>
                    <motion.tr whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <td>Virtual Economy Engine</td>
                      <td><div className="icon-wrapper matrix-icon mx-auto bg-green-light"><CheckCircle className="text-green" size={20} /></div></td>
                      <td><XCircle className="text-red mx-auto" size={20} /></td>
                      <td><XCircle className="text-red mx-auto" size={20} /></td>
                    </motion.tr>
                    <motion.tr whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <td>Automated Tracking</td>
                      <td><div className="icon-wrapper matrix-icon mx-auto bg-green-light"><CheckCircle className="text-green" size={20} /></div></td>
                      <td><XCircle className="text-red mx-auto" size={20} /></td>
                      <td><CheckCircle className="text-green mx-auto" size={20} /></td>
                    </motion.tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* MODULE 6: BUSINESS MODEL */}
        <section id="business" className="module-section bg-secondary relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container"
          >
            <motion.h2 variants={fadeInUp} className="section-title text-center">Business Model & Lean Canvas</motion.h2>

            <div className="grid-2 mt-4 gap-4 staggered-masonry">
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="glass-card green-glow">
                <h3 className="card-title text-green"><DollarSign className="icon-green bounce-icon" /> Revenue Streams</h3>
                <ul className="business-list">
                  <li><strong className="text-green">Freemium Model:</strong> Core task features free for user acquisition.</li>
                  <li><strong className="text-green">Toka+ SaaS ($4.99/mo):</strong> AI chore generation, advanced learning models.</li>
                  <li><strong className="text-green">Future B2B2C:</strong> Fintech API integrations for youth debit cards.</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="glass-card pink-glow mt-offset">
                <h3 className="card-title text-pink"><Megaphone className="icon-pink bounce-icon" /> Channels</h3>
                <ul className="business-list">
                  <li><strong className="text-pink">Organic Social:</strong> Targeting parenting communities online.</li>
                  <li><strong className="text-pink">ASO:</strong> Intent optimization for "chore apps for kids".</li>
                  <li><strong className="text-pink">B2B Partnerships:</strong> Pilot programs with elementary PTAs.</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="glass-card blue-glow">
                <h3 className="card-title text-blue"><Activity className="icon-blue bounce-icon" /> Cost Structure</h3>
                <ul className="business-list">
                  <li><strong className="text-blue">Infrastructure:</strong> Firebase Database/Auth scale up.</li>
                  <li><strong className="text-blue">Development:</strong> Continuous feature iteration.</li>
                  <li><strong className="text-blue">CAC:</strong> Targeted acquisition marketing spend.</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="glass-card yellow-glow mt-offset border-glow">
                <h3 className="card-title text-yellow"><Shield className="icon-yellow bounce-icon" /> Unfair Advantage</h3>
                <p><strong>Proprietary Behavioral Loop:</strong> Competitors build dry utility tools for parents. Toka is designed natively as a gamified behavioral economics game for children, achieving unmatched Daily Active User (DAU) stickiness.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ROADMAP / TRACTION MODULE */}
        <section id="traction" className="module-section relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container text-center"
          >
            <motion.h2 variants={fadeInUp} className="section-title">Traction & Roadmap</motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mb-5">Execution is everything. Here is our path to scaling family productivity.</motion.p>

            <div className="roadmap-container mt-4">
              <div className="roadmap-line"></div>
              {roadmapSteps.map((step, idx) => (
                <motion.div key={idx} variants={fadeInUp} className={`roadmap-item ${idx % 2 === 0 ? "left" : "right"}`}>
                  <div className="roadmap-dot"></div>
                  <div className="roadmap-card glass-card text-left interactive-card">
                    <div className="flex justify-between items-center mb-1">
                      <span className="badge m-0 px-2 py-1" style={{ display: 'inline-flex', alignItems: 'center' }}><Calendar size={12} style={{ marginRight: '6px' }} /> {step.date}</span>
                    </div>
                    <h4 className="text-gradient mt-1" style={{ fontSize: '1.4rem' }}>{step.title}</h4>
                    <p className="mt-1 text-secondary text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* TEAM & CTA SECTION */}
        <section id="team" className="module-section relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="section-container">
            <motion.h2 variants={fadeInUp} className="section-title">The Founding Team</motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mb-4">A cross-functional team combining deep technical expertise with strategic business execution.</motion.p>

            <div className="team-grid mt-4">
              {teamMembers.map((member, idx) => {
                const Icon = member.icon;
                return (
                  <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -10 }} className="team-card glow-card">
                    <div className={`team-avatar pulse-anim`}><Icon size={40} className={member.color} /></div>
                    <h3>{member.name}</h3>
                    <p className={`team-role ${member.color}`}>{member.role}</p>
                    <p className="team-bio">{member.desc}</p>
                    <div className="team-social mt-2" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <a href="#" className="social-icon" aria-label="LinkedIn"><Linkedin size={18} className="text-secondary hover:text-blue" /></a>
                      <a href="#" className="social-icon" aria-label="Github"><Github size={18} className="text-secondary hover:text-white" /></a>
                    </div>
                  </motion.div>
                );
              })}

              {/* Academic Advisor */}
              <motion.div variants={fadeInUp} whileHover={{ y: -10 }} className="team-card instructor-card border-glow">
                <div className="team-avatar"><Award size={40} className="text-yellow" /></div>
                <h3>Asst. Prof. Evangelina Magaling</h3>
                <p className="team-role text-yellow">Course Instructor & Advisor</p>
                <p className="team-bio text-secondary">Providing critical academic oversight and mentorship through the Wadhwani Foundation framework.</p>
                <div className="badge mt-2 border-yellow text-yellow" style={{ background: 'rgba(250,204,21,0.1)' }}>Wadhwani Mentor</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta pb-0 relative z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="cta-container"
          >
            <h2>Ready to scale family productivity?</h2>
            <p>Join our waitlist for the Beta launch or contact the team for investment opportunities.</p>
            <div className="hero-buttons" style={{ justifyContent: 'center' }}>
              <motion.button whileHover={{ scale: 1.05 }} className="cta-button large-cta pulse-btn">
                <Briefcase size={20} className="inline-icon" style={{ marginRight: '8px', marginLeft: 0 }} /> Contact Team
              </motion.button>
              <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} className="secondary-button large-cta">
                Join Beta Waitlist <ArrowRight size={20} className="inline-icon" />
              </motion.button>
            </div>
          </motion.div>
        </section>

      </main>

      <footer className="footer relative z-10 mt-5" role="contentinfo">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo" style={{ fontSize: '1.8rem' }}>Toka.</div>
            <p className="footer-text mt-1">A Wadhwani Foundation Project.</p>
          </div>
          <p className="footer-text">© {new Date().getFullYear()} Toka. Built for the Wadhwani Foundation.</p>
        </div>
      </footer>

      {/* INTERACTIVE PROTOTYPE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
              <div className="modal-header">
                <h3 className="text-gradient">Toka Interactive Demo</h3>
                <p className="text-sm text-secondary">Experience the gamified chore loop (Simulated Interface)</p>
              </div>
              <div className="modal-body" style={{ display: 'flex', justifyContent: 'center' }}>
                {/* 
                  Real-world execution: 
                  If Toka was deployed to Vercel/Expo web, we'd embed it via iframe:
                  <iframe src="https://toka-app.vercel.app" className="demo-iframe" title="Toka App Prototype" />
                */}
                <div className="placeholder-prototype flex-center flex-col text-center" style={{ padding: '20px' }}>
                  <Smartphone size={60} className="text-purple mb-2 float-anim mx-auto" />
                  <h4>Mobile Prototype Access</h4>
                  <p className="text-center mt-1 text-secondary text-sm">
                    In a live deployment, this window streams the functional React Native Expo prototype.
                    <br /><br />
                    Currently running locally. Ensure <span className="text-pink px-1 rounded" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>npx expo start</span> is executed to test the mobile backend.
                  </p>
                  <button className="cta-button mt-4" onClick={() => setIsModalOpen(false)}>Close Simulator</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
