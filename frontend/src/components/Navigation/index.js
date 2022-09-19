import react from 'react';
import {NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton';

import './Navigation.css';

function Navigation({ isLoaded }){
  const user = useSelector(state => state.session.user);
  console.log(user)
  return (
    <div className='nav-bar'>
      <NavLink exact to="/">Home</NavLink>
      {isLoaded && <ProfileButton user={user}/>}
    </div>
  );
}

export default Navigation;
