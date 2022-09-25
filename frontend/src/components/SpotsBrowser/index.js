import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SpotCard from './SpotCard';

import './Spots.css'

import * as spotActions from '../../store/spots';

function SpotsBrowser() {

  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(spotActions.getAllSpots())
  },[dispatch]);

  const spots = useSelector(state=> state.spots.allSpots)
  return spots && (
    <div
      id='spot-range'
      className='padded max1120 centered'
      >
      { Object.values(spots).map(spot => (
          <SpotCard key={spot.id} spot={spot} />
        ))
      }
    </div>
    )
};

export default SpotsBrowser;
