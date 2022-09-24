import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews'

const SingleReview = ({review, user}) => {
  const dispatch = useDispatch();
  return (
  <div id='review'>
    <div id='single-review-header'>
      <div id='profile-icon'>
        <i className="fa-solid fa-user"></i>
      </div>
      <div id='review-details'>
        <div id='reviewer'>{review.User.firstName}</div>
        <div id='review-date'>{review.createdAt}</div>
      </div>

      {user.id === review.userId && (
        <button
          id='delete-review'
          onClick={()=>dispatch(reviewActions.deleteReview(review.id))}
          >
          Delete
        </button>)}
    </div>
    <div id='review-body' className='nowrap'>{review.review}</div>
  </div>
)};


export default function SpotReviews({spotId, user}) {
  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(reviewActions.getSpotReviews(spotId))
  },[dispatch])

  const spotReviews = useSelector(state=>state.reviews.spot);

  if (spotReviews) {
    const reviews = Object.values(spotReviews)
    let userReview = reviews.find(review=>review.userId === user.id)

    let nonUserReviews = reviews.filter(review=>review.userId !== user.id)
    const orderedReviews = userReview? [userReview, ...nonUserReviews] : nonUserReviews;

    return spotReviews && (
      <div id='spot-reviews'>
        {orderedReviews.slice(0,6)
          .map((review) => (
            <SingleReview
              key={review.id}
              review={review}
              user={user}
              />
          ))
        }
      </div>
    )
  };
};
