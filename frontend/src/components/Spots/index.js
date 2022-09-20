import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './Spots.css'

import * as spotActions from '../../store/spots';

function printSpot(spot) {
   const {city, state, country, name, description, price, avgRating, previewImage } = spot;
   return (
    <>
      <img
        src={previewImage}
        ></img>
      <div className='spot-details'>
      <div className='stars'>
        <label><i className="fa-solid fa-star"></i></label>
        <span>{
        avgRating ? avgRating.toPrecision(3) : 'No Ratings'
        }</span>
      </div>
      <div>{`${city}, ${state}`}</div>
      <div><span style={{fontWeight: 'bold'}}>{`$${price} `}</span>night</div>
      </div>

    </>
   );
};

function SpotsBrowser() {

  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(spotActions.getAllSpots())
  },[dispatch]);

  const spots = useSelector(state=> state.spots.allSpots)
  console.log(spots);

  return (
    <div id='spot-range'>
     { Object.values(spots).map(spot => (
        <div className='spot-card' key={spot.id}>
          {printSpot(spot)}
        </div>
      ))}
    </div>
    )
};

export default SpotsBrowser;
