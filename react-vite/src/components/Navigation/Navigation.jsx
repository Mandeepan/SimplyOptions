import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { SiFramework } from "react-icons/si";
import { FaSearch } from "react-icons/fa"

import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const searchBarClassName = sessionUser ? "search-bar-container": "search-bar-container-hidden"
  return (
    <header className="nav-bar-container">
      <div className="logo">
        <NavLink to="/"><SiFramework /></NavLink>
      </div>
      <div className={searchBarClassName}>
        <FaSearch />
        <input
          type="text"
          placeholder="search for a company or an instrument..."
          >
        </input>
      </div>
      <div>
        <ProfileButton />
      </div>
    </header>
  );
}

export default Navigation;
