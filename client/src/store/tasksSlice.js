import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const PAGE_SIZE = 9;

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  pagination: { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 },
  stats: { total: 0, pending: 0, inProgress: 0, completed: 0 },
  filters: {
    search: '',
    status: '',
    priority: '',
    sort: '',
    page: 1,
  },
};

const toQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) q.append(key, value);
  });
  return q.toString();
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/tasks?${toQuery({ limit: PAGE_SIZE, ...params })}`);
      return res.data; // { tasks, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'tasks/fetchStats',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/tasks/stats?${toQuery(params)}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/tasks', taskData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, taskData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Changing any filter other than `page` sends you back to page 1
    setFilters: (state, action) => {
      const changesPage = Object.prototype.hasOwnProperty.call(action.payload, 'page');
      state.filters = { ...state.filters, ...action.payload, ...(changesPage ? {} : { page: 1 }) };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Instant UI feedback; the Dashboard refetches the page + stats after each mutation
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export const { setFilters } = tasksSlice.actions;
export default tasksSlice.reducer;
