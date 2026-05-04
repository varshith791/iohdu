'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.id) {
      router.push('/');
      return;
    }
    setUser(storedUser);
    setName(storedUser.name);
    setEmail(storedUser.email);
  }, [router]);

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    const userId = user.id;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
        setUser(updatedUser);
      } else {
        alert('Update failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="border-b border-border pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-primary">TaskHub <span className="font-light text-foreground/50">—</span> Profile</h1>
            <p className="text-muted-foreground font-medium">Manage your account details</p>
          </div>
        </header>

        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl space-y-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <button
            onClick={updateProfile}
            className="w-full bg-primary text-primary-foreground p-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Update Profile
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/dashboard/member')}
            className="bg-secondary text-primary px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}