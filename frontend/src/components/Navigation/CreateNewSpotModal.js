import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

import CreateNewSpotForm from './CreateNewSpotForm.js';

function CreateNewSpotFormModal({text}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <button
      id='create-spot-button'
      onClick={()=> setShowModal(true)}
      >
      {text}
    </button>
    {showModal && (
      <Modal onClose={()=> setShowModal(false)}>
        <CreateNewSpotForm setShowModal={setShowModal}/>
      </Modal>
    )}
    </>
  );
};

export default CreateNewSpotFormModal;
