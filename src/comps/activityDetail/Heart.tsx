import { useState, useEffect } from 'react';
import { IconHeartFilled } from "@tabler/icons-react";

function Heart() {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    console.log(`The heart is now ${isLiked ? "liked (red)" : "not liked (gray)"}`);
  }, [isLiked]);

  return (
    <button 
      onClick={handleClick} 
      style={{
        backgroundColor: isLiked ? '#FF6B6B' : '#D3D3D3',
        borderRadius: '50%', 
        width: '40px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer', 
        outline: 'none', 
        color: isLiked ? 'white' : 'gray', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', 
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease' 
      }}
      aria-label="Like or Unlike" 
    >
      <IconHeartFilled size={24}/> 
    </button>
  );
}

export default Heart;
