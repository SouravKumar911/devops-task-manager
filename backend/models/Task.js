
const mongoose = require("mongoose");

// Define the structure of a Task
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
