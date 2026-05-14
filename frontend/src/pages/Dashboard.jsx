import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import {
  fetchCategoryBreakdown,
  fetchExpenses,
  fetchMonthlySummary,
} from '../services/api.js';
import { readableApiError } from '../utils/readableApiError.js';

function money(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function Dashboard() {
  const defaults = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }, []);

  const [year, setYear] = useState(defaults.year);
  const [month, setMonth] = useState(defaults.month);

  const [monthly, setMonthly] = useState(null);
  const [cats, setCats] = useState(null);
  const [recentRows, setRecentRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ym = useMemo(() => ({ year, month }), [year, month]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [m, c, ex] = await Promise.all([
        fetchMonthlySummary(ym),
        fetchCategoryBreakdown(ym),
        fetchExpenses({ year, month }),
      ]);
      setMonthly(m);
      setCats(c);
      setRecentRows((ex ?? []).slice(0, 10));
    } catch (e) {
      setError(readableApiError(e));
    } finally {
      setLoading(false);
    }
  }, [year, month, ym]);

  useEffect(() => {
    reload();
  }, [reload]);

  function onFilter({ field, value }) {
    if (field === 'year') {
      const ys = String(value ?? '').trim();
      setYear(ys === '' ? defaults.year : Number(ys));
    }
    if (field === 'month') {
      setMonth(Number(value ?? defaults.month));
    }
  }

  return (
    <div className="page">
      <div className="section-title">
        <h2 style={{ margin: 0, fontSize: 18 }}>Dashboard</h2>
      </div>
      {loading ? (
        <p className="muted" style={{ margin: '0 0 4px' }}>
          Updating your numbers…
        </p>
      ) : null}

      <FilterBar
        title="Month"
        subtitle="Choose a month to see spending totals, categories, and recent items."
        year={String(year)}
        month={String(month)}
        onChange={onFilter}
        showCategory={false}
        monthAllowAll={false}
      />

      {error ? <div className="error">{error}</div> : null}

      <SummaryCards
        year={monthly?.year ?? year}
        month={monthly?.month ?? month}
        totalAmount={monthly?.totalAmount ?? 0}
      />

      <CategoryChart categories={cats?.categories} />

      <div className="card">
        <div className="section-title">
          <h2>Recent expenses</h2>
          <span className="muted">Up to 10 for the month you selected</span>
        </div>
        {!loading && recentRows.length === 0 ? (
          <div className="muted">No expenses for this month yet. Add one from <strong>Add expense</strong>.</div>
        ) : null}
        <div className="recent-grid">
          {recentRows.map((r) => (
            <div key={r.id} className="recent-row">
              <div style={{ display: 'grid', gap: 6 }}>
                <strong>{r.title}</strong>
                <div className="muted">
                  {r.categoryDisplayName ?? r.category} · <span>{String(r.date)}</span>
                </div>
              </div>
              <div style={{ fontWeight: 900 }}>{money(r.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
