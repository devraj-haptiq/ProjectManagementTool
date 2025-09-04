// /server/models/index.js

const sequelize = require("../util/database");
const User = require("./user");
const Project = require("./project");
const Task = require("./task");

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

// Project-Task Relationship
Project.hasMany(Task, {
  foreignKey: {
    name: "projectId",
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

// --- NEW: Define Many-to-Many Relationships ---

// Project Members (User <-> Project)
User.belongsToMany(Project, {
  through: "ProjectMembers", // This is the name of our join table
  as: "memberProjects",
  foreignKey: "userId",
});
Project.belongsToMany(User, {
  through: "ProjectMembers",
  as: "members",
  foreignKey: "projectId",
});

// Task Assignees (User <-> Task)
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
  Task,
};

module.exports = db;
