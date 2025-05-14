import React, { useState } from 'react';
import CardComponent from './CardComponent';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import {X} from 'lucide-react'
import { handleEventClick } from './calendarUtils';

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Sample Event',
    start: new Date(2025, 4, 14, 10, 0), // May 14, 2025, 10:00 AM, 0 indexed month. #Year, Month, Day, Hour, Minute
    end: new Date(2025, 4, 14, 12, 0), // May 14, 2025, 12:00 PM
  },
  {
    title: 'Another Event',
    start: new Date(2025, 4, 16, 13, 0), // May 16, 2025, 1:00 PM
    end: new Date(2025, 4, 16, 15, 0), // May 16, 2025, 3:00 PM
  },
];


const CalendarComponent = ({  }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const [view, setView] = useState('month');
  const onView = (newView) => setView(newView);

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedEvent(null);
  };

  return (
    <div className=''>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh'}}
        defaultView= {'month'}
        view={view}
        onView={onView}
        onSelectEvent={(event, e) => handleEventClick(event, e, setSelectedEvent, setCardPosition, isCardVisible, setIsCardVisible)}

      />
      {isCardVisible && selectedEvent && (
        <CardComponent event={selectedEvent} onClose={handleCloseCard} position={cardPosition} />
      )}
    </div>
  );
};

export default CalendarComponent;
