import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import header_design from '../assets/images/landingpage.png';
import ScrollWatcher from './ScrollWatcher';


const LandingHeader = () => {
  return (
        <header className="sticky top-0 bg-white shadow-md z-50 animate-slideInDown">
        {/* <div className="scroll-watcher fixed top-0 left-0 h-[4px] w-full bg-white origin-left scale-x-0 scale-y-1 z-[1000] animate-scroll-watcher">
        </div> */}
        <ScrollWatcher/>
          <div className="container mx-auto px-4 p-1 pl-20 pr-20">
            <div className="flex items-center justify-between mt-2">
              {/* Logo */}
              <a href="index.html" className="flex items-center">
                <img src={logo} alt="raktadan" className="h-12" />
              </a>
              
              {/* Navigation Menu */}
              <nav className="hidden md:flex space-x-8 items-center mb-2">
                <Link to="/" className="link-75">
                  Home
                </Link>
                <a href="service" className="link-75">
                  About
                </a>
                <a href="" className="link-75">
                  Contacted
                </a>
                <Link to="/home" className="link-75">
                  Website
                </Link>
                
                <div className="scene">
                  <Link to="/register" className="cube">
                    <span className="side top">Register Now</span>
                    <span className="side front">Sign Up</span>
                  </Link>
                </div>
              </nav>

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

