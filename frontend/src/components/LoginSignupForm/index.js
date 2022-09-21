import { useDispatch } from "react-redux";
import { useState } from "react";

import * as sessionActions from '../../store/session';

import './LoginSignupForm.css'

const LoginSignupForm = ({setShowModal}) => {
  console.log('loginSignUpForm rendered')
  const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      return dispatch(sessionActions.login({ credential, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    };

    return (
      <div className='container'>
        <div className='login-header'>
          <button
            id='close-button'
            onClick={()=> {
              setShowModal(false)
            }}
            >
            <i className="fa-regular fa-x"></i>
          </button>
          Log in or sign up
        </div>
        <div id='login-content-container'>
          <div id='welcome-banner'>Welcome to FlairBnB</div>
          <form
            onSubmit={handleSubmit}
            className='login-submit-form'
            >
            <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <input
              className='top input-field'
              type="text"
              value={credential}
              placeholder='Username or Email'
              onChange={(e) => setCredential(e.target.value)}
              required
              />
            <input
              className='bottom input-field'
              type="password"
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
              />
            <button
              className='continue button'
              type="submit"
              >
              Continue
            </button>
          </form>
          <div id='or-container'>
            <div id='or'>or</div>
          </div>
          <button
            className='demo button'
            onClick={()=>{
              dispatch(sessionActions.login({
                credential: 'NatureBoy',
                password: 'woooooo'
              }));
            }}
            >
            Continue with Demo User
          </button>
        </div>
      </div>
    );
};

export default LoginSignupForm;
