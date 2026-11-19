import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-mark">A</span>
          <span>Alzikrayat</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <NavLink to="/" end className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/gallery" className="nav-link" onClick={closeMenu}>
              Gallery
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/upload" className="nav-link" onClick={closeMenu}>
                Upload Photo
              </NavLink>
            )}
          </div>

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <span className="nav-greeting">Hi {user.firstName}</span>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-login-prompt" onClick={closeMenu}>
                Please Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
