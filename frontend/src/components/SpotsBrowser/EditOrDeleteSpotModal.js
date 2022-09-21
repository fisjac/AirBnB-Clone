import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

import EditOrDeleteSpot from './EditOrDeleteSpot.js';

function EditOrDeleteSpotModal({text}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <button onClick={()=> setShowModal(true)}>{text}</button>
    {showModal && (
      <Modal onClose={()=> setShowModal(false)}>
        <EditOrDeleteSpot setShowModal={setShowModal}/>
      </Modal>
    )}
    </>
  );
};

export default EditOrDeleteSpotModal;
