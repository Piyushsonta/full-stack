import React from 'react';
import { format } from 'date-fns';

const BookingStatusNotification = ({ notifications }) => {
  if (!Array.isArray(notifications) || notifications.length === 0) return null;
  return (
    <div className="booking-status-notification-bar" style={{
      background: '#e6ffed',
      borderBottom: '1px solid #5cb85c',
      padding: '12px 0',
      textAlign: 'center',
      fontSize: '1.08rem',
      zIndex: 1040
    }}>
      {notifications.map((notification, idx) => {
        let message = notification.message;
        let mealTitle = notification.mealTitle || '';
        let servingTime = notification.servingTime ? format(new Date(notification.servingTime), 'PPpp') : '';
        // Custom message for accepted/rejected
        if (message && message.toLowerCase().includes('accepted')) {
          message = `Your meal order${mealTitle ? ` for "${mealTitle}"` : ''} is accepted and it will be delivered in the given time${servingTime ? ` (${servingTime})` : ''}.`;
        } else if (message && message.toLowerCase().includes('rejected')) {
          message = `Your meal order${mealTitle ? ` for "${mealTitle}"` : ''} was rejected.`;
        }
        return (
          <span key={notification._id || idx} style={{ margin: '0 16px', display: 'inline-block' }}>
            <strong>{notification.type === 'booking' ? 'Booking' : 'Notification'}:</strong> {message}
            {notification.createdAt && (
              <>
                {' '}<span style={{ color: '#888', fontSize: '0.95em' }}>
                  ({format(new Date(notification.createdAt), 'PPpp')})
                </span>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default BookingStatusNotification;
