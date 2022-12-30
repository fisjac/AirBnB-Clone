import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
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

function UserBooking ({booking, setShowModal}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = booking.Spot;
  const startDate = new Date(booking['startDate']);
  const endDate = new Date(booking['endDate']);

  return (
    <div
      className='trip-container'
      onClick={(e)=> {
        e.preventDefault();
        navigate(`/spots/${spot.id}`)
        setShowModal(false)

      }}
      >
      {!booking && <div>No upcoming reservations</div>}
      <div className='preview-image-container'>
        <div
          style={{backgroundImage: `url(${spot.previewImage})`}}
          id='preview-image'
          >
        </div>
        </div>
        <div className='reservation'>
          <div><span className='bold'>Name: </span>{spot.name}</div>
          <div>
            <div><span className='bold'>Check-in:</span> {startDate.toUTCString().slice(0,16)}</div>
            <div><span className='bold'>Check-out:</span> {endDate.toUTCString().slice(0,16)}</div>
          </div>
      </div>
      <div className='side-buttons'>
        {/* <div className='side-button pink'><i className="fa-solid fa-pen-to-square"></i></div> */}
        <div
          className='side-button pink'
          onClick={async (e)=> {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to cancel this reservation?')) {
              const response = await dispatch(bookingActions.deleteBookings(booking.id))
              if (response.ok) {
                alert('Reservation cancelled')
                dispatch(bookingActions.getUserBookings())
              }
            }
          }}
          ><i className="fa-solid fa-trash"></i></div>
      </div>
    </div>
  )
}

export default function BookingsList({spot, setShowModal}) {
  const dispatch = useDispatch();


  useEffect(()=> {
    if (spot) {
      dispatch(bookingActions.getSpotBookings(spot.id))
    } else {
      dispatch(bookingActions.getUserBookings())
    };
    return ()=>dispatch(bookingActions.clearBookings())
  }, [dispatch]);

  const spotBookings = useSelector(state=> state.bookings.spotBookings);
  const userBookings = useSelector(state=> state.bookings.userBookings);

  spotBookings?.sort((date1,date2)=>
    (date1.startDate > date2.startDate ? 1 : -1
    )
  );

  userBookings?.sort((date1,date2)=>
    (date1.startDate > date2.startDate ? 1 : -1
    )
  );

  return (
    <>
    {
      spotBookings && spotBookings.map((booking, idx ) => (
        <GuestBooking id={idx} booking={booking}/>
      ))
    }
    {
      userBookings && userBookings.map((booking, idx ) => (
        <UserBooking id={idx} booking={booking} setShowModal={setShowModal}/>
      ))
    }
    {
      !userBookings?.length && !spotBookings?.length && <div className='no-reservations'>No Upcoming Reservations</div>
    }

    </>
  )
}
