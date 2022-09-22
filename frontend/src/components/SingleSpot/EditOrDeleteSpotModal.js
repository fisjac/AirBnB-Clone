import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

import EditOrDeleteSpotForm from './EditOrDeleteSpotForm.js';

function EditOrDeleteSpotModal({text, spot}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <button className='pink' onClick={()=> setShowModal(true)}>{text}</button>
    {showModal && (
      <Modal onClose={()=> setShowModal(false)}>
        <EditOrDeleteSpotForm setShowModal={setShowModal}/>
      </Modal>
    )}
    </>
  );
};

export default EditOrDeleteSpotModal;
