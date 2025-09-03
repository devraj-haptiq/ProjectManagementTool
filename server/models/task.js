// /server/models/task.js

const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Task = sequelize.define("task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // NEW: The status is now a property of the Task itself
  status: {
    type: DataTypes.ENUM("pending", "in-progress", "completed"),
    defaultValue: "pending", // A new task will automatically be 'pending'
    allowNull: false,
  },
  // The 'position' field might not be needed if you just sort by creation date,
  // but we can leave it for now for manual ordering.
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Task;
