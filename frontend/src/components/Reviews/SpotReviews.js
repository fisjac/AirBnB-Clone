import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalWrapper } from '../../context/Modal';
import * as reviewActions from '../../store/reviews'
import UpdateReviewForm from './UpdateReviewForm';

const SingleReview = ({spotId, review, user, fullWidth}) => {
  const dispatch = useDispatch();

  const reviewDate = new Date(review.createdAt)
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[reviewDate.getMonth()];
  const year = reviewDate.getFullYear();
  const reviewDateString = `${month}, ${year}`;
  return (
  <div
    id='review'
    className={fullWidth? 'full-width': 'half-width'}
    >
    <div id='single-review-header'>
      <div id='profile-icon'>
        <i className="fa-solid fa-user"></i>
      </div>
      <div id='review-details'>
        <div id='reviewer'>{review.User.firstName}</div>
        <div id='review-date'>{reviewDateString}</div>
      </div>

      {user?.id === review.userId && (
        <>


          <ModalWrapper header='Edit Review' child='Edit'>
          <button
            id='delete-review'
            className='pink'
            ></button>
            <UpdateReviewForm spotId={spotId} review={review}/>
          </ModalWrapper>
          <button
            id='delete-review'
            className='pink'
            onClick={()=>dispatch(reviewActions.deleteReview({
              reviewId: review.id,
              spotId: spotId}))}
            >
            Delete
          </button>
        </>
      )}
    </div>
    <div id='review-body' className='nowrap'>{review.review}</div>
  </div>
)};


export function ReviewLine({numStars, starCounts}) {
  return (
    <div className='review-line-section'>
        <div>
          {[...Array(numStars)].map(()=>(<i className='fa-solid fa-star'></i>))}
        </div>
        <div className='review-line'>
          <div className='review-line-black' style={{'width': `${starCounts[numStars]*100}%`}}></div>
      </div>
    </div>
  )
};


export function ReviewBars({reviews}) {
  const starCounts = Object.values(reviews).reduce((starCounts, review)=> {
    starCounts[review.stars]++;
    return starCounts;
  },{1: 0, 2: 0, 3: 0, 4: 0, 5: 0});

  Object.keys(starCounts).forEach(key=>starCounts[key]=starCounts[key]/Object.keys(reviews).length)

  return (
    <div className='review-line-container'>
      {[...Array(5).keys()].reverse().map(i=>(
        <ReviewLine key={i} numStars={i+1} starCounts={starCounts}/>
      ))}
    </div>
  )

}


export default function SpotReviews({spotId, user, limit=6, fullWidth=false}) {
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
      <div>
        {Object.values(spotReviews).length ?
          <ReviewBars reviews={spotReviews}/> :
          null}
        <div id='spot-reviews'>
          {reviews.slice(0,limit)
            .map((review) => (
              <SingleReview
                spotId={spotId}
                key={review.id}
                review={review}
                user={user}
                fullWidth={fullWidth}
                />
            ))
          }
        </div>
      </div>
    )
  };
};
