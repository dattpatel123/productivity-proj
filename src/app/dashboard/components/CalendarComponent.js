import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import {X} from 'lucide-react'

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

  const handleEventClick = (event, e) => {
    const target = e.target;
    const rect = target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = 384; // w-96 in tailwind is 24rem = 384px
    const cardHeight = 200; // Estimated height of the card

    let newLeft = rect.right + window.scrollX;
    let newTop = rect.top + window.scrollY;

    // Adjust left position if the card goes out of the viewport on the right
    if (newLeft + cardWidth > viewportWidth) {
      newLeft = rect.left + window.scrollX - cardWidth;
    }

    // Adjust top position if the card goes out of the viewport at the bottom
    if (newTop + cardHeight > viewportHeight) {
      newTop = viewportHeight - cardHeight + window.scrollY;
    }
     // Ensure the card doesn't go out of the viewport at the top
     if (newTop < window.scrollY) {
      newTop = window.scrollY;
    }


    setSelectedEvent(event);
    setCardPosition({ top: newTop, left: newLeft });
    setIsCardVisible(true);
  };

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedEvent(null);
  };

  const [view, setView] = useState('month');
  const onView = (newView) => setView(newView);
  
  
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
        onSelectEvent={(event, e) => handleEventClick(event, e)}

      />
      {isCardVisible && selectedEvent && (
        <div className="card card-dash bg-base-100 w-96" style={{ position: 'absolute', top: cardPosition.top, left: cardPosition.left, zIndex: 1000 }}>
          <button onClick={handleCloseCard} className='cursor-pointer'> <X /> </button>
          <div className="card-body flex justify-end">
            <h2 className="card-title">{selectedEvent.title}</h2>
            <p>Start: {moment(selectedEvent.start).format('LLL')}</p>
            <p>End: {moment(selectedEvent.end).format('LLL')}</p>
            <p>{selectedEvent.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
