import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';
import Reviews from '../Reviews/Reviews';
import { CreateModalButton } from '../../context/Modal';
import EditOrDeleteSpotForm from './EditOrDeleteSpotForm';
import CreateImageForm from './CreateImageForm';

import './SingleSpot.css'

//get spot details from db
//get user from state
//check if user owns spot


const Title = ({spot, user}) => (
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
        <span id='dot'>·</span>
        <div id='num-reviews'>{`${spot.numReviews || 0} Reviews`}</div>
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
    id='image'
    >
  </div>
);



const Images = ({spot, user, spotImages}) => {
  console.log('SpotImages = ',spotImages)
  const images = spotImages?.reduce((arr, image)=> {
  arr.push(<Image url={image.url}/>);
  return arr;
  },[])
  if (user.id === spot.ownerId) images.push((
    <CreateModalButton
      id='addImage'
      header='Add an Image'
      childElement={<i className="fa-solid fa-plus"></i>}>
        <CreateImageForm spotId={spot.id}/>
    </CreateModalButton>))
  console.log(images)
  return (
    <div>
      <div className='padded top-padded centered  max1120'>
      <div
        className='image-grid'
        id='main-grid'>

          {/* <Image url={images[0]} id='image'/> */}
          {images[0]}

            <div
              className='image-grid'
              id='small-hide'
              >
              {
              images?.slice(1,5)
                // .map((url, idx)=> (
                //   <Image
                //     key={idx}
                //     url={url}
                //     id='image'
                //     />
                //   )
                // )
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
              <span>night</span>
            </div>
            <div
              id='RHS-reviews'
              className='stars flex justify-center align'>
            <label><i className="fa-solid fa-star"></i></label>
            <span>
              {spot.avgStarRating ? spot.avgStarRating.toPrecision(3) : 'No Ratings'} ·
            </span>
            <span className='lightfont underline'>{`${spot.numReviews || 0} Reviews`}</span>
          </div>



          </div>
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
        user={user}/>
    </>
  );
};

export default SingleSpot;
