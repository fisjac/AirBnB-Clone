import { useSelector, useDispatch } from "react-redux";
import * as reviewActions from '../../store/reviews';

export default function SingleReview ({reviewId}) {
  const dispatch = useDispatch();
  const user = useSelector(state=> state.session.user)
  const review = useSelector(state=> state.reviews.spot[reviewId])
  return review && (
    <div id='review'>
      <div>{review.stars}</div>
      <div>{review.review}</div>
      {user?.id === review.userId &&
        <button
          className='pink delete-review'
          onClick={(e)=> {
            e.preventDefault();
            dispatch(reviewActions.deleteReview(review.id))}}
            >
            delete
          </button>}
    </div>

  )
}
