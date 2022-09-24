import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';

function LoginSignupFormModal({text}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <button onClick={()=> setShowModal(true)}>{text}</button>
    {showModal && (
      <Modal
      onClose={()=> setShowModal(false)}
      setShowModal={setShowModal}>
        {text === 'Log In' && <LoginForm setShowModal={setShowModal}/>}
        {text === 'Sign Up' && <SignupForm setShowModal={setShowModal}/>}

      </Modal>
    )}
    </>
  );
};

export default LoginSignupFormModal;
