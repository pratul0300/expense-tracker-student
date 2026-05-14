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
        <span className="muted">Optional filters match the APIs</span>
      </div>
      <div className="filter-bar">
        {showYearMonth ? (
          <>
            <label>
              Year
              <input
                inputMode="numeric"
                pattern="\\d{4}"
                placeholder="YYYY"
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
                {monthAllowAll ? <option value="">All months</option> : null}
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
