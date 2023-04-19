'use strict';

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Queue = require('./lib/queue');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Create new Queue instances for drivers and vendors
const driverQueue = new Queue();
const vendorQueue = new Queue();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle event subscriptions
  socket.on('subscribe', ({ clientId, eventName }) => {
    console.log(`Client ${clientId} subscribed to event ${eventName}`);
    socket.join(eventName);
  });

  // Handle event unsubscriptions
  socket.on('unsubscribe', ({ clientId, eventName }) => {
    console.log(`Client ${clientId} unsubscribed from event ${eventName}`);
    socket.leave(eventName);
  });

  // Handle the 'getAll' event for clients to request all undelivered messages
  socket.on('getAll', ({ clientId, eventName }) => {
    console.log(`Client ${clientId} requests all messages for event ${eventName}`);
    const messages = eventName === 'pickup' ? driverQueue.getAll(clientId) : vendorQueue.getAll(clientId);

    messages.forEach((message) => {
      socket.emit(eventName, message);
    });
  });

  // Handle the 'received' event to remove a message from the queue
  socket.on('received', ({ clientId, eventName, messageId }) => {
    console.log(`Client ${clientId} received message ${messageId} for event ${eventName}`);
    if (eventName === 'pickup') {
      driverQueue.remove(clientId, messageId);
    } else if (eventName === 'delivered') {
      vendorQueue.remove(clientId, messageId);
    }
  });

  // Event listeners for 'pickup', 'in-transit', and 'delivered'
  socket.on('pickup', (payload) => {
    console.log('Event: pickup', payload);
    driverQueue.add(payload.vendorId, payload); // Add the message to the driver queue
    io.to('pickup').emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    console.log('Event: in-transit', payload);
    io.to('in-transit').emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    console.log('Event: delivered', payload);
    vendorQueue.add(payload.vendorId, payload); // Add the message to the vendor queue
    io.to('delivered').emit('delivered', payload);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Socket.io server running on port ${port}`);
  });
}

module.exports = server;
