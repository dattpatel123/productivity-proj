import { create } from 'zustand';

const useNotesStore = create((set) => ({
  notes: [],
  loading: true,
  fetchNotes: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      set({ notes: data });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      set({ loading: false });
    }
  },
  addNote: async (title, content) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const newNote = await response.json();
      set((state) => ({ notes: [...state.notes, newNote] }));
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  },
  updateNote: async (id, title, content) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const updatedNote = await response.json();
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? updatedNote : note
        ),
      }));
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  },
  deleteNote: async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      // Assuming the API returns a success status and no body for delete
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  },
}));

export default useNotesStore;
