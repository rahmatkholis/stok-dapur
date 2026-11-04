import { getUserData, readBatchLedger, roundStockQuantity } from './store.js';

// A read-only presentation of existing records. Never creates a second transaction.
function readStockMovements(username, productId) {
  const ledger = readBatchLedger(username, productId);
  if (!ledger) return null;
  const data = getUserData(username);
  const eventsById = new Map(ledger.events.map(event => [event.id, event]));
  const original = ledger.origin;
  const origin = {
    id: `origin:${productId}`, action: 'received', source: original.kind === 'purchase' ? 'Belanja' : original.kind === 'manual' ? 'Inventori' : 'Asal belum diketahui',
    title: original.title || (original.kind === 'manual' ? 'Stok awal' : original.kind === 'purchase' ? 'Penerimaan belanja' : 'Catatan stok lama'),
    date: original.date, recordedAt: original.recordedAt, delta: original.quantity,
    before: original.quantity === null ? null : 0, after: original.quantity,
    shoppingActivityId: original.shoppingActivityId
  };
  // activityLog is saved newest-first. Physical corrections apply in recording order,
  // including activities entered later with a past occurrence date.
  const movements = [...data.activityLog].reverse().filter(entry => eventsById.has(entry.id)).map(entry => {
    const event = eventsById.get(entry.id);
    return { ...event, source: entry.action === 'adjusted' ? 'Koreksi' : 'Aktivitas',
      affectsStock: !entry.cancelledAt || data.activityLog.some(reversal => reversal.reversalOf === entry.id) };
  });
  let running = original.quantity;
  let reliable = Number.isFinite(running) && ledger.summary.consistent === true;
  for (const event of movements) {
    const storedBefore = event.action === 'adjusted' && Number.isFinite(event.delta) && Number.isFinite(event.before) ? event.before : null;
    const storedAfter = event.action === 'adjusted' && Number.isFinite(event.delta) && Number.isFinite(event.after) ? event.after : null;
    event.explicitBefore = storedBefore; event.explicitAfter = storedAfter;
    if (!event.affectsStock) { event.before = null; event.after = null; continue; }
    if (!Number.isFinite(event.delta) || !Number.isFinite(running)) {
      reliable = false; running = null; event.before = null; event.after = null; continue;
    }
    if (storedBefore !== null && roundStockQuantity(running) !== storedBefore) reliable = false;
    event.before = running;
    running = roundStockQuantity(running + event.delta);
    event.after = running;
    if (running < 0 || (storedAfter !== null && storedAfter !== running)) reliable = false;
  }
  if (running !== ledger.product.quantity) reliable = false;
  if (!reliable) for (const event of movements) {
    // Only an adjustment stores its own before/after. Do not invent historic balances.
    event.before = event.explicitBefore; event.after = event.explicitAfter;
  }
  // Opening stock is the balance anchor, not a movement card. A receipt is an
  // actual incoming transaction and remains linked to its shopping record.
  return { ...ledger, balancesKnown: reliable, movements: [...(original.kind === 'purchase' ? [origin] : []), ...movements].reverse() };
}
export { readStockMovements };
