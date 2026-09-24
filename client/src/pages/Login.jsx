import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store/authSlice';
import AuthLayout from '../components/AuthLayout';
import FormAlert from '../components/FormAlert';
import Field from '../components/ui/Field';

const DEMO_ACCOUNTS = [
  { label: 'User', email: 'testuser@example.com', password: 'Test@1234' },
  { label: 'Admin', email: 'admin@example.com', password: 'Admin@1234' },
];

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const validate = () => {
    if (!formData.email.trim()) return 'Email is required';
    if (!EMAIL_RE.test(formData.email)) return 'Enter a valid email address';
    if (!formData.password) return 'Password is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    const result = await dispatch(loginUser({ ...formData, rememberMe }));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  const loading = status === 'loading';

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Taskflow workspace">
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <FormAlert message={validationError || error} />

        <Field label="Email" htmlFor="email">
          <input id="email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="field" />
        </Field>

        <Field label="Password" htmlFor="password">
          <input id="password" type="password" name="password" autoComplete="current-password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="field" />
        </Field>

        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-2 select-none">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-3.5 w-3.5 accent-accent" />
          Keep me signed in
        </label>

        <button type="submit" disabled={loading} className="btn-primary h-9 w-full">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="mt-5 rounded-xl bg-fill px-3 py-2.5">
        <p className="text-[11px] font-semibold text-ink-2">Demo accounts</p>
        <div className="mt-1.5 flex gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                setFormData({ email: a.email, password: a.password });
                setValidationError('');
              }}
              className="flex-1 rounded-md bg-surface px-2 py-1.5 text-[12px] font-medium text-ink shadow-sm transition hover:text-accent"
            >
              Use {a.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-center text-[13px] text-ink-2">
        Don’t have an account?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
