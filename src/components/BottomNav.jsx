// Migrated from the audited v1 runtime; editable source, no runtime-bundle loading.
var Ur = [{
  id: `home`,
  label: `Beranda`,
  icon: `⌂`
}, {
  id: `inventory`,
  label: `Inventori`,
  icon: `▤`
}, {
  id: `shopping`,
  label: `Belanja`,
  icon: `◎`
}, {
  id: `recipes`,
  label: `Resep`,
  icon: `▣`
}, {
  id: `activity`,
  label: `Aktivitas`,
  icon: `✓`
}];
function BottomNav({
  current: current,
  onChange: onChange
}) {
  return <nav className={`fixed bottom-0 left-0 right-0 z-40 flex`} style={{
    background: `var(--card)`,
    boxShadow: `0 -2px 12px rgba(0,0,0,0.06)`,
    paddingBottom: `env(safe-area-inset-bottom, 0)`,
    maxWidth: 480,
    margin: `0 auto`
  }}>{Ur.map(n => {
      let r = n.id === current;
      return <button onClick={() => onChange(n.id)} className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative transition-all`} style={{
        color: r ? `var(--primary)` : `var(--muted-foreground)`
      }} key={n.id}>{[r && <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full`} style={{
          background: `var(--primary)`
        }} />, <span className={`text-xl leading-none`}>{n.icon}</span>, <span className={`text-[10px] font-bold tracking-wide`} style={{
          fontFamily: `Plus Jakarta Sans, sans-serif`
        }}>{n.label}</span>]}</button>;
    })}</nav>;
}
export { Ur, BottomNav };
