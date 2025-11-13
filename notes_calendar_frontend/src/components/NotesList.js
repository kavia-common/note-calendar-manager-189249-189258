import React from 'react';

// PUBLIC_INTERFACE
export default function NotesList({ notes, activeNoteId, onSelectNote }) {
  /** Shows a list of notes for the selected date. */
  const isLoadingInitial = notes.length === 0; // heuristic for initial/sparse; purely visual

  return (
    <div className="notes-list" role="region" aria-label="Notes list">
      <div className="nc-panel-header">
        <div style={{ fontWeight: 700 }}>Notes ({notes.length})</div>
      </div>
      <div className="notes-list-body">
        {isLoadingInitial ? (
          <>
            <div className="skeleton-card shimmer" aria-hidden="true" />
            <div className="skeleton-card shimmer" aria-hidden="true" />
            <div className="skeleton-card shimmer" aria-hidden="true" />
            <div className="nc-empty">No notes for this date. Create one with “+ New Note”.</div>
          </>
        ) : (
          notes.map(n => (
            <button
              key={n.id}
              className={`note-card list-animate-enter list-animate-enter-active ${n.id === activeNoteId ? 'active' : ''}`}
              onClick={() => onSelectNote?.(n.id)}
              aria-label={`Open note ${n.title || 'Untitled note'}`}
            >
              <div className="note-title">{n.title || 'Untitled note'}</div>
              <div className="note-snippet">{(n.content || '').slice(0, 120) || 'No content yet.'}</div>
              <div className="note-meta">
                <span>{new Date(n.updatedAt).toLocaleString()}</span>
                <span>{(n.tags || []).slice(0, 2).map(t => `#${t}`).join(' ')}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
