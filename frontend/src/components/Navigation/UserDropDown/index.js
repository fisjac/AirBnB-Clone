import { NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux';

import * as sessionActions from '../../../store/session';

import './DropDownTable.css'

function  UserDropDown({user}) {
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let dropDownMenu;
  if (user) {

    dropDownMenu = (
      <ul className="profile-dropdown">
        {Object.keys(user).map((key)=> {
          if (key !== 'id') return (
          <li className='user'>
            <label>{`${key}: `}</label>
            {user[key]}
          </li>
          )}
        )}
        <button onClick={logout}>Log Out</button>
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
  )};

  return (
    <div className="drop-down-menu">
    {dropDownMenu}
    </div>
    );
};

export default UserDropDown;
