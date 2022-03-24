'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Profile)
      this.hasMany(models.PostTag, { foreignKey: 'PostId' })
      this.belongsToMany(models.Tag, { through: models.PostTag })

    }
  }
  Post.init({
    title: DataTypes.STRING,
    fileUpload: DataTypes.STRING,
    description: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER,
    like: DataTypes.INTEGER
  }, {
    sequelize,
    hooks: {
      beforeCreate: (instance, options) => {
        instance.like = 0
      },
    },
    modelName: 'Post',
  });
  return Post;
};