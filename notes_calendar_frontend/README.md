# Notes + Calendar Frontend (Ocean Professional)

A responsive React app providing a split-view notes manager with an integrated monthly calendar.

## Features

- Ocean Professional theme: blue primary, amber accents, rounded corners, soft shadows, gradient headers.
- Top navigation bar with brand, search, and “New Note”.
- Left sidebar calendar with month navigation and per-day note counts.
- Right main area:
  - Notes list filtered by the selected date and search query.
  - Note editor with autosave on blur, date picker, tags, and delete.
- CRUD: Create, read, update, delete notes.
- Local persistence via localStorage:
  - Keys: `nc_notes`, `nc_selected_date`
- Keyboard: Cmd/Ctrl + N to create a new note.
- Graceful empty states and responsive layout.
- No backend required. Optional API mode documented below.

## Getting Started

- Start: `npm start`
- Build: `npm run build`
- Test: `npm test`

Opens at http://localhost:3000.

## Data Model

```
{
  id: string,
  title: string,
  content: string,
  date: 'YYYY-MM-DD',
  tags?: string[],
  createdAt: ISOString,
  updatedAt: ISOString
}
```

## Environment Variables

This project reads the following if present:

- `REACT_APP_API_BASE`: If set, you can extend `src/context/NotesContext.js` to call your backend instead of localStorage. The current code provides a `maybeCallApi` helper and in-place comments where to add calls.
- `REACT_APP_NODE_ENV`: When set to `development`, additional debug logging is enabled.

No variables are required to run locally.

## Switch to API mode (later)

1. Set `REACT_APP_API_BASE=http://localhost:4000` (example).
2. In `src/context/NotesContext.js`, replace the local state operations with `fetch` calls in `createNote`, `updateNote`, and `deleteNote`. The `maybeCallApi` helper already handles base URL and JSON encoding.
3. Ensure your backend exposes compatible endpoints:
   - `GET /notes?date=YYYY-MM-DD`
   - `POST /notes`
   - `PUT /notes/:id`
   - `DELETE /notes/:id`

Until then, the app uses localStorage with seed demo data.

## Styling

- Main styles in `src/theme.css`.
- Minimal base in `src/App.css`.
- Colors:
  - primary: `#2563EB`
  - secondary/success: `#F59E0B`
  - error: `#EF4444`
  - background: `#f9fafb`
  - surface: `#ffffff`
  - text: `#111827`

## File Structure

- `src/context/NotesContext.js` — app state and persistence
- `src/components/TopNav.js` — top navigation
- `src/components/CalendarSidebar.js` — calendar with month grid
- `src/components/NotesList.js` — list of notes for selected date
- `src/components/NoteEditor.js` — editor view (autosave on blur)
- `src/utils/date.js` — date helpers and calendar matrix
- `src/utils/storage.js` — localStorage helpers and seed data
- `src/App.js` — app shell wiring and layout
- `src/theme.css` — Ocean Professional theme

## Accessibility

- ARIA labels on navigation and regions
- High-contrast text and focus states on inputs
