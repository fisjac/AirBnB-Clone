'use strict';

const spotImagesSeed = [
  {
    spotId: 1,
    url: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
    preview: true
  },
  {
    spotId: 1,
    url: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_960_720.jpg',
    preview: false
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
    url: 'https://cdn.pixabay.com/photo/2017/11/16/19/29/cottage-2955582__340.jpg',
    preview: true
  },
  {
    spotId: 7,
    url: 'https://cdn.pixabay.com/photo/2017/09/17/18/15/lost-places-2759275__340.jpg',
    preview: true
  },
  {
    spotId: 8,
    url: 'https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092__340.jpg',
    preview: true
  },
  {
    spotId: 9,
    url: 'https://cdn.pixabay.com/photo/2013/11/13/21/14/san-francisco-210230__340.jpg',
    preview: true
  },
  {
    spotId: 10,
    url: 'https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221__340.jpg',
    preview: true
  },
  {
    spotId: 11,
    url: 'https://cdn.pixabay.com/photo/2021/11/08/00/30/bedroom-6778193__340.jpg',
    preview: true
  },
  {
    spotId: 12,
    url: 'https://cdn.pixabay.com/photo/2017/01/07/17/48/interior-1961070__340.jpg',
    preview: true
  },
  {
    spotId: 13,
    url: 'https://cdn.pixabay.com/photo/2016/04/18/08/50/kitchen-1336160__340.jpg',
    preview: true
  },
  {
    spotId: 14,
    url: 'https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092__340.jpg',
    preview: true
  },
  {
    spotId: 15,
    url: 'https://cdn.pixabay.com/photo/2016/11/22/19/11/brick-wall-1850095__340.jpg',
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
