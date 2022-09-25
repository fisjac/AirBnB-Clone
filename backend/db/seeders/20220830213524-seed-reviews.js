'use strict';

const reviewsSeed = [
  {
    spotId: 1,
    userId: 1,
    review: 'My boyfriend and I stayed at the Milky Way Run and had such a wonderful time! Amy made everything super easy, and were incredibly happy with our accommodations! We felt incredibly safe and relaxed during our stay.',
    stars: 5
  },
  {
    spotId: 1,
    userId: 3,
    review: 'Beautiful place! Super clean. Would definitely stay again.',
    stars: 4
  },
  {
    spotId: 1,
    userId: 4,
    review: "If you want to getaway, this cute little home makes a great stay. It was a bit smaller than I expected but that had no affect on how I felt about this place. Washing dishes, showering and even using the restrooms was cool experience.",
    stars: 5
  },
  {
    spotId: 1,
    userId: 5,
    review: 'Awesome location. Exactly the peaceful getaway I needed. Understand that you are coming here to camp with a lovely and comfortable building to sleep in. So worth it. Definitely coming back.',
    stars: 5
  },
  {
    spotId: 1,
    userId: 6,
    review: 'Overall it was a very nice and relaxing stay we got to see a bunch of stars and some beautiful storms at night the view is amazing especially for the sun rising and setting it was all together just an amazing experience all together!!',
    stars: 4
  },
  {
    spotId: 1,
    userId: 7,
    review: 'This campsite was a little further from The Big Bend than I had expected, and it took travel time to get to any attraction close by.',
    stars: 5
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', reviewsSeed)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews');
  }
};
