'use client'
import React, { use } from 'react'
import { useState } from 'react';
const NowPlaying = () => {
  const [isOpen, setIsOpen] = useState(false);

    return (
    <div>
        <button onClick={() => setIsOpen(!isOpenll)} className='p-2 btn btn-info rounded cursor-pointer'>
        Show Now Playing</button>
        {isOpen && 
            <div className='bg-gray-800 text-white rounded shadow-lg'>   
                <h3>Now Playing</h3>
                <p>Song Title</p>
                <p>Artist</p>
            </div>
        }
    
      
    </div>
  )
}

export default NowPlaying
