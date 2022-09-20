import { useDispatch } from "react-redux";
import { useState } from "react";

import * as sessionActions from '../../store/session';


const LoginSignupForm = () => {
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
      <div>
        <form
          onSubmit={handleSubmit}
          className='login-submit-page'
          >
        <i className="fa-regular fa-x"></i>
        <div className='login-header'>Log in or sign up</div>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
          <input
            type="text"
            value={credential}
            placeholder='Username or Email'
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button className='continue button' type="submit">Continue</button>
      </form>
      <div id='or'>or</div>
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
    );
};

export default LoginSignupForm;
