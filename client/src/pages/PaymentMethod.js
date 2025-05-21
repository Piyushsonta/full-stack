import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentMethod = () => {
  const { bookingId } = useParams();
  const [method, setMethod] = useState('');
  const [info, setInfo] = useState({});
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const UPI_ID = 'ayanalam9529@oksbi';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        setBooking(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching booking details: ' + (err.response?.data?.msg || err.message));
        console.error('Error fetching booking details:', err);
      }
    };
    try {
      fetchBookingDetails();
    } catch (e) {
      setError('Payment page error: ' + e.message);
    }
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!method) {
      setError('Please select a payment method');
      return;
    }
    if (!booking) {
      setError('Loading payment details...');
      return;
    }
    try {
      // Send payment info to backend
      await axios.put(
        `/api/bookings/${bookingId}/status`,
        {
          status: 'completed',
          paymentInfo: { method, ...info, payeeUpi: UPI_ID }
        }
      );
      navigate('/guest-dashboard');
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Payment for Booking</h2>
      {error && <div className="alert alert-danger payment-error">{error}</div>}
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Payment Method:</label>
          <select
            className="form-select"
            value={method}
            onChange={e => setMethod(e.target.value)}
            required
          >
            <option value="">-- Choose --</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        {method === 'credit_card' && (
          <div className="mb-3">
            <label className="form-label">Card Number:</label>
            <input
              type="text"
              className="form-control"
              onChange={e => setInfo({ ...info, cardNumber: e.target.value })}
              required
            />
          </div>
        )}
        {method === 'upi' && (
          <>
            <div className="mb-3">
              <label className="form-label">Your UPI ID:</label>
              <input
                type="text"
                className="form-control"
                onChange={e => setInfo({ ...info, payerUpi: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Payee UPI ID:</label>
              <input
                type="text"
                className="form-control"
                value={UPI_ID}
                readOnly
              />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary">Pay ₹{booking && booking.paymentAmount ? booking.paymentAmount.toFixed(2) : ''}</button>
      </form>
    </div>
  );
};

export default PaymentMethod;
