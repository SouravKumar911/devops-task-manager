
import { useState } from "react";

function TaskForm({ onAddTask, isAdding }) {
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        const success = await onAddTask(title.trim());

        if (success) {
            setTitle("");
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isAdding}
            />

            <button type="submit" disabled={isAdding}>
                {isAdding ? "Adding..." : "+ Add Task"}
            </button>
        </form>
    );
}

export default TaskForm;
