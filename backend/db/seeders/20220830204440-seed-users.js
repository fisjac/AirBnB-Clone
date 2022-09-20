'use strict';
const bcrypt = require("bcryptjs");

const userSeed = [
  {
    firstName: 'demo',
    lastName: 'lition',
    email: 'demo@user.io',
    username: 'Demo-lition',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    firstName: 'Ric',
    lastName: 'Flair',
    email: 'natureboy@woo.io',
    username: 'NatureBoy',
    hashedPassword: bcrypt.hashSync('woooooo')
  },
  {
    firstName: 'Fake',
    lastName: 'User',
    email: 'user1@user.io',
    username: 'FakeUser1',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    firstName: 'Fake',
    lastName: 'User',
    email: 'user2@user.io',
    username: 'FakeUser2',
    hashedPassword: bcrypt.hashSync('password3')
  },
  {
    firstName: 'Joe',
    lastName: 'Schmoe',
    email: 'joeschmoe@gmail.com',
    username: 'username1',
    hashedPassword: bcrypt.hashSync('password'),
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'JaneD@domain.io',
    username: 'username2',
    hashedPassword: bcrypt.hashSync('password2'),
  },
  {
    firstName: 'David',
    lastName: 'Rogers',
    email: 'capt@avengers.com',
    username: 'cpt-america',
    hashedPassword: bcrypt.hashSync('shield'),
  },
];


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', userSeed, {individualHooks: true});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users');
  }
};
