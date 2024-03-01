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
        <div className='tags_and_location'>
          <p>{post?.location}</p>
          <div className='tag_con'>
            <p className='card_distance'>{post?.distance}km</p>
            <p className='card_price'>{post?.price}</p>
          </div>
        </div>
        <p className='card_title'>
          {post?.title?.length > 25
            ? post?.title?.slice(0, 25) + '...'
            : post?.title}
        </p>
        <p className='card_description'>
          {post?.description?.length > 100
            ? post?.description?.slice(0, 100) + '...'
            : post?.description}
        </p>
      </div>
    </div>
  );
};

export default Card;
