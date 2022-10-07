import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews';
import { useSearchParams } from 'react-router-dom';
import SpotCard from './SpotCard';

import './Spots.css'

import * as spotActions from '../../store/spots';

function SpotsBrowser() {

  const dispatch = useDispatch();
  console.log('searchparams', useSearchParams())

  useEffect(()=> {
    dispatch(spotActions.clearState())
    dispatch(reviewActions.clearState())

    dispatch(spotActions.getAllSpots())
  },[dispatch]);

  const spots = useSelector(state=> state.spots.allSpots)
  return spots && (
    <div
      id='spot-range'
      className='padded max1500 centered'
      >
      { Object.values(spots).map(spot => (
          <SpotCard key={spot.id} spot={spot} />
        ))
      }
    </div>
    )
};

export default SpotsBrowser;
