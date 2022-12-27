import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as bookingActions from '../../store/bookings';

function GuestBooking ({booking}) {
  const user = booking['User'];
  const startDate = new Date(booking['startDate']);
  const endDate = new Date(booking['endDate']);
  let testDate = new Date(startDate)
  return (
    <div>
        <div><span className='bold'>Guest:</span> {user.firstName} {user.lastName}</div>
        <div>
          <div><span className='bold'>Check-in:</span> {startDate.toUTCString().slice(0,16)}</div>
          <div><span className='bold'>Check-out:</span> {endDate.toUTCString().slice(0,16)}</div>
        </div>
    </div>
  )
}

export default function BookingsList({spot}) {
  const dispatch = useDispatch();


  useEffect(()=> {
    if (spot) {
      dispatch(bookingActions.getSpotBookings(spot.id))
    } else {
      // dispatch(bookingActions.getUserBookings())
    };
  }, [dispatch])
  const spotBookings = useSelector(state=> state.bookings.spotBookings);
  // const userBookings = useSelector(state=> state.bookings.userBookings);
  // if (listType === 'user') {}


  return (

    <GuestBooking booking={spotBookings[0]}/>
  )
}
