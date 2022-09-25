import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FiveStars from "./FiveStars.js";
import * as reviewActions from '../../store/reviews'

export default function ReviewForm({setShowModal}) {
  const spot = useSelector(state=> state.spots.singleSpot)
  const dispatch = useDispatch();


  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {spotId: spot.id, review: {review,stars}};
    setErrors([]);
    const response = await dispatch(reviewActions.createReview(options))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });

    if (response.ok) setShowModal(false);
  };

  return (
    <div className='container'>
      <div className="content-container modal-padded flex-col">
        <div className='welcome-banner'>Leave a review for this listing</div>
        <form onSubmit={
          handleSubmit}>
          <ul>
            {Object.keys(errors).map((key, idx) => <li id='error-message' key={idx}>{`${key}: ${errors[key]}`}</li>)}
          </ul>
          <textarea
            className="button bottom fill"
            id='review-input'
            value={review}
            onChange={(e)=>setReview(e.target.value)}
            ></textarea>
          <div className='flex between'>
            <FiveStars
              stars={stars}
              setStars={setStars}
              />
            <button
                className="button pink nomargin"
                id="review-submit"
                type="submit">Submit Review</button>
          </div>

        </form>
      </div>
    </div>

  )
};
