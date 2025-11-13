import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadNotes, saveNotes, loadSelectedDate, saveSelectedDate, seedNotes } from '../utils/storage';
import { formatDateISO, todayISO } from '../utils/date';

// PUBLIC_INTERFACE
export const NotesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * NotesProvider provides application-wide state:
 * - notes: array of note objects
 * - selectedDate: YYYY-MM-DD string
 * - CRUD operations for notes
 * - search query state
 * It persists to localStorage. If REACT_APP_API_BASE is present, this file documents
 * where to add network calls later.
 */
export function NotesProvider({ children }) {
  const isDebug = (process.env.REACT_APP_NODE_ENV || '').toLowerCase() === 'development';

  const [notes, setNotes] = useState(() => loadNotes() ?? seedNotes());
  const [selectedDate, setSelectedDate] = useState(() => loadSelectedDate() ?? todayISO());
  const [search, setSearch] = useState('');

  // Persist on changes
  useEffect(() => {
    saveNotes(notes);
    if (isDebug) console.debug('[Notes] persisted', notes.length);
  }, [notes, isDebug]);

  useEffect(() => {
    saveSelectedDate(selectedDate);
  }, [selectedDate]);

  const apiBase = process.env.REACT_APP_API_BASE || '';

  // Placeholder for future API integration
  const maybeCallApi = async (path, method = 'GET', body) => {
    if (!apiBase) return null; // Local mode
    try {
      const res = await fetch(`${apiBase}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      return await res.json();
    } catch (e) {
      if (isDebug) console.warn('API call failed, falling back to localStorage mode.', e);
      return null;
    }
  };

  // PUBLIC_INTERFACE
  const createNote = useCallback((payload) => {
    const now = new Date().toISOString();
    const note = {
      id: crypto.randomUUID(),
      title: payload.title || 'Untitled note',
      content: payload.content || '',
      date: payload.date ? formatDateISO(payload.date) : selectedDate,
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      createdAt: now,
      updatedAt: now
    };
    setNotes(prev => [note, ...prev]);
    // For future API: maybeCallApi('/notes','POST',note)
    return note;
  }, [selectedDate]);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((id, updater) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === id);
      if (idx === -1) return prev;
      const patch = typeof updater === 'function' ? updater(prev[idx]) : updater;
      const updated = { ...prev[idx], ...patch, updatedAt: new Date().toISOString() };
      const next = [...prev];
      next[idx] = updated;
      // For future API: maybeCallApi(`/notes/${id}`,'PUT',updated)
      return next;
    });
  }, []);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id);
      // For future API: maybeCallApi(`/notes/${id}`,'DELETE')
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    notes,
    createNote,
    updateNote,
    deleteNote,
    selectedDate,
    setSelectedDate,
    search,
    setSearch
  }), [notes, createNote, updateNote, deleteNote, selectedDate, search]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Convenience hook for the Notes context. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
