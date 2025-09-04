// /server/models/project.js

const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Project = sequelize.define("project", {
  // This 'id' field serves as our unique 'projectId'
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
  // NEW FIELD: A longer text description for the project.
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Making this optional
  },
  // NEW FIELD: To categorize the project (e.g., 'Web Development').
  domain: {
    type: DataTypes.STRING,
    allowNull: true, // Making this optional
  },
  // NEW FIELD: The project's due date.
  deadline: {
    type: DataTypes.DATE,
    allowNull: true, // Making this optional
  },
  // NOTE: The 'ownerId' (the userId of the owner) is added automatically
  // by the relationship we defined in models/index.js.
});

module.exports = Project;
