
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET is missing or too short. Use at least 32 characters.");
    process.exit(1);
}

if (!process.env.METRICS_USERNAME || !process.env.METRICS_PASSWORD) {
    console.error("Metrics username or password is missing from .env");
    process.exit(1);
}

const connectDB = require("./config/db");
const Task = require("./models/Task");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const client = require("@prometheus-io/client");

const app = express();
const register = new client.Registry();

const PORT = process.env.PORT || 5000;

// =====================================
// PROMETHEUS CONFIGURATION
// =====================================

client.collectDefaultMetrics({ register });

// =====================================
// METRICS AUTHENTICATION
// =====================================

const metricsAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        res.set("WWW-Authenticate", 'Basic realm="Prometheus Metrics"');
        return res.status(401).send("Authentication required");
    }

    const credentials = Buffer.from(
        authHeader.split(" ")[1],
        "base64"
    ).toString("utf8");

    const separator = credentials.indexOf(":");

    if (separator === -1) {
        return res.status(401).send("Invalid credentials");
    }

    const username = credentials.slice(0, separator);
    const password = credentials.slice(separator + 1);

    if (
        username !== process.env.METRICS_USERNAME ||
        password !== process.env.METRICS_PASSWORD
    ) {
        return res.status(401).send("Invalid credentials");
    }

    next();
};

// =====================================
// RATE LIMITER
// =====================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts. Please try again later."
    }
});

// =====================================
// SECURITY MIDDLEWARE
// =====================================

app.use(helmet());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:8080",
        "https://devops-task-manager-ebon.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10kb" }));

// =====================================
// AUTHENTICATION ROUTES
// =====================================

app.use("/auth", authLimiter, authRoutes);

// =====================================
// PROMETHEUS METRICS
// =====================================

app.get("/metrics", metricsAuth, async (req, res) => {
    try {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        console.error("Metrics error:", error.message);
        res.status(500).send("Unable to retrieve metrics");
    }
});

// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {
    res.send("Welcome to Task Manager Backend!");
});

// =====================================
// HEALTH CHECK
// =====================================

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend is running"
    });
});

// =====================================
// CREATE TASK
// =====================================

app.post("/tasks", authMiddleware, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Valid task title is required"
            });
        }

        const newTask = await Task.create({
            title: title.trim(),
            user: req.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        console.error("Create task error:", error.message);
        res.status(500).json({
            message: "Failed to create task"
        });
    }
});

// =====================================
// READ ALL TASKS
// =====================================

app.get("/tasks", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.userId
        });

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error("Fetch tasks error:", error.message);
        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});

// =====================================
// READ SINGLE TASK
// =====================================

app.get("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(400).json({
            message: "Invalid task ID"
        });
    }
});

// =====================================
// UPDATE TASK
// =====================================

app.put("/tasks/:id", authMiddleware, async (req, res) => {
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

        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
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
        res.status(400).json({
            message: "Invalid task ID"
        });
    }
});

// =====================================
// DELETE TASK
// =====================================

app.delete("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

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
        res.status(400).json({
            message: "Invalid task ID"
        });
    }
});

// =====================================
// START SERVER
// =====================================

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
