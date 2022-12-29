import { csrfFetch } from "./csrf";

const LOAD_SPOT_BOOKINGS = 'bookings/spot';
const LOAD_USER_BOOKINGS = 'bookings/user'
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

export const loadUserBookings = ({bookings}) => {
  return {
    type: LOAD_USER_BOOKINGS,
    bookings
  }
};

export const getSpotBookings = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
  if (response.ok) {
    const bookings = await response.json();
     dispatch(loadSpotBookings(bookings));
  };
  return response;
};

export const getUserBookings = () => async dispatch => {
  const response = await csrfFetch('/api/bookings/current');
  if (response.ok) {
    const bookings = await response.json();
    dispatch(loadUserBookings(bookings));
  };
  return response;
}

export const createBooking = async (booking) => {
  const response = await csrfFetch(`/api/spots/${booking.spotId}/bookings`, {
    method: 'POST',
    body: JSON.stringify({
      startDate: booking.startDate,
      endDate: booking.endDate
    })
  });
  return response;
}

export const editBooking = async (booking) => {
  const response = await csrfFetch(`/api/bookings/${booking.id}`, {
    method: 'PUT',
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
      return {...state, spotBookings: [...action.bookings]};

    case LOAD_USER_BOOKINGS:
      return {...state, userBookings: [...action.bookings]};

    default:
      return {...state}
  };
};
