import { useDispatch } from 'react-redux';


import * as sessionActions from '../../store/session';
import LoginForm from './LoginForm';

import './DropDownTable.css'
import { ModalWrapper } from '../../context/Modal';
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
        <ModalWrapper header='Create New Listing' child='Create New Listing'>
            <button className='drop_down_button'></button>
          <CreateNewSpotForm/>
        </ModalWrapper>
        <ModalWrapper header='Your Reservations' child='Trips'>
          <button className='drop_down_button'></button>
          <div>bookings list</div>
        </ModalWrapper>
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
        <ModalWrapper header='Log In' child='Log In'>
          <button className='drop_down_button'></button>
          <LoginForm/>
        </ModalWrapper>
        <ModalWrapper header='Sign Up' child='Sign Up'>
          <button className='drop_down_button'></button>
          <SignupForm/>
        </ModalWrapper>
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
