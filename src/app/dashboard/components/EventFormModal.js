import React, { useState, useEffect } from 'react';

const EventFormModal = ({ slotInfo, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (slotInfo) {
      // Pre-fill start and end times from selected slot
      setStart(slotInfo.start.toISOString());
      setEnd(slotInfo.end.toISOString());
      // Set allDay based on the slot selection (if it's a full day slot)
      // This might need refinement based on how react-big-calendar provides this info
      const duration = slotInfo.end.getTime() - slotInfo.start.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (duration >= twentyFourHours) {
        setAllDay(true);
      } else {
        setAllDay(false);
      }
    }
  }, [slotInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      note,
      start,
      end,
      allDay,
    };
    onSubmit(newEvent);
  };

  return (
    
    <div className="">
      <input type="text" placeholder="Type here" className="input" />
      <div className="">
        <h2>Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="note">Note:</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="start">Start:</label>
            <input
              type="datetime-local"
              id="start"
              value={start.substring(0, 16)} // Format for datetime-local input
              onChange={(e) => setStart(new Date(e.target.value).toISOString())}
              required
            />
          </div>
          <div>
            <label htmlFor="end">End:</label>
            <input
              type="datetime-local"
              id="end"
              value={end.substring(0, 16)} // Format for datetime-local input
              onChange={(e) => setEnd(new Date(e.target.value).toISOString())}
              required
            />
          </div>
          <div>
            <label htmlFor="allDay">All Day:</label>
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
          </div>
          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
