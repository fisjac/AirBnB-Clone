import React, {useState} from "react";
import { useDispatch } from "react-redux";
import errorCatching from "../errorHandler.js";
import * as sessionActions from '../../store/session';

function SignupForm({setShowModal}) {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      const options = {
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      };
      const response = await dispatch(sessionActions.signup(options))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
      if (response.ok) setShowModal(false)
    }
  }

  return (
    <div
      className="container">
      <div id="content-container">
        <div className='welcome-banner'>Welcome to FlairBnB</div>
        <form
          className="submit-form"
          onSubmit={handleSubmit}
        >
          <ul>
            {Object.keys(errors).map((key, idx) => <li id='error-message' key={idx}>{`${key}: ${errors[key]}`}</li>)}
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
            className="button pink"
            type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  )
};

export default SignupForm;
