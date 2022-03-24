'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasOne(models.Profile)

    }
  }
  Member.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please input Email' },
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please input password' },
        isEven(value) {
          if (value.length < 8) {
            throw new Error('Password min 8 character');
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please choose role' }
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate: (instance, options) => {
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash
      },
    },
    modelName: 'Member',
  });
  return Member;
};