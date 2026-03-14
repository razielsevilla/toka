import React, { useState, useEffect } from 'react';
import {
  Target, Shield, Brain, CheckCircle, ArrowRight,
  Users, Briefcase, Smartphone, Database, Globe, DollarSign,
  Activity, XCircle, Megaphone, Rocket, PieChart, Code, Award,
  Play, X, Calendar, MessageSquareQuote, ChevronLeft, ChevronRight, Menu, Lock
} from 'lucide-react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, type Variants } from 'framer-motion';
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

// Magical Floating Particles Component
const MagicalParticles = () => {
  const particles = Array.from({ length: 25 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.2
          }}
          animate={{
            y: ["-10%", "110%"],
            x: [
              (Math.random() * 100) + "%",
              (Math.random() * 100 + (Math.random() > 0.5 ? 20 : -20)) + "%"
            ],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
          }}
        />
      ))}
    </div>
  );
};

// --- Interactive Components ---

const Counter = ({ value, duration = 2, suffix = '' }: { value: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalMiliseconds = duration * 1000;

      const timer = setInterval(() => {
        start += 1;
        setCount(Math.floor(start * (end / (totalMiliseconds / 16)))); // smoother transition
        if (start >= (totalMiliseconds / 16)) {
          setCount(end);
          clearInterval(timer);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const TokaBokaToggle = () => {
  const [isToka, setIsToka] = useState(true);

  return (
    <section className={`toka-boka-section ${isToka ? 'mode-toka' : 'mode-boka'}`}>
      <div className="section-container">
        <div className="toggle-wrapper">
          <span className={`toggle-label ${!isToka ? 'active' : ''}`}>Boka (Nagging)</span>
          <div className="main-toggle" onClick={() => setIsToka(!isToka)}>
            <motion.div
              className="toggle-handle"
              animate={{ x: isToka ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
          <span className={`toggle-label ${isToka ? 'active' : ''}`}>Toka (Kusa)</span>
        </div>

        <div className="comparison-display mt-4">
          <AnimatePresence mode="wait">
            {isToka ? (
              <motion.div
                key="toka"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="comparison-card toka-card"
              >
                <div className="comparison-icon"><CheckCircle size={48} className="text-green" /></div>
                <h3>The "Toka" Way</h3>
                <p>"Ma, tapos na po yung toka ko! Check niyo na sa app."</p>
                <ul className="comparison-list">
                  <li>✨ Positive reinforcement</li>
                  <li>✨ Self-driven discipline</li>
                  <li>✨ Kids earn Tokash</li>
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="boka"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="comparison-card boka-card"
              >
                <div className="comparison-icon"><XCircle size={48} className="text-red" /></div>
                <h3>The "Boka" Way</h3>
                <p>"WASH THE DISHES! How many times do I have to ask?!"</p>
                <ul className="comparison-list">
                  <li>💢 Constant verbal friction</li>
                  <li>💢 High parental mental load</li>
                  <li>💢 Kids feel like it's a chore</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const SavingsCalculator = () => {
  const [allowance, setAllowance] = useState(100);
  const [months, setMonths] = useState(6);
  const interestRate = 0.05;

  const calculateSavings = () => {
    let total = 0;
    for (let i = 0; i < months * 4; i++) {
      total = (total + allowance) * (1 + (interestRate / 4));
    }
    return Math.floor(total);
  };

  return (
    <div className="calculator-card glass-card">
      <h3 className="text-gradient">The Vault Projection</h3>
      <p className="text-sm text-secondary mb-2">See how Tokash grows with discipline & interest.</p>

      {/* Visual Progress Visualization */}
      <div className="vault-progress-container">
        {[...Array(12)].map((_, i) => {
          const isActive = (i + 1) <= months;
          const height = 20 + (i * 6);
          return (
            <motion.div
              key={i}
              className={`progress-bar ${isActive ? 'active' : ''}`}
              initial={{ height: 20 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.05 }}
            />
          );
        })}
      </div>

      <div className="calc-controls mt-2">
        <div className="control-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="text-sm font-bold">Weekly Allowance</label>
            <span className="text-cyan font-bold">{allowance} Tokash</span>
          </div>
          <input
            type="range" min="50" max="500" step="10"
            value={allowance} onChange={(e) => setAllowance(parseInt(e.target.value))}
            className="modern-slider"
          />
        </div>
        <div className="control-group mt-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="text-sm font-bold">Saving for</label>
            <span className="text-blue font-bold">{months} Months</span>
          </div>
          <input
            type="range" min="1" max="12" step="1"
            value={months} onChange={(e) => setMonths(parseInt(e.target.value))}
            className="modern-slider slider-blue"
          />
        </div>
      </div>

      <div className="calc-result mt-3">
        <div className="result-label">Projected Savings</div>
        <div className="result-value text-gradient" style={{ fontSize: '2.5rem' }}>
          <Counter value={calculateSavings()} />
          <span className="tokash-suffix" style={{ fontSize: '1rem' }}> Tokash</span>
        </div>
        <p className="text-xs text-secondary mt-1">Includes ~5% APY compounding growth.</p>
      </div>
    </div>
  );
};

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="conversion-area">
      {!submitted ? (
        <form className="waitlist-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(email.includes('@')); }}>
          <input
            type="email"
            placeholder="Enter your email"
            className="waitlist-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cta-button waitlist-submit"
          >
            Join Early Waitlist
          </motion.button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-green font-bold text-center p-2"
        >
          ✨ You're on the list! We'll reach out soon.
        </motion.div>
      )}
    </div>
  );
};


const InteractiveChore = () => {
  const [complete, setComplete] = useState(false);

  return (
    <div className="interactive-chore-card">
      <div className="chore-info">
        <div className="chore-icon"><Activity size={24} className="text-cyan" /></div>
        <div>
          <h4>Daily Toka: Wash Dishes</h4>
          <p className="text-xs">+50 Tokash</p>
        </div>
      </div>

      {!complete ? (
        <div className="slider-track">
          <motion.div
            className="slider-button"
            drag="x"
            dragConstraints={{ left: 0, right: 200 }}
            dragElastic={0}
            onDrag={(_, info) => {
              if (info.offset.x >= 180) {
                setComplete(true);
              }
            }}
            style={{ x: 0 }}
            whileTap={{ scale: 1.1 }}
          >
            <ArrowRight size={20} />
          </motion.div>
          <span className="slider-text">Slide to complete</span>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="chore-completed-msg"
        >
          <CheckCircle className="text-green" size={24} />
          <span>Toka Complete! +50 Tokash</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setComplete(false)}
            className="text-xs text-blue mt-1 underline"
          >
            Reset Demo
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [businessTab, setBusinessTab] = useState('market');
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [sessionTokash, setSessionTokash] = useState(0);
  const [collectedCoins, setCollectedCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [activeCoins, setActiveCoins] = useState<{ id: number, x: number, delay: number, duration: number }[]>(
    [...Array(6)].map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      delay: i * 3,
      duration: 18 + Math.random() * 12
    }))
  );

  const thresholds = {
    problem: 20,
    solution: 40,
    market: 60,
    traction: 80,
    team: 100
  };

  const isUnlocked = (section: keyof typeof thresholds) => {
    return sessionTokash >= thresholds[section];
  };

  const getSectionProgress = (section: keyof typeof thresholds) => {
    const keys = Object.keys(thresholds) as (keyof typeof thresholds)[];
    const idx = keys.indexOf(section);
    const prevThreshold = idx === 0 ? 0 : thresholds[keys[idx - 1]];
    const currentThreshold = thresholds[section];
    
    if (sessionTokash >= currentThreshold) return 100;
    if (sessionTokash <= prevThreshold) return 0;
    
    return ((sessionTokash - prevThreshold) / (currentThreshold - prevThreshold)) * 100;
  };

  // Mouse Tracking for Mascot Cursor & Parallax
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  // Parallax offsets
  const orb1Translate = { x: (mousePos.x - window.innerWidth / 2) * 0.05, y: (mousePos.y - window.innerHeight / 2) * 0.05 };
  const orb2Translate = { x: (mousePos.x - window.innerWidth / 2) * -0.07, y: (mousePos.y - window.innerHeight / 2) * -0.07 };
  const heroParallax = { x: (mousePos.x - window.innerWidth / 2) * 0.015, y: (mousePos.y - window.innerHeight / 2) * 0.015 };

  useEffect(() => {
    let lastX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < lastX - 2) setDirection('left');
      else if (e.clientX > lastX + 2) setDirection('right');

      setMousePos({ x: e.clientX, y: e.clientY });
      lastX = e.clientX;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHoveringLink(true);
      } else {
        setIsHoveringLink(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const handleCollect = (e: React.MouseEvent, id: number) => {
    setSessionTokash(prev => prev + 10);
    setCollectedCoins(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);

    // "Pop" the coin immediately by removing it from active state
    setActiveCoins(prev => prev.filter(c => c.id !== id));

    // Respawn a new coin after a short delay to keep the game going
    setTimeout(() => {
      setActiveCoins(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        delay: 0,
        duration: 20 + Math.random() * 10 // Chill speed for respawns
      }]);
    }, 2000);

    // Remove the popup after animation
    setTimeout(() => {
      setCollectedCoins(prev => prev.filter(c => c.id !== id));
    }, 1000);
  };


  const { scrollYProgress } = useScroll();
  const mascotY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const mascotRotate = useTransform(scrollYProgress, [0, 0.3], [0, 8]);

  // Handle scroll effects (Solidify navbar on scroll)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Active Section Tracking using Intersection Observer
    const sections = ['problem', 'solution', 'market', 'traction', 'team'];
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Toggle body scroll when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const roadmapSteps = [
    { date: "Q3 2025", title: "Customer Discovery", done: true, desc: "Interviewed 100+ parents, identifying the core friction in Filipino household management." },
    { date: "Q4 2025", title: "MVP Validated", done: true, desc: "Core gamification loop with Tokash economy built using React Native & Firebase." },
    { date: "Q1 2026", title: "Community Beta", done: false, desc: "Opening access to early adopters in CALABARZON for live stress-testing." },
    { date: "Q3 2026", title: "B2B School Pilot", done: false, desc: "Launching classroom management modules for partner elementary schools." }
  ];

  const teamMembers = [
    { name: "Raziel Sevilla", role: "Chief Executive Officer", desc: "Driving the vision and product strategy to revolutionize Filipino household productivity.", icon: Rocket, color: "text-cyan" },
    { name: "Kurt Joshua Cayaga", role: "Chief Technology Officer", desc: "Leading technical architecture and full-stack development for the Toka ecosystem.", icon: Code, color: "text-blue" },
    { name: "Emiel James Escuzar", role: "Chief Financial Officer", desc: "Managing financial sustainability, monetization strategies, and operational growth.", icon: PieChart, color: "text-green" },
    { name: "Charles Platon", role: "Chief Marketing Officer", desc: "Developing community-driven growth and go-to-market strategies for local impact.", icon: Megaphone, color: "text-pink" }
  ];

  const testimonials = [
    { quote: "Finally, an app that speaks the language of local parents. My kids actually enjoy doing their 'toka' now.", author: "Maricel R.", role: "Mother of three (Laguna)" },
    { quote: "The Tokash economy is genius. My son saves up for his rewards instead of asking for them daily. Real discipline.", author: "Jose P.", role: "DFA-Dad of two (Cavite)" },
    { quote: <><span className="logo-inline">Tok<span className="logo-accent-inline">a</span></span> makes household habits feel like a game. The 'Less Boka' promise is real.</>, author: "Elena S.", role: "Early Adopter" }
  ];

  return (
    <div className="app-container">
      {/* Custom Mascot Cursor */}
      <motion.div
        className="custom-cursor"
        animate={{
          x: mousePos.x - 75, // Centered for 150px
          y: mousePos.y - 75,
          scale: isHoveringLink ? 0.7 : 1,
          rotateY: direction === 'right' ? 180 : 0, 
          rotateZ: direction === 'left' ? -5 : 5 
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 250, // More responsive
          mass: 0.3
        }}
      >
        <img
          src="/cursor.png"
          alt="Mascot Cursor"
          className="cursor-mascot"
          style={{ transform: 'scaleX(1)' }} // No base flip needed, rotateY handles it
        />
      </motion.div>

      {/* Dynamic Background Orbs with Parallax */}
      <div className="orb-container">
        <div className="orb orb-1" style={{ transform: `translate(${orb1Translate.x}px, ${orb1Translate.y}px)` }}></div>
        <div className="orb orb-2" style={{ transform: `translate(${orb2Translate.x}px, ${orb2Translate.y}px)` }}></div>
        <div className="orb orb-3"></div>
      </div>

      <MagicalParticles />

      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-top'}`} role="navigation" aria-label="main navigation">
        <div className="nav-brand">
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <a href="/" className="logo">Tok<span className="logo-accent">a</span></a>
        </div>

        <div className="nav-links">
          {['problem', 'solution', 'market', 'traction', 'team'].map((key) => {
            const label = key === 'problem' ? 'Impact' : key === 'solution' ? 'Product' : key === 'market' ? 'Strategy' : key === 'traction' ? 'Roadmap' : 'Team';
            const progress = getSectionProgress(key as keyof typeof thresholds);
            return (
              <a 
                key={key}
                href={`#${key}`} 
                className={`nav-link ${activeSection === key ? 'active' : ''} ${isUnlocked(key as keyof typeof thresholds) ? 'unlocked' : ''}`}
              >
                {!isUnlocked(key as keyof typeof thresholds) && (
                  <div className="nav-link-progress" style={{ width: `${progress}%` }}></div>
                )}
                {label}
              </a>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {sessionTokash > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="navbar-tokash-counter"
            >
              <DollarSign size={16} /> {sessionTokash} Tokash
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button nav-cta" aria-label="View Investor Deck"
          >
            <Briefcase size={16} style={{ marginRight: '8px' }} /> <span className="cta-text">Pitch Deck</span>
          </motion.button>
        </div>
      </nav>

      {/* Reward Popups Overlay */}
      {collectedCoins.map(coin => (
        <motion.div
          key={coin.id}
          initial={{ opacity: 1, y: coin.y, x: coin.x }}
          animate={{ opacity: 0, y: coin.y - 100 }}
          className="reward-popup"
          style={{ position: 'fixed', left: 0, top: 0 }}
        >
          +10 Tokash!
        </motion.div>
      ))}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-links">
              <a href="#problem" onClick={() => setIsMenuOpen(false)}>Impact</a>
              <a href="#solution" onClick={() => setIsMenuOpen(false)}>Product</a>
              <a href="#market" onClick={() => setIsMenuOpen(false)}>Strategy</a>
              <a href="#traction" onClick={() => setIsMenuOpen(false)}>Roadmap</a>
              <a href="#team" onClick={() => setIsMenuOpen(false)}>Team</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home" style={{ overflow: 'hidden' }}>
          {/* Floating Interactive "Bubbles" */}
          <AnimatePresence>
            {activeCoins.map((coin) => (
              <motion.div
                key={coin.id}
                className="tokash-coin"
                onClick={(e) => handleCollect(e, coin.id)}
                initial={{
                  left: coin.x + "%",
                  top: "110%",
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  top: "-10%",
                  scale: [1, 1.1, 1],
                  opacity: [0, 1, 1, 0.5],
                  x: [0, 20, -20, 0] // Wobble "bubble" movement
                }}
                exit={{
                  scale: 2,
                  opacity: 0,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  duration: coin.duration,
                  delay: coin.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.3, rotate: 15, backgroundColor: '#FFD700' }}
              >
                T
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="hero-content"
          >
            <motion.h2 variants={fadeInUp} className="high-level-concept">
              "Sa Bawat Toka, Less ang Boka, More ang Kusa"
            </motion.h2>

            <motion.h1 variants={fadeInUp} className="hero-title">
              Turn daily chores into
              <span className="text-gradient"> magical rewards.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="hero-subtitle">
              <strong>Why Now?</strong> The digital generation needs modern incentives. <span className="logo-inline">Tok<span className="logo-accent-inline">a</span></span> bridges the gap between household responsibilities and financial literacy using behavioral economics.
              {sessionTokash < thresholds.problem && (
                <span className="text-accent-yellow" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                  <br /><br />
                  🎯 Pounce on {thresholds.problem - sessionTokash} more Tokash with the mascot to unlock the Full Mission!
                </span>
              )}
            </motion.p>

            <motion.div variants={fadeInUp} className="hero-buttons">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0, 137, 255, 0.3)" }}
                onClick={() => setIsModalOpen(true)}
                className="cta-button pulse-btn"
              >
                <Play size={18} style={{ marginRight: '8px' }} /> Try MVP Prototype
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 137, 255, 0.05)" }}
                className="secondary-button"
              >
                Watch Pitch Video
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} className="logo-strip mt-2">
              <div className="logo-item"><Award size={18} className="text-green" /> Wadhwani Foundation</div>
              <div className="logo-item"><Globe size={18} className="text-blue" /> CALABARZON Pilots</div>
              <div className="logo-item"><Users size={18} className="text-cyan" /> 100+ Families</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hero-image-container"
            style={{ 
              y: mascotY, 
              rotate: mascotRotate,
              x: heroParallax.x,
              translateY: heroParallax.y
            }}
          >
            <div className="glass-ring"></div>
            <img src="/mascot-front.png" alt="Toka App Dashboard Overview" className="hero-image" loading="lazy" />
          </motion.div>
        </section>

        {/* INTERACTIVE MODULE: TOKA VS BOKA */}
        <TokaBokaToggle />

        {/* MODULE 1: FAMILY IMPACT (Merged Problem + Testimonials) */}
        <section id="problem" className={`module-section bg-secondary relative z-10 ${!isUnlocked('problem') ? 'section-locked' : ''}`}>
          {!isUnlocked('problem') && (
            <div className="unlock-overlay">
              <div className="unlock-card challenge-card">
                <div className="lock-icon-container"><Lock size={32} /></div>
                <div className="challenge-badge">Tokash Challenge #1</div>
                <h3>Impact Section Locked</h3>
                <p>Collect <b>{thresholds.problem} Tokash</b> by catching bubbles in the <b>Hero Section</b> to unlock this data.</p>
                <div className="text-secondary mt-2">Current Balance: <b>{sessionTokash} Tokash</b></div>
                <a href="#home" className="challenge-link mt-2">Go to Hero Section ↑</a>
              </div>
            </div>
          )}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container"
          >
            <motion.div variants={fadeInUp} className="text-center mb-4">
              <h2 className="section-title">The Problem & Family Impact</h2>
              <p className="section-subtitle">
                Modern parents face constant friction and burnout, but there's a better way.
              </p>
            </motion.div>

            <div className="grid-2 gap-4 mt-4">
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: "rgba(49, 255, 236, 0.4)" }}
                className="glass-card interactive-card"
              >
                <h3 className="card-title text-cyan"><Activity className="icon-cyan" /> Empathy Evidence</h3>
                <p><strong>74% of parents report the "mental load" of nagging is worse than doing the chore themselves.</strong></p>
                <div className="quote-box mt-2 float-anim-slow">
                  "Existing solutions like fridge whiteboards or basic list apps feel like homework to kids."
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.4)" }}
                className="glass-card interactive-card"
              >
                <h3 className="card-title text-blue"><Users className="icon-blue" /> Target Segments</h3>
                <div className="persona-box">
                  <strong className="text-blue">B2C: Working Families</strong>
                  <p className="text-sm">Reducing household friction through a micro-economy.</p>
                </div>
                <div className="persona-box mt-1">
                  <strong className="text-cyan">B2B: Schools</strong>
                  <p className="text-sm">Gamified classroom management tools.</p>
                </div>
              </motion.div>
            </div>

            {/* Testimonials Carousel (Option C) */}
            <div className="carousel-nav-container mt-4">
              <div className="carousel-arrow arrow-left"><ChevronLeft size={24} /></div>
              <div className="carousel-arrow arrow-right"><ChevronRight size={24} /></div>

              <div className="carousel-container">
                <div className="carousel-track">
                  {testimonials.map((test, idx) => (
                    <motion.div key={idx} variants={scaleIn} className="carousel-item">
                      <div className="glass-card testimonial-card text-center" style={{ height: '100%' }}>
                        <MessageSquareQuote size={30} className="text-cyan mx-auto mb-2 opacity-50" />
                        <p className="italic mb-2 text-sm text-secondary">"{test.quote}"</p>
                        <h4 className="mt-1">{test.author}</h4>
                        <p className="text-xs text-secondary">{test.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="scroll-indicator">
                {testimonials.map((_, i) => <div key={i} className={`dot ${i === 0 ? 'active' : ''}`} />)}
              </div>
            </div>
          </motion.div>
        </section>

        {/* MODULE 2: VALUE PROPOSITION */}
        <section id="solution" className={`module-section relative z-10 ${!isUnlocked('solution') ? 'section-locked' : ''}`}>
          {!isUnlocked('solution') && (
            <div className="unlock-overlay">
              <div className="unlock-card challenge-card">
                <div className="lock-icon-container"><Lock size={32} /></div>
                <div className="challenge-badge">Tokash Challenge #2</div>
                <h3>Product Section Locked</h3>
                <p>Reach <b>{thresholds.solution} Tokash</b> to see how the Toka APP actually works.</p>
                <div className="text-secondary mt-2">Current Balance: <b>{sessionTokash} Tokash</b></div>
                <a href="#home" className="challenge-link mt-2">Go to Hero Section ↑</a>
              </div>
            </div>
          )}
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
                  <li>Delayed gratification training</li>
                  <li>Real-time Tokash reinforcement</li>
                  <li>Interest-bearing Vault mechanics</li>
                </ul>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="mt-5 mx-auto" style={{ maxWidth: '600px' }}>
              <SavingsCalculator />
            </motion.div>
          </motion.div>
        </section>

        {/* MODULE 3: SOLUTION MVP */}
        <section id="solution" className={`module-section bg-secondary relative z-10 overflow-hidden ${!isUnlocked('solution') ? 'section-locked' : ''}`}>
          {!isUnlocked('solution') && (
            <div className="unlock-overlay">
              <div className="unlock-card">
                <div className="lock-icon-container"><Lock size={32} /></div>
                <h3>Product Section Locked</h3>
                <p>Collect <b>{thresholds.solution} Tokash</b> to unlock the full product details and value proposition.</p>
                <div className="text-secondary mt-2">Current Balance: {sessionTokash} Tokash</div>
              </div>
            </div>
          )}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container text-center"
          >            <motion.h2 variants={fadeInUp} className="section-title">Solution & The MVP</motion.h2>
            <div className="feature-grid mt-4">
              <article className="feature-card">
                <motion.div variants={fadeInUp} className="feature-content">
                  <div className="badge pulse-border">Functional MVP Foundation</div>
                  <h3 className="text-gradient">The Tokash Economy</h3>
                  <p>Our platform transforms chores into an engaging micro-economy that rewards discipline and patience.</p>

                  <motion.ul variants={staggerContainer} className="feature-list">
                    <motion.li variants={fadeInUp} whileHover={{ x: 5 }}><CheckCircle className="text-cyan" size={18} /> <strong className="text-left">Gamified Task Engine:</strong> Kids earn 'Tokash' for every completed 'Toka'.</motion.li>
                    <motion.li variants={fadeInUp} whileHover={{ x: 5 }}><Activity className="text-cyan" size={18} /> <strong className="text-left">Savings Vault:</strong> Earn interest on saved Tokash, teaching delayed gratification.</motion.li>
                    <motion.li variants={fadeInUp} whileHover={{ x: 5 }}><Briefcase className="text-cyan" size={18} /> <strong className="text-left">Auction House:</strong> Compete for premium family rewards with bidding mechanics.</motion.li>
                    <motion.li variants={fadeInUp} whileHover={{ x: 5 }}><Shield className="text-cyan" size={18} /> <strong className="text-left">Parent Dashboard:</strong> Real-time approval and budget tracking (₱).</motion.li>
                  </motion.ul>

                  <div className="tech-stack mt-2">
                    <strong>Tech Stack Foundation:</strong>
                    <div className="tech-icons">
                      <motion.span whileHover={{ scale: 1.1 }} className="tech-pill bg-blue-dark text-blue-light"><Smartphone size={14} /> React Native</motion.span>
                      <motion.span whileHover={{ scale: 1.1 }} className="tech-pill bg-cyan-dark text-cyan-light"><Code size={14} /> TypeScript</motion.span>
                      <motion.span whileHover={{ scale: 1.1 }} className="tech-pill bg-yellow-dark text-yellow-light"><Database size={14} /> Firebase</motion.span>
                    </div>
                  </div>

                  <div className="interactive-demo-container mt-4">
                    <InteractiveChore />
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

        {/* MODULE 4, 5, 6: BUSINESS STRATEGY (Tabbed Sections Option B) */}
        <section id="market" className={`module-section relative z-10 ${!isUnlocked('market') ? 'section-locked' : ''}`}>
          {!isUnlocked('market') && (
            <div className="unlock-overlay">
              <div className="unlock-card challenge-card">
                <div className="lock-icon-container"><Lock size={32} /></div>
                <div className="challenge-badge">Tokash Challenge #3</div>
                <h3>Business Strategy Locked</h3>
                <p>Collect <b>{thresholds.market} Tokash</b> to reveal the market validation and revenue model.</p>
                <div className="text-secondary mt-2">Current Balance: <b>{sessionTokash} Tokash</b></div>
                <a href="#home" className="challenge-link mt-2">Go to Hero Section ↑</a>
              </div>
            </div>
          )}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="section-container text-center"
          >
            <motion.h2 variants={fadeInUp} className="section-title">Business Strategy</motion.h2>

            <div className="tabs-nav">
              <button
                className={`tab-button ${businessTab === 'market' ? 'active' : ''}`}
                onClick={() => setBusinessTab('market')}
              >
                Market Validation
              </button>
              <button
                className={`tab-button ${businessTab === 'competitive' ? 'active' : ''}`}
                onClick={() => setBusinessTab('competitive')}
              >
                Competitive Analysis
              </button>
              <button
                className={`tab-button ${businessTab === 'model' ? 'active' : ''}`}
                onClick={() => setBusinessTab('model')}
              >
                Business Model
              </button>
            </div>

            <div className="tabs-content">
              <AnimatePresence mode="wait">
                {businessTab === 'market' && (
                  <motion.div
                    key="market"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid-3"
                  >
                    <div className="market-card stat-tilt">
                      <Globe size={40} className="text-blue mx-auto mb-1 stat-icon" />
                      <h3 className="counter-text text-blue"><Counter value={13} suffix="M" /></h3>
                      <p className="label">TAM</p>
                      <p className="desc text-xs">PH Households</p>
                    </div>
                    <div className="market-card stat-tilt">
                      <Target size={40} className="text-cyan mx-auto mb-1 stat-icon" />
                      <h3 className="counter-text text-cyan"><Counter value={500} suffix="k" /></h3>
                      <p className="label">SAM</p>
                      <p className="desc text-xs">CALABARZON</p>
                    </div>
                    <div className="market-card stat-tilt">
                      <PieChart size={40} className="text-green mx-auto mb-1 stat-icon" />
                      <h3 className="counter-text text-green"><Counter value={50} suffix="k" /></h3>
                      <p className="label">SOM</p>
                      <p className="desc text-xs">Local Pilot Cities</p>
                    </div>
                  </motion.div>
                )}

                {businessTab === 'competitive' && (
                  <motion.div
                    key="competitive"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-card interactive-card mx-auto"
                    style={{ maxWidth: '900px' }}
                  >
                    <div className="matrix-table-container">
                      <table className="matrix-table">
                        <thead>
                          <tr>
                            <th>Feature</th>
                            <th><span className="logo-inline" style={{ fontSize: '1.2rem' }}>Tok<span className="logo-accent-inline">a</span></span></th>
                            <th>Traditional</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Gaming UI</td>
                            <td><CheckCircle className="text-green mx-auto" size={20} /></td>
                            <td><XCircle className="text-red mx-auto" size={20} /></td>
                          </tr>
                          <tr>
                            <td>Economy Engine</td>
                            <td><CheckCircle className="text-green mx-auto" size={20} /></td>
                            <td><XCircle className="text-red mx-auto" size={20} /></td>
                          </tr>
                          <tr>
                            <td>Auto-Tracking</td>
                            <td><CheckCircle className="text-green mx-auto" size={20} /></td>
                            <td><XCircle className="text-red mx-auto" size={20} /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {businessTab === 'model' && (
                  <motion.div
                    key="model"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="carousel-container">
                      <div className="carousel-track">
                        <div className="carousel-item">
                          <div className="glass-card green-glow text-left" style={{ height: '100%' }}>
                            <h3 className="card-title text-green"><DollarSign size={20} /> Revenue</h3>
                            <ul className="business-list text-sm">
                              <li>B2C: ₱99/mo</li>
                              <li>B2B: ₱99/student</li>
                            </ul>
                          </div>
                        </div>
                        <div className="carousel-item">
                          <div className="glass-card pink-glow text-left" style={{ height: '100%' }}>
                            <h3 className="card-title text-pink"><Megaphone size={20} /> Channels</h3>
                            <ul className="business-list text-sm">
                              <li>School Partnerships</li>
                              <li>Community Groups</li>
                            </ul>
                          </div>
                        </div>
                        <div className="carousel-item">
                          <div className="glass-card blue-glow text-left" style={{ height: '100%' }}>
                            <h3 className="card-title text-blue"><Activity size={20} /> Scaling</h3>
                            <ul className="business-list text-sm">
                              <li>Phase 1: Households</li>
                              <li>Phase 2: Schools</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* ROADMAP / TRACTION MODULE */}
        <section id="traction" className={`module-section relative z-10 ${!isUnlocked('traction') ? 'section-locked' : ''}`}>
          {!isUnlocked('traction') && (
            <div className="unlock-overlay">
              <div className="unlock-card challenge-card">
                <div className="lock-icon-container"><Lock size={32} /></div>
                <div className="challenge-badge">Tokash Challenge #4</div>
                <h3>Roadmap Section Locked</h3>
                <p>Collect <b>{thresholds.traction} Tokash</b> to see our path to scaling family productivity.</p>
                <div className="text-secondary mt-2">Current Balance: <b>{sessionTokash} Tokash</b></div>
                <a href="#home" className="challenge-link mt-2">Go to Hero Section ↑</a>
              </div>
            </div>
          )}
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
                  <div className={`roadmap-dot ${step.done ? 'roadmap-dot-done' : ''}`}></div>
                  <div className="roadmap-card glass-card text-left interactive-card">
                    <div className="roadmap-card-header">
                      <span className="badge m-0 px-2 py-1" style={{ display: 'inline-flex', alignItems: 'center' }}><Calendar size={12} style={{ marginRight: '6px' }} /> {step.date}</span>
                      {step.done && <span className="done-badge">Completed</span>}
                    </div>
                    <h4 className="text-gradient mt-1" style={{ fontSize: '1.4rem' }}>{step.title}</h4>
                    <p className="mt-1 text-secondary text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* TEAM & CTA SECTION (Team Carousel Option C) */}
        <section id="team" className={`module-section relative z-10 text-center ${!isUnlocked('team') ? 'section-locked' : ''}`}>
          {!isUnlocked('team') && (
            <div className="unlock-overlay">
              <div className="unlock-card challenge-card">
                <div className="lock-icon-container"><Lock size={32} /></div>
                <div className="challenge-badge">The Final Challenge</div>
                <h3>Team Section Locked</h3>
                <p>Reach <b>{thresholds.team} Tokash</b> to unlock the founding team details.</p>
                <div className="text-secondary mt-2">Current Balance: <b>{sessionTokash} Tokash</b></div>
                <a href="#home" className="challenge-link mt-2">Go to Hero Section ↑</a>
              </div>
            </div>
          )}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="section-container">
            <motion.h2 variants={fadeInUp} className="section-title">The Founding Team</motion.h2>

            <div className="carousel-nav-container mt-4">
              <div className="carousel-arrow arrow-left"><ChevronLeft size={24} /></div>
              <div className="carousel-arrow arrow-right"><ChevronRight size={24} /></div>

              <div className="carousel-container">
                <div className="carousel-track">
                  {teamMembers.map((member, idx) => {
                    const Icon = member.icon;
                    return (
                      <motion.div key={idx} variants={fadeInUp} className="carousel-item">
                        <div className="team-card glow-card" style={{ height: '100%' }}>
                          <div className="team-avatar-frame">
                            <div className="team-avatar" style={{ width: '100%', height: '100%', margin: 0 }}>
                              <Icon size={40} className={member.color} />
                            </div>
                          </div>
                          <h3 style={{ fontSize: '1.2rem' }}>{member.name}</h3>
                          <p className={`team-role ${member.color}`} style={{ fontSize: '0.9rem' }}>{member.role}</p>
                          <p className="team-bio text-xs mt-1">{member.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="scroll-indicator">
                {teamMembers.map((_, i) => <div key={i} className={`dot ${i === 0 ? 'active' : ''}`} />)}
              </div>
            </div>
          </motion.div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta relative z-10 overflow-hidden">
          {/* Decorative background orbs */}
          <div className="cta-orb cta-orb-1"></div>
          <div className="cta-orb cta-orb-2"></div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="cta-container"
          >
            <div className="cta-badge">✨ Join the Movement</div>
            <h2>Ready to build the next generation of<span className="text-gradient"> financially literate kids?</span></h2>
            <p>Toka is already reducing household friction for families across CALABARZON. Be among the first to bring it to yours.</p>

            {/* Key stats strip */}
            <div className="cta-stats">
              <div className="cta-stat">
                <span className="cta-stat-value">100+</span>
                <span className="cta-stat-label">Parents Interviewed</span>
              </div>
              <div className="cta-stat-divider"></div>
              <div className="cta-stat">
                <span className="cta-stat-value">74%</span>
                <span className="cta-stat-label">Report nagging burnout</span>
              </div>
              <div className="cta-stat-divider"></div>
              <div className="cta-stat">
                <span className="cta-stat-value">₱1.56B</span>
                <span className="cta-stat-label">Market potential (TAM)</span>
              </div>
            </div>

            <div className="cta-buttons">
              <motion.button whileHover={{ scale: 1.05 }} className="cta-button large-cta pulse-btn">
                <Briefcase size={20} style={{ marginRight: '8px' }} /> Contact the Team
              </motion.button>
              <div style={{ width: '100%', flexBasis: '100%', height: 0 }}></div>
              <WaitlistForm />
            </div>
          </motion.div>
        </section>

      </main>

      <footer className="footer relative z-10" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-top">
            {/* Brand column */}
            <div className="footer-brand">
              <div className="logo" style={{ fontSize: '2rem' }}>Tok<span className="logo-accent">a</span></div>
              <p className="footer-tagline">Sa Bawat Toka, Less ang Boka, More ang Kusa.</p>
              <p className="footer-sub">"For every chore, less nagging — more initiative."</p>
              <span className="footer-badge">✨ Wadhwani Foundation Project</span>
            </div>

            {/* Navigation column */}
            <div className="footer-nav">
              <h5 className="footer-nav-heading">Navigate</h5>
              <a href="#problem" className="footer-link">The Problem</a>
              <a href="#solution" className="footer-link">Solution MVP</a>
              <a href="#market" className="footer-link">Market</a>
              <a href="#business" className="footer-link">Business Model</a>
              <a href="#team" className="footer-link">Team</a>
            </div>

            {/* Contact column */}
            <div className="footer-nav">
              <h5 className="footer-nav-heading">Get Involved</h5>
              <a href="mailto:team@toka.ph" className="footer-link">team@toka.ph</a>
              <a href="#" className="footer-link">Investor Deck</a>
              <a href="#" className="footer-link">Join Waitlist</a>
              <a href="#" className="footer-link">Media Kit</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} <span className="logo-inline" style={{ fontSize: '0.9rem' }}>Tok<span className="logo-accent-inline">a</span></span>. All Rights Reserved.</p>
            <p className="footer-legal">Built with ❤️ for Filipino families. CALABARZON, Philippines.</p>
          </div>
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
                <h3 className="text-gradient"><span className="logo-inline">Tok<span className="logo-accent-inline">a</span></span> Interactive Demo</h3>
                <p className="text-sm text-secondary">Experience the gamified chore loop (Simulated Interface)</p>
              </div>
              <div className="modal-body" style={{ display: 'flex', justifyContent: 'center' }}>
                {/* 
                  Real-world execution: 
                  If Toka was deployed to Vercel/Expo web, we'd embed it via iframe:
                  <iframe src="https://toka-app.vercel.app" className="demo-iframe" title="Toka Interactive Demo" />
                */}
                <div className="placeholder-prototype flex-center flex-col text-center" style={{ padding: '20px' }}>
                  <Smartphone size={60} className="text-cyan mb-2 float-anim mx-auto" />
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
