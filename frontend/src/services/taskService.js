
const API_URL = import.meta.env.VITE_API_URL;

// Common function for making API requests
async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// Get all tasks
export function getTasks() {
    return request("/tasks");
}

// Create a task
export function createTask(title) {
    return request("/tasks", {
        method: "POST",
        body: JSON.stringify({ title })
    });
}

// Update a task
export function updateTask(id, taskData) {
    return request(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(taskData)
    });
}

// Delete a task
export function deleteTask(id) {
    return request(`/tasks/${id}`, {
        method: "DELETE"
    });
}
