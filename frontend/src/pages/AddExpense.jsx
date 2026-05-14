import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm.jsx';
import { createExpense } from '../services/api.js';
import { readableApiError } from '../utils/readableApiError.js';

export default function AddExpense() {
  const nav = useNavigate();
  const [error, setError] = useState(null);

  return (
    <div className="page">
      <div className="section-title">
        <h2 style={{ margin: 0, fontSize: 18 }}>Add expense</h2>
        <button type="button" className="btn secondary" onClick={() => nav(-1)}>
          Back
        </button>
      </div>

      <p className="muted" style={{ marginTop: 0 }}>
        Fill in the amount and date you paid. Everything saves to your expense list when you tap Save.
      </p>

      {error ? <div className="error">{error}</div> : null}

      <ExpenseForm
        submitLabel="Save expense"
        onSubmit={async (payload) => {
          setError(null);
          try {
            await createExpense(payload);
            nav('/expenses', { state: { justAdded: true } });
          } catch (e) {
            setError(readableApiError(e));
          }
        }}
      />
    </div>
  );
}
