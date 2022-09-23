import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getSpotDetails } from '../../store/spots';
import EditOrDeleteSpotModal from './EditOrDeleteSpotModal';
import LeaveAReviewModal from '../../components/Reviews/LeaveAReviewModal'
import SpotReviews from './SpotReviews';

import './SingleSpot.css'
//get spot details from db
//get user from state
//check if user owns spot

function SingleSpot () {
  const dispatch = useDispatch();
  const {spotId} = useParams();

  useEffect(()=>{
    dispatch(getSpotDetails(spotId));
  },[dispatch])

  const user = useSelector(state=>state.session.user);
  const spot = useSelector(state=>state.spots.singleSpot);

  return  spot && (
    <>
      <div
        className='title'>
          <div id='name'>{spot.name}</div>
          <div id='subheader'>
            <div id='stars'>
              <i className="fa-solid fa-star"></i>
              {spot.avgStarRating ?
                spot.avgStarRating.toPrecision(3) :
                'No Ratings'}
            </div>
            <span id='dot'>·</span>
            <div id='num-reviews'>{spot.numReviews}Reviews</div>
            <div id=''></div>
            <span id='dot'>·</span>
            <span id='city'>{`${spot.city},`} </span>
            <span id='state'> {` ${spot.state},`} </span>
            <span id='country'>{` ${spot.country}`}</span>
          </div>
      </div>
      <div
        id='image-container'
        >
        {spot.SpotImages?.slice(0,5).map((image, idx)=>(
          <div
            key={idx}
            style={{backgroundImage:`url(${image.url})`}}
            className='image'
            id={`image-${idx+1}`}
            >

          </div>
          ))}
      </div>
      <div className='container'>

        {spot && <SpotReviews spotId={spot.id}/>}
        {user?.id === spot.ownerId &&
          <EditOrDeleteSpotModal
            text={'Edit or Delete Listing'}
            />
        }
        {user?.id !== spot.ownerId &&
        <LeaveAReviewModal
          text={'Leave a review'}
          />
        }
      </div>

    </>
  );
};

export default SingleSpot;
