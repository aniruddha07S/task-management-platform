import AppIcon from './ui/AppIcon';
import useTheme from '../hooks/useTheme';
import { MoonIcon, SunIcon } from './Icons';

const AuthLayout = ({ title, subtitle, children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden="true" className="wallpaper absolute inset-0" />

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/40 text-ink backdrop-blur-xl transition hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="relative w-full max-w-[380px] animate-pop">
        <div className="mac-window rounded-3xl border border-white/50 bg-elevated/75 p-8 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
          <div className="mb-6 flex flex-col items-center text-center">
            <AppIcon size="lg" />
            <h1 className="mt-4 text-[22px] font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-[13px] text-ink-2">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
