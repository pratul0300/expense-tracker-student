import React from 'react';

const MONTHS = [
  ['1', 'Jan'],
  ['2', 'Feb'],
  ['3', 'Mar'],
  ['4', 'Apr'],
  ['5', 'May'],
  ['6', 'Jun'],
  ['7', 'Jul'],
  ['8', 'Aug'],
  ['9', 'Sep'],
  ['10', 'Oct'],
  ['11', 'Nov'],
  ['12', 'Dec'],
];

export default function FilterBar({
  title = 'Filters',
  subtitle,
  year,
  month,
  category,
  onChange,
  showCategory = true,
  showYearMonth = true,
  monthAllowAll = true,
}) {
  return (
    <div className="card">
      <div className="section-title">
        <h2>{title}</h2>
        {subtitle ? <span className="muted">{subtitle}</span> : null}
      </div>
      <div className="filter-bar">
        {showYearMonth ? (
          <>
            <label>
              Year
              <input
                inputMode="numeric"
                pattern="\\d{4}"
                placeholder="e.g. 2026"
                value={year ?? ''}
                onChange={(e) => onChange?.({ field: 'year', value: e.target.value })}
              />
            </label>
            <label>
              Month
              <select
                value={month ?? ''}
                onChange={(e) =>
                  onChange?.({ field: 'month', value: e.target.value === '' ? '' : Number(e.target.value) })
                }
              >
                {monthAllowAll ? <option value="">Any month</option> : null}
                {MONTHS.map(([val, lab]) => (
                  <option key={val} value={val}>
                    {lab}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}
        {showCategory ? (
          <label>
            Category
            <select
              value={category ?? ''}
              onChange={(e) => onChange?.({ field: 'category', value: e.target.value })}
            >
              <option value="">All categories</option>
              <option value="FOOD">Food & groceries</option>
              <option value="TRAVEL">Travel & transit</option>
              <option value="SHOPPING">Shopping & supplies</option>
              <option value="BILLS">Bills & rent</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}
