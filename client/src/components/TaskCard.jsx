import { memo } from 'react';
import Avatar from './ui/Avatar';
import { DueBadge, PriorityBadge, StatusBadge } from './ui/Badges';
import { CheckIcon, PencilIcon, TrashIcon } from './Icons';

// Memoized so typing in search / opening modals doesn't re-render every card.
const TaskCard = memo(function TaskCard({ task, onOpen, onToggle, onEdit, onDelete }) {
  const done = task.status === 'Completed';
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <article
      onClick={() => onOpen(task)}
      className="group card flex cursor-pointer gap-3 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <button
        type="button"
        onClick={stop(() => onToggle(task))}
        aria-label={done ? 'Mark as pending' : 'Mark as completed'}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition ${
          done ? 'border-accent bg-accent text-white' : 'border-ink-3 hover:border-accent'
        }`}
      >
        {done && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h3 className={`flex-1 text-[14px] leading-snug font-medium break-words ${done ? 'text-ink-3 line-through' : 'text-ink'}`}>
            {task.title}
          </h3>
          <div className="-mt-1 -mr-1 flex gap-0.5 transition lg:opacity-0 lg:group-hover:opacity-100">
            <button type="button" className="icon-btn" aria-label="Edit task" onClick={stop(() => onEdit(task))}>
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="icon-btn hover:!text-mac-red" aria-label="Delete task" onClick={stop(() => onDelete(task._id))}>
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {task.description && <p className="mt-1 line-clamp-2 text-[13px] text-ink-2">{task.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <DueBadge task={task} />
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          {task.assignedUser?.name && (
            <span className="ml-auto">
              <Avatar name={task.assignedUser.name} className="h-6 w-6 text-[10px]" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
});

export default TaskCard;
