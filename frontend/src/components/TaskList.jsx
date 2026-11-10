
import TaskItem from "./TaskItem";

function TaskList({
    tasks,
    onToggle,
    onDelete,
    updatingTaskId,
    deletingTaskId
}) {
    if (tasks.length === 0) {
        return (
            <div className="empty-message">
                No tasks yet. Add your first task!
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    isUpdating={updatingTaskId === task._id}
                    isDeleting={deletingTaskId === task._id}
                />
            ))}
        </div>
    );
}

export default TaskList;
