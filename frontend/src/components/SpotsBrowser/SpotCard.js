import { NavLink } from "react-router-dom";

function printSpot(spot) {
  const {city, state, country, name, description, price, avgRating, previewImage } = spot;
  return (
   <>
    <div
      className='radius fill ratio background'
      style={{
        backgroundImage:`url(${previewImage})`
        }}
      >
    </div>
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

export default function SpotCard({spot}) {
  return (

      <NavLink
        className='spot-link'
        to={`/spots/${spot.id}`}
        >
        <div
          className='spot-card'
          key={spot.id}
          >
          {printSpot(spot)}
        </div>
      </NavLink>

  );
};
