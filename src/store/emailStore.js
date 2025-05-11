import { create } from 'zustand';
import { signOut } from 'next-auth/react'; // Import signOut

const useEmailStore = create((set) => ({
  emails: [],
  loading: true,
  error: null,
  fetchEmails: async (session) => {
    if (!session) {
      set({ loading: false });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      const res = await fetch('/api/emails');
      if (res.status === 401) {
        // Handle unauthorized specifically
        set({ error: 'Invalid credentials. Please sign in again.', emails: [] });
        signOut(); // Sign out the user on the frontend
      } else if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.error || 'Failed to fetch emails', emails: [] });
      } else {
        const data = await res.json();
        if (Array.isArray(data)) {
          set({ emails: data });
        } else {
          set({ error: 'Unexpected data format from API', emails: [] });
        }
      }
    } catch (error) {
      set({ error: 'An error occurred while fetching emails', emails: [] });
    } finally {
      set({ loading: false });
    }
  },
  resetStore: () => set({ emails: [], loading: false, error: null }), // Add reset action
}));

export default useEmailStore;
