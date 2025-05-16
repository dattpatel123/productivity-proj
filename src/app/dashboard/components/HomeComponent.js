import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import useEventsStore from '@/store/eventsStore';

export default function HomeComponent(){ 
  const [events, setEvents] = useState([]);
  
  const fetchEvents = async () => {
    const response = await fetch('/api/events');
    if (response.ok) {
      const data = await response.json();
      console.log(data)
    } else {
      console.error('Failed to fetch events:', response.statusText);
    }
  }
  
  

  return (
    <div>
      <button className='btn btn-accent' onClick={fetchEvents}>Fetch events</button>
      <button className='btn btn-accent' >Add Eveent</button>
       
    </div>
  )
}
