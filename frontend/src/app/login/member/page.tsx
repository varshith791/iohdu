'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function MemberLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    console.log("API URL:", API); // 🔍 DEBUG

    if (!API) {
      alert("API URL not configured");
      return;
    }

    // ✅ FIXED ENDPOINTS (Your backend uses /api prefix)
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    const body = isLogin
      ? { email, password }
      : { name, email, password, role: 'MEMBER' };

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Request failed");
        return;
      }

      if (data.token) {
        if (data.user.role !== 'MEMBER') {
          alert('Use Admin portal for admin login');
          return;
        }

        // ✅ STORE DATA
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ ATTENDANCE LOGIN
        await fetch(`${API}/api/attendance/login`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.token}`
          }
        });

        router.push('/dashboard/member');
      } else {
        alert(data.error || "Authentication failed");
      }

    } catch (error: any) {
      console.error(error);
      if (!API) {
        alert('Connection error: API URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel environment variables.');
      } else {
        alert(`Connection error: ${error.message || 'backend not reachable'}`);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-accent/5 pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            TaskHub Workspace
          </h1>
          <p className="text-muted-foreground font-medium">{isLogin ? 'Collaborate with your team' : 'Join your workspace'}</p>
        </div>

        <div className="bg-card border border-border shadow-2xl rounded-[2.5rem] p-10 space-y-8">
          <div className="space-y-6">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full bg-secondary border border-transparent rounded-2xl p-4 outline-none focus:border-accent/30 focus:ring-4 focus:ring-accent/5 transition-all font-medium"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Work Email</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full bg-secondary border border-transparent rounded-2xl p-4 outline-none focus:border-accent/30 focus:ring-4 focus:ring-accent/5 transition-all font-medium"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-secondary border border-transparent rounded-2xl p-4 outline-none focus:border-accent/30 focus:ring-4 focus:ring-accent/5 transition-all font-medium"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleAuth}
            className="w-full bg-accent text-white rounded-2xl py-4 font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isLogin ? 'Sign In to Workspace' : 'Join Platform'}
          </button>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground font-medium">
              {isLogin ? "No account yet? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-accent font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
            
            <button onClick={() => router.push('/')} className="w-full text-xs text-muted-foreground/60 font-bold hover:text-accent transition-all pt-4 border-t border-border/50 uppercase tracking-widest">
              ← Back to Platform
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}