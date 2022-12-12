import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';
import Reviews from '../Reviews/Reviews';
import { ModalWrapper } from '../../context/Modal';
import EditOrDeleteSpotForm from './EditOrDeleteSpotForm';
import CreateImageForm from './CreateImageForm';
import BookingCalendar from './BookingCalendar';


import './SingleSpot.css'
import SpotReviews from '../Reviews/SpotReviews';

const Title = ({spot, user}) => {
  const navigate = useNavigate();
  return (
  <div
    className='title padded top-padded max1120 centered'
    >
    <div>
        <div id='name'>{spot.name}</div>
        <div id='subheader'>
          <div id='stars'>
          <i className="fa-solid fa-star"></i>
          {spot.avgStarRating ?
            spot.avgStarRating.toPrecision(3) :
            'No Ratings'}
        </div>
        { !spot.numReviews? null : (
          <>
            <span id='dot'>·</span>
            <ModalWrapper
              header='Reviews'
              child={`${spot.numReviews || 0} Reviews`}
              >
              <div id='num-reviews'></div>
              <SpotReviews limit={20} fullWidth={true}/>
            </ModalWrapper>
          </>
          )
        }
        <span id='dot'>·</span>
        <span
          id='city'
          className='pointer'
          onClick={()=>navigate(`/spots?city=${spot.city}`)}
          >
          {`${spot.city},`}
        </span>
        <span
          id='state'
          className='pointer'
          onClick={()=>navigate(`/spots?state=${spot.state}`)}
          > {` ${spot.state},`}</span>
        <span
          id='country'
          className='pointer'
          onClick={()=>navigate(`/spots?country=${spot.country}`)}
          >{` ${spot.country}`}</span>
      </div>
    </div>
    {user?.id === spot.ownerId &&
      <ModalWrapper header='Edit or Delete Your Listing' child='Edit/Delete'>
        <button
          className='pink align'
          id='edit-delete-listing'
          >
        </button>
        <EditOrDeleteSpotForm />
      </ModalWrapper>
      }
  </div>
)};


const Image = ({url}) => (
  <div
    style={{backgroundImage: `url(${url})`}}
    id='image'
    >
  </div>
);



const Images = ({spot, user, spotImages}) => {
  const images = spotImages?.reduce((arr, image, idx)=> {
  arr.push(<Image key={idx} url={image.url}/>);
  return arr;
  },[])
  if (user?.id === spot.ownerId) images.push((
    <ModalWrapper header='Add an Image' child={<i className="fa-solid fa-plus"></i>}>
        <button id='addImage'></button>
        <CreateImageForm spotId={spot.id}/>
    </ModalWrapper>))
  return (
    <div>
      <div className='padded top-padded centered max1120'>
      <div
        className='image-grid'
        id='main-grid'>
          {images[0]}

            <div
              className='image-grid'
              id='small-hide'
              >
              {
              images?.slice(1,5)
              }
        </div>
      </div>
    </div>
    </div>

  );
};


const Description = ({spot}) => {
  return (
    <div className='padded top-padded max1120 centered'>
      <div className ='flex between undercarriage bottom-padded'>
        <div id='details-container' className='undercarriage fill'>
          <div className='subItem'>
            {spot.description}
          </div>
        </div>
        <div id='price-box'>
          <div className='flex between wrap'>
            <div>
              <span id='price'>${spot.price}</span>
              <span> night</span>
            </div>
            <div
              id='RHS-reviews'
              className='stars flex justify-center align'>
              <label><i className="fa-solid fa-star"></i></label>
              <span>
                {spot.avgStarRating ? spot.avgStarRating.toPrecision(3) : 'No Ratings'}
              </span>
              {!spot.numReviews ? null : (
                <>
                  <span>·</span>
                  <ModalWrapper
                    header='Reviews'
                    child={`${spot.numReviews || 0} Reviews`}>
                    <span className='lightfont underline pointer'></span>
                    <SpotReviews limit={20} fullWidth={true} />
                  </ModalWrapper>
                </>
              )}
            </div>
          </div>
          <BookingCalendar spot={spot}/>
        </div>
      </div>
    </div>
  )
}

function SingleSpot () {
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const user = useSelector(state=>state.session.user);
  const spot = useSelector(state=>state.spots.singleSpot);

  useEffect(()=>{
    dispatch(spotActions.getSpotDetails(spotId))
    dispatch(reviewActions.getSpotReviews(spotId));
  },[dispatch])

  return  spot && (
    <>
      <Title spot={spot} user={user} />
      <Images
        spotImages={spot.SpotImages}
        spot={spot}
        user={user}/>
      <Description spot={spot}/>
      <Reviews
        spot={spot}
        user={user}
        />
    </>
  );
};

export default SingleSpot;
