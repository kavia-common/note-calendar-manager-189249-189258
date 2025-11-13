import React from 'react';

// PUBLIC_INTERFACE
export default function TopNav({ onNewNote, search, onSearch }) {
  /** Top navigation with brand and search. */
  return (
    <nav className="nc-topnav" role="navigation" aria-label="Top Navigation">
      <div className="nc-topnav-inner">
        <div className="nc-brand">
          <div className="nc-logo" aria-hidden="true" />
          <div className="nc-title">Notes + Calendar</div>
        </div>
        <div className="nc-actions">
          <input
            type="search"
            className="nc-search"
            value={search}
            onChange={e => onSearch?.(e.target.value)}
            placeholder="Search notes…"
            aria-label="Search notes"
          />
          <button className="nc-button transition-quick" onClick={onNewNote} aria-label="Create new note">
            + New Note
          </button>
        </div>
      </div>
    </nav>
  );
}
