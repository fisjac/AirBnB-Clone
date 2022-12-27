import { csrfFetch } from "./csrf";

const LOAD_SPOT_BOOKINGS = 'bookings/set';
const CLEAR_BOOKINGS = 'bookings/clear';

export const clearBookings = () => {
  return {
    type: CLEAR_BOOKINGS
  }
};

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
     dispatch(loadSpotBookings(bookings));
  };
  return response
};


export const createBooking = (booking) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${booking.spotId}/bookings`, {
    method: 'POST',
    body: JSON.stringify({
      startDate: booking.startDate,
      endDate: booking.endDate
    })
  });
  return response;
}

let initialState = {
  spotBookings: null,
  userBookings: null,
};

let newState;
export default function bookingsReducer (state = initialState, action) {
  switch (action.type) {
    case CLEAR_BOOKINGS:
      return {...initialState}

    case LOAD_SPOT_BOOKINGS:
      return {spotBookings: [...action.bookings]}
    default:
      return {...state}
  };
};
