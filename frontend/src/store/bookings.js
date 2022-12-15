import { csrfFetch } from "./csrf";

const LOAD_SPOT_BOOKINGS = 'bookings/set';

export const loadSpotBookings = ({bookings}) => {
  return {
    type: LOAD_SPOT_BOOKINGS,
    bookings
  }
};

export const getSpotBookings = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
  if (response.ok) {
    const bookings = await response.json();
     dispatch(addBookings(bookings));
  };
  return response
};

let initialSate = {
  spotBookings: null,
  userBookings: null,
};

let newState;
export default function bookingsReducer (state = initialState, action) {
  switch (action.type) {
    case LOAD_SPOT_BOOKINGS:
      return {spotBookings: [...action.bookings]}
    default:
      return {...state}
  }
};
