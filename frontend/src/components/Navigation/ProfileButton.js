import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux';

import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let dropDownMenu;
  if (user) {
    dropDownMenu = (
      <ul className="profile-dropdown">
        <li>{user.firstName}</li>
        <li>{user.lastName}</li>
        <li>{user.username}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
    </ul>
    )
  } else {
    dropDownMenu = (
      <>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
        <button
          onClick={()=>{let _ = dispatch(sessionActions.login({
            credential: 'Demo-lition',
            password: 'password'}))
          }}
          >
            Login Demo User
        </button>
      </>
  )}


  return (
    <>
      <button className='profile-button' onClick={openMenu}>
      <i class="fa-solid fa-bars"></i>
      <i class="fa-solid fa-user"></i>
      </button>
      {showMenu &&  dropDownMenu}
    </>
  );
}

export default ProfileButton;
