'use strict';

const spotImagesSeed = [
  {
    spotId: 1,
    url: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
    preview: true
  },
  {
    spotId: 2,
    url: 'https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041__340.jpg',
    preview: true
  },
  {
    spotId: 3,
    url: 'https://cdn.pixabay.com/photo/2014/11/21/17/17/house-540796__340.jpg',
    preview: true
  },
  {
    spotId: 4,
    url: 'https://cdn.pixabay.com/photo/2016/07/28/09/01/mountains-1547302__340.jpg',
    preview: true
  },
  {
    spotId: 5,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 6,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 7,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 8,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 9,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 10,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 11,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 12,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 13,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 14,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
  {
    spotId: 15,
    url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271__340.jpg',
    preview: true
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', spotImagesSeed);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', spotImagesSeed);
  }
};
