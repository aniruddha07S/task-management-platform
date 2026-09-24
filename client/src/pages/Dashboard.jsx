import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { fetchTasks, createTask, updateTask, deleteTask, setFilters } from '../store/tasksSlice';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import useDebounce from '../hooks/useDebounce';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { items: tasks, status, filters } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [filters, dispatch]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };
  }, [tasks]);

  const handleCreate = useCallback(() => {
    setEditingTask(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Delete this task?')) {
        dispatch(deleteTask(id))
          .unwrap()
          .then(() => toast.success('Task deleted'))
          .catch((msg) => toast.error(msg || 'Failed to delete task'));
      }
    },
    [dispatch]
  );

  const handleFormSubmit = useCallback(
    (formData) => {
      if (editingTask) {
        dispatch(updateTask({ id: editingTask._id, taskData: formData }))
          .unwrap()
          .then(() => toast.success('Task updated'))
          .catch((msg) => toast.error(msg || 'Failed to update task'));
      } else {
        dispatch(createTask(formData))
          .unwrap()
          .then(() => toast.success('Task created'))
          .catch((msg) => toast.error(msg || 'Failed to create task'));
      }
      setShowForm(false);
      setEditingTask(null);
    },
    [dispatch, editingTask]
  );

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingTask(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Task Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={() => dispatch(logout())}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border rounded px-3 py-2 flex-1 min-w-[200px]"
          />
          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            className="border rounded px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => dispatch(setFilters({ priority: e.target.value }))}
            className="border rounded px-3 py-2"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            value={filters.sort}
            onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
            className="border rounded px-3 py-2"
          >
            <option value="">Sort by Date</option>
            <option value="asc">Due Date: Earliest</option>
            <option value="desc">Due Date: Latest</option>
          </select>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Task
          </button>
        </div>

        {status === 'loading' && <p className="text-gray-500">Loading tasks...</p>}
        {status === 'failed' && <p className="text-red-500">Failed to load tasks.</p>}

        {status === 'succeeded' && tasks.length === 0 && (
          <p className="text-gray-500">No tasks found. Create one to get started.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {showForm && (
        <TaskForm task={editingTask} onSubmit={handleFormSubmit} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default Dashboard;