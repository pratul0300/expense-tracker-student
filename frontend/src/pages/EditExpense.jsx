import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm.jsx';
import { fetchExpense, updateExpense } from '../services/api.js';
import { readableApiError } from '../utils/readableApiError.js';

export default function EditExpense() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initial, setInitial] = useState(null);

  const numericId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchExpense(numericId);
        if (!alive) return;
        setInitial({
          title: data.title,
          amount: String(data.amount),
          category: String(data.category),
          date: String(data.date),
          description: data.description ?? '',
        });
      } catch (e) {
        if (!alive) return;
        setError(readableApiError(e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [numericId]);

  return (
    <div className="page">
      <div className="section-title">
        <h2 style={{ margin: 0, fontSize: 18 }}>Edit expense</h2>
        <button type="button" className="btn secondary" onClick={() => nav(-1)}>
          Back
        </button>
      </div>

      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}

      {!loading && initial ? (
        <ExpenseForm
          initialValues={initial}
          submitLabel="Save changes"
          onSubmit={async (payload) => {
            setError(null);
            try {
              await updateExpense(numericId, payload);
              nav('/expenses', { state: { justSaved: true } });
            } catch (e) {
              setError(readableApiError(e));
            }
          }}
        />
      ) : null}
    </div>
  );
}
