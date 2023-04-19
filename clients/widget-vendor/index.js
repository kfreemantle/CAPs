'use strict';

const io = require('socket.io-client');
const handler = require('./handler');

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || 'http://localhost:3000';
const VENDOR_ID = 'ACME Widgets';

const socket = io(SOCKET_SERVER_URL);

socket.on('connect', () => {
  console.log(`Connected to CAPS server as ${VENDOR_ID}`);

  // Subscribe to the 'delivered' event
  socket.emit('subscribe', { clientId: VENDOR_ID, eventName: 'delivered' });

  // Request all undelivered 'delivered' messages
  socket.emit('getAll', { clientId: VENDOR_ID, eventName: 'delivered' });
});

// Event handlers
socket.on('delivered', (payload) => {
  handler.delivered(socket, payload);
});

socket.on('disconnect', () => {
  console.log(`Disconnected from CAPS server as ${VENDOR_ID}`);
});

module.exports = socket;
