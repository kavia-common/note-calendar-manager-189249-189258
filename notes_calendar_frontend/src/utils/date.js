export function pad2(n) {
  return String(n).padStart(2, '0');
}

// PUBLIC_INTERFACE
export function formatDateISO(input) {
  /** Accepts Date or string; returns YYYY-MM-DD */
  if (input instanceof Date) {
    return `${input.getFullYear()}-${pad2(input.getMonth() + 1)}-${pad2(input.getDate())}`;
  }
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (isNaN(d)) return todayISO();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// PUBLIC_INTERFACE
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// PUBLIC_INTERFACE
export function getMonthMatrix(year, month) {
  /**
   * Returns a 6x7 matrix for a calendar grid:
   * - month: 0-11
   * Each cell: { date: Date, inCurrentMonth: boolean }
   */
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 Sun - 6 Sat
  // Start from Sunday of the first week containing the 1st
  const startDate = new Date(year, month, 1 - startDay);
  const matrix = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + (w * 7 + d));
      row.push({
        date: cellDate,
        inCurrentMonth: cellDate.getMonth() === month
      });
    }
    matrix.push(row);
  }
  return matrix;
}
