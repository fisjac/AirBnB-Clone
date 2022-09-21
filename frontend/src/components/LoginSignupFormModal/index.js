import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

import LoginSignupForm from '../LoginSignupForm';

function LoginSignupFormModal({text}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <button onClick={()=> setShowModal(true)}>{text}</button>
    {showModal && (
      <Modal onClose={()=> setShowModal(false)}>
        <LoginSignupForm setShowModal={setShowModal}/>
      </Modal>
    )}
    </>
  );
};

export default LoginSignupFormModal;
