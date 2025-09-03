const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, User, Project, Board, Card } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());

// --- Add your API routes here later ---
// Example:
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("Project Management Tool API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    // This will sync all models that have been defined on the sequelize instance.
    // Right now, it will just create the 'users' table.
    await sequelize.sync();
    console.log("Database has been successfully synced.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
});
