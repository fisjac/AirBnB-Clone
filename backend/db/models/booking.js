'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      belongsTo(models.Spot, {foreignKey: 'spotId'})
      belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        [Op.lt]: this.endDate
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        [Op.gt]: this.startDate
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
