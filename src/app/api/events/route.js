import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust the import path if necessary
import { createSupabaseClient } from '@/utils/supabaseClient'; // Adjust the import path if necessary
import { supabase } from '@/utils/supabaseClient'; 

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id; // Assuming user ID is in session
  

  const { data: events, error } = await supabase
    .from('events') // Assuming a Supabase table named 'events'
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(events);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id; // Assuming user ID is in session
  const { title, note, start, end, allDay } = await request.json(); // Assuming event has title, note, start, end, and allDay

  if (!title || !start || !end || allDay === undefined) {
    return NextResponse.json({ error: 'Title, start, end, and allDay are required' }, { status: 400 });
  }

  

  const { data, error } = await supabase
    .from('events') // Assuming a Supabase table named 'events'
    .insert([
      { user_id: userId, title: title, note: note, start: start, end: end, allDay: allDay } // Adjust column names as needed
    ])
    .select(); // Select the inserted row

  if (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 }); // Return the created event with 201 status
}
