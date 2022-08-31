'use strict';

const reviewsSeed = [
  {
    spotId: 1,
    userId: 3,
    review: 'loved it',
    stars: 5
  },
  {
    spotId: 3,
    userId: 1,
    review: 'hated it',
    stars: 1
  },
  {
    spotId: 2,
    userId: 4,
    review: 'no wifi',
    stars: 5
  },
  {
    spotId: 2,
    userId: 3,
    review: 'no wifi',
    stars: 2
  },
  {
    spotId: 1,
    userId: 5,
    review: 'no wifi',
    stars: 3
  },
  {
    spotId: 1,
    userId: 2,
    review: 'no wifi',
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
