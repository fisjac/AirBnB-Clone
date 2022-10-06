import { ModalWrapper } from "../../context/Modal";
import SpotReviews from "./SpotReviews";
import ReviewForm from "./ReviewForm";


import './reviews.css'

const LeaveAReviewButton = ({user, spot}) => (
  user && user?.id !== spot.ownerId &&
  <ModalWrapper header='Leave a review' child='Leave a Review'>
    <button></button>
    <ReviewForm/>
  </ModalWrapper>
);

export default function Reviews({user, spot}) {
  return (
    <div className="padded top-padded  max1120 centered">
      <div id='reviews-header'>
        <div>
          <div className='stars flex justify-center'>
            <label><i className="fa-solid fa-star"></i></label>
            <span>
              {spot.avgStarRating ? spot.avgStarRating.toPrecision(3) : 'No Ratings'}
            </span>
            <span id='dot'>·</span>
            <div>{`${spot.numReviews || 0} Reviews`}</div>
          </div>
        </div>
        <LeaveAReviewButton id='leave-review-button' spot={spot} user={user}/>
      </div>
      <div>
        <SpotReviews spotId={spot.id} user={user} fullWidth={false}/>
      </div>
    </div>)
};
