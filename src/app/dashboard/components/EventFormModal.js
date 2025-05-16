import React, { useState, useEffect } from 'react';

const EventFormModal = ({ isOpen, slotInfo, onClose, addEvent, updateEvent, eventToEdit }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // Format Date object to 'YYYY-MM-DDTHH:mm' string for input value
  const formatToDatetimeLocal = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // On mount or when editing or slotInfo changes, set form fields as strings
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setNote(eventToEdit.note || '');
      setAllDay(eventToEdit.allDay || false);
      setStart(eventToEdit.start ? formatToDatetimeLocal(new Date(eventToEdit.start)) : '');
      setEnd(eventToEdit.end ? formatToDatetimeLocal(new Date(eventToEdit.end)) : '');
    } else if (slotInfo) {
      setTitle('');
      setNote('');
      setAllDay(false);
      setStart(slotInfo.start ? formatToDatetimeLocal(new Date(slotInfo.start)) : '');
      setEnd(slotInfo.end ? formatToDatetimeLocal(new Date(slotInfo.end)) : '');
    } else {
      // Clear fields if nothing
      setTitle('');
      setNote('');
      setAllDay(false);
      setStart('');
      setEnd('');
    }
  }, [slotInfo, eventToEdit]);

  useEffect(() => {
    const modalElement = document.getElementById('New_Event_Modal');
    if (isOpen) {
      modalElement.showModal();
    } else {
      modalElement.close();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      title,
      note,
      allDay,
      start: start ? new Date(start).toISOString() : null,
      end: end ? new Date(end).toISOString() : null,
    };

    if (eventToEdit) {
      updateEvent({ ...eventToEdit, ...eventData });
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  return (
    <dialog id="New_Event_Modal" className="modal">
      <div className="modal-box w-60 flex flex-col items-center justify-center gap-2">
        <div className='p-1'>{eventToEdit ? 'Edit Event' : 'Add a new Event'}</div>

        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <textarea
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="textarea textarea-bordered w-full max-w-xs"
          />
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <div className='space-x-2'>
            <label htmlFor="allDay">All Day:</label>
            <input type="checkbox" id="allDay" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
          </div>
          <button type="submit" className="btn">{eventToEdit ? 'Update Event' : 'Add Event'}</button>
          <button type="button" className="btn" onClick={onClose}>Close</button>
        </form>
      </div>
    </dialog>
  );
};

export default EventFormModal;
