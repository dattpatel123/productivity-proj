import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust the import path if necessary
import { supabase } from '@/utils/supabaseClient'; // Adjust the import path if necessary

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = session.user.id;
  const {id: noteId} = await params;
  
  //console.log(params.id);
  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('notes')
    .update({ title: title, content: content })
    .eq('id', noteId)
    .eq('user_id', userId) // Ensure the user owns the note
    .select(); // Select the updated row

  if (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

// Optional: Add a GET handler for fetching a single note by ID if needed
// export async function GET(request, { params }) {
//   const session = await getServerSession(authOptions);
//
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
//
//   const userId = session.user.id;
//   const noteId = params.id;
//
//   const { data: note, error } = await supabase
//     .from('notes')
//     .select('*')
//     .eq('id', noteId)
//     .eq('user_id', userId)
//     .single(); // Use single() to get a single record
//
//   if (error) {
//     console.error('Error fetching single note:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
//
//   if (!note) {
//       return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
//   }
//
//   return NextResponse.json(note);
// }

// Add a DELETE handler for deleting a note by ID
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const noteId = params.id;

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', userId); // Ensure the user owns the note

  if (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Note deleted successfully' });
}
