
const arrayToJSON = (array) => {
  return array.reduce((accum, record) => {
    accum.push(record.toJSON());
    return accum;
  }, [] );
};


module.exports = {
  arrayToJSON
};
