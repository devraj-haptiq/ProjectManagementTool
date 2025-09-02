const { DataTypes } = require("sequelize");
// Import the central sequelize instance from our new file
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  // We explicitly define the 'id' field as you requested.
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Name is a required field
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Email is a required field
    unique: true, // No two users can have the same email
    validate: {
      isEmail: true, // Ensures the string is a valid email format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Password is a required field
  },
});

module.exports = User;
