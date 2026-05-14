import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpenseTable from '../components/ExpenseTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { deleteExpense, downloadExpenseCsv, fetchExpenses } from '../services/api.js';
import { readableApiError } from '../utils/readableApiError.js';

export default function Expenses() {
  const nav = useNavigate();
  const location = useLocation();
  const d = new Date();
  const [year, setYear] = useState(String(d.getFullYear()));
  const [month, setMonth] = useState('');
  const [category, setCategory] = useState('');

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState(null);

  React.useEffect(() => {
    if (location.state?.justAdded || location.state?.justSaved) {
      setBanner(location.state.justAdded ? 'Expense saved.' : 'Changes saved.');
      nav(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, nav]);

  const qp = React.useMemo(() => {
    return {
      year: year.trim() === '' ? undefined : Number(year),
      month: month === '' ? undefined : Number(month),
      category: category || undefined,
    };
  }, [year, month, category]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses(qp);
      setRows(data ?? []);
    } catch (e) {
      setError(readableApiError(e));
    } finally {
      setLoading(false);
    }
  }, [qp]);

  useEffect(() => {
    reload();
  }, [reload]);

  function onFilter({ field, value }) {
    if (field === 'year') setYear(value);
    if (field === 'month') setMonth(value === '' ? '' : String(Number(value)));
    if (field === 'category') setCategory(value ?? '');
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this expense? This cannot be undone.');
    if (!ok) return;
    try {
      await deleteExpense(id);
      await reload();
      setBanner('Expense deleted.');
    } catch (e) {
      setError(readableApiError(e));
    }
  }

  return (
    <div className="page">
      <div className="section-title">
        <h2 style={{ margin: 0, fontSize: 18 }}>All expenses</h2>
        <div className="row-actions">
          <button type="button" className="btn secondary" onClick={() => nav('/expenses/new')}>
            Add expense
          </button>
          <button type="button" className="btn" onClick={() => downloadExpenseCsv(qp)}>
            Download spreadsheet (CSV)
          </button>
        </div>
      </div>

      {banner ? (
        <div
          className="card"
          style={{
            borderColor: 'rgba(56, 189, 248, 0.45)',
            background: 'rgba(56, 189, 248, 0.08)',
            padding: 12,
            fontSize: 14,
          }}
        >
          {banner}{' '}
          <button type="button" className="btn secondary" style={{ marginLeft: 8 }} onClick={() => setBanner(null)}>
            Dismiss
          </button>
        </div>
      ) : null}

      <FilterBar
        title="Filters"
        subtitle="Year narrows results; leave month blank to include the whole year. Category is optional."
        year={year}
        month={month}
        category={category}
        onChange={onFilter}
      />

      <ExpenseTable rows={rows} loading={loading} error={error} onDelete={onDelete} />
    </div>
  );
}
