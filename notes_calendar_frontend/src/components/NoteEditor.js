import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { formatDateISO } from '../utils/date';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, selectedDate, onNoNotes }) {
  /**
   * Editor for the currently active note. Autosaves on blur.
   */
  const { updateNote, deleteNote } = useNotes();
  const [local, setLocal] = useState(() => note || null);

  useEffect(() => {
    setLocal(note || null);
  }, [note?.id]); // switch note

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const tagsRef = useRef(null);

  const onBlurSave = () => {
    if (!local) return;
    const patch = {
      title: titleRef.current?.value || '',
      content: contentRef.current?.value || '',
      date: formatDateISO(local.date || selectedDate),
      tags: (tagsRef.current?.value || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };
    updateNote(local.id, patch);
  };

  const onDelete = () => {
    if (!local) return;
    deleteNote(local.id);
    onNoNotes?.();
  };

  const dateValue = useMemo(() => formatDateISO(local?.date || selectedDate), [local?.date, selectedDate]);

  return (
    <div className="editor" role="region" aria-label="Note editor">
      <div className="nc-panel-header">
        <div style={{ fontWeight: 700 }}>{local ? 'Edit Note' : 'No note selected'}</div>
        {local && (
          <div className="row">
            <button className="nc-button danger" onClick={onDelete} aria-label="Delete note">Delete</button>
          </div>
        )}
      </div>
      {local ? (
        <div className="editor-body">
          <input
            ref={titleRef}
            className="title-input"
            type="text"
            defaultValue={local.title}
            placeholder="Note title"
            onBlur={onBlurSave}
          />
          <textarea
            ref={contentRef}
            className="content-input"
            defaultValue={local.content}
            placeholder="Write your note…"
            onBlur={onBlurSave}
          />
          <div className="row">
            <label className="muted" htmlFor="date-input">Date</label>
            <input
              id="date-input"
              type="date"
              defaultValue={dateValue}
              onBlur={(e) => {
                updateNote(local.id, { date: formatDateISO(e.target.value) });
              }}
            />
            <span className="muted" style={{ marginLeft: 8 }}>
              Updated {new Date(local.updatedAt).toLocaleString()}
            </span>
          </div>
          <div className="row">
            <label className="muted" htmlFor="tags-input">Tags</label>
            <input
              id="tags-input"
              ref={tagsRef}
              type="text"
              defaultValue={(local.tags || []).join(', ')}
              placeholder="e.g. work, ideas"
              onBlur={onBlurSave}
              style={{ flex: 1 }}
            />
            {(local.tags || []).slice(0, 3).map(t => (
              <span key={t} className="tag">#{t}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="nc-empty">
          Select a note from the list or create a new one to begin.
        </div>
      )}
    </div>
  );
}
