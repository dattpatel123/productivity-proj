import React, { useState, useEffect } from 'react';

const EventFormModal = ({ isOpen, slotInfo, onClose, addEvent, updateEvent, eventToEdit }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');


  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setNote(eventToEdit.note || '');
      setAllDay(eventToEdit.allDay || false);
      setStart(eventToEdit.start ? new Date(eventToEdit.start).toISOString() : '');
      setEnd(eventToEdit.end ? new Date(eventToEdit.end).toISOString() : '');
    } else if (slotInfo) {
      // Pre-fill start and end times from selected slot
      setStart(slotInfo.start.toISOString());
      setEnd(slotInfo.end.toISOString());
      // Reset other fields for new event
      setTitle('');
      setNote('');
      setAllDay(false);
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
    e.preventDefault(); // Prevent default form submission
    const eventData = {
      title,
      note,
      start,
      end,
      allDay,
    };

    if (eventToEdit) {
      // Update existing event
      console.log(eventToEdit)
      const updatedEvent = { ...eventToEdit, ...eventData };
      //console.log('Updating Event:', updatedEvent);
      updateEvent(updatedEvent);
    } else {
      // Add new event
      const newEvent = eventData;
      console.log('Adding New Event:', newEvent);
      addEvent(newEvent);
    }

    onClose(); // Close modal after submit
  };

  return (
    // Input: Title, Note, Start, End, All Day?
    //
    <div className="">

      <dialog id="New_Event_Modal" className="modal" >
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
              ></textarea>
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
              {/* <div className='space-x-2'>
                <label htmlFor="allDay">All Day:</label>
                <input type="checkbox" id="allDay" checked={allDay} onChange={(e) => setAllDay(e.target.checked)}/>
              </div> */}
              <button type="submit" className="btn">{eventToEdit ? 'Update Event' : 'Add Event'}</button>
              <button type="button" className="btn" onClick={onClose}>Close</button>
            </form>

        </div>
      </dialog>



    </div>
  );
};

export default EventFormModal;
