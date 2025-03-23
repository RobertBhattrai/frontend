import React, { useContext } from 'react'; // Import useContext
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import header_design from '../assets/images/landingpage.png';
import ScrollWatcher from './ScrollWatcher';
import { UserContext } from '../context/UserContext'; // Import UserContext

const Header = () => {
  const { user } = useContext(UserContext); // Access the user object from UserContext
  const username = user?.username; // Get the username from the user object

  return (
    <header className="sticky top-0 bg-white shadow-md z-50 animate-slideInDown font-light">
      <ScrollWatcher />
      <div className="container">
        <div className="flex items-start justify-around">
          {/* Logo */}
          <Link to={`/${username}/home`} className="flex items-center">
            <img src={logo} alt="raktadan" className="h-14" />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-1 items-center justify-center gap-1">
            <Link to={`/${username}/home`} className="link-75">
              Home
            </Link>
            <Link to={`/${username}/myrequests`} className="link-75">
              My Request
            </Link>
            <Link to={`/${username}/mydonations`} className="link-75">
              My Donation
            </Link>
            <Link to={`/${username}/profile`} className="link-75">
              Profile
            </Link>
          </nav>

          <div className="flex">
            <div className="scene">
              <Link to={`/${username}/request`} className="cube">
                <span className="side top">Explore Donor</span>
                <span className="side front">Request</span>
              </Link>
            </div>
            <div className="scene">
              <Link to={`/${username}/donate`} className="cube">
                <span className="side top">Save Life</span>
                <span className="side front">Donate</span>
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

export default Header;