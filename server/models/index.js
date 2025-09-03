// /server/models/index.js

const sequelize = require("../util/database");
const User = require("./user");
const Project = require("./project");
const Task = require("./task"); // Renamed from Card

// --- Define One-to-Many Relationships ---
// User-Project (as owner)
User.hasMany(Project, {
  foreignKey: { name: "ownerId", allowNull: false },
  as: "ownedProjects",
});
Project.belongsTo(User, {
  foreignKey: { name: "ownerId", allowNull: false },
  as: "owner",
});

// --- NEW: Define Direct Project-Task Relationship ---
Project.hasMany(Task, {
  foreignKey: {
    name: "projectId", // This creates a 'projectId' field in the 'tasks' table
    allowNull: false,
  },
  as: "tasks",
});
Task.belongsTo(Project, {
  foreignKey: {
    name: "projectId",
    allowNull: false,
  },
  as: "project",
});

// --- Many-to-Many for Assignees is still useful ---
User.belongsToMany(Task, {
  through: "TaskAssignees", // Join table for task assignments
  as: "assignedTasks",
  foreignKey: "userId",
});
Task.belongsToMany(User, {
  through: "TaskAssignees",
  as: "assignees",
  foreignKey: "taskId",
});

// Export all models and the sequelize instance
const db = {
  sequelize,
  User,
  Project,
  Task, // Replaced Board with Task
};

module.exports = db;
