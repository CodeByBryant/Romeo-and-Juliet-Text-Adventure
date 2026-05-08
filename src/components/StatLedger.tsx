import type { InventoryItem } from '../types/game'

interface StatLedgerProps {
  fate: number
  luck: number
  turn: number
  inventory: InventoryItem[]
  nodeCount: number
}

function statPercent(value: number) {
  return ((value + 30) / 60) * 100
}

export function StatLedger({
  fate,
  luck,
  turn,
  inventory,
  nodeCount,
}: StatLedgerProps) {
  return (
    <section className="panel stat-ledger reveal">
      <h3>Story telemetry</h3>
      <dl>
        <div>
          <dt>Turn</dt>
          <dd>{turn}</dd>
        </div>
        <div>
          <dt>Node capacity</dt>
          <dd>{nodeCount}</dd>
        </div>
      </dl>

      <div className="meter-wrap">
        <label htmlFor="fate-meter">Fate axis: {fate}</label>
        <div id="fate-meter" className="meter">
          <span style={{ width: `${statPercent(fate)}%` }} />
        </div>
      </div>

      <div className="meter-wrap">
        <label htmlFor="luck-meter">Luck axis: {luck}</label>
        <div id="luck-meter" className="meter luck">
          <span style={{ width: `${statPercent(luck)}%` }} />
        </div>
      </div>

      <h4>Inventory flags</h4>
      <div className="inventory-grid">
        {inventory.length > 0 ? (
          inventory.map((item) => <span key={item}>{item}</span>)
        ) : (
          <span className="empty">No key artifacts yet.</span>
        )}
      </div>
    </section>
  )
}
