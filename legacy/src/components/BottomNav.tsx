import type { Page } from '../types';

interface Props {
  current: Page;
  onChange: (p: Page) => void;
}

const tabs: { id: Page; label: string; icon: string }[] = [
  { id: 'home',      label: 'Beranda',  icon: '⌂' },
  { id: 'inventory', label: 'Inventori', icon: '▤' },
  { id: 'shopping',  label: 'Belanja',  icon: '◎' },
  { id: 'use',       label: 'Pakai',    icon: '✓' },
  { id: 'account',   label: 'Akun',     icon: '◉' },
];

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: 'var(--card)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {tabs.map(tab => {
        const active = tab.id === current;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative transition-all"
            style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: 'var(--primary)' }} />
            )}
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[10px] font-bold tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
