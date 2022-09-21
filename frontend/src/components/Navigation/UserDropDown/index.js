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
      <>
        <div id='greeting'>{`Welcome back ${user.firstName}!`}</div>
        <button onClick={logout}>Log Out</button>
      </>
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
