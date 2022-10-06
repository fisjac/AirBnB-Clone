import React, { useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, [])

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
};

export function CreateModalButton(props) {
  // takes className, id, button label, and header as props

  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <button className={props.className || ''} id={props.id || ''} onClick={()=> setShowModal(true)}>{props.label || ''}
    {props.childElement}
    </button>
    {showModal && (
      <Modal
        onClose={()=> setShowModal(false)}
        setShowModal={setShowModal}
        showModal={showModal}
        header={props.header || ''}
        >
        {props.children}
      </Modal>
    )}
    </>
  );
};

export function Modal(props) {
  const modalNode = useContext(ModalContext);
  if (!modalNode) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={props.onClose} />
      <div id="modal-content">
        <ModalHeader header={props.header} setShowModal={props.setShowModal}>
          {props.children}
        </ModalHeader>
      </div>
    </div>,
    modalNode
  );
};

const ModalHeader = ({setShowModal, header, children}) => {
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
        {header}
      </div>
      {React.cloneElement(children, {setShowModal})}
    </div>
  );
};
