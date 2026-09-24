import { CalendarIcon, FlagIcon } from '../Icons';
import { PRIORITY_STYLES, STATUS_DOTS } from '../../constants/taskMeta';
import { formatDue, isOverdue } from '../../utils/date';

const base = 'inline-flex h-[22px] items-center gap-1 rounded-full px-2 text-[11px] font-medium';

export const PriorityBadge = ({ priority }) => (
  <span className={`${base} ${PRIORITY_STYLES[priority] || 'bg-fill text-ink-2'}`}>
    <FlagIcon className="h-3 w-3" />
    {priority}
  </span>
);

export const StatusBadge = ({ status }) => (
  <span className={`${base} gap-1.5 bg-fill text-ink-2`}>
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status] || 'bg-mac-gray'}`} />
    {status}
  </span>
);

export const DueBadge = ({ task }) => {
  const overdue = isOverdue(task);
  return (
    <span className={`${base} ${overdue ? 'bg-mac-red/10 text-mac-red' : 'bg-fill text-ink-2'}`}>
      <CalendarIcon className="h-3 w-3" />
      {formatDue(task.dueDate)}
    </span>
  );
};
