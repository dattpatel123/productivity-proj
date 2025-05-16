import React, { useState, useEffect } from 'react';
import CardComponent from './CardComponent';
import EventFormModal from './EventFormModal'; // Import the new modal component
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import {X} from 'lucide-react'
import { handleEventClick } from './calendarUtils'; // Removed handleSelectSlot

const localizer = momentLocalizer(moment);

const CalendarComponent = ({  }) => {
  const [events, setEvents] = useState([]); // Manage events in state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const [view, setView] = useState('month');
  const onView = (newView) => setView(newView);

  // State for the new event modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);

  // Function to add a new event to the state
  const addEventToState = (newEvent) => {
    // Convert start and end times to Date objects if they are strings
    const formattedEvent = {
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
      allDay: newEvent.allDay,
      note: newEvent.note,
    };
    setEvents(prevEvents => [...prevEvents, formattedEvent]);
  };

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events'); // Assuming a GET endpoint for fetching events
        if (!response.ok) {
          console.error('Error fetching events:', response.statusText);
          return;
        }
        const data = await response.json();
        // Format event dates from strings to Date objects and include note and allDay
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: event.allDay,
          note: event.note,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array means this runs once on mount

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedEvent(null);
  };

  // Function to handle modal submission
  const handleModalSubmit = async (newEventData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding event:', errorData.error);
        alert('Failed to add event: ' + errorData.error);
        return;
      }

      const addedEvent = await response.json();
      console.log('Event added successfully:', addedEvent);
      addEventToState(addedEvent); // Add the new event to the calendar state
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event.');
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedSlotInfo(null);
  };


  return (
    <div className=''>
      {isModalVisible && (
        <div style={{
          position: 'fixed',
          
          backgroundColor: 'gray', // Semi-transparent background
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1, // High z-index to appear on top
        }}>
          <EventFormModal
            slotInfo={selectedSlotInfo}
            onClose={handleCloseModal}
            onSubmit={handleModalSubmit}
          />
        </div>
      )}
      <Calendar
        localizer={localizer}
        events={events} // Use state events
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh'}}
        defaultView= {'month'}
        view={view}
        onView={onView}
        selectable={true} // Enable slot selection
        onSelectEvent={(event, e) => handleEventClick(event, e, setSelectedEvent, setCardPosition, isCardVisible, setIsCardVisible)}
        onSelectSlot={(slotInfo) => {
          console.log('Slot selected:', slotInfo); // Add console log
          setSelectedSlotInfo(slotInfo);
          setIsModalVisible(true);
        }} // Set state to show modal and store slot info
      />
      {isCardVisible && selectedEvent && (
        <CardComponent event={selectedEvent} onClose={handleCloseCard} position={cardPosition} />
      )}


    </div>
  );
};

export default CalendarComponent;
