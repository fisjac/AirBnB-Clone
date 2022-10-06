import { csrfFetch } from "./csrf";

import * as spotActions from './spots';

const CLEARSTATE = 'reviews/CLEAR'
const LOADSPOTREVIEWS = 'spot/LOADREVIEWS';
const LOADUSERREVIEWS = 'user/LOADREVIEWS';
const ADDNEWSPOTREVIEW = 'spot/ADDREVIEW';
const UPDATESPOTREVIEW = 'spot/UPDATEREVIEW';
const DELETEREVIEW = 'review/DELETE';


// RESET
export const clearState = () => {
  return {
    type: CLEARSTATE,
  };
}


// CREATE
export const createSpotReview = (review) => {
  return {
    type: ADDNEWSPOTREVIEW,
    payload: review
  };
}

export const createReview = ({spotId, review}) => async dispatch => {
  const postResponse = await csrfFetch(`/api/spots/${spotId}/reviews`,{
    method: 'POST',
    body: JSON.stringify(review)
  });
  if (postResponse.ok) {
    const postResponseData = await postResponse.json();
    const reviewId = postResponseData.id;
    const loadResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const {reviews} = await loadResponse.json();
    const loadedReview = reviews.find(review=> {
      return review.id === reviewId })
    dispatch(createSpotReview(loadedReview));
    dispatch(spotActions.getSpotDetails(spotId));
  };
  return postResponse;
};


// READ
export const loadSpotReviews = (reviews) => {
  return {
    type: LOADSPOTREVIEWS,
    payload: reviews
  };
};

export const loadUserReviews = (reviews) => {
  return {
    type: LOADUSERREVIEWS,
    payload: reviews
  };
};

export const getSpotReviews = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
  if (response.ok) {
    const {reviews} = await response.json()
    dispatch(loadSpotReviews(reviews));
    return reviews;
  }
  return response;
};

// UPDATE
export const updateReview = ({spotId, reviewId, review}) => async dispatch => {
  const putResponse = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(review)
  });
  if (putResponse.ok) {
    dispatch(spotActions.getSpotDetails(spotId));
    dispatch(getSpotReviews(spotId))
  };
  return putResponse;
};

// DELETE
export const removeReview = (reviewId) => {
  return {
    type: DELETEREVIEW,
    payload: reviewId
  };
};

export const deleteReview = ({ spotId, reviewId}) => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`,{
    method: 'DELETE'
  });
  if (response.ok) {
    dispatch(removeReview(reviewId));
    dispatch(spotActions.getSpotDetails(spotId))
  };
  return response;
};

const initialState = {
  spot: null,
  user: null
};

let newState;
export default function reviewsReducer (state = initialState, action) {
  switch (action.type) {

    case CLEARSTATE:
      return {spot:null, user:null}

    case ADDNEWSPOTREVIEW:
      return {
        ...state,
        spot: {
          ...state.spot,
          [action.payload.id]: action.payload}};

    case LOADSPOTREVIEWS:
      const spotReviews = action.payload.reduce((accum, review) => {
        accum[review.id] = review;
        return accum;
      }, {});
      return {...state, spot: {...spotReviews}};

    case DELETEREVIEW:
      newState = {...state};
      delete newState.spot[action.payload]
      return {...newState, spot: {...newState.spot}};
    default:
      return {...state};
  }
};
