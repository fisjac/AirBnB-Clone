import { csrfFetch } from "./csrf";
import * as reviewActions from './reviews';

const CLEARSTATE = 'spot/CLEAR';
const LOADSPOTS = 'spot/LOAD';
const LOADSINGLESPOT = 'spot/LOADSINGLE';
const EDITSPOT = 'spot/EDIT';
const REMOVESPOT = 'spot/DELETE';


export const clearState = () => {
  return {
    type: CLEARSTATE,
  }
}


const loadSpots = (spots) => {
  return {
    type: LOADSPOTS,
    payload: spots
  }
};
const loadSingleSpot = (spot) => {
  return {
    type: LOADSINGLESPOT,
    payload: spot
  }
};

const editSpot = (spot) => {
  return {
    type:EDITSPOT,
    payload: spot
  }
}

const removeSpot = () => {
  return {type: REMOVESPOT}
};

//CREATE
export const createSpot = (spot) => async dispatch => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spot)
  });
  const newSpot = await response.json();
  if (response.ok) {
    dispatch(loadSingleSpot(newSpot));
    dispatch(reviewActions.getSpotReviews(newSpot.id))
    return newSpot
  };
  return response;
}

//READ
export const getAllSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots');
  const {spots} = await response.json();
  if (response.ok) dispatch(loadSpots(spots));
  return response;
};

export const getUsersSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots/current');
  const {spots} = await response.json();
  if (response.ok) dispatch(loadSpots(spots));
  return response;
};

export const getSpotDetails = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await response.json();
  if (response.ok) dispatch(loadSingleSpot(spot));
  return response;
}



//UPDATE
export const updateSpot = (spot) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    body: JSON.stringify(spot)
  });
  if (response.ok) dispatch(getSpotDetails(spot.id));
  return response;
}

//DELETE
export const deleteSpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    console.log('spot was deleted');
    dispatch(removeSpot())};
  return response;
}


const initialState = {
    allSpots: null,
    singleSpot: null
  };
const spotReducer = ( state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CLEARSTATE:
      return {allSpots: null, singleSpot:null};

    case LOADSPOTS:
      newState= {...state};
      const newSpots = action.payload.reduce((accum, spot) => {
        accum[spot.id] = spot;
        return accum;
      }, {});
      newState.allSpots = {...newSpots};
      return newState;

    case LOADSINGLESPOT:
      newState= {...state};
      newState.singleSpot = action.payload;
      return newState;

    // case EDITSPOT:
    //   newState= {...state};
    //   newState.singleSpot= action.payload;
    //   return newState;

    case REMOVESPOT:
      newState= {...state};
      newState.singleSpot= null;
      return newState;

    default:
      return {...state}
  }

}

export default spotReducer;
