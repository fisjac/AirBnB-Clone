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

function SingleSpot () {
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const user = useSelector(state=>state.session.user);
  const spot = useSelector(state=>state.spots.singleSpot);

  useEffect(()=>{
    dispatch(getSpotDetails(spotId));
  },[dispatch])



const Title = () => (
  <div
    className='title padded top-padded'
    >
    <div
      // className='title'
      >
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

const Wrappers = ({children}) => (
  <div className='padded top-padded'>
    <div className = 'fit-content'>
      <div className='centered'>
          {children}
      </div>
    </div>
  </div>
)


const Image = ({url, className}) => (
  <div
    style={{backgroundImage: `url(${url})`}}
    // src={url}
    className={className}
    >
  </div>
);


  // {/* <div
  //   id='col2'
  //   >
  //   {spot.SpotImages?.slice(1,3).map((image, idx)=>(
  //     <div
  //       key={idx}
  //       style={{backgroundImage:`url(${image.url})`}}
  //       className='image secondary'
  //       >
  //     </div>
  //   ))}
  // </div>
  // <div
  //   id='col3'
  //   >
  //   {spot.SpotImages?.slice(3,5).map((image, idx)=>(
  //     <div
  //       key={idx}
  //       style={{backgroundImage:`url(${image.url})`}}
  //       className='image secondary'
  //       >
  //     </div>
  //   ))}
  // </div> */}



  return  spot && (
    <>
      <Title />

      <Wrappers>
        <Image
          url={
            spot.SpotImages?.slice(0).url
          }
          className='background ratio fill'
          />
        <div></div>
      </Wrappers>

        <Reviews
          spot={spot}
          user={user}/>

    </>
  );
};

export default SingleSpot;
