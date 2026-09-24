import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import Modal from './ui/Modal';
import Field from './ui/Field';
import Segmented from './ui/Segmented';
import Select from './ui/Select';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants/taskMeta';

const toFormState = (task, currentUserId) => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  priority: task?.priority ?? 'Medium',
  dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  status: task?.status ?? 'Pending',
  assignedUser: task?.assignedUser?._id ?? task?.assignedUser ?? currentUserId ?? '',
});

const validate = (d) => {
  const e = {};
  if (!d.title.trim()) e.title = 'Title is required';
  else if (d.title.trim().length > 100) e.title = 'Keep the title under 100 characters';
  if (!d.dueDate) e.dueDate = 'Pick a due date';
  if (!d.assignedUser) e.assignedUser = 'Assign this task to someone';
  return e;
};

const TaskForm = ({ task, onSubmit, onClose }) => {
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const [formData, setFormData] = useState(() => toFormState(task, currentUserId));
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/api/auth/users')
      .then((res) => !cancelled && setUsers(res.data))
      .catch(() => !cancelled && setUsers([]))
      .finally(() => !cancelled && setUsersLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(formData);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setSubmitting(true);
    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
    setSubmitting(false);
  };

  return (
    <Modal
      title={task ? 'Edit Task' : 'New Task'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="task-form" className="btn-primary min-w-[110px]" disabled={submitting}>
            {submitting ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
          </button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Title" htmlFor="title" error={errors.title}>
          <input
            id="title"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className="field !py-2.5 !text-[15px] font-medium"
          />
        </Field>

        <Field label="Notes" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details (optional)"
            className="field resize-none"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Due date" htmlFor="dueDate" error={errors.dueDate}>
            <input id="dueDate" type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="field" />
          </Field>
          <Field label="Assign to" htmlFor="assignedUser" error={errors.assignedUser}>
            <Select id="assignedUser" name="assignedUser" value={formData.assignedUser} onChange={handleChange}>
              {usersLoading ? (
                <option value={formData.assignedUser}>Loading people…</option>
              ) : (
                <>
                  <option value="">Choose a person…</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </>
              )}
            </Select>
          </Field>
        </div>

        <Field label="Priority">
          <Segmented full ariaLabel="Priority" options={PRIORITY_OPTIONS} value={formData.priority} onChange={(v) => setField('priority', v)} />
        </Field>

        <Field label="Status">
          <Segmented full ariaLabel="Status" options={STATUS_OPTIONS} value={formData.status} onChange={(v) => setField('status', v)} />
        </Field>
      </form>
    </Modal>
  );
};

export default TaskForm;
