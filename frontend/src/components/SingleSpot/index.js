import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpotDetails } from '../../store/spots';
import EditOrDeleteSpotModal from './EditOrDeleteSpotModal';


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

  if (!spot) return
  return (
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
            <div id='reviws'>{spot.numReviews}</div>
            <div id=''></div>
            <span id='city'>{spot.city}, </span>
            <span id='state'>{spot.state}, </span>
            <span id='country'>{spot.country}</span>
          </div>
      </div>
      <div
        className='image container'
        >
        {spot.SpotImages?.slice(0,5).map((image, idx)=>(
          <img
            key={idx}
            id={`image-${idx+1}`}
            src= {image.url}
            >
          </img>
          ))}
      </div>
      {user.id === spot.ownerId &&
        <EditOrDeleteSpotModal
          text={'Edit or Delete Listing'}
          spot={spot}
          />
      }
    </>
  );
};

export default SingleSpot;
