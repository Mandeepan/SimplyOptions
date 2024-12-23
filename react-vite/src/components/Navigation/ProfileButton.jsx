import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate } from "react-router-dom"
// import { FaUserCircle } from 'react-icons/fa';
import { FaUserLarge } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa";



import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  const handleIssuerPanelClick = () => {
    navigate("/issuerPanel");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const profileButtonClassName = user ? "profile-button": "profile-button-hidden"
  return (
    <>
      <button className={profileButtonClassName} onClick={toggleMenu}>
        <FaUserLarge />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <li className='profile-username'>Hi, {user.first_name}</li>
              <li className='profile-list-item-with-icon'>
                <FaBriefcase />
                <button className='profile-my-portfolio' onClick={handleIssuerPanelClick} >Issuer Panel</button>
              </li>
              <li className='profile-list-item-with-icon'>
                <MdSpaceDashboard />
                <button className='profile-mode-button' onClick={handleDashboardClick}>User Dashboard</button>
              </li>
              <li className="profile-list-item-with-icon">
                <FaLayerGroup />
                <button className="profile-terms" onClick={()=>{navigate("/policies")}}>Terms & Policies</button>
              </li>
              <li className='profile-list-item-with-icon'>
                <MdOutlineLogout />
                <button className='profile-log-out' onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
