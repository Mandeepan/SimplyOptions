import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SiFramework } from "react-icons/si";
import { FaSearch } from "react-icons/fa"
import { useState, useEffect } from "react";


import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const allInstruments = useSelector((state)=>state.instruments.allInstruments)
  const [searchInput, setSearchInput]=useState("");
  const [filteredResults, setFilteredResults]=useState([]);
  const navigate =useNavigate()

  useEffect(() => {
    if (searchInput && allInstruments) {
      const results = Object.values(allInstruments).filter((instrument) =>
        instrument.instrument_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        instrument.company_name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchInput, allInstruments]);

  const handleSelectResult = (instrumentId) => {
    navigate(`/instruments/${instrumentId}`);
    setSearchInput(""); 
    setFilteredResults([]); 
  };



  const searchBarClassName = sessionUser ? "search-bar-container": "search-bar-container-hidden"
  const profileButtonClassName = sessionUser? "profile-button-container" :"profile-button-container-hidden"


  return (
    <header className="nav-bar-container">
      <div className="logo">
        <NavLink to="/"><SiFramework className="logo-button-1"/></NavLink>
      </div>
      <div className={searchBarClassName}>
        <FaSearch />
        <input
          type="text"
          placeholder="search for a company or an instrument..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          >
        </input>
        {filteredResults.length > 0 && (
          <div className="search-results-dropdown">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="search-result-item"
                onClick={() => handleSelectResult(result.id)}
              >
                {result.company_name}  :  {result.instrument_name}
              </div>
            ))}
          </div>
        )}
      </div>
        <div className={profileButtonClassName}>
          <ProfileButton />
        </div>
    </header>
  );
}

export default Navigation;
