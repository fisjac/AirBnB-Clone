import {useState} from 'react';
import {useDispatch} from 'react-redux';
import * as spotActions from '../../store/spots';

export default function CreateImageForm ({spotId, setShowModal}) {
  const [errors, setErrors] = useState([]);
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const body = {url};
    const response = await dispatch(spotActions.addImageToSpot(body,spotId))
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });;
    if (response.ok) setShowModal(false);
  };

  return (
  <div id='content-container'>
    <div className='welcome-banner'>Submit an image URL for this listing</div>
    <form
      className='submit-form'
      onSubmit={handleSubmit}
      >
      <ul>
      {Object.keys(errors).map((key, idx) => <li id='error-message' key={idx}>{`${key}: ${errors[key]}`}</li>)}
      </ul>
      <input
        className='top bottom'
        type="text"
        value={url}
        placeholder={`url`}
        onChange={(e) => setUrl(e.target.value)}
        required
        />
      {/* <label htmlFor='preview'>Preview Image:</label>
      <input
        id='preview'
        type="radio"
        checked={preview}
        onChange={() => setPreview(!preview)}
        required
        /> */}
      <button
        className='pink button'
        type="submit"
        >
        Add
        </button>
    </form>
  </div>

  )
};
