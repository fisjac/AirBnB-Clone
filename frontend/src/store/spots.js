import { csrfFetch } from "./csrf";

const ADDSPOTS = 'spot/ADD';

const addSpots = (spots) => {
  return {
    type: ADDSPOTS,
    payload: spots
  }
};

export const getAllSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots');
  const {spots} = await response.json();
  dispatch(addSpots(spots));
  return response;
};


const initialState = {
    allSpots: []
  };
const spotReducer = ( state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADDSPOTS:
      newState= {...state};
      const newSpots = action.payload.reduce((accum, spot) => {
        accum[spot.id] = spot;
        return accum;
      }, {});
      newState.allSpots = {...newSpots}
      return newState
    default:
      return {...state}
  }

}

export default spotReducer;
