'use strict';

const reviewImagesSeed = [
  {
    reviewId: 1,
    url: '/someurl1'
  },
  {
    reviewId: 2,
    url: '/someurl2'
  },
  {
    reviewId: 2,
    url: '/someurl3'
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewImages',reviewImagesSeed);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages');
  }
};
