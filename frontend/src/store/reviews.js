import { csrfFetch } from "./csrf";


const LOADSPOTREVIEWS = 'spot/LOADREVIEWS';
const LOADUSERREVIEWS = 'user/LOADREVIEWS';
const ADDNEWSPOTREVIEW = 'spot/ADDREVIEW';
const DELETEREVIEW = 'review/DELETE';


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
export const updateReview = ({spotId, review}) => async dispatch => {
  const putResponse = await csrfFetch(`/api/spots/${spotId}/reviews`,{
    method: 'PUT',
    body: JSON.stringify(review)
  });
  if (putResponse.ok) {
    const putResponseData = await putResponse.json();
    const reviewId = putResponseData.id;
    const loadResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const {reviews} = await loadResponse.json();
    const loadedReview = reviews.find(review=> {
      console.log(review.id, reviewId)
      return review.id === reviewId })
    dispatch(createSpotReview(loadedReview));
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

export const deleteReview = (reviewId) => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`,{
    method: 'DELETE'
  });
  if (response.ok) dispatch(removeReview(reviewId));
  return response;
};

const initialState = {
  spot: null,
  user: null
};

let newState;
export default function reviewsReducer (state = initialState, action) {
  switch (action.type) {

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