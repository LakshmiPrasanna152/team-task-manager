import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage     from './pages/LoginPage';
import SignupPage    from './pages/SignupPage';
import Dashboard     from './pages/Dashboard';
import ProjectsPage  from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import Navbar        from './components/Navbar';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={
            <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
          } />
          <Route path="/projects" element={
            <PrivateRoute><Layout><ProjectsPage /></Layout></PrivateRoute>
          } />
          <Route path="/projects/:id" element={
            <PrivateRoute><Layout><ProjectDetail /></Layout></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}