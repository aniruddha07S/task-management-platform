import { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending',
    assignedUser: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        status: task.status || 'Pending',
        assignedUser: task.assignedUser?._id || task.assignedUser || '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }
    if (!formData.assignedUser.trim()) {
      setError('Assigned user ID is required');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {task ? 'Edit Task' : 'Create Task'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-3">
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="assignedUser"
            placeholder="Assigned User ID"
            value={formData.assignedUser}
            onChange={handleChange}
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;    