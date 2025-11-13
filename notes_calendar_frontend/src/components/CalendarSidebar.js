import React, { useMemo, useState } from 'react';
import { getMonthMatrix, formatDateISO } from '../utils/date';

// PUBLIC_INTERFACE
export default function CalendarSidebar({ selectedDate, onSelectDate, notesByDate }) {
  /**
   * Renders a simple monthly grid calendar with navigation.
   * Visual polish: animated month grid container and improved button states.
   */
  const sel = selectedDate ? new Date(selectedDate) : new Date();
  const [cursor, setCursor] = useState(new Date(sel.getFullYear(), sel.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const matrix = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const nextMonth = () => setCursor(new Date(year, month + 1, 1));
  const prevMonth = () => setCursor(new Date(year, month - 1, 1));

  const monthName = cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="calendar">
      <div className="cal-header">
        <button
          className="nc-button transition-quick"
          onClick={prevMonth}
          aria-label="Previous month"
          title="Previous month"
        >
          ‹
        </button>
        <div style={{ fontWeight: 700 }}>{monthName}</div>
        <button
          className="nc-button transition-quick"
          onClick={nextMonth}
          aria-label="Next month"
          title="Next month"
        >
          ›
        </button>
      </div>

      {/* Animated month container – CSS handles enter/exit */}
      <div className="month-animate month-animate-enter month-animate-enter-active">
        <div className="cal-grid">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="cal-weekday">{d}</div>
          ))}

          {matrix.flat().map((cell, idx) => {
            const iso = formatDateISO(cell.date);
            const isSelected = iso === selectedDate;
            const count = notesByDate?.[iso] || 0;
            return (
              <button
                key={idx}
                className={`cal-cell ${cell.inCurrentMonth ? '' : 'outside'} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectDate?.(iso)}
                aria-label={`Select ${iso}${count ? ` (${count} notes)` : ''}`}
              >
                <div className="date">{cell.date.getDate()}</div>
                {count > 0 && <div className="badge">{count}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
