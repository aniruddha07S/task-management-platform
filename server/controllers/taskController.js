const Task = require('../models/Task');

// GET /api/tasks — supports ?search=&status=&priority=&sort=
exports.getTasks = async (req, res) => {
  try {
    const { search, status, priority, sort } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    let query = Task.find(filter).populate('assignedUser', 'name email');

    if (sort === 'asc') {
      query = query.sort({ dueDate: 1 });
    } else if (sort === 'desc') {
      query = query.sort({ dueDate: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const tasks = await query;
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedUser', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, assignedUser } = req.body;

    if (!title || !dueDate || !assignedUser) {
      return res.status(400).json({ message: 'Title, due date, and assigned user are required' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      assignedUser,
    });

    const populatedTask = await task.populate('assignedUser', 'name email');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedUser', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
