import React from 'react';

function money(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function SummaryCards({ year, month, totalAmount }) {
  return (
    <div className="grid-2">
      <div className="card metric">
        <div className="muted">Total spending this month</div>
        <div className="big">{money(totalAmount)}</div>
        <div className="muted">
          <strong>
            {month}/{year}
          </strong>
        </div>
      </div>
      <div className="card metric">
        <div className="muted">At a glance</div>
        <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          This number is everything you logged for that month. Use{' '}
          <strong>Expenses</strong> to see the full list or add more items.
        </div>
      </div>
    </div>
  );
}
