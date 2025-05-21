import React from 'react';
import './NotificationBar.css';

const NotificationBar = ({ notifications = [] }) => {
  if (!notifications.length) return null;
  return (
    <div className="notification-bar">
      {notifications.map((notif, idx) => (
        <div key={idx} className={`notification-item notification-${notif.type || 'info'}`}>
          {notif.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationBar;
