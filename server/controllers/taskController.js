const Task = require('../models/Task');

const STATUSES = ['Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Builds the Mongo filter from query params. Returns { error } for invalid values.
const buildFilter = ({ search, status, priority }, { includeStatus = true } = {}) => {
  const filter = {};
  if (search && search.trim()) {
    filter.title = { $regex: escapeRegex(search.trim()), $options: 'i' };
  }
  if (priority) {
    if (!PRIORITIES.includes(priority)) return { error: `Invalid priority "${priority}"` };
    filter.priority = priority;
  }
  if (includeStatus && status) {
    if (!STATUSES.includes(status)) return { error: `Invalid status "${status}"` };
    filter.status = status;
  }
  return { filter };
};

// GET /api/tasks — ?search=&status=&priority=&sort=asc|desc&page=1&limit=9
exports.getTasks = async (req, res) => {
  try {
    const { filter, error } = buildFilter(req.query);
    if (error) return res.status(400).json({ message: error });

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);

    // _id is a unique tie-breaker so skip/limit pages never overlap
    let sortBy = { createdAt: -1, _id: -1 };
    if (req.query.sort === 'asc') sortBy = { dueDate: 1, createdAt: -1, _id: -1 };
    else if (req.query.sort === 'desc') sortBy = { dueDate: -1, createdAt: -1, _id: -1 };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignedUser', 'name email')
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/tasks/stats — counts per status (respects search & priority filters)
exports.getTaskStats = async (req, res) => {
  try {
    const { filter, error } = buildFilter(req.query, { includeStatus: false });
    if (error) return res.status(400).json({ message: error });

    const grouped = await Task.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byStatus = Object.fromEntries(grouped.map((g) => [g._id, g.count]));
    const pending = byStatus.Pending || 0;
    const inProgress = byStatus['In Progress'] || 0;
    const completed = byStatus.Completed || 0;

    res.status(200).json({ total: pending + inProgress + completed, pending, inProgress, completed });
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
