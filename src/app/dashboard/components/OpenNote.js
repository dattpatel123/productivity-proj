import React from 'react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import the Quill styles
import '../../styles/editor.css'; // Import custom editor styles
import useNotesStore from '@/store/notesStore';
import { useState, useEffect } from 'react';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean'],
    [{size: [ 'small', false, 'large', 'huge' ]}]
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image','size'
];


const OpenNote = ({ note, setSelectedNote }) => {
    const { notes, loading, fetchNotes, addNote, updateNote, deleteNote } = useNotesStore();
    const [value, setValue] = useState(note?.content || '');
    const [title, setTitle] = useState(note?.title || '');


    useEffect(() => {
      console.log('OpenNote received note prop:', note);
      console.log('Initial title state:', title);
      console.log('Initial value state:', value);
    }, [note, title, value]);
    
      return (
        <div>
          
          {/* Title Input */}
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Note Title" 
          />
          {/* Quill Editor */}
          <ReactQuill 
            value={value} 
            onChange={setValue} 
            placeholder="Write your note here..." 
            modules={modules}
            formats={formats}
          />
          <button onClick={() => {
            console.log('Title:', title);
            console.log('Content:', value);
            if (!title || !value) {
              alert('Title and content are required.');
              return;
            }

            if (note && note.id) {
              // Existing note, call update
              updateNote(note.id, title, value);
            } else {
              // New note, call add
              addNote(title, value);
            }
          }} className='btn btn-accent mt-20'> Save Note</button>
          
          {note && note.id && (
            <button onClick={async () => {
              if (confirm('Are you sure you want to delete this note?')) {
                await deleteNote(note.id);
                setSelectedNote(null); // Close the editor after deletion
              }
            }} className='btn btn-danger mt-20 ml-4'> Delete Note</button>
          )}
    
    
        </div>
      )


}

export default OpenNote
