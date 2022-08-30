'use strict';

const spotImagesSeed = [
  {
    spotId: 1,
    url: '/someurl4',
    preview: true
  },
  {
    spotId: 2,
    url: '/someurl5',
    preview: false
  },
  {
    spotId: 3,
    url: '/someurl6',
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
