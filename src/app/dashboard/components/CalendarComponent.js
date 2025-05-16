import React, { useState, useEffect } from 'react';
import CardComponent from './CardComponent';
import EventFormModal from './EventFormModal'; // Import the new modal component
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import {X} from 'lucide-react'
import { handleEventClick } from './calendarUtils';
import useEventsStore from '@/store/eventsStore';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({  }) => {
  const { events, fetchEvents, addEvent, updateEvent } = useEventsStore();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const [view, setView] = useState('month');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null); // State for the event being edited
  const onView = (newView) => setView(newView);


  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // Empty dependency array means this runs once on mount

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedEvent(null);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedSlotInfo(null);
    setEventToEdit(null); // Reset eventToEdit when modal closes
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsModalVisible(true);
    setIsCardVisible(false); // Close the card when opening the modal
  };

  
  
  
  
  return (
    <div>

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
          setIsModalVisible(true);
          setSelectedSlotInfo(slotInfo);
          setEventToEdit(null); // Ensure eventToEdit is null for new events
          console.log('slotInfo', slotInfo);
        }} // Set state to show modal and store slot info
      />
      {isCardVisible && selectedEvent && (
        <CardComponent event={selectedEvent} onClose={handleCloseCard} position={cardPosition} onEdit={() => handleEditEvent(selectedEvent)} />
      )}

      {isModalVisible && (
        <EventFormModal
          isOpen={isModalVisible}
          slotInfo={selectedSlotInfo}
          onClose={handleCloseModal}
          addEvent={addEvent}
          updateEvent={updateEvent} // Pass updateEvent to the modal
          eventToEdit={eventToEdit} // Pass eventToEdit to the modal
          
        />
      )}

    </div>
  );
};


export default CalendarComponent;
