import { useDispatch } from 'react-redux';

import LoginSignupFormModal from "../../LoginSignupFormModal";
import * as sessionActions from '../../../store/session';

import './DropDownTable.css'

function UserDropDown({user}) {
  const dispatch = useDispatch();

  // Define Logout function that calls logout thunk
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  // Create options for dropDown menu depending on whether signed in or not
  let dropDownMenu;
  if (user) { // If a user is signed in then show

    dropDownMenu = (
      <ul className="profile-dropdown">
        {Object.keys(user).map((key)=> {
          if (key !== 'id') return (
          <li className='user' key={key}>
            <label>{`${key}: `}</label>
            {user[key]}
          </li>
          )}
        )}
        <button onClick={logout}>Log Out</button>
    </ul>
    )
  } else { // if no user is signed in then show
    dropDownMenu = (
      <>
        <LoginSignupFormModal text={'Log In'}/>
        <LoginSignupFormModal text={'Sign Up'}/>
      </>
  )};

  return (
    <>
      <div className="drop-down-menu">
        {dropDownMenu}
      </div>
    </>
    );
};

export default UserDropDown;
