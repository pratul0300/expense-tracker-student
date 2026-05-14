import React from 'react';
import { NavLink, Route, Routes, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Expenses from './pages/Expenses.jsx';
import AddExpense from './pages/AddExpense.jsx';
import EditExpense from './pages/EditExpense.jsx';

function Shell() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <strong>Student Expense Tracker</strong>
          <span>See what you spent, by category and month</span>
        </div>
        <nav className="nav" aria-label="Primary">
          <NavLink end className={({ isActive }) => `nav-link${isActive ? ' primary' : ''}`} to="/">
            Dashboard
          </NavLink>
          <NavLink end className={({ isActive }) => `nav-link${isActive ? ' primary' : ''}`} to="/expenses">
            Expenses
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? ' primary' : ''}`} to="/expenses/new">
            Add expense
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/new" element={<AddExpense />} />
        <Route path="expenses/:id/edit" element={<EditExpense />} />
      </Route>
      <Route
        path="*"
        element={
          <div className="card error" style={{ margin: 16 }}>
            Page not found. Use the menu above to go back.
          </div>
        }
      />
    </Routes>
  );
}
