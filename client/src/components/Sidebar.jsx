import { memo } from 'react';
import TrafficLights from './ui/TrafficLights';
import AppIcon from './ui/AppIcon';
import Avatar from './ui/Avatar';
import { LogoutIcon, MoonIcon, SunIcon } from './Icons';
import { TASK_LISTS } from '../constants/taskMeta';
import useTheme from '../hooks/useTheme';

const Sidebar = ({ activeList, onSelect, stats, user, onLogout, open, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 animate-fade bg-black/20 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-line bg-sidebar backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 ease-out lg:sticky lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-12 shrink-0 items-center px-5">
          <TrafficLights />
        </div>

        <div className="flex items-center gap-2.5 px-5 pb-5">
          <AppIcon size="sm" />
          <div>
            <p className="text-[14px] leading-tight font-semibold">Taskflow</p>
            <p className="text-[11px] text-ink-2">Team workspace</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3" aria-label="Task lists">
          <p className="px-2 pb-1.5 text-[11px] font-semibold text-ink-3">Lists</p>
          <ul className="space-y-0.5">
            {TASK_LISTS.map(({ key, label, icon: Icon, tint, statKey }) => {
              const active = activeList === key;
              return (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => onSelect(key)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-[13px] transition ${
                      active ? 'bg-accent text-white' : 'text-ink hover:bg-fill'
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${active ? 'bg-white/25' : tint}`}>
                      <Icon className="h-3 w-3" strokeWidth={2.6} />
                    </span>
                    <span className="flex-1 text-left">{label}</span>
                    <span className={`text-[12px] tabular-nums ${active ? 'text-white/80' : 'text-ink-3'}`}>
                      {stats[statKey]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2.5 px-1 py-1.5">
            <Avatar name={user?.name || ''} className="h-8 w-8 text-[12px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{user?.name}</p>
              <p className="truncate text-[11px] text-ink-2">
                <span className="capitalize">{user?.role}</span> · {user?.email}
              </p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button type="button" onClick={toggleTheme} className="btn-secondary !px-2">
              {theme === 'dark' ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button type="button" onClick={onLogout} className="btn-destructive !px-2">
              <LogoutIcon className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
