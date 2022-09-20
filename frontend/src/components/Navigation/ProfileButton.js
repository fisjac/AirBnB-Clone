import React, { useState, useEffect } from "react";
import UserDropDown from "./UserDropDown";


function ProfileButton({ user }) {

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

  return (
    <div className='user-container'>
        <button className='profile-button' onClick={openMenu}>
        <i className="fa-solid fa-bars"></i>
        <div id='profile-icon'>
          <i className="fa-solid fa-user"></i>
        </div>
        </button>
        <div className='drop-down-div'>
          {showMenu &&  <UserDropDown user={user}/>}
        </div>
    </div>
  );
}

export default ProfileButton;
