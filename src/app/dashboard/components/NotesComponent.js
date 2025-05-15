import React, { useState, useEffect } from 'react';
import OpenNote from './OpenNote';
import useNotesStore from '@/store/notesStore';


const NotesComponent = () => {
  const { notes, loading, fetchNotes } = useNotesStore();
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div>
      <h2>Notes</h2>
      {loading && (
        <p>Loading...</p>
      )} 
      
      {!selectedNote ? (
        <>
          <button className='btn btn-primary mb-4' onClick={() => setSelectedNote({})}>Create New Note</button> {/* Use an empty object to signify new note */}
          <ul>
            {notes.map(note => (
              <li key={note.id}>
                {note.title} 
                <button className='btn btn-accent' onClick={() => setSelectedNote(note)}> open note </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <h2>{selectedNote.id ? 'Edit Note' : 'Create New Note'}</h2>
          <button className='btn btn-accent' onClick={() => setSelectedNote(null)}> Close Note </button>
          <OpenNote note={selectedNote} setSelectedNote={setSelectedNote} />
        </div>
      )}
    </div>
  )
}

export default NotesComponent
