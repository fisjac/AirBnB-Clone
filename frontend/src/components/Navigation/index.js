import {NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton';
import logo from '../../Flair-Favicon.png';

import './Navigation.css';

function Navigation(){
  const user = useSelector(state => state.session.user);

  return (
    <div className='header'>
      <div className='nav-bar'>

        <NavLink className='home-button' exact to="/">
          <img id='logo' src={logo}></img>
          FlairBnB
        </NavLink>
        <ProfileButton user={user}/>
      </div>
    </div>
  );
}

export default Navigation;
