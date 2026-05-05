import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form,     setForm]     = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.getProjects().then(r => setProjects(r.data));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const res = await api.createProject(form);
    setProjects(p => [...p, res.data]);
    setForm({ name: '', description: '' });
    setCreating(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button onClick={() => setCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + New Project
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold mb-4 text-gray-700">New Project</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input placeholder="Project name" value={form.name} required
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Description (optional)" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none" />
            <div className="flex gap-2">
              <button type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                Create
              </button>
              <button type="button" onClick={() => setCreating(false)}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p => (
          <Link key={p.id} to={`/projects/${p.id}`}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow block">
            <h3 className="font-semibold text-gray-800 mb-1">{p.name}</h3>
            {p.description && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{p.description}</p>
            )}
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{p.members?.length || 0} member{p.members?.length !== 1 ? 's' : ''}</span>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                {p.myRole}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}