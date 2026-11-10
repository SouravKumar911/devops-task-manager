
function TaskItem({
    task,
    onToggle,
    onDelete,
    isUpdating,
    isDeleting
}) {
    const isBusy = isUpdating || isDeleting;

    return (
        <div className={`task-item ${task.completed ? "completed" : ""}`}>
            <div className="task-details">
                <input
                    type="checkbox"
                    checked={task.completed}
                    disabled={isBusy}
                    onChange={() => onToggle(task._id)}
                />

                <span>{task.title}</span>
            </div>

            <button
                className="delete-btn"
                disabled={isBusy}
                onClick={() => onDelete(task._id)}
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}

export default TaskItem;
