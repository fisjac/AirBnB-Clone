import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import * as spotActions from '../../store/spots'


function EditOrDeleteSpotForm({setShowModal}) {
  const dispatch = useDispatch();

  let spot = useSelector(state=>state.spots.singleSpot)
  console.log(spot)

  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState([]);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const body = {
      id: spot.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    };
    const updatedSpot = await dispatch(spotActions.updateSpot(body))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
      if(!Object.keys(errors).length) setShowModal(false);
  };

  return (
    <div className='container'>
      <div id='content-container'>
        <div className='welcome-banner'>Edit or Delete this listing</div>
        <form
          className='submit-form'
          onSubmit={handleSubmit}
          >
          <ul>
          {Object.keys(errors).map((key, idx) => <li id='error-message' key={idx}>{`${key}: ${errors[key]}`}</li>)}
          </ul>
          <input
            className='top'
            type="text"
            value={address}
            placeholder='Address'
            onChange={(e) => setAddress(e.target.value)}
            required
            />
          <input
            type="text"
            value={city}
            placeholder='City'
            onChange={(e) => setCity(e.target.value)}
            required
            />
          <input
            type="text"
            value={state}
            placeholder='State'
            onChange={(e) => setState(e.target.value)}
            required
            />
          <input
            type="text"
            value={country}
            placeholder='Country'
            onChange={(e) => setCountry(e.target.value)}
            required
            />
          <input
            type="number"
            value={lat}
            min="-90"
            max="90"
            placeholder='Latitude'
            onChange={(e) => setLat(e.target.value)}
            required
            />
          <input
            type="number"
            value={lng}
            min="-180"
            max="180"
            placeholder='Lng'
            onChange={(e) => setLng(e.target.value)}
            required
            />
          <input
            type="text"
            value={name}
            placeholder='Name'
            onChange={(e) => setName(e.target.value)}
            required
            />
          <input
            type="text"
            value={description}
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            required
            />
          <input
            className='bottom'
            type="number"
            min="0"
            value={price}
            placeholder='Price'
            onChange={(e) => setPrice(e.target.value)}
            required
            />
          <button
            className='continue button'
            type="submit"
            >
            Continue
          </button>
        </form>
        <div id='or-container'>
          <div id='or'>or</div>
        </div>
        <button
          className='delete button'
          onClick={()=>{
            if(window
              .confirm('are you sure you want to delete your listing?')
              ) {
                dispatch(spotActions.deleteSpot(spot.id))
                history.push('/');
              };
          }}
          >
          Delete Listing
        </button>
      </div>
    </div>
  );
};

export default EditOrDeleteSpotForm;
