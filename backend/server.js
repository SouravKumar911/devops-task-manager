
const cors = require("cors");
require("dotenv").config();

const express = require("express");
const { randomUUID } = require("crypto");
const connectDB = require("./config/db");
const Task = require("./models/Task");

const app = express();
const client = require("@prometheus-io/client");

const register = new client.Registry();

client.collectDefaultMetrics({ register });
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:8080"
    ]
}));

app.use(express.json());

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Welcome to Task Manager Backend!");
});

// HEALTH CHECK
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend is running"
    });
});

// CREATE TASK
app.post("/tasks", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Valid task title is required"
            });
        }

        const newTask = await Task.create({
            title: title.trim()
        });

        res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ ALL TASKS
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ SINGLE TASK
app.get("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(400).json({ message: "Invalid task ID" });
    }
});

// UPDATE TASK
app.put("/tasks/:id", async (req, res) => {
    try {
        const { title, completed } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof completed !== "boolean"
        ) {
            return res.status(400).json({
                message: "Valid title and completed status are required"
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: title.trim(),
                completed
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(
            req.params.id
        );

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });

    } catch (error) {
        res.status(400).json({ message: "Invalid task ID" });
    }
});

// START SERVER AFTER DATABASE CONNECTION
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
