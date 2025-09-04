const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Middleware to protect routes
const { Project, User } = require("../models"); // Import models

// --- 1. CREATE a new project ---
// @route   POST /api/projects
// @desc    Create a new project with all details
// @access  Private (requires login)
router.post("/", auth, async (req, res) => {
  try {
    // Destructure all the fields from the request body
    const { name, description, domain, deadline } = req.body;

    // Validate that the required 'name' field is present
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    // Create the new project in the database
    const newProject = await Project.create({
      name,
      description,
      domain,
      deadline,
      ownerId: req.user.id, // Set the owner to the currently logged-in user
    });

    // Automatically add the project's creator as the first member
    // The 'addMember' method is automatically provided by Sequelize
    await newProject.addMember(req.user.id);

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- 2. READ all of a user's projects ---
// @route   GET /api/projects
// @desc    Get all projects where the user is a member
// @access  Private (requires login)
router.get("/", auth, async (req, res) => {
  try {
    // First, find the instance of the logged-in user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use the special 'getMemberProjects' method from Sequelize to fetch all associated projects
    const projects = await user.getMemberProjects({
      // Optional: Include details about the project owner in the response
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]], // Order projects by newest first
    });

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- 3. UPDATE a project ---
// @route   PUT /api/projects/:projectId
// @desc    Update a project's details
// @access  Private (Owner only)
router.put("/:projectId", auth, async (req, res) => {
  try {
    const { name, description, domain, deadline } = req.body;
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);

    // If project doesn't exist, return 404
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Authorization check: Ensure the person updating is the project owner
    if (project.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this project" });
    }

    // Update all the fields provided in the request body
    project.name = name || project.name; // Keep old name if a new one isn't provided
    project.description = description;
    project.domain = domain;
    project.deadline = deadline;

    // Save the changes to the database
    await project.save();

    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- 4. DELETE a project ---
// @route   DELETE /api/projects/:projectId
// @desc    Delete a project
// @access  Private (Owner only)
router.delete("/:projectId", auth, async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Authorization check: Ensure the person deleting is the project owner
    if (project.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this project" });
    }

    // Delete the project from the database
    await project.destroy();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
