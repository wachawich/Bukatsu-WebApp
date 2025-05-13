import { useState, useEffect } from 'react';
import { IconHeartFilled} from "@tabler/icons-react";

function Heart() {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    console.log(`The heart is now ${isLiked ? "liked (red)" : "not liked (gray)"}`);
  }, [isLiked]);

  return (
    <>
    <button 
        onClick={handleClick} 
        style={{
          backgroundColor: '#D3D3D3', 
          borderRadius: '50%', 
          width: '30px', 
          height: '30px',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer', 
          outline: 'none', 
          color: isLiked ? 'red' : 'white', 
        }}
        aria-label="Like or Unlike" 
      >
        <IconHeartFilled size={24}/> 
      </button>
    </>
  );
}

export default Heart;