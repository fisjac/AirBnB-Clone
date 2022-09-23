import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import errorCatching from "../../errorHandler.js";
import FiveStars from "./FiveStars.js";
import * as reviewActions from '../../store/reviews'

export default function ReviewForm({setShowModal}) {
  const spot = useSelector(state=> state.spots.singleSpot)
  const dispatch = useDispatch();

  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');
  const [errors, setErrors] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const options = {spotId: spot.id, review: {review,stars}};
    errorCatching(
      reviewActions.createReview,
      options,
      dispatch,
      setErrors
    );
    if (!errors.length) setShowModal(false)


  };

  return (
    <div className='container'>
      <div className="modal-header">
        <button
            id='close-button'
            onClick={()=> {
              setShowModal(false)
            }}
            >
            <i className="fa-regular fa-x"></i>
          </button>
        Leave a Review
      </div>
      <div className="content-container">
        <div className='welcome-banner'>Leave a review for this listing</div>
        <form onSubmit={handleSubmit}>
          <ul>
            {Object.keys(errors).map((key, idx) => <li id='error-message' key={idx}>{`${key}: ${errors[key]}`}</li>)}
          </ul>
          <input
            className="button bottom"
            type='text'
            value={review}
            onChange={(e)=>setReview(e.target.value)}
            />
          <FiveStars
            stars={stars}
            setStars={setStars}
            />
          <button
              className="button pink"
              type="submit">Submit Review</button>
        </form>
      </div>
    </div>

  )
};
