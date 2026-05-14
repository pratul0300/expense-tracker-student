import React from 'react';
import { Link } from 'react-router-dom';

function money(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function ExpenseTable({ rows, loading, error, onDelete }) {
  return (
    <div className="card">
      <div className="section-title">
        <h2>Your expenses</h2>
        <span className="muted">{loading ? 'Loading…' : `${rows.length} shown`}</span>
      </div>

      {error ? <div className="error">{String(error)}</div> : null}

      {!error && rows.length === 0 && !loading ? (
        <div className="muted">
          Nothing matches these filters—or you have not added any expenses yet.
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 800 }}>{r.title}</div>
                  </td>
                  <td>{r.categoryDisplayName ?? r.category}</td>
                  <td>{money(r.amount)}</td>
                  <td>{String(r.date)}</td>
                  <td className="muted">{r.description ? r.description : '—'}</td>
                  <td>
                    <div className="row-actions">
                      <Link className="btn secondary" to={`/expenses/${r.id}/edit`}>
                        Edit
                      </Link>
                      <button className="btn danger" type="button" onClick={() => onDelete?.(r.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
