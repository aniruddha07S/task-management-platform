import Modal from './ui/Modal';
import Avatar from './ui/Avatar';
import { DueBadge, PriorityBadge, StatusBadge } from './ui/Badges';
import { PencilIcon, TrashIcon, CheckIcon } from './Icons';
import { formatDateTime, formatLongDate } from '../utils/date';

const Row = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 px-4 py-2.5">
    <dt className="shrink-0 text-ink-2">{label}</dt>
    <dd className="min-w-0 truncate text-right text-ink">{children}</dd>
  </div>
);

const TaskDetail = ({ task, onClose, onEdit, onDelete, onToggle }) => {
  const done = task.status === 'Completed';

  return (
    <Modal
      title="Task Details"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-destructive mr-auto" onClick={() => onDelete(task._id)}>
            <TrashIcon className="h-3.5 w-3.5" />
            Delete
          </button>
          <button type="button" className="btn-secondary" onClick={() => onEdit(task)}>
            <PencilIcon className="h-3.5 w-3.5" />
            Edit
          </button>
          <button type="button" className="btn-primary" onClick={() => onToggle(task)}>
            <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
            {done ? 'Reopen' : 'Mark Complete'}
          </button>
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        <DueBadge task={task} />
      </div>

      <h3 className={`mt-3 text-[20px] font-semibold tracking-tight break-words ${done ? 'text-ink-2 line-through' : 'text-ink'}`}>
        {task.title}
      </h3>

      <p className="mt-2 text-[14px] leading-relaxed whitespace-pre-wrap text-ink-2">
        {task.description || <span className="text-ink-3 italic">No notes</span>}
      </p>

      <dl className="mt-5 divide-y divide-line rounded-xl border border-line bg-canvas text-[13px]">
        <Row label="Due date">{formatLongDate(task.dueDate)}</Row>
        <Row label="Assigned to">
          {task.assignedUser?.name ? (
            <span className="inline-flex items-center gap-2">
              <Avatar name={task.assignedUser.name} className="h-5 w-5 text-[9px]" />
              {task.assignedUser.name}
            </span>
          ) : (
            '—'
          )}
        </Row>
        <Row label="Created">{formatDateTime(task.createdAt)}</Row>
        <Row label="Last updated">{formatDateTime(task.updatedAt)}</Row>
      </dl>
    </Modal>
  );
};

export default TaskDetail;
