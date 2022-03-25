'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    genderCaller(name) {
      if (this.gender === "male" || this.gender === "Male") {
        return `Mr. ${name}`
      }
      if (this.gender === "female" || this.gender === "Female") {
        return `Mrs. ${name}`
      }
    }

    static associate(models) {
      // define association here
      this.hasMany(models.Post)
      this.belongsTo(models.Member)

    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please input name' }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please choose gender' }
      }
    },
    registeredEmail: {
      type: DataTypes.STRING,
    },
    selfDescription: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please input selfDescription' }
      }
    },
    MemberId: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};