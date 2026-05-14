import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseTable from '../components/ExpenseTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { deleteExpense, downloadExpenseCsv, fetchExpenses } from '../services/api.js';

export default function Expenses() {
  const nav = useNavigate();
  const d = new Date();
  const [year, setYear] = useState(String(d.getFullYear()));
  const [month, setMonth] = useState('');
  const [category, setCategory] = useState('');

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError(e?.response?.data?.message ?? e?.message ?? String(e));
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
    // eslint-disable-next-line no-alert
    const ok = window.confirm(`Delete expense #${id}?`);
    if (!ok) return;
    try {
      await deleteExpense(id);
      await reload();
    } catch (e) {
      setError(e?.response?.data?.message ?? e?.message ?? String(e));
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
            Export CSV
          </button>
        </div>
      </div>

      <FilterBar title="List filters" year={year} month={month} category={category} onChange={onFilter} />

      <ExpenseTable rows={rows} loading={loading} error={error} onDelete={onDelete} />
    </div>
  );
}
