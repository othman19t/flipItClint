import React, { useState } from 'react';

const Card = ({ post }) => {
  const [img, setImg] = useState(post?.imgSrc[0]);
  const handleCardClick = () => {
    window.open(post?.postUrl, '_blank');
  };

  return (
    <div className='card' onClick={handleCardClick}>
      <img src={img} alt={post?.title} />
      <div className='card-info'>
        <h4>{post?.title}</h4>
        <p>{post?.price}</p>
        <p>{post?.location}</p>
      </div>
    </div>
  );
};

export default Card;
