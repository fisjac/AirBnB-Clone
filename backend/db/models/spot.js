'use strict';
const {User, SpotImage} = require('../../db/models');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User,{
        as: 'Owner',
        foreignKey: 'ownerId'
      })
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      })
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      })
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull:false
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
        isNumeric: true
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
        isNumeric: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
  }, {
    hooks: {beforeCreate: (instance, options) => {
      console.log(instance)
    }},
    scopes: {
      avgRating: {
        attributes: {
          include: [
            [
              // adding subquery for average ratings
              sequelize.literal(`(
                select avg(stars)
                from Reviews as Review
                where
                  Review.spotId = Spot.id
              )`), 'avgRating'
            ],
          ]
        }
      },
      preview: {
        attributes: {
          include: [
            [
            // adding subquery for preview image
            sequelize.literal(`(
              select url
              from SpotImages as SpotImage
              where
                SpotImage.spotId = Spot.id
                and
                  SpotImage.preview = true
            )`), 'previewImage'
            ],
          ]
        }
      }
    },
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
