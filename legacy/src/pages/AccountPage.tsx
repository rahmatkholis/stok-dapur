import { useState } from 'react';
import { getProfile, updateProfile, updatePassword } from '../store';

const pjs: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans, sans-serif' };
const shadow = '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)';

const AVATAR_COLORS = ['#E57034', '#2BBFA3', '#7C3AED', '#0369A1', '#D97706', '#15803D'];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1.5px solid var(--border)',
  background: 'var(--muted)',
  color: 'var(--foreground)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
};

interface Props {
  username: string;
  onLogout: () => void;
}

type SubView = 'profile' | 'password' | null;

export default function AccountPage({ username, onLogout }: Props) {
  const profile = getProfile(username);
  const [subView, setSubView] = useState<SubView>(null);
  const [currentDisplayName, setCurrentDisplayName] = useState(profile.displayName);

  const initials = (currentDisplayName || username).slice(0, 2).toUpperCase();
  const color = avatarColor(username);

  if (subView === 'profile') {
    return (
      <ProfileSubPage
        username={username}
        initialName={currentDisplayName}
        email={profile.email || ''}
        onBack={(saved) => {
          if (saved) setCurrentDisplayName(getProfile(username).displayName);
          setSubView(null);
        }}
      />
    );
  }

  if (subView === 'password') {
    return (
      <PasswordSubPage
        username={username}
        onBack={() => setSubView(null)}
      />
    );
  }

  return (
    <div className="pb-28 pt-6 px-4 max-w-[480px] mx-auto">
      {/* Profile highlight */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4 mb-6"
        style={{ background: 'var(--card)', boxShadow: shadow }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shrink-0"
          style={{ background: color, color: '#fff', ...pjs }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-black text-base truncate" style={{ color: 'var(--foreground)', ...pjs }}>{currentDisplayName || username}</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--muted-foreground)', ...pjs }}>@{username}</p>
          {profile.email && (
            <p className="text-xs mt-0.5 font-medium truncate" style={{ color: 'var(--muted-foreground)', ...pjs }}>{profile.email}</p>
          )}
        </div>
      </div>

      {/* Settings menu */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--card)', boxShadow: shadow }}>
        <p className="px-5 pt-4 pb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', ...pjs }}>Pengaturan</p>
        <MenuItem
          icon="👤"
          label="Pengaturan Profil"
          sub="Ubah nama tampilan"
          onClick={() => setSubView('profile')}
        />
        <div className="h-px mx-5" style={{ background: 'var(--border)' }} />
        <MenuItem
          icon="🔒"
          label="Ubah Kata Sandi"
          sub="Ganti kata sandi akun"
          onClick={() => setSubView('password')}
        />
      </div>

      {/* Logout */}
      <button
        onClick={() => { if (confirm('Yakin ingin keluar?')) onLogout(); }}
        className="w-full py-3.5 rounded-2xl font-black text-sm mt-2"
        style={{ background: '#FEF2F2', color: '#EF4444', ...pjs }}
      >
        Keluar
      </button>
    </div>
  );
}

function MenuItem({ icon, label, sub, onClick }: { icon: string; label: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-5 py-4 flex items-center gap-4 transition-colors active:bg-[var(--muted)] text-left"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: 'var(--muted)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: 'var(--foreground)', ...pjs }}>{label}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted-foreground)', ...pjs }}>{sub}</p>
      </div>
      <span className="text-base" style={{ color: 'var(--muted-foreground)' }}>›</span>
    </button>
  );
}

function ProfileSubPage({ username, initialName, email, onBack }: {
  username: string; initialName: string; email: string; onBack: (saved: boolean) => void;
}) {
  const [displayName, setDisplayName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const isDirty = displayName.trim() !== initialName;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setError('Nama tidak boleh kosong.'); return; }
    setSaving(true); setError(''); setSuccess('');
    await new Promise(r => setTimeout(r, 300));
    const err = updateProfile(username, displayName.trim());
    setSaving(false);
    if (err) { setError(err); } else {
      setSuccess('Nama berhasil disimpan.');
      setTimeout(() => onBack(true), 800);
    }
  }

  return (
    <SubPageShell title="Pengaturan Profil" onBack={() => onBack(false)}>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <Field label="Nama">
          <input
            type="text"
            value={displayName}
            onChange={e => { setDisplayName(e.target.value); setError(''); setSuccess(''); }}
            placeholder="Nama tampilan"
            style={inputStyle}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            readOnly
            placeholder="Tidak tersedia"
            style={{ ...inputStyle, opacity: 0.55, cursor: 'not-allowed' }}
          />
          <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--muted-foreground)', ...pjs }}>Email tidak dapat diubah</p>
        </Field>
        {error && <Msg type="error" text={error} />}
        {success && <Msg type="success" text={success} />}
        <SaveButton loading={saving} disabled={!isDirty} label="Simpan Perubahan" />
      </form>
    </SubPageShell>
  );
}

function PasswordSubPage({ username, onBack }: { username: string; onBack: () => void }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const isDirty = currentPw.length > 0 && newPw.length > 0 && confirmPw.length > 0;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) { setError('Semua field wajib diisi.'); return; }
    if (newPw.length < 6) { setError('Kata sandi baru minimal 6 karakter.'); return; }
    if (newPw !== confirmPw) { setError('Konfirmasi kata sandi tidak cocok.'); return; }
    setSaving(true); setError(''); setSuccess('');
    await new Promise(r => setTimeout(r, 300));
    const err = updatePassword(username, currentPw, newPw);
    setSaving(false);
    if (err) { setError(err); } else {
      setSuccess('Kata sandi berhasil diubah.');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => onBack(), 1000);
    }
  }

  return (
    <SubPageShell title="Ubah Kata Sandi" onBack={onBack}>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <Field label="Kata Sandi Saat Ini">
          <input type="password" value={currentPw} onChange={e => { setCurrentPw(e.target.value); setError(''); }} placeholder="••••••••" style={inputStyle} />
        </Field>
        <Field label="Kata Sandi Baru">
          <input type="password" value={newPw} onChange={e => { setNewPw(e.target.value); setError(''); }} placeholder="Min. 6 karakter" style={inputStyle} />
        </Field>
        <Field label="Konfirmasi Kata Sandi Baru">
          <input type="password" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setError(''); }} placeholder="Ulangi kata sandi baru" style={inputStyle} />
        </Field>
        {error && <Msg type="error" text={error} />}
        {success && <Msg type="success" text={success} />}
        <SaveButton loading={saving} disabled={!isDirty} label="Simpan Perubahan" />
      </form>
    </SubPageShell>
  );
}

function SubPageShell({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Sub-page header */}
      <div
        className="sticky top-0 z-30 px-4 pb-3.5 flex items-center gap-3"
        style={{
          background: 'var(--card)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0 transition-opacity active:opacity-60"
          style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
        >
          ‹
        </button>
        <span className="text-base font-black" style={{ color: 'var(--foreground)', ...pjs }}>{title}</span>
      </div>
      <div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto">
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)', ...pjs }}>{label}</label>
      {children}
    </div>
  );
}

function Msg({ type, text }: { type: 'error' | 'success'; text: string }) {
  return (
    <p
      className="text-sm px-3 py-2 rounded-xl font-semibold"
      style={{ background: type === 'error' ? '#FEE2E2' : '#D1FAE5', color: type === 'error' ? '#EF4444' : '#065F46', ...pjs }}
    >
      {text}
    </p>
  );
}

function SaveButton({ loading, disabled, label }: { loading: boolean; disabled: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full py-3 rounded-xl font-black text-sm transition-all"
      style={{
        background: disabled ? 'var(--border)' : 'var(--primary)',
        color: disabled ? 'var(--muted-foreground)' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...pjs,
      }}
    >
      {loading ? 'Menyimpan...' : label}
    </button>
  );
}
