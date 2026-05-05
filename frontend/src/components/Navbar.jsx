import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-gray-800 text-lg">TaskFlow</Link>
        <Link to="/"         className="text-sm text-gray-500 hover:text-gray-800">Dashboard</Link>
        <Link to="/projects" className="text-sm text-gray-500 hover:text-gray-800">Projects</Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.name}</span>
        <button onClick={logout}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors">
          Logout
        </button>
      </div>
    </nav>
  );
}