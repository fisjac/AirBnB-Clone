import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import * as spotActions from '../../store/spots'


function EditOrDeleteSpot({setShowModal, spot}) {
  const dispatch = useDispatch();
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
        history.push(`/spots/${newSpot.id}`);
        if(!errors.length) setShowModal(false);
    };

  return (
    <div className='container'>
      <div className='modal-header'>
        <button
          id='close-button'
          onClick={()=> {
            setShowModal(false)
          }}
          >
          <i className="fa-regular fa-x"></i>
        </button>
        Log in
      </div>
      <div id='content-container'>
        <div className='welcome-banner'>Edit or Delete this listing</div>
        <form
          className='submit-form'
          onSubmit={handleSubmit}
          >
          <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
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
              };
          }}
          >
          Delete Listing
        </button>
      </div>
    </div>
  );
};

export default EditOrDeleteSpot;
