import { useDispatch } from "react-redux";
import { useState } from "react";
import errorCatching from "../../errorHandler";
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
      errorCatching(
        sessionActions.login,
        { credential, password },
        dispatch,
        setErrors)
    };
    console.log(errors)
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
            {Object.keys(errors).map((key, idx) => <li id='error-message' key={idx}>{`${key}: ${errors[key]}`}</li>)}
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
              className='pink button'
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
