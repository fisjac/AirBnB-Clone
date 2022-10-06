import { useDispatch } from 'react-redux';


import * as sessionActions from '../../store/session';
import LoginForm from './LoginForm';

import './DropDownTable.css'
import { CreateModalButton } from '../../context/Modal';
import SignupForm from './SignUpForm';
import CreateNewSpotForm from './CreateNewSpotForm';

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
        <CreateModalButton
          label='Create a listing'
          header='Create New Listing'
          className='drop_down_button'>
          <CreateNewSpotForm/>
        </CreateModalButton>
        <button
          onClick={logout}
          className='drop_down_button'
          >
          Log Out
        </button>
      </>
    )
  } else { // if no user is signed in then show
    dropDownMenu = (
      <>
        <CreateModalButton
          label='Log In'
          header='Log In'
          className='drop_down_button'
          >
          <LoginForm/>
        </CreateModalButton>
        <CreateModalButton
          label='Sign Up'
          header='Sign Up'
          className='drop_down_button'
          >
          <SignupForm/>
        </CreateModalButton>
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
