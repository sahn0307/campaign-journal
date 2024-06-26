import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/characters">Characters</Link>
          </li>
          <li>
            <Link to="/campaigns">Campaigns</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;