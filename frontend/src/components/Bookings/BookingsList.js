import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as bookingActions from '../../store/bookings';

import './Bookings.css'

function GuestBooking ({booking}) {
  const user = booking['User'];
  const startDate = new Date(booking['startDate']);
  const endDate = new Date(booking['endDate']);
  return (
    <div className='reservation'>
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
      console.log('in else')
      dispatch(bookingActions.getUserBookings())
    };
    return ()=>dispatch(bookingActions.clearBookings())
  }, [dispatch]);

  const spotBookings = useSelector(state=> state.bookings.spotBookings);
  spotBookings?.sort((date1,date2)=>
    (date1.startDate > date2.startDate ? 1 : -1
    )
  );

  const userBookings = useSelector(state=> state.bookings.userBookings);

  return (

    spotBookings && spotBookings.map((booking, idx ) => (
      <GuestBooking id={idx} booking={booking}/>
    ))

    // userBookings && userBookings.map((booking, idx ) => (
    //   <UserBooking id={idx} booking={booking}/>
    // ))
  )
}
