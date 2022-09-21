import { csrfFetch } from "./csrf";

const ADDSPOTS = 'spot/ADD';
const ADDSINGLESPOT = 'spot/ADDSINGLE'
const EDITSPOT = 'spot/EDIT'
const REMOVESPOT = 'spot/DELETE'

const addSpots = (spots) => {
  return {
    type: ADDSPOTS,
    payload: spots
  }
};
const addSingleSpot = (spot) => {
  return {
    type: ADDSINGLESPOT,
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
  dispatch(addSingleSpot(newSpot));
  return newSpot;
}

//READ
export const getAllSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots');
  const {spots} = await response.json();
  dispatch(addSpots(spots));
  return response;
};

export const getUsersSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots/current');
  const {spots} = await response.json();
  dispatch(addSpots(spots));
  return response;
};

export const getSpotDetails = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await response.json();
  dispatch(addSingleSpot(spot));
  return response;
}



//UPDATE
export const updateSpot = (spot) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    body: JSON.stringify(spot)
  });
  dispatch(editSpot(spot));
  return response;
}

//DELETE
export const deleteSpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });
  dispatch(removeSpot());
  return response;
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

    case EDITSPOT:
      newState= {...state};
      newState.singleSpot= action.payload;
      return newState;

    case REMOVESPOT:
      newState= {...state};
      newState.singleSpot= null;
      return newState;

    default:
      return {...state}
  }

}

export default spotReducer;
