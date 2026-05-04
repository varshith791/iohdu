'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'ADMIN') router.push('/');
    fetchData();
  }, [router]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    
    try {
      const [tRes, mRes, aRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance`, { headers })
      ]);
      
      if (tRes.ok) setTasks(await tRes.json());
      if (mRes.ok) setMembers(await mRes.json());
      if (aRes.ok) setAttendance(await aRes.json());
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  const createTask = async () => {
    if (!newTitle || !assignedTo) return alert('Title and Member are required');
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: newDesc, assigned_to: assignedTo, deadline })
    });
    setNewTitle(''); setNewDesc(''); setAssignedTo(''); setDeadline('');
    fetchData();
  };

  const deleteTask = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-end border-b border-border pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Ethara <span className="font-light text-foreground/50">—</span> Console</h1>
            <p className="text-muted-foreground font-medium">Control & Monitoring Center</p>
          </div>
          <button onClick={handleLogout} className="bg-secondary text-primary px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
            Sign Out
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card border border-border p-8 rounded-[2rem] space-y-2 shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Tasks</p>
            <p className="text-4xl font-extrabold text-primary">{tasks.length}</p>
          </div>
          <div className="bg-card border border-border p-8 rounded-[2rem] space-y-2 shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Completed</p>
            <p className="text-4xl font-extrabold text-green-500">{tasks.filter((t: any) => t.status === 'COMPLETED').length}</p>
          </div>
          <div className="bg-card border border-border p-8 rounded-[2rem] space-y-2 shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">In Progress</p>
            <p className="text-4xl font-extrabold text-accent">{tasks.filter((t: any) => t.status === 'IN_PROGRESS').length}</p>
          </div>
          <div className="bg-card border border-border p-8 rounded-[2rem] space-y-2 shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Members</p>
            <p className="text-4xl font-extrabold text-primary">{members.length}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Assign New Task</h2>
            <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl space-y-4">
              <div className="space-y-4">
                <input placeholder="Task Title" className="w-full bg-secondary p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <textarea placeholder="Description" className="w-full bg-secondary p-4 rounded-2xl outline-none h-32 focus:ring-2 focus:ring-primary/20 transition-all" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                <select className="w-full bg-secondary p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                  <option value="">Select Member</option>
                  {Array.isArray(members) && members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <input type="date" className="w-full bg-secondary p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
              <button onClick={createTask} className="w-full bg-primary text-primary-foreground p-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Create Task
              </button>
            </div>
          </section>

          <section className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Task Monitoring</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {Array.isArray(tasks) && tasks.map((task: any) => (
                <div key={task.id} className="bg-card border border-border p-6 rounded-[2rem] shadow-sm flex justify-between items-center group hover:border-primary/30 transition-all">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold">{task.title}</h4>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground font-medium">Assigned to: <span className="text-foreground">{task.assignedTo?.name || 'Unassigned'}</span></p>
                      <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 bg-destructive/10 text-destructive p-3 rounded-xl hover:bg-destructive hover:text-white transition-all font-bold text-sm px-5">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Attendance Logs</h2>
          <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-8 py-5 font-black">Member</th>
                    <th className="px-8 py-5 font-black">Login</th>
                    <th className="px-8 py-5 font-black">Logout</th>
                    <th className="px-8 py-5 font-black">Duration (Hrs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Array.isArray(attendance) && attendance.map((log: any) => (
                    <tr key={log.id} className="hover:bg-secondary/30 transition-all">
                      <td className="px-8 py-6 font-bold">{log.user?.name}</td>
                      <td className="px-8 py-6 text-sm text-muted-foreground">{new Date(log.login_time).toLocaleString()}</td>
                      <td className="px-8 py-6 text-sm text-muted-foreground">{log.logout_time ? new Date(log.logout_time).toLocaleString() : <span className="text-green-500 font-bold">Active</span>}</td>
                      <td className="px-8 py-6 font-black text-primary">{log.total_hours?.toFixed(2) || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
