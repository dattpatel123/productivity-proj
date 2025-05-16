import { create } from 'zustand';
import moment from 'moment';

const useEventsStore = create((set) => ({
  events: [],
  setEvents: (events) => set({ events }),

  fetchEvents: async () => {
    try {
      const response = await fetch('/api/events'); // Assuming a GET endpoint for fetching events
      if (!response.ok) {
        console.error('Error fetching events:', response.statusText);
        return;
      }
      const data = await response.json();
      // Format event dates from strings to Date objects and include note, allDay, and id
      console.log(data)
      const formattedEvents = data.map(event => ({
        
        id: event.id, // Include the id
        title: event.title, 
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: event.allDay, // Include the allDay property
        note: event.note,
      }));  
      set({ events: formattedEvents });
      console.log('Fetched events:', formattedEvents);
      
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  },
  addEvent: async (event) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        console.error('Error adding event:', response.statusText);
        return;
      }
      const newEvent = await response.json();
      set((state) => ({
        events: [...state.events, newEvent],
      }));
    } catch (error) {
      console.error('Error adding event:', error);
    }
  },
  updateEvent: async (updatedEvent) => {
    try {
      const response = await fetch(`/api/events/${updatedEvent.id}`, {
        method: 'PUT', // Or PATCH depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
      if (!response.ok) {
        console.error('Error updating event:', response.statusText);
        return;
      }
      const data = await response.json();
      console.log(data.message); // Log success message
      set((state) => ({
        events: state.events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        ),
      }));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  },
  deleteEvent: async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error('Error deleting event:', response.statusText);
        return;
      }
      const data = await response.json();

      set((state) => ({
        events: state.events.filter((event) => event.id !== eventId),
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
}));

export default useEventsStore;
