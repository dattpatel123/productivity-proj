import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust the import path if necessary
import { supabase } from '@/utils/supabaseClient'; // Adjust the import path if necessary

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Assuming your user ID is available in the session object, e.g., session.user.id
  const userId = session.user.id;
  
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(notes);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { title, content } = await request.json();
  console.log('session.user.id:', session.user.id, 'Type:', typeof session.user.id);
  console.log(session);
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('notes')
    .insert([
      { user_id: userId, title: title, content: content }
    ])
    .select(); // Select the inserted row
    
  if (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 }); // Return the created note with 201 status
}
