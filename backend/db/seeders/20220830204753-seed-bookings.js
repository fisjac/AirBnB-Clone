'use strict';

const bookingSeed = [
  {
    spotId: 1,
    userId: 3,
    startDate: '2020-10-01',
    endDate: '2020-10-15'
  },
  {
    spotId: 2,
    userId: 3,
    startDate: '2022-11-01',
    endDate: '2022-12-01'
  },
  {
    spotId: 3,
    userId: 1,
    startDate: '2023-01-01',
    endDate: '2023-01-04'
  },
  {
    spotId: 3,
    userId: 1,
    startDate: '2023-01-01',
    endDate: '2023-01-04'
  },
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', bookingSeed, {individualHooks: true});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings');
  }
};
