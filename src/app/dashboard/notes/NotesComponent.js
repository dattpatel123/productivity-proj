'use client'; // This is a client component
import React, { useState, useEffect } from 'react';
import OpenNote from './OpenNote';
import useNotesStore from '@/store/notesStore';


const NotesComponent = () => {
  const { notes, loading, fetchNotes } = useNotesStore();
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    
    fetchNotes();
  }, [fetchNotes]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
      <span className="loading loading-infinity loading-xl w-30 c"></span>
      </div>
    )
  }
  return (
    <div>
      
      
      
      {!selectedNote ? (
        <>
          
          <button className='btn btn-primary mt-5 ml-5' onClick={() => setSelectedNote({})}>Create New Note</button>
          <div className='grid grid-cols-3 gap-6 justify-center mt-10 p-5'>
            {notes.map(note => (
              <div key={note.id} className='card w-full shadow-xl bg-base-300'>
                <div className='card-body '>
                  <div className='flex justify-center'>
                  <h2 className='card-title'>{note.title}</h2>
                  </div>
                <button className='btn btn-accent' onClick={() => setSelectedNote(note)}> Open Note </button>
                </div>
              </div>
            ))}
          </div>
          
        </>
      ) : (
        <div className='mt-5'>
          
          <button className='btn btn-accent' onClick={() => setSelectedNote(null)}> Close </button>
          <OpenNote note={selectedNote} setSelectedNote={setSelectedNote} />
        </div>
      )}
    </div>
  )
}

export default NotesComponent
