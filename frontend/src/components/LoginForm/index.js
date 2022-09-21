import { useDispatch } from "react-redux";
import { useState } from "react";

import * as sessionActions from '../../store/session';

import './LoginForm.css'

const LoginForm = ({setShowModal}) => {
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
        <div className='modal-header'>
          <button
            id='close-button'
            onClick={()=> {
              setShowModal(false)
            }}
            >
            <i className="fa-regular fa-x"></i>
          </button>
          Log in
        </div>
        <div id='content-container'>
          <div className='welcome-banner'>Welcome to FlairBnB</div>
          <form
            className='submit-form'
            onSubmit={handleSubmit}
            >
            <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <input
              className='top'
              type="text"
              value={credential}
              placeholder='Username or Email'
              onChange={(e) => setCredential(e.target.value)}
              required
              />
            <input
              className='bottom'
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

export default LoginForm;
