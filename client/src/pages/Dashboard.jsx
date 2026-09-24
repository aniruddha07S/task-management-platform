import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { fetchTasks, fetchStats, createTask, updateTask, deleteTask, setFilters } from '../store/tasksSlice';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskDetail from '../components/TaskDetail';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Segmented from '../components/ui/Segmented';
import Select from '../components/ui/Select';
import { AlertIcon, MenuIcon, PlusIcon, SearchIcon, TrayIcon } from '../components/Icons';
import { TASK_LISTS, PRIORITY_OPTIONS } from '../constants/taskMeta';
import { greeting, todayLabel } from '../utils/date';
import useDebounce from '../hooks/useDebounce';

const PRIORITY_FILTERS = [{ value: '', label: 'All' }, ...PRIORITY_OPTIONS];

const SkeletonCard = () => (
  <div className="card animate-pulse p-4">
    <div className="h-4 w-2/3 rounded bg-fill" />
    <div className="mt-3 h-3 w-full rounded bg-fill" />
    <div className="mt-2 h-3 w-1/2 rounded bg-fill" />
    <div className="mt-4 flex gap-2">
      <div className="h-5 w-16 rounded-full bg-fill" />
      <div className="h-5 w-14 rounded-full bg-fill" />
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { items: tasks, status, error, filters, pagination, stats } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ open: false, task: null });
  const [viewingId, setViewingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Search → Redux filters (debounced)
  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // Everything is filtered, sorted and paginated on the server.
  const { search, priority, sort, status: statusFilter, page } = filters;

  const loadTasks = useCallback(
    () => dispatch(fetchTasks({ search, priority, sort, status: statusFilter, page })),
    [dispatch, search, priority, sort, statusFilter, page]
  );

  // Stats ignore the status filter so every sidebar count / tile stays accurate
  const loadStats = useCallback(
    () => dispatch(fetchStats({ search, priority })),
    [dispatch, search, priority]
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // If the current page became empty (e.g. last task on it deleted), step back
  useEffect(() => {
    if (status === 'succeeded' && tasks.length === 0 && page > pagination.totalPages) {
      dispatch(setFilters({ page: pagination.totalPages }));
    }
  }, [status, tasks.length, page, pagination.totalPages, dispatch]);

  const refresh = useCallback(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

  const visibleTasks = tasks;

  const viewingTask = useMemo(() => tasks.find((t) => t._id === viewingId) ?? null, [tasks, viewingId]);
  const activeList = TASK_LISTS.find((l) => l.key === filters.status) ?? TASK_LISTS[0];
  const hasFilters = Boolean(filters.search || filters.status || filters.priority);

  // ---- Handlers (stable references so memoized children don't re-render) ----
  const selectList = useCallback(
    (key) => {
      dispatch(setFilters({ status: key }));
      setSidebarOpen(false);
    },
    [dispatch]
  );

  const setPriority = useCallback((value) => dispatch(setFilters({ priority: value })), [dispatch]);

  const goToPage = useCallback(
    (p) => {
      dispatch(setFilters({ page: p }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    setSearchInput('');
    dispatch(setFilters({ search: '', status: '', priority: '' }));
  }, [dispatch]);

  const openCreate = useCallback(() => setForm({ open: true, task: null }), []);
  const openEdit = useCallback((task) => {
    setViewingId(null);
    setForm({ open: true, task });
  }, []);
  const closeForm = useCallback(() => setForm({ open: false, task: null }), []);

  const openDetail = useCallback((task) => setViewingId(task._id), []);
  const closeDetail = useCallback(() => setViewingId(null), []);

  const requestDelete = useCallback((id) => setDeletingId(id), []);
  const cancelDelete = useCallback(() => setDeletingId(null), []);

  const confirmDelete = useCallback(async () => {
    const id = deletingId;
    setDeletingId(null);
    setViewingId((current) => (current === id ? null : current));
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success('Task deleted');
      refresh();
    } catch (msg) {
      toast.error(msg || 'Failed to delete task');
    }
  }, [deletingId, dispatch, refresh]);

  const toggleComplete = useCallback(
    async (task) => {
      const next = task.status === 'Completed' ? 'Pending' : 'Completed';
      try {
        await dispatch(updateTask({ id: task._id, taskData: { status: next } })).unwrap();
        toast.success(next === 'Completed' ? 'Marked as completed' : 'Moved back to pending');
        refresh();
      } catch (msg) {
        toast.error(msg || 'Failed to update task');
      }
    },
    [dispatch, refresh]
  );

  const handleFormSubmit = useCallback(
    async (formData) => {
      try {
        if (form.task) {
          await dispatch(updateTask({ id: form.task._id, taskData: formData })).unwrap();
          toast.success('Task updated');
        } else {
          await dispatch(createTask(formData)).unwrap();
          toast.success('Task created');
        }
        closeForm();
        refresh();
      } catch (msg) {
        toast.error(msg || 'Something went wrong');
      }
    },
    [dispatch, form.task, closeForm, refresh]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.success('Signed out');
  }, [dispatch]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const showSkeleton = status === 'loading' && tasks.length === 0;

  const searchBox = (
    <label className="relative block">
      <span className="sr-only">Search tasks</span>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ink-2" />
      <input
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search tasks"
        className="h-8 w-full rounded-lg border border-transparent bg-fill pr-3 pl-8 text-[13px] text-ink outline-none transition placeholder:text-ink-3 focus:border-accent/60 focus:bg-surface focus:ring-4 focus:ring-accent/15 sm:w-60"
      />
    </label>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeList={filters.status}
        onSelect={selectList}
        stats={stats}
        user={user}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-w-0 flex-1">
        {/* Toolbar */}
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/75 backdrop-blur-xl backdrop-saturate-150">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button type="button" className="icon-btn lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <MenuIcon className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold">{activeList.label}</h1>
              <p className="text-[11px] text-ink-2">
                {pagination.total} {pagination.total === 1 ? 'task' : 'tasks'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:block">{searchBox}</div>
              <button type="button" onClick={openCreate} className="btn-primary">
                <PlusIcon className="h-4 w-4" strokeWidth={2.2} />
                <span className="hidden sm:inline">New Task</span>
              </button>
            </div>
          </div>
          <div className="px-4 pb-3 sm:hidden">{searchBox}</div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Greeting */}
          <div className="mb-6">
            <p className="text-[13px] font-medium text-ink-2">{todayLabel()}</p>
            <h2 className="mt-0.5 text-[26px] font-semibold tracking-tight sm:text-[30px]">
              {greeting()}, {firstName}
            </h2>
          </div>

          {/* Stat tiles */}
          <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Task summary">
            {TASK_LISTS.map((l) => (
              <StatCard
                key={l.label}
                listKey={l.key}
                label={l.label}
                value={stats[l.statKey]}
                icon={l.icon}
                tint={l.tint}
                active={filters.status === l.key}
                onSelect={selectList}
              />
            ))}
          </section>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Segmented ariaLabel="Filter by priority" options={PRIORITY_FILTERS} value={filters.priority} onChange={setPriority} />
            <Select
              aria-label="Sort tasks"
              value={filters.sort}
              onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
              className="w-48"
            >
              <option value="">Newest first</option>
              <option value="asc">Due date: earliest</option>
              <option value="desc">Due date: latest</option>
            </Select>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="text-[13px] font-medium text-accent hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Content */}
          {status === 'failed' ? (
            <div className="card flex flex-col items-center px-6 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mac-red/10 text-mac-red">
                <AlertIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold">Couldn’t load tasks</h3>
              <p className="mt-1 max-w-sm text-[13px] text-ink-2">{error || 'Something went wrong.'}</p>
              <button type="button" onClick={loadTasks} className="btn-secondary mt-5">
                Try again
              </button>
            </div>
          ) : showSkeleton ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="card flex flex-col items-center px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fill text-ink-3">
                <TrayIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold">{hasFilters ? 'No matching tasks' : 'No tasks yet'}</h3>
              <p className="mt-1 max-w-xs text-[13px] text-ink-2">
                {hasFilters ? 'Try a different search or filter.' : 'Create your first task to get started.'}
              </p>
              {hasFilters ? (
                <button type="button" onClick={clearFilters} className="btn-secondary mt-5">
                  Clear filters
                </button>
              ) : (
                <button type="button" onClick={openCreate} className="btn-primary mt-5">
                  <PlusIcon className="h-4 w-4" strokeWidth={2.2} />
                  New Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onOpen={openDetail}
                  onToggle={toggleComplete}
                  onEdit={openEdit}
                  onDelete={requestDelete}
                />
              ))}
            </div>
          )}

          {status !== 'failed' && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={goToPage}
            />
          )}
        </div>
      </main>

      {viewingTask && (
        <TaskDetail task={viewingTask} onClose={closeDetail} onEdit={openEdit} onDelete={requestDelete} onToggle={toggleComplete} />
      )}

      {form.open && <TaskForm task={form.task} onSubmit={handleFormSubmit} onClose={closeForm} />}

      {deletingId && (
        <ConfirmDialog
          title="Delete this task?"
          message="This can’t be undone."
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;
