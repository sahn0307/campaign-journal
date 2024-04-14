import React from "react";
import { Link , useNavigate} from "react-router-dom";
import '../styles/nav.scss';
import { useAuth } from '../context/AuthContext';

function NavBar({ mode, toggleMode }) {
  const { user, updateUser, logout } = useAuth()

  return (
    <nav className="NavBar">
      <ul className="NavBar__list">
        <li className="NavBar__item">
          <Link to="/" className="NavBar__link">Home</Link>
        </li>
        <li className="NavBar__item">
          <Link to="/characters" className="NavBar__link">Characters</Link>
        </li>
        <li className="NavBar__item">
          <Link to="/campaigns" className="NavBar__link">Campaigns</Link>
        </li>
        <li className="NavBar__item">
          <Link to="/profile" className="NavBar__link">Profile</Link>
        </li>
        {user ? (
          <li className="NavBar__item">
            <button onClick={() => logout()} className="NavBar__link">Logout</button>
          </li>
        ) : (
          <>
            <li className="NavBar__item">
              <Link to="/signup" className="NavBar__link">Sign-Up</Link>
            </li>
            <li className="NavBar__item">
              <Link to="/login" className="NavBar__link">Log In</Link>
            </li>
          </>
        )}
        <li className="NavBar__item">
          <button className="NavBar__toggle" onClick={toggleMode}>
            {mode === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode'}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;