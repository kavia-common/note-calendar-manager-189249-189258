import { todayISO, formatDateISO } from './date';

const KEY_NOTES = 'nc_notes';
const KEY_SELECTED_DATE = 'nc_selected_date';

// PUBLIC_INTERFACE
export function loadNotes() {
  try {
    const raw = localStorage.getItem(KEY_NOTES);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  try {
    localStorage.setItem(KEY_NOTES, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function loadSelectedDate() {
  try {
    const raw = localStorage.getItem(KEY_SELECTED_DATE);
    if (!raw) return null;
    return formatDateISO(raw);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function saveSelectedDate(date) {
  try {
    localStorage.setItem(KEY_SELECTED_DATE, formatDateISO(date));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function seedNotes() {
  const today = todayISO();
  const yesterday = formatDateISO(new Date(Date.now() - 86400000));
  const demo = [
    {
      id: crypto.randomUUID(),
      title: 'Welcome to Notes',
      content: 'Use the calendar to filter notes by date. Click a note to edit.\n\nTip: Press Cmd/Ctrl + N to create a new note.',
      date: today,
      tags: ['getting-started'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Design ideas',
      content: 'Ocean Professional theme with blue primary and amber accents. Rounded corners, soft shadows.',
      date: yesterday,
      tags: ['design', 'theme'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  saveNotes(demo);
  saveSelectedDate(today);
  return demo;
}
