import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FiveStars from "./FiveStars.js";
import * as reviewActions from '../../store/reviews'

export default function UpdateReviewForm({spotId, review, setShowModal}) {
  const dispatch = useDispatch();

  const [newReview, setNewReview] = useState(review.review);
  const [newStars, setNewStars] = useState(review.stars);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      spotId: spotId,
      reviewId: review.id,

      review: {
        review: newReview,
        stars: newStars
      }
    };
    setErrors([]);
    const response = await dispatch(reviewActions.updateReview(options))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });

    if (response.ok) setShowModal(false);
  };

  return (
    <div className='container'>
      <div className="content-container modal-padded flex-col">
        <div className='welcome-banner'>Edit Your Review</div>
        <form onSubmit={
          handleSubmit}>

          <ul>
            {Object.keys(errors).map((key, idx) => <li id='error-message' key={idx}>{`${key}: ${errors[key]}`}</li>)}
          </ul>

          <textarea
            className="button bottom fill"
            id='review-input'
            value={newReview}
            onChange={(e)=>setNewReview(e.target.value)}
            ></textarea>

          <div className='flex between'>
            <FiveStars
              stars={newStars}
              setStars={setNewStars}
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
