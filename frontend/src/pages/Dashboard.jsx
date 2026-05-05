import { useEffect, useState } from 'react';
import * as api from '../api';

const statusColors = {
  TODO:        { backgroundColor: '#f3f4f6', color: '#4b5563' },
  IN_PROGRESS: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  DONE:        { backgroundColor: '#dcfce7', color: '#15803d' },
};

const priorityColors = {
  LOW:    { backgroundColor: '#f1f5f9', color: '#475569' },
  MEDIUM: { backgroundColor: '#fef9c3', color: '#a16207' },
  HIGH:   { backgroundColor: '#fee2e2', color: '#dc2626' },
};

export default function Dashboard() {
  const [data,  setData]  = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDashboard()
      .then(r => setData(r.data))
      .catch(err => {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard');
      });
  }, []);

  if (error) return (
    <div style={{ padding: '2rem' }}>
      <p style={{ color: '#dc2626' }}>{error}</p>
    </div>
  );

  if (!data) return (
    <div style={{ padding: '2rem' }}>
      <p style={{ color: '#9ca3af' }}>Loading...</p>
    </div>
  );

  const stats = [
    { label: 'Total Assigned', value: data.total,             bg: '#2563eb' },
    { label: 'To Do',          value: data.todo.length,       bg: '#6b7280' },
    { label: 'In Progress',    value: data.inProgress.length, bg: '#6366f1' },
    { label: 'Done',           value: data.done.length,       bg: '#16a34a' },
    { label: 'Overdue',        value: data.overdue.length,    bg: '#dc2626' },
  ];

  const allTasks = [...data.overdue, ...data.inProgress, ...data.todo, ...data.done];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        My Dashboard
      </h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {stats.map(s => (
          <div key={s.label} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', minWidth: '120px' }}>
            <div style={{ width: '3rem', height: '3rem', backgroundColor: s.bg, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>{s.value}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {data.overdue.length > 0 && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: '600', color: '#b91c1c', marginBottom: '0.75rem' }}>Overdue Tasks</h2>
          {data.overdue.map(t => (
            <div key={t.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>{t.title}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.project.name}</p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                Due {new Date(t.dueDate).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontWeight: '600', color: '#374151' }}>All Assigned Tasks</h2>
        </div>
        {allTasks.length === 0 ? (
          <p style={{ padding: '1.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            No tasks assigned to you yet. Go to Projects to get started!
          </p>
        ) : (
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                {['Task', 'Project', 'Priority', 'Status', 'Due Date'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTasks.map(t => (
                <tr key={t.id} style={{ borderTop: '1px solid #f9fafb' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '500', color: '#1f2937' }}>{t.title}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{t.project.name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', ...priorityColors[t.priority] }}>
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', ...statusColors[t.status] }}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#9ca3af' }}>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}