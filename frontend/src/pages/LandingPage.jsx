import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import image1 from "../assets/women.jpg";
import image2 from "../assets/women1.jpg";
import image3 from "../assets/women2.jpg";
import image4 from "../assets/women3.jpg";
import logo from "../assets/logo.png";

const features = [
  {
    icon: <span className="landing-feature-icon">🔒</span>,
    title: "Safe & Secure",
    desc: "Escrow system and digital contracts protect both borrowers and lenders."
  },
  {
    icon: <span className="landing-feature-icon">👩‍🦰</span>,
    title: "For Women, By Women",
    desc: "A supportive, women-only community for financial empowerment."
  },
  {
    icon: <span className="landing-feature-icon">💸</span>,
    title: "No Collateral Needed",
    desc: "Access microloans without property, bank accounts, or formal education."
  },
  {
    icon: <span className="landing-feature-icon">📈</span>,
    title: "Earn & Grow",
    desc: "Lenders earn interest while helping others succeed."
  }
];

const LandingPage = () => {
  const images = [image1, image2, image3, image4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="landing-root">
      <nav className="nav-container" style={{backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.85)', borderBottom: '1.5px solid #ecebfa'}}>
        <div className="logo-container">
          <img
            src={logo}
            alt="AarthaSathi Logo"
            className="logo-img"
            style={{ height: "60px", width: "60px", objectFit: "contain" }}
          />
            <a className="navbar-brand" href="#" style={{ fontWeight: '1100' }}>
  Aarthasathi
</a>
 
        </div>
        <div className="nav-links">



    
          <a href="/">Home</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </nav>

    
      <section className="landing-hero-flex">
        
        <div className="hero-content-flex">
          <h1>Empowering Women<br />Through Microloans</h1>
          <p>Join AarthaSathi to support or receive financial assistance in a safe, women-only community built on trust and dignity.</p>
          <div style={{ margin: '24px 0' }}>
            <a href="/lend" className="landing-cta-btn" style={{ marginRight: 16 }}>I want to lend →</a>
            <a href="/borrow" className="landing-cta-btn">I need a loan →</a>
          </div>
        </div>
        
        <div className="image-carousel-flex">
          <div className="carousel-image-wrapper">
            {images.map((image, index) => (
           <div
  key={index}
  className={`carousel-slide${index === currentImageIndex ? " active" : ""}`}
  style={{
    backgroundImage: `url(${image})`,
    borderRadius: '18px',
    boxShadow: index === currentImageIndex ? '0 4px 32px 0 rgba(124,58,237,0.13)' : 'none',
    opacity: index === currentImageIndex ? 1 : 0,
    transition: 'opacity 0.7s',
      height: 480,               
    width: 600,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    margin: '0 auto',
    zIndex: index === currentImageIndex ? 2 : 1
  }}
/>

            ))}
            <div className="carousel-dots-flex">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot${index === currentImageIndex ? " active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

    
      <div className="landing-section-title">Why Choose AarthaSathi?</div>
      <section className="landing-features">
        {features.map((feature, idx) => (
          <div className="landing-feature-card" key={idx}>
            {feature.icon}
            <div className="landing-feature-title">{feature.title}</div>
            <div className="landing-feature-desc">{feature.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
