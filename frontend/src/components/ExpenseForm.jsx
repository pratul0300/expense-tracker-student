import React, { useMemo, useState } from 'react';
import { EXPENSE_CATEGORY_OPTIONS } from '../services/api.js';

export default function ExpenseForm({ initialValues = {}, submitLabel = 'Save', onSubmit }) {
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

  React.useEffect(() => {
    setForm(defaults);
  }, [defaults]);

  function patch(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      description: form.description.trim() === '' ? null : form.description.trim(),
    };
    await onSubmit?.(payload);
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="section-title">
        <h2>{submitLabel}</h2>
      </div>

      <label>
        Title
        <input value={form.title} onChange={(e) => patch('title', e.target.value)} required maxLength={200} />
      </label>

      <label>
        Amount (USD)
        <input value={form.amount} onChange={(e) => patch('amount', e.target.value)} required min={0.01} step={0.01} type="number" />
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
        Description (optional)
        <textarea value={form.description} onChange={(e) => patch('description', e.target.value)} maxLength={2000} />
      </label>

      <button className="btn" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
