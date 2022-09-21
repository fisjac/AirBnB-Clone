import react, { useContext } from 'react';
import {NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton';

import './Navigation.css';

function Navigation({ isLoaded }){
  const user = useSelector(state => state.session.user);

  return (
    <div className='header'>
      <div className='nav-bar'>
        <NavLink className='home-button' exact to="/">FlairBnB</NavLink>
        {isLoaded && <ProfileButton user={user}/>}
      </div>
    </div>
  );
}

export default Navigation;
