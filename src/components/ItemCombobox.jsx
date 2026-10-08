import * as React from 'react';

function ItemCombobox({ items, value, onSelect, onAddItem, disabled, label, style }) {
  const id = React.useId();
  const inputRef = React.useRef(null);
  const selected = items.find(item => item.id === value);
  const [query, setQuery] = React.useState(selected?.name ?? '');
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  React.useEffect(() => { if (!open) setQuery(selected?.name ?? ''); }, [value, selected?.name, open]);
  React.useEffect(() => { if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView?.({ block: 'nearest' }); }, [active, open, id]);
  const available = items.filter(item => item.active || item.id === value);
  const names = new Map();
  available.forEach(item => {
    const key = item.name.trim().toLocaleLowerCase('id-ID');
    names.set(key, (names.get(key) ?? 0) + 1);
  });
  const options = available.filter(item => !query || item.name.toLocaleLowerCase('id-ID').includes(query.toLocaleLowerCase('id-ID')))
    .sort((a, b) => a.name.localeCompare(b.name, 'id-ID') || a.unit.localeCompare(b.unit, 'id-ID'));
  const choose = item => {
    onSelect(item.active ? item : null);
    setQuery(item.active ? item.name : '');
    setOpen(false);
    setActive(0);
    inputRef.current?.focus();
  };
  const close = () => { setOpen(false); setQuery(selected?.name ?? ''); };
  const toggle = () => {
    if (open) close();
    else { setQuery(''); setActive(0); setOpen(true); inputRef.current?.focus(); }
  };
  return <div className="item-combobox" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  }}>
    <div className="flex items-center justify-between gap-3 mb-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      {!disabled && onAddItem && <button type="button" onClick={() => onAddItem(query.trim())} className="text-xs font-bold shrink-0" style={{ color: 'var(--primary)' }}>Tambah Item Baru</button>}
    </div>
    <div className="item-combobox-control">
      <input ref={inputRef} id={id} role="combobox" aria-label={label} aria-expanded={open} aria-autocomplete="list"
        aria-controls={`${id}-options`} aria-activedescendant={open && options[active] ? `${id}-option-${active}` : undefined}
        autoComplete="off" disabled={disabled} value={query} placeholder="Pilih atau cari produk"
        style={{ ...style, paddingRight: 44 }}
        onFocus={() => { if (!disabled) { setOpen(true); setActive(0); } }}
        onChange={event => {
          setQuery(event.target.value); setOpen(true); setActive(0);
          if (value) onSelect(null);
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) { setQuery(''); setOpen(true); setActive(0); }
            else setActive(index => Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))));
          } else if (event.key === 'Enter' && open) {
            event.preventDefault();
            if (options[active]) choose(options[active]);
          } else if (event.key === 'Escape') {
            event.preventDefault(); close();
          }
        }} />
      <button type="button" disabled={disabled} tabIndex={-1} className="item-combobox-toggle" aria-label={`Buka pilihan ${label.toLowerCase()}`} aria-expanded={open}
        onMouseDown={event => event.preventDefault()} onClick={toggle}>⌄</button>
    </div>
    {open && !disabled && <div className="item-combobox-options" id={`${id}-options`} role="listbox" aria-label={`Pilihan ${label.toLowerCase()}`}>
      {options.length ? options.map((item, index) => <button type="button" role="option" id={`${id}-option-${index}`} key={item.id}
        aria-selected={item.id === value} disabled={!item.active} className={`item-combobox-option${index === active ? ' is-active' : ''}`}
        onMouseDown={event => event.preventDefault()} onMouseEnter={() => setActive(index)} onClick={() => choose(item)}>
        {item.name}{names.get(item.name.trim().toLocaleLowerCase('id-ID')) > 1 ? ` (${item.unit})` : ''}{item.active ? '' : ' · Diarsipkan'}
      </button>) : <p className="p-3 text-sm" role="status">Produk tidak ditemukan.</p>}
    </div>}
  </div>;
}

export { ItemCombobox };
