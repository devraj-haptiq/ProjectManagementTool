const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Project = sequelize.define("project", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Project;
