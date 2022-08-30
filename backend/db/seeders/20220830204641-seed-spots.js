'use strict';

const spotSeed = [
  {
    ownerId: 1,
    address: '100 Candy lane',
    city: 'Nunya',
    state: 'TX',
    country: 'USA',
    lat: 80,
    lng: 179,
    name: 'test spot 1',
    description: 'Boho Vibes 2B2B',
    price: 250
  },
  {
    ownerId: 1,
    address: '255 Polar Express',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    lat: 60,
    lng: 150,
    name: 'test spot 2',
    description: 'Brownstone in the heart of downtown.',
    price: 400
  },
  {
    ownerId: 2,
    address: '77 Diagon Alley',
    city: 'London',
    state: 'VA',
    country: 'Great Britain',
    lat: 20,
    lng: -150,
    name: 'test spot 3',
    description: 'Boho Vibes 2B2B',
    price: 250
  },
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', spotSeed, {Hooks: true});
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('Spots')
  }
};
