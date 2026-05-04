'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      
      <div className="max-w-4xl w-full space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide mb-4">
            v2.0 Now Live
          </div>
          <h1 className="text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
            Ethara <span className="font-light text-foreground/80">—</span> Platform
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            The next-generation workspace for elite teams. <br/>
            Sleek, fast, and engineered for high-performance collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Portal Card */}
          <button 
            onClick={() => router.push('/login/admin')}
            className="group relative bg-card border border-border p-12 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all text-left space-y-6 overflow-hidden"
          >
            <div className="bg-primary text-primary-foreground w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
              A
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Admin Portal</h2>
              <p className="text-muted-foreground leading-relaxed">
                Complete control center. Manage members, assign high-impact tasks, and monitor team performance.
              </p>
            </div>
            <div className="pt-4 flex items-center font-bold text-primary gap-2 text-lg">
              Launch Console <span className="transition-transform group-hover:translate-x-2">→</span>
            </div>
            {/* Hover Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
          </button>

          {/* Member Portal Card */}
          <button 
            onClick={() => router.push('/login/member')}
            className="group relative bg-card border border-border p-12 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-accent/50 transition-all text-left space-y-6 overflow-hidden"
          >
            <div className="bg-secondary text-primary w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl transition-all group-hover:scale-110 group-hover:-rotate-3 shadow-sm">
              M
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Member Portal</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your personal workspace. Focus on execution, track your contributions, and collaborate seamlessly.
              </p>
            </div>
            <div className="pt-4 flex items-center font-bold text-foreground gap-2 text-lg">
              Open Workspace <span className="transition-transform group-hover:translate-x-2">→</span>
            </div>
            {/* Hover Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
          </button>
        </div>

        <div className="text-center space-y-4">
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />
          <p className="text-muted-foreground/60 text-sm font-medium tracking-widest uppercase">
            Designed for Excellence • Premium Build
          </p>
        </div>
      </div>
    </main>
  );
}
