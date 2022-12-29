import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as spotActions from '../../store/spots'

function CreateNewSpotForm ({setShowModal}) {
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors([]);
      const newSpot = await dispatch(spotActions.createSpot({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
      navigate(`/spots/${newSpot.id}`)
      setShowModal(false);
    };

  return (
    <div className="container">
        <div id='content-container'>
          <div className='welcome-banner'>Enter the details for your new listing</div>
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
              // required
              />
            <input
              type="text"
              className='middle'
              value={city}
              placeholder='City'
              onChange={(e) => setCity(e.target.value)}
              required
              />
            <input
              type="text"
              className='middle'
              value={state}
              placeholder='State'
              onChange={(e) => setState(e.target.value)}
              required
              />
            <input
              type="text"
              className='middle'
              value={country}
              placeholder='Country'
              onChange={(e) => setCountry(e.target.value)}
              required
              />
            <input
              type="number"
              className='middle'
              value={lat}
              min="-90"
              max="90"
              placeholder='Latitude'
              onChange={(e) => setLat(e.target.value)}
              required
              />
            <input
              type="number"
              className='middle'
              value={lng}
              min="-180"
              max="180"
              placeholder='Longitude'
              onChange={(e) => setLng(e.target.value)}
              required
              />
            <input
              type="text"
              className='middle'
              value={name}
              placeholder='Name'
              onChange={(e) => setName(e.target.value)}
              required
              />
            <input
              type="text"
              className='middle'
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
              className='pink button'
              type="submit"
              >
              Continue
            </button>
          </form>
        </div>
    </div>
  )
};

export default CreateNewSpotForm;
