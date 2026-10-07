import { useState } from 'react';
import { login, register } from '../store';

interface Props {
  onAuth: (username: string) => void;
}

export default function AuthPage({ onAuth }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 300));
    const err = mode === 'login'
      ? login(username.trim(), password)
      : register(username.trim(), password);
    setLoading(false);
    if (err) { setError(err); return; }
    onAuth(username.trim());
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8' }}>
      {/* Top decorative shapes */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: 'var(--primary)', opacity: 0.15 }} />
        <div className="absolute top-4 right-16 w-20 h-20 rounded-full" style={{ background: 'var(--accent)', opacity: 0.3 }} />
        <div className="absolute -top-4 left-8 w-28 h-28" style={{ background: 'var(--secondary)', opacity: 0.12, borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }} />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 pt-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'var(--primary)' }}>
            <span className="text-2xl">🍳</span>
          </div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Dapur</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Pantau stok, kurangi pemborosan</p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-5 pb-10">
        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
          {/* Tab switch */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'var(--muted)' }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: mode === m ? 'var(--primary)' : 'transparent',
                  color: mode === m ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {m === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="nama_pengguna"
                autoCapitalize="none"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--muted)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--foreground)',
                  fontFamily: 'DM Mono, monospace',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--muted)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ background: '#FEE2E2', color: '#EF4444' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat Akun'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
