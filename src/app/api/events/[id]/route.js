import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust the import path if necessary

import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const eventId = params.id;
  const updatedEventData = await request.json();

  const { data, error } = await supabase
    .from('events')
    .update(updatedEventData)
    .eq('id', eventId)
    .eq('user_id', userId) // Ensure the user owns the event
    .select(); // Select the updated event to return

  if (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
  }


  return NextResponse.json(data[0]); // Return the updated event
}


export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const eventId = params.id;

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', userId); // Ensure the user owns the event

  if (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Event deleted successfully' });
}
