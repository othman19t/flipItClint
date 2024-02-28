import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
// Button component taking 'label' and 'onClick' as props
const NotificationBtn = ({ numberOfNotifications, onClick }) => {
  return (
    <button className='notification_btn' onClick={onClick}>
      <span className='up_icon'>
        <FontAwesomeIcon icon={faArrowUp} />
      </span>
      <span className='notification_num'>{numberOfNotifications}</span> New Post
      {numberOfNotifications > 1 && 's'}
    </button>
  );
};

export default NotificationBtn;
