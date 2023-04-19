"use strict";

const io = require('socket.io-client');
const handler = require('./handler');

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || 'http://localhost:3000';

const socket = io(SOCKET_SERVER_URL);

socket.on('connect', () => {
  console.log('Connected to CAPS server as a driver');

  // Subscribe to the 'pickup' event
  socket.emit('subscribe', { clientId: 'driver', eventName: 'pickup' });

  // Request all undelivered 'pickup' messages
  socket.emit('getAll', { clientId: 'driver', eventName: 'pickup' });
});

// Event handlers
socket.on('pickup', (payload) => {
  handler.pickup(socket, payload);
});

socket.on('disconnect', () => {
  console.log('Disconnected from CAPS server');
});

module.exports = socket;
