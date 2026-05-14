import React, { useMemo, useState } from 'react';
import { EXPENSE_CATEGORY_OPTIONS } from '../services/api.js';

/** Stable default so useMemo/useEffect deps do not change every render when initialValues is omitted. */
const EMPTY_INITIAL_VALUES = Object.freeze({});

export default function ExpenseForm({ initialValues = EMPTY_INITIAL_VALUES, submitLabel = 'Save', onSubmit }) {
  const defaults = useMemo(
    () => ({
      title: '',
      amount: '',
      category: 'FOOD',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      ...initialValues,
    }),
    [initialValues],
  );

  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setForm(defaults);
  }, [defaults]);

  function patch(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    const amountNum = Number(form.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      amount: amountNum,
      category: form.category,
      date: form.date,
      description: form.description.trim() === '' ? null : form.description.trim(),
    };

    setSaving(true);
    try {
      await onSubmit?.(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="section-title">
        <h2>{submitLabel}</h2>
      </div>

      <label>
        What did you spend on?
        <input value={form.title} onChange={(e) => patch('title', e.target.value)} required maxLength={200} />
      </label>

      <label>
        Amount (USD)
        <input
          value={form.amount}
          onChange={(e) => patch('amount', e.target.value)}
          required
          min={0.01}
          step={0.01}
          type="number"
          inputMode="decimal"
        />
      </label>

      <label>
        Category
        <select value={form.category} onChange={(e) => patch('category', e.target.value)} required>
          {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input value={form.date} onChange={(e) => patch('date', e.target.value)} required type="date" />
      </label>

      <label>
        Notes (optional)
        <textarea value={form.description} onChange={(e) => patch('description', e.target.value)} maxLength={2000} />
      </label>

      <button className="btn" type="submit" disabled={saving}>
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
