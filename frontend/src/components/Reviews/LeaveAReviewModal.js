import React, { useState } from 'react';
import { Modal } from '../../context/Modal';


import ReviewForm from './ReviewForm.js';

function ReviewFormModal({text}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <button className='pink' onClick={()=> setShowModal(true)}>{text}</button>
    {showModal && (
      <Modal onClose={()=> setShowModal(false)}>
        <ReviewForm setShowModal={setShowModal}/>
      </Modal>
    )}
    </>
  );
};

export default ReviewFormModal;
