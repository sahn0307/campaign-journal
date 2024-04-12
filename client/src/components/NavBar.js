import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
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
                <li>
                <Link to="/signup">Sign-Up</Link>
                </li>
            </ul>
            </nav>
    );
    }

export default NavBar;
