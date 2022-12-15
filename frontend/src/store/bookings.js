import { csrfFetch } from "./csrf";

const ADD_SPOT_BOOKINGS = 'bookings/set';

export const addBookins = (bookings) => {
  return {
    type: ADD_SPOT_BOOKINGS,
    payload: bookings
  }
};
