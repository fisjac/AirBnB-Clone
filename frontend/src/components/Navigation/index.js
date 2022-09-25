import {NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton';
import logo from '../../Flair-Favicon.png';

import './Navigation.css';

function Navigation(){
  const user = useSelector(state => state.session.user);

  return (
    <div className='header undercarriage'>
      <div className='flex padded height100 justify-between max1120 centered'>

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
