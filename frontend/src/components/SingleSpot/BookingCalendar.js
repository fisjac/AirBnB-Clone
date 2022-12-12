import { useState } from "react";
import { useDispatch } from "react-redux";

export default function BookingCalendar ({spot}) {

  let numNights = 7;
  let stayCost = numNights * spot.price;
  let cleaningFee = Math.ceil(7.5 * numNights,0);
  let serviceFee = Math.ceil(spot.price * .15 * numNights,0);
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // await dispatch( //need to dispatch to backend
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="calendar-inputs flex">
          <div className='input-area'>
            <label
              className="floating-label"
              htmlFor='check-in'
              >
              Check-In
            </label>
            <input
              id='check-in'
              type='date'
              value={checkInDate}
              onChange={(e)=>setCheckInDate(e.target.value)}
              />
          </div>
          <div className='input-area'>
            <label
              htmlFor='check-out'
              className="floating-label"
              >Check-Out</label>
            <input
              id='check-out'
              type='date'
              value={checkOutDate}
              onChange={(e)=>setCheckOutDate(e.target.value)}
              />
          </div>
        </div>
        <button
          id='reserve-button'
          className="pink button"
          type='submit'>Reserve</button>
      </form>
      <div>
        <div className='flex between align small-pad-vert'>
          <span>{`$${spot.price} x ${numNights} ${numNights > 1? 'nights': 'night'}`} </span>
          <span>{`$${stayCost}`}</span>
        </div>
        <div className='flex between align small-pad-vert'>
          <span>cleaning fee</span>
          <span>{`$${cleaningFee}`}</span>
        </div>
        <div className='flex between align small-pad-vert'>
          <span>service fee</span>
          <span>{`$${serviceFee}`}</span>
        </div>

        <div id='solid-line'></div>
        <div className='flex between align small-pad-vert'>
          <span className='bold'>Total before taxes</span>
          <span className='bold'>{`$${stayCost + serviceFee + cleaningFee}`}</span>
        </div>

      </div>
    </div>
  )
}
