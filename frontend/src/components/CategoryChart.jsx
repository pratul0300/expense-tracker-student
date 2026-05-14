import React, { useMemo } from 'react';

function money(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function CategoryChart({ categories }) {
  const rows = categories ?? [];

  const max = useMemo(() => {
    return rows.reduce((m, r) => Math.max(m, Number(r.total ?? 0)), 0);
  }, [rows]);

  return (
    <div className="card">
      <div className="section-title">
        <h2>Category breakdown</h2>
        <span className="muted">Relative bar widths vs month max category</span>
      </div>
      <div className="chart">
        {rows.length === 0 ? <div className="muted">No data for selected range.</div> : null}
        {rows.map((r) => {
          const pct = max > 0 ? Math.round((Number(r.total) / max) * 1000) / 10 : 0;
          return (
            <div key={String(r.category)} className="chart-row">
              <div className="muted" title={String(r.category)}>
                {r.categoryDisplayName ?? r.category}
              </div>
              <div className="bar" aria-label={`${r.category}: ${pct}%`}>
                <div style={{ width: `${pct}%` }} />
              </div>
              <div style={{ fontWeight: 800 }}>{money(r.total)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
