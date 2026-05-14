import React from 'react';

function money(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function SummaryCards({ year, month, totalAmount }) {
  return (
    <div className="grid-2">
      <div className="card metric">
        <div className="muted">Total spending</div>
        <div className="big">{money(totalAmount)}</div>
        <div className="muted">
          Window:{' '}
          <strong>
            {month}/{year}
          </strong>
        </div>
      </div>
      <div className="card metric">
        <div className="muted">Tip</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
          This total matches{' '}
          <code style={{ padding: '2px 6px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.14)' }}>
            GET /api/summary/monthly
          </code>
          . Filters are synced with expense list/export.
        </div>
      </div>
    </div>
  );
}
