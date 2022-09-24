import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getSpotDetails } from '../../store/spots';
import Reviews from '../Reviews/Reviews';
import { CreateModalButton } from '../../context/Modal';
import EditOrDeleteSpotForm from './EditOrDeleteSpotForm';


import './SingleSpot.css'

//get spot details from db
//get user from state
//check if user owns spot


const Title = ({spot, user}) => (
  <div
    className='title padded top-padded'
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
        <span id='dot'>·</span>
        <div id='num-reviews'>{`${spot.numReviews} Reviews`}</div>
        <span id='dot'>·</span>
        <span id='city'>{`${spot.city},`} </span>
        <span id='state'> {` ${spot.state},`} </span>
        <span id='country'>{` ${spot.country}`}</span>
      </div>
    </div>
    {user?.id === spot.ownerId &&
      <CreateModalButton
        header='Edit or Delete Your Listing'
        label='Edit/Delete'
        className='pink align'
        id='edit-delete-listing'
        >
        <EditOrDeleteSpotForm />
      </CreateModalButton>
      }
  </div>
);


const Image = ({url, id}) => (
  <div
    style={{backgroundImage: `url(${url})`}}
    id={id}
    >
  </div>
);

const Images = ({spotImages}) => {
  const images = spotImages.reduce((arr, image)=> {
    arr.push(image.url);
    return arr;
  },[])
  return (
    <div className='padded top-padded undercarriage bottom-padded'>
      <div
        className='image-grid'>

          <Image url={images[0]} id='image'/>

            <div
              className='image-grid'
              id='small-hide'
              >
              {
              images?.slice(1,5)
                .map(url=> (
                  <Image
                    url={url}
                    id='image'
                    />
                  )
                )
              }
        </div>
      </div>
    </div>
  );
};



function SingleSpot () {
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const user = useSelector(state=>state.session.user);
  const spot = useSelector(state=>state.spots.singleSpot);

  useEffect(()=>{
    dispatch(getSpotDetails(spotId));
  },[dispatch])

  return  spot && (
    <>
      <Title spot={spot} user={user} />
      <Images spotImages={spot.SpotImages}/>
      <Reviews
        spot={spot}
        user={user}/>
    </>
  );
};

export default SingleSpot;
