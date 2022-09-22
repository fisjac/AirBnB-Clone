import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FiveStars from "./FiveStars.js";

export default function ReviewForm({setShowModal}) {
  const spot = useSelector(state=> state.spots.singleSpot)
  const dispatch = useDispatch();

  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');

  const handleSubmit = (e) => {

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
        Log in
      </div>
      <div className="content-container">
        <div className='welcome-banner'>Leave a review for this listing</div>
        <form>
        <FiveStars
          stars={stars}
          setStars={setStars}
          />
        </form>
      </div>
    </div>

  )
};
