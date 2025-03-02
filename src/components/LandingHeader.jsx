import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import header_design from '../assets/images/landingpage.png';
import ScrollWatcher from './ScrollWatcher';


const LandingHeader = () => {
  return (
        <header className="sticky top-0 bg-white shadow-md z-50 animate-slideInDown font-light">
        <ScrollWatcher/>
          <div className="container">
            <div className="flex items-start justify-around">
              {/* Logo */}
              <a href="index.html" className="flex items-center">
                <img src={logo} alt="raktadan" className="h-14" />
              </a>
              
              {/* Navigation Menu */}
              <nav className="hidden md:flex space-x-1 items-center justify-center gap-1">
                <Link to="/" className="link-75">
                  Home
                </Link>
                <a href="#about" className="link-75">
                  About
                </a>
                <a href="" className="link-75">
                  Contacted
                </a>
                <Link to="/home" className="link-75">
                  Website
                </Link>
                </nav>
                <div className='flex'>
                <div className="scene">
                  <Link to="/register" className="cube">
                    <span className="side top">Register Now</span>
                    <span className="side front">Sign Up</span>
                  </Link>
                </div>
                <div className="scene">
                  <Link to="/login" className="cube">
                    <span className="side top">Welcome Back</span>
                    <span className="side front">Log in</span>
                  </Link>
                  </div>
                  </div>
              

              {/* Mobile Menu Trigger */}
              <div className="md:hidden">
                <button className="text-gray-800">
                  <span>Menu</span>
                </button>
              </div>
            </div>
      </div>
    </header>
  );
};
export default LandingHeader;

