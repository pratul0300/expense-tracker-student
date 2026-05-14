export const EXPENSES_CHANGED = 'student-expenses-changed';

export function notifyExpensesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EXPENSES_CHANGED));
  }
}
