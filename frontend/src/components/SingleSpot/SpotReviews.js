import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews'

const SingleReview = ({spotId, review, user}) => {
  const dispatch = useDispatch();

  const reviewDate = new Date(review.createdAt)
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[reviewDate.getMonth()];
  const year = reviewDate.getFullYear();
  const reviewDateString = `${month}, ${year}`;
  return (
  <div id='review'>
    <div id='single-review-header'>
      <div id='profile-icon'>
        <i className="fa-solid fa-user"></i>
      </div>
      <div id='review-details'>
        <div id='reviewer'>{review.User.firstName}</div>
        <div id='review-date'>{reviewDateString}</div>
      </div>

      {user?.id === review.userId && (
        <button
          id='delete-review'
          className='pink'
          onClick={()=>dispatch(reviewActions.deleteReview({
            reviewId: review.id,
            spotId: spotId}))}
          >
          Delete
        </button>)}
    </div>
    <div id='review-body' className='nowrap'>{review.review}</div>
  </div>
)};


export default function SpotReviews({spotId, user, limit=6}) {
  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(reviewActions.getSpotReviews(spotId))
  },[dispatch])

  const spotReviews = useSelector(state=>state.reviews.spot);

  if (spotReviews) {
    let reviews = Object.values(spotReviews)

    if (user) {
      let userReview = reviews.find(review=>review.userId === user.id)
      let nonUserReviews = reviews.filter(review=>review.userId !== user.id)
      reviews = userReview? [userReview, ...nonUserReviews] : nonUserReviews;
    }

    return spotReviews && (
      <div id='spot-reviews'>
        {reviews.slice(0,limit)
          .map((review) => (
            <SingleReview
              spotId={spotId}
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
