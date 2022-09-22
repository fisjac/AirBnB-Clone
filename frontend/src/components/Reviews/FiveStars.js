export default function FiveStars({stars, setStars}) {
  return (
    <div id='stars-container'>
      {[1,2,3,4,5]
        .map(num => (
          <input
          className={`star ${stars>=num && 'checked'}`}
          id='star1'
          type='radio'
          checked={stars >= num}
          onClick={()=> setStars(num)}
          />
      ))}
    </div>
  )
};
