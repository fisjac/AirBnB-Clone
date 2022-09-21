import { csrfFetch } from "./csrf";

const ADDSPOTS = 'spot/ADD';
const ADDSINGLESPOT = 'spot/ADDSINGLE'

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

const addSingleSpot = (spot) => {
  return {
    type: ADDSINGLESPOT,
    payload: spot
  }
};

export const getSpotDetails = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await response.json();
  dispatch(addSingleSpot(spot));
  return response;
}

export const createSpot = (spot) => async dispatch => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: spot
  })
  const {spot} = await response.json()
}

const initialState = {
    allSpots: [],
    singleSpot: {}
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
      newState.allSpots = {...newSpots};
      return newState;

    case ADDSINGLESPOT:
      newState= {...state};
      newState.singleSpot = action.payload;
      return newState;
    default:
      return {...state}
  }

}

export default spotReducer;
