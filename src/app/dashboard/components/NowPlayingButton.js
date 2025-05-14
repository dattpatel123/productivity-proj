import React from 'react';

const NowPlayingButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className='p-2 btn btn-accent rounded cursor-pointer'>
      Show Now Playing
    </button>
  );
};

export default NowPlayingButton;
