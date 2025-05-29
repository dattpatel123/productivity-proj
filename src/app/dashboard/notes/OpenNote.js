import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Import the Quill styles
import '../../styles/editor.css'; // Import custom editor styles
import useNotesStore from '@/store/notesStore';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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
  'list', 'indent',
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
        <div className='space-y-2 p-2'>
          
          {/* Title Input */}
          <div className='flex justify-center'>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Note Title" 
            className='input'
          />
          </div>
          {/* Note Content */}
          {/* Quill Editor */}
          <ReactQuill 
            value={value} 
            onChange={setValue} 
            placeholder="Write your note here..." 
            modules={modules}
            formats={formats}
          />
          <div className='flex justify-start space-x-2  mt-20'>
            <button onClick={async () => {
              console.log('Title:', title);
              console.log('Content:', value);
              if (!title || !value) {
                alert('Title and content are required.');
                return;
              }

              if (note && note.id) {
                // Existing note, call update
                await updateNote(note.id, title, value);
              } else {
                // New note, call add
                await addNote(title, value);
              }
            }} className='btn btn-accent'>{note ? "Update Note" : "Create New Note"}
            </button>
            {note && note.id && (
              <button onClick={async () => {
                if (confirm('Are you sure you want to delete this note?')) {
                  await deleteNote(note.id);
                  setSelectedNote(null); // Close the editor after deletion
                }
              }} className='btn btn-error'> Delete Note</button>
            )}
    
          </div>
        </div>
      )


}

export default OpenNote
