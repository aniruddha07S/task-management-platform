import { TrayIcon, ClockIcon, ProgressIcon, CheckCircleIcon } from '../components/Icons';

// Sidebar lists + dashboard tiles. `key` is the status filter ('' = all).
export const TASK_LISTS = [
  { key: '', label: 'All Tasks', statKey: 'total', icon: TrayIcon, tint: 'bg-accent' },
  { key: 'Pending', label: 'Pending', statKey: 'pending', icon: ClockIcon, tint: 'bg-mac-orange' },
  { key: 'In Progress', label: 'In Progress', statKey: 'inProgress', icon: ProgressIcon, tint: 'bg-mac-indigo' },
  { key: 'Completed', label: 'Completed', statKey: 'completed', icon: CheckCircleIcon, tint: 'bg-mac-green' },
];

export const PRIORITY_STYLES = {
  High: 'bg-mac-red/10 text-mac-red',
  Medium: 'bg-mac-orange/10 text-mac-orange',
  Low: 'bg-mac-green/10 text-mac-green',
};

export const STATUS_DOTS = {
  Pending: 'bg-mac-orange',
  'In Progress': 'bg-mac-indigo',
  Completed: 'bg-mac-green',
};

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'].map((v) => ({ value: v, label: v }));
export const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'].map((v) => ({ value: v, label: v }));
