import { CreateModalButton } from "../../context/Modal";
import SpotReviews from "../SingleSpot/SpotReviews";
import ReviewForm from "./ReviewForm";

export default function Reviews({user, spot}) {
  return (
  <div className='flex'>
    <div className='stars'>
       <label><i className="fa-solid fa-star"></i></label>
       <span>{
       spot.avgRating ? spot.avgRating.toPrecision(3) : 'No Ratings'
       }</span>
     </div>
    <div>{`${spot.numReviews} Reviews`}</div>
    {<SpotReviews spotId={spot.id}/>}

    {user && user?.id !== spot.ownerId &&
    <CreateModalButton
      header='Leave a review'
      label='Leave a Review'
      className='pink'
      >
        <ReviewForm/>
      </CreateModalButton>

    }
  </div>
  )
};
