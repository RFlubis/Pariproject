'use strict';
const fs = require('fs')
const bcrypt = require('bcryptjs');

module.exports = {
   up(queryInterface, Sequelize) {
      /**
       * Add seed commands here.
       *
       * Example:
       * await queryInterface.bulkInsert('People', [{
       *   name: 'John Doe',
       *   isBetaMember: false
       * }], {});
      */
      let data = JSON.parse(fs.readFileSync('./data/member.json', 'utf-8'))
      data.forEach(element => {
         const salt = bcrypt.genSaltSync(8);
         const hash = bcrypt.hashSync(element.password, salt);
         element.password = hash
         element.createdAt = new Date()
         element.updatedAt = new Date()
      })
      console.log(data);
      return queryInterface.bulkInsert('Members', data, {})
   },

   down(queryInterface, Sequelize) {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {});
       */
      return queryInterface.bulkDelete('Members', null, {})
   }
};
