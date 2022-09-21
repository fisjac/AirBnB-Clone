import { NavLink } from "react-router-dom";

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

export default function SpotCard({spot}) {
  return (
    <div
      className='spot-card'
      key={spot.id}
      >
      <NavLink
        className='card-navlink'
        to={`/spots/${spot.id}`}
        ></NavLink>
      {printSpot(spot)}
    </div>
  );
};
