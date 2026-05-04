'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'MEMBER') router.push('/');
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTasks(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchTasks();
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
      console.error(e);
    } finally {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-end border-b border-border pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Ethara <span className="font-light text-foreground/50">—</span> Workspace</h1>
            <p className="text-muted-foreground font-medium">Execution & Updates</p>
          </div>
          <button onClick={handleLogout} className="bg-secondary text-primary px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
            Sign Out
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border p-10 rounded-[2.5rem] space-y-2 shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Assigned Tasks</p>
            <p className="text-5xl font-black text-primary">{tasks.length}</p>
          </div>
          <div className="bg-card border border-border p-10 rounded-[2.5rem] space-y-2 shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">To Do</p>
            <p className="text-5xl font-black text-accent">{tasks.filter((t: any) => t.status !== 'COMPLETED').length}</p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Active Tasks</h2>
          <div className="grid grid-cols-1 gap-6">
            {!Array.isArray(tasks) || tasks.length === 0 ? (
              <div className="bg-secondary/50 rounded-[2rem] p-16 text-center text-muted-foreground border border-dashed border-border">
                No tasks assigned to you yet. Enjoy your day!
              </div>
            ) : (
              tasks.map((task: any) => (
                <div key={task.id} className="bg-card border border-border p-8 rounded-[2rem] shadow-sm space-y-6 hover:shadow-md transition-all border-l-4 border-l-primary">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold">{task.title}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed">{task.description}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    {task.status !== 'IN_PROGRESS' && task.status !== 'COMPLETED' && (
                      <button onClick={() => updateStatus(task.id, 'IN_PROGRESS')} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start Task
                      </button>
                    )}
                    {task.status !== 'COMPLETED' && (
                      <button onClick={() => updateStatus(task.id, 'COMPLETED')} className="bg-secondary text-primary px-8 py-3 rounded-xl text-sm font-bold border border-primary/20 hover:bg-primary hover:text-white transition-all">
                        Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
