import React, { useEffect, useState, useRef } from 'react';
import Quill from 'quill'; // Direct import
import 'quill/dist/quill.snow.css'; // Import Quill styles

export default function NotesComponent() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const editorRef = useRef(null); // Ref for the editor div
  const quillRef = useRef(null); // Ref for the Quill instance

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        setError(error);
        console.error('Failed to fetch notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Initialize Quill editor after the component mounts and editorRef is populated
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow', // Use 'snow' theme for a basic toolbar
        placeholder: 'Note content...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
          ],
        },
      });
    }

    // Cleanup function to destroy the Quill instance when the component unmounts
    return () => {
      if (quillRef.current) {
        quillRef.current.destroy();
        quillRef.current = null;
      }
    };
  }, [editorRef]); // Add editorRef to dependency array


  const handleCreateNote = async () => {
    const newNoteContent = quillRef.current ? quillRef.current.root.innerHTML : ''; // Get content from Quill

    if (!newNoteTitle || !newNoteContent || newNoteContent === '<p><br></p>') { // Check for empty content including Quill's default empty state
      alert('Please enter both title and content for the note.');
      return;
    }

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newNoteTitle, content: newNoteContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const createdNote = await response.json();
      console.log('Note created successfully:', createdNote);

      // Optionally, add the new note to the list without refetching all notes
      setNotes([...notes, createdNote]);

      // Clear form fields and Quill editor
      setNewNoteTitle('');
      if (quillRef.current) {
        quillRef.current.setText(''); // Clear Quill editor content
      }

    } catch (error) {
      console.error('Failed to create note:', error);
      alert(`Failed to create note: ${error.message}`); // Show an alert or display error on UI
    }
  };


  if (loading) {
    return <div>Loading notes...</div>;
  }

  if (error) {
    return <div>Error loading notes: {error.message}</div>;
  }

  return (
    <div>
      <h2>Available Notes</h2>
      {notes.length === 0 ? (
        <p>No notes found. Create one!</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note.id}>{note.title}</li>
          ))}
        </ul>
      )}

      <h3>Create New Note</h3>
      <div>
        <input
          type="text"
          placeholder="Note Title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
      </div>
      <div ref={editorRef} style={{ height: '200px', marginBottom: '10px' }}> {/* Editor div */}
        {/* Quill editor will be initialized here */}
      </div>
      <button onClick={handleCreateNote}>Create Note</button>

      {/* The button to "open" a specific note will be implemented later */}
      {/* For now, we keep the placeholder button if needed, or remove it if the list itself is the primary interaction */}
      {/* <button onClick={handleOpenNotes}>Open Selected Note</button> */}
    </div>
  );
}
