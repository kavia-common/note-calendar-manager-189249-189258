import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './theme.css';
import { NotesProvider, useNotes } from './context/NotesContext';
import TopNav from './components/TopNav';
import CalendarSidebar from './components/CalendarSidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';

// PUBLIC_INTERFACE
function AppShell() {
  /**
   * The main application shell that renders the Ocean Professional layout:
   * - Top navigation bar
   * - Split view: left calendar sidebar, right notes area
   */
  const { selectedDate, setSelectedDate, createNote, notes, search, setSearch } = useNotes();
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Filter notes for selected date and search query
  const filteredNotes = useMemo(() => {
    const byDate = notes.filter(n => n.date === selectedDate);
    if (!search?.trim()) return byDate;
    const q = search.toLowerCase();
    return byDate.filter(n => (n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)));
  }, [notes, selectedDate, search]);

  // Select first note when date or list changes
  useEffect(() => {
    if (filteredNotes.length > 0) {
      setActiveNoteId(prev => {
        if (!prev) return filteredNotes[0].id;
        // ensure prev exists in filtered
        const stillExists = filteredNotes.some(n => n.id === prev);
        return stillExists ? prev : filteredNotes[0].id;
      });
    } else {
      setActiveNoteId(null);
    }
  }, [filteredNotes]);

  // Keyboard shortcut: Cmd/Ctrl+N to create a new note
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const newNote = createNote({
          title: 'Untitled note',
          content: '',
          date: selectedDate,
          tags: []
        });
        setActiveNoteId(newNote.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNote, selectedDate]);

  const activeNote = useMemo(() => filteredNotes.find(n => n.id === activeNoteId) || null, [filteredNotes, activeNoteId]);

  return (
    <div className="nc-app-root ocean-professional">
      <TopNav onNewNote={() => {
        const newNote = createNote({
          title: 'Untitled note',
          content: '',
          date: selectedDate,
          tags: []
        });
        setActiveNoteId(newNote.id);
      }} search={search} onSearch={setSearch} />
      <div className="nc-main">
        <aside className="nc-sidebar">
          <CalendarSidebar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            notesByDate={notes.reduce((acc, n) => {
              acc[n.date] = (acc[n.date] || 0) + 1;
              return acc;
            }, {})}
          />
        </aside>
        <section className="nc-content">
          <div className="nc-panel">
            <div className="nc-panel-left">
              <NotesList
                notes={filteredNotes}
                activeNoteId={activeNoteId}
                onSelectNote={setActiveNoteId}
              />
            </div>
            <div className="nc-panel-right">
              <NoteEditor
                note={activeNote}
                selectedDate={selectedDate}
                onNoNotes={() => setActiveNoteId(null)}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * App entrypoint: wraps AppShell in NotesProvider.
   */
  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}

export default App;
