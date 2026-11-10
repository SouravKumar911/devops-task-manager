
import Notification from "./components/Notification";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Auth from "./components/Auth";

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask as removeTask,
} from "./services/taskService";

import "./App.css";

function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (!token || !savedUser) return null;

        try {
            return JSON.parse(savedUser);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return null;
        }
    });

    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const [notification, setNotification] = useState({
        message: "",
        type: ""
    });

    // Fetch tasks after login
    useEffect(() => {
        if (!currentUser) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTasks();
                setTasks(data.tasks);
            } catch (err) {
                setError(err.message);

                if (
                    err.message.toLowerCase().includes("token") ||
                    err.message.toLowerCase().includes("login")
                ) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [currentUser]);

    // Handle successful login
    const handleLogin = (user) => {
        setCurrentUser(user);
        setTasks([]);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setCurrentUser(null);
        setTasks([]);
        setError("");
    };

    // Add task
    const addTask = async (title) => {
        try {
            setError("");
            setIsAdding(true);

            const data = await createTask(title);

            setTasks((previousTasks) => [
                ...previousTasks,
                data.task
            ]);

            setNotification({
                message: "Task added successfully!",
                type: "success"
            });

            return true;
        } catch (err) {
            setNotification({
                message: err.message,
                type: "error"
            });

            return false;
        } finally {
            setIsAdding(false);
        }
    };

    // Toggle task completion
    const toggleTask = async (id) => {
        const task = tasks.find((item) => item._id === id);

        if (!task || updatingTaskId || deletingTaskId) return;

        try {
            setError("");
            setUpdatingTaskId(id);

            const data = await updateTask(id, {
                title: task.title,
                completed: !task.completed
            });

            setTasks((previousTasks) =>
                previousTasks.map((item) =>
                    item._id === id ? data.task : item
                )
            );

            setNotification({
                message: "Task updated successfully!",
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: err.message,
                type: "error"
            });
        } finally {
            setUpdatingTaskId(null);
        }
    };

    // Delete task
    const handleDeleteTask = async (id) => {
        if (deletingTaskId || updatingTaskId) return;

        try {
            setError("");
            setDeletingTaskId(id);

            await removeTask(id);

            setTasks((previousTasks) =>
                previousTasks.filter((task) => task._id !== id)
            );

            setNotification({
                message: "Task deleted successfully!",
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: err.message,
                type: "error"
            });
        } finally {
            setDeletingTaskId(null);
        }
    };

    // Show login/register when logged out
    if (!currentUser) {
        return <Auth onLogin={handleLogin} />;
    }

    const completedCount = tasks.filter(
        (task) => task.completed
    ).length;

    return (
        <div className="app">

            {/* Updated Navbar with user details and logout */}
            <Navbar
                user={currentUser}
                onLogout={handleLogout}
            />

            <main className="container">

                <Notification
                    message={notification.message}
                    type={notification.type}
                />

                <div className="page-heading">
                    <h1>My Tasks</h1>

                    <p>
                        Welcome, {currentUser.name}! Organize your work
                        and stay productive.
                    </p>
                </div>

                <div className="stats">
                    <div className="stat-card">
                        <h3>{tasks.length}</h3>
                        <p>Total Tasks</p>
                    </div>

                    <div className="stat-card">
                        <h3>{completedCount}</h3>
                        <p>Completed</p>
                    </div>

                    <div className="stat-card">
                        <h3>{tasks.length - completedCount}</h3>
                        <p>Pending</p>
                    </div>
                </div>

                <section className="task-section">
                    <h2>Add a New Task</h2>

                    <TaskForm
                        onAddTask={addTask}
                        isAdding={isAdding}
                    />
                </section>

                <section className="task-section">
                    <h2>Your Task List</h2>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onToggle={toggleTask}
                            onDelete={handleDeleteTask}
                            updatingTaskId={updatingTaskId}
                            deletingTaskId={deletingTaskId}
                        />
                    )}
                </section>

            </main>
        </div>
    );
}

export default App;
