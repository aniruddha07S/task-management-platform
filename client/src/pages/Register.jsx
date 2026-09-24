import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/authSlice';
import AuthLayout from '../components/AuthLayout';
import FormAlert from '../components/FormAlert';
import Field from '../components/ui/Field';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!EMAIL_RE.test(formData.email)) return 'Enter a valid email address';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password))
      return 'Password must contain letters and numbers';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    const { name, email, password } = formData;
    const result = await dispatch(registerUser({ name: name.trim(), email: email.trim(), password }));
    if (registerUser.fulfilled.match(result)) navigate('/dashboard');
  };

  const loading = status === 'loading';

  return (
    <AuthLayout title="Create your account" subtitle="Start organizing work with your team">
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <FormAlert message={validationError || error} />

        <Field label="Full name" htmlFor="name">
          <input id="name" name="name" autoComplete="name" placeholder="Jane Appleseed" value={formData.name} onChange={handleChange} className="field" />
        </Field>

        <Field label="Email" htmlFor="email">
          <input id="email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="field" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" htmlFor="password">
            <input id="password" type="password" name="password" autoComplete="new-password" placeholder="6+ characters" value={formData.password} onChange={handleChange} className="field" />
          </Field>
          <Field label="Confirm" htmlFor="confirmPassword">
            <input id="confirmPassword" type="password" name="confirmPassword" autoComplete="new-password" placeholder="Repeat" value={formData.confirmPassword} onChange={handleChange} className="field" />
          </Field>
        </div>

        <button type="submit" disabled={loading} className="btn-primary h-9 w-full">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-2">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
