import React from 'react';
import { format } from 'date-fns';

const OrderNotification = ({ bookings }) => {
  if (!Array.isArray(bookings) || bookings.length === 0) return null;
  return (
    <div className="order-notification-bar" style={{
      background: '#fffbe9',
      borderBottom: '1px solid #ffd54f',
      padding: '12px 0',
      textAlign: 'center',
      fontSize: '1.08rem',
      zIndex: 1040
    }}>
      {bookings.map((booking, idx) => {
        let message = '';
        let createdAt = null;
if (booking.createdAt) {
  createdAt = new Date(booking.createdAt);
  if (isNaN(createdAt.getTime())) {
    createdAt = null;
  }
}
        if (booking.status === 'accepted' && booking.meal && booking.meal.servingTime) {
          message = `Your meal order${booking.meal.title ? ` for "${booking.meal.title}"` : ''} is accepted and it will be delivered in the given time (${format(new Date(booking.meal.servingTime), 'PPPP p')}).`;
        } else if (['rejected','cancelled'].includes(booking.status) && booking.meal) {
          message = createdAt
            ? `(Your meal order for "${booking.meal.title}" is rejected or the host cancelled the booking. [Received: ${format(createdAt, 'PPPP')} at ${format(createdAt, 'p')}])`
            : `(Your meal order for "${booking.meal.title}" is rejected or the host cancelled the booking. [Received: Unknown])`;
        }
        if (!message) return null;
        return (
          <div key={booking._id || idx} style={{ margin: '0 16px', display: 'block', color: booking.status === 'accepted' ? undefined : '#b71c1c' }}>
            {message}
          </div>
        );
      })}
      {/* No upcoming orders */}
      {bookings.filter(b => b.status === 'accepted' && b.meal && b.meal.servingTime).length === 0 && (
        <div>No upcoming orders.</div>
      )}
    </div>
  );
};

export default OrderNotification;
