const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const AlbomModel = sequelize.define('alboms',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name:{type:DataTypes.STRING, allowNull: false},
  userId:{type:DataTypes.STRING, allowNull: false},
  orderId:{type:DataTypes.STRING, allowNull: false, defaultValue: 'USER'}
}, {
  timestamps: false
})

module.exports = AlbomModel;

