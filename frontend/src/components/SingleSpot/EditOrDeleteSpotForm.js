import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as spotActions from '../../store/spots'


function EditOrDeleteSpotForm({setShowModal}) {
  const dispatch = useDispatch();

  let spot = useSelector(state=>state.spots.singleSpot)

  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [errors, setErrors] = useState([]);

  let address = !newAddress? spot.address : newAddress;
  let city = !newCity? spot.city : newCity;
  let state = !newState? spot.state : newState;
  let country = !newCountry? spot.country : newCountry;
  let lat = !newLat? spot.lat : newLat;
  let lng = !newLng? spot.lng : newLng;
  let name = !newName? spot.name : newName;
  let description = !newDescription? spot.description : newDescription;
  let price = !newPrice? spot.price : newPrice;

  const navigate = useNavigate();

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
    const response = await dispatch(spotActions.updateSpot(body))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
    if (response.ok) setShowModal(false);

  };

  return (
    <div className='container'>
      <div id='content-container'>
        <div className='welcome-banner'>Enter the new details for this listing</div>
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
            value={newAddress}
            placeholder={`Address:${spot.address}`}
            onChange={(e) => setNewAddress(e.target.value)}
            />
          <input
            type="text"
            className='middle'
            value={newCity}
            placeholder={`City:${spot.city}`}
            onChange={(e) => setNewCity(e.target.value)}
            />
          <input
            type="text"
            className='middle'
            value={newState}
            placeholder={`State:${spot.state}`}
            onChange={(e) => setNewState(e.target.value)}
            />
          <input
            type="text"
            className='middle'
            value={newCountry}
            placeholder={`Country:${spot.country}`}
            onChange={(e) => setNewCountry(e.target.value)}
            />
          <input
            type="number"
            className='middle'
            value={newLat}
            min="-90"
            max="90"
            placeholder={`Latitude:${spot.lat}`}
            onChange={(e) => setNewLat(e.target.value)}
            />
          <input
            type="number"
            className='middle'
            value={newLng}
            min="-180"
            max="180"
            placeholder={`Longitude:${spot.lng}`}
            onChange={(e) => setNewLng(e.target.value)}
            />
          <input
            type="text"
            className='middle'
            value={newName}
            placeholder={`Name:${spot.name}`}
            onChange={(e) => setNewName(e.target.value)}
            />
          <input
            type="text"
            className='middle'
            value={newDescription}
            placeholder={`Description:${spot.description}`}
            onChange={(e) => setNewDescription(e.target.value)}
            />
          <input
            className='bottom'
            type="number"
            min="0"
            value={newPrice}
            placeholder={`Price:${spot.price}`}
            onChange={(e) => setNewPrice(e.target.value)}
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
                (async ()=> {
                const response = await dispatch(spotActions.deleteSpot(spot.id))
                if (response.ok) {
                  navigate('/')
                };
              })()};
          }}
          >
          Delete Listing
        </button>
      </div>
    </div>
  );
};

export default EditOrDeleteSpotForm;
