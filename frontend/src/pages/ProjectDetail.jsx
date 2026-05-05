import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

const statusOptions  = ['TODO', 'IN_PROGRESS', 'DONE'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

export default function ProjectDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: ''
  });
  const [invite, setInvite] = useState({ email: '', role: 'MEMBER' });
  const [tab,    setTab]    = useState('tasks');

  async function load() {
    const res = await api.getProject(id);
    setProject(res.data);
  }

  useEffect(() => { load(); }, [id]);

  async function handleCreateTask(e) {
    e.preventDefault();
    await api.createTask({
      ...newTask,
      projectId:  id,
      assigneeId: newTask.assigneeId || undefined
    });
    setNewTask({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
    load();
  }

  async function handleStatusChange(taskId, status) {
    await api.updateTask(taskId, { status });
    load();
  }

  async function handleDeleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    await api.deleteTask(taskId);
    load();
  }

  async function handleInvite(e) {
    e.preventDefault();
    try {
      await api.inviteMember(id, invite);
      setInvite({ email: '', role: 'MEMBER' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Invite failed');
    }
  }

  if (!project) return <p className="text-gray-400">Loading...</p>;

  const isAdmin = project.myRole === 'ADMIN';
  const tasksByStatus = {
    TODO:        project.tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE:        project.tasks.filter(t => t.status === 'DONE'),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
        {project.description && (
          <p className="text-gray-400 mt-1">{project.description}</p>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {['tasks', 'members', isAdmin && 'invite'].filter(Boolean).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
              ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'tasks' && (
        <div>
          {isAdmin && (
            <form onSubmit={handleCreateTask}
              className="bg-white rounded-xl p-5 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required placeholder="Task title" value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2" />
              <textarea placeholder="Description" value={newTask.description}
                onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2 h-16 resize-none" />
              <select value={newTask.priority}
                onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {priorityOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={newTask.assigneeId}
                onChange={e => setNewTask(p => ({ ...p, assigneeId: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Unassigned</option>
                {project.members.map(m => (
                  <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                ))}
              </select>
              <input type="date" value={newTask.dueDate}
                onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit"
                className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                Add Task
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statusOptions.map(status => (
              <div key={status} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-600">
                    {status.replace('_', ' ')}
                  </span>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                    {tasksByStatus[status].length}
                  </span>
                </div>
                <div className="p-3 space-y-2 min-h-24">
                  {tasksByStatus[status].map(task => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-gray-800 leading-snug">
                          {task.title}
                        </p>
                        {(isAdmin || task.creatorId === user?.id) && (
                          <button onClick={() => handleDeleteTask(task.id)}
                            className="text-gray-300 hover:text-red-400 text-xs ml-2">
                            x
                          </button>
                        )}
                      </div>
                      {task.assignee && (
                        <p className="text-xs text-gray-400 mb-2">{task.assignee.name}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-gray-400 mb-2">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      <select value={task.status}
                        onChange={e => handleStatusChange(task.id, e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded px-2 py-1 outline-none bg-white">
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {project.members.map(m => (
            <div key={m.id}
              className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-gray-800 text-sm">{m.user.name}</p>
                <p className="text-xs text-gray-400">{m.user.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${m.role === 'ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                {m.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'invite' && isAdmin && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md">
          <h2 className="font-semibold text-gray-700 mb-4">Invite a Member</h2>
          <form onSubmit={handleInvite} className="space-y-3">
            <input type="email" required placeholder="Their email address" value={invite.email}
              onChange={e => setInvite(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={invite.role}
              onChange={e => setInvite(p => ({ ...p, role: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Send Invite
            </button>
          </form>
        </div>
      )}
    </div>
  );
}