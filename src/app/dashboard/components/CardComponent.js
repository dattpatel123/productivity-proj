import React from 'react';
import moment from 'moment';
import { X } from 'lucide-react';
import useEventsStore from '@/store/eventsStore';

export default function CardComponent({ event, onClose, position, onEdit }) {
    const { deleteEvent } = useEventsStore();

    const handleDelete = async () => {
        await deleteEvent(event.id);
        onClose(); // Close the card after deleting the event
    };

    return (
        <div className="card card-dash bg-base-100 w-96" style={{ position: 'absolute', top: position.top, left: position.left, zIndex: 1000, animation: 'bubble-in 0.3s ease-out forwards', transformOrigin: 'top center', padding: '1rem' }}>
            <style jsx>{`
                @keyframes bubble-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    70% {
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className='cursor-pointer hover:bg-gray-400 rounded'> <X /> </button>
            </div>
            <div className="card-body flex justify-end" style={{ padding: '0' }}>
                <h2 className="card-title">{event.title}</h2>
                <p>Start: {moment(event.start).format('LLL')}</p>
                <p>End: {moment(event.end).format('LLL')}</p>
                
                <p>{event.note}</p>
            </div>
            <div className="card-actions justify-end">
                <button className='btn btn-secondary' onClick={onEdit}>Edit</button>
                <button className='btn btn-primary' onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}
