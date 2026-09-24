import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  filters: {
    search: '',
    status: '',
    priority: '',
    sort: '',
  },
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.sort) params.append('sort', filters.sort);

      const res = await api.get(`/api/tasks?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
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
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
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