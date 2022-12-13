import { useState } from "react";
import { useDispatch } from "react-redux";
import { ModalWrapper } from "../../context/Modal";
import LoginForm from "../Navigation/LoginForm";

const shortDateStringToDate = (dateString) => {
  const year = Number(dateString.slice(0,4));
  const month = Number(dateString.slice(5,7) - 1);
  const day = Number(dateString.slice(8,10));
  const outputDate = new Date(year, month, day);
  return outputDate;
}

const dateToShortString = (date) => {
  const ISOString = date.toISOString();
  const shortISODate = ISOString.slice(0,10)
  return shortISODate;
};

const compareDate = (date1, date2, cb) => {
  const MS = cb(date1, date2);
  const outputDate = new Date(MS)
  return outputDate;
}

const addDays = (date, days) => {
  date.setDate(date.getDate() + days)
  return date
}

const dateDiff = (date1, date2) => {
  const MS = date1 - date2;
  const days = MS / 1000 / 60 / 60 / 24
  return days
}

export default function BookingCalendar ({spot, user}) {
  const today = new Date();
  const endDate = new Date();
  addDays(endDate, 7);

  const [checkInDate, setCheckInDate] = useState(dateToShortString(today))
  const [checkOutDate, setCheckOutDate] = useState(dateToShortString(endDate))
  let numNights = dateDiff(shortDateStringToDate(checkOutDate), shortDateStringToDate(checkInDate));
  let stayCost = numNights * spot.price;
  let cleaningFee = Math.ceil(7.5 * numNights,0);
  let serviceFee = Math.ceil(spot.price * .15 * numNights,0);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              min={dateToShortString(today)}
              max={dateToShortString(addDays(shortDateStringToDate(checkOutDate),-1))}
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
              min={
                dateToShortString(
                addDays(
                  compareDate(
                    shortDateStringToDate(checkInDate), today, Math.max)
                  ,1)
                )
              }
              value={checkOutDate}
              onChange={(e)=>setCheckOutDate(e.target.value)}
              />
          </div>
        </div>

        {!user &&
          <ModalWrapper header='Log In' child='Log in to reserve'>
            <button
              id='reserve-button'
              className="pink button"
              type='button'
              >
            </button>
            <LoginForm/>
          </ModalWrapper>
          }
        {user &&
          <button
                id='reserve-button'
                className="pink button"
                type='submit'>
                  Reserve
          </button>
          }
      </form>
      {numNights > 0 && checkInDate && checkOutDate && <div>
        <div className='flex between align small-pad-vert'>
          <span>{`$${spot.price.toLocaleString()} x ${numNights.toLocaleString()} ${numNights > 1? 'nights': 'night'}`} </span>
          <span>{`$${stayCost.toLocaleString()}`}</span>
        </div>
        <div className='flex between align small-pad-vert'>
          <span>cleaning fee</span>
          <span>{`$${cleaningFee.toLocaleString()}`}</span>
        </div>
        <div className='flex between align small-pad-vert'>
          <span>service fee</span>
          <span>{`$${serviceFee.toLocaleString()}`}</span>
        </div>

        <div id='solid-line'></div>
        <div className='flex between align small-pad-vert'>
          <span className='bold'>Total before taxes</span>
          <span className='bold'>{`$${Number(stayCost + serviceFee + cleaningFee).toLocaleString()}`}</span>
        </div>

      </div>}
    </div>
  )
}
