import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews'

import SingleReview from '../Reviews/SingleReview.js';

export default function SpotReviews({spotId}) {
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(reviewActions.getSpotReviews(spotId))
  },[dispatch])

  const spotReviews = useSelector(state=>state.reviews.spot);

  return spotReviews && Object.keys(spotReviews)
    .map((id)=> (
        <SingleReview
          key={id}
          reviewId={id}
          />
    ))
}
