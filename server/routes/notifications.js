const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const notificationEmitter = require('../utils/notificationEmitter');

// Get notifications for current user
router.get('/', auth, async (req, res) => {
  let notifs = [];
  // Try to get notifications, but do not throw on error
  await Notification.find({ user: req.user.id }).sort({ createdAt: -1 })
    .then(result => { notifs = result; })
    .catch(err => {
      // Log the error but do not throw, just return empty array
      console.error('Notification query failed:', err);
      notifs = [];
    });
  res.json(notifs);
});

// SSE endpoint for real-time notifications
router.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  // initial comment to establish stream
  res.write(':ok\n\n');
  const onNewNotification = notification => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  };
  notificationEmitter.on('newNotification', onNewNotification);
  req.on('close', () => {
    notificationEmitter.removeListener('newNotification', onNewNotification);
  });
});

module.exports = router;