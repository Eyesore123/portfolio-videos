import { useState,} from 'react';
import '../index.css';

import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Videos", path: "/videos" },
    { label: "About", path: "/about" }
  ];

  return (
    <div className='navbar orange !mb-6'>
      <div className='blur2 blur3'></div>
      <div className='picture logo'>
        <Link to='/' className='logolink' onClick={handleLinkClick}>
          <img src='/favicon.png' alt="logo" width={70} className='logo' />
        </Link>
      </div>
      <div className='nav-wrapper'>
        <ul className={`nav-links ${isMenuOpen ? 'nav-active' : ''}`}>
          {navLinks.map((link, index) => (
            <li className='nav-link' key={index}>
              <Link
                to={link.path}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <button
        className="btn mobilemenu hover:cursor-pointer"
        id="menu-btn"
        aria-label="Menu"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
          <path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"/>
        </svg>
      </button>
    </div>
  );
}
