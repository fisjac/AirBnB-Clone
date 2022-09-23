import './Stars.css'

export default function FiveStars({stars, setStars}) {
  return (
    <div id='star-container'>
      {[1,2,3,4,5]
        .map(num => (
          <div
            className={`star ${stars>=num && 'checked'}`}
            id={`star${num}`}
            key={num}
            onClick={(e)=> {
              e.preventDefault()
              setStars(num)}}
            >
            {
              stars>=num && <i className="fa-solid fa-star"></i>
            }
            { stars< num && <i className="fa-regular fa-star"></i>}
          </div>
      ))}
    </div>
  )
};
