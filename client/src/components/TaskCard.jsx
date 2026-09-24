import { memo } from 'react';

const priorityColors = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
};

const statusColors = {
  Pending: 'bg-gray-100 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
};

const TaskCard = memo(function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm">{task.description}</p>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>

      {task.assignedUser?.name && (
        <p className="text-xs text-gray-400">Assigned to: {task.assignedUser.name}</p>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded text-sm hover:bg-blue-100"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-sm hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default TaskCard;