import {csrfFetch} from './csrf'

const SET_USER = 'session/LOGIN'
const REMOVE_USER = 'session/LOGOUT'

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  }
};

export const removeUser = () => {
  return {
    type: REMOVE_USER,
  }
};

export const login = (user) => async dispatch => {
  const {credential, password} = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password
    }),
  })
  const data = await response.json();
  // console.log(data);
  dispatch(setUser(data));
  return response;
}

const initialState = {user: null};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.payload};

    case REMOVE_USER:
      return {...state, user: null};

    default:
      return {...state}
  }
};

export default sessionReducer;
