import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={() => dispatch(logout())}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p>Welcome, {user?.name} ({user?.role})</p>
      <p className="text-gray-500 mt-2">Task management UI coming next.</p>
    </div>
  );
};

export default Dashboard;