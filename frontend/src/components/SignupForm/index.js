import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from '../../store/session';

function SignupForm({setShowModal}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state=> state.session.user);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to='/' />

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.Errors)
      });

    }
  }

  return (
    <div
      className="container">
      <div className='modal-header'>
      <button
        id='close-button'
        onClick={()=> {
          setShowModal(false)
        }}
        >
        <i className="fa-regular fa-x"></i>
      </button>
      Sign Up
      </div>
      <div id="content-container">
        <div className='welcome-banner'>Welcome to FlairBnB</div>
        <form
          className="submit-form"
          onSubmit={handleSubmit}
        >
          <ul>
            {errors.map((error, idx)=> (<li key={idx}>{error}</li>))}
          </ul>
          <input
            className="top"
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            >
          </input>
          <input
            placeholder="Email"
            type='text'
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            required
            >

          </input>
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="bottom"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div
            className="spacer">
          </div>
          <button
            className="button continue"
            type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  )
};

export default SignupForm;
