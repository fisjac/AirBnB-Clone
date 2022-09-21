import {createContext, useState} from 'react';
import { Provider } from 'react-redux';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';


export const NavBarContext = createContext();

export function NavBarProvider (props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <NavBarContext.Provider value={{showModal, setShowModal}}>
      {props.children}
    </NavBarContext.Provider>
  )
};
