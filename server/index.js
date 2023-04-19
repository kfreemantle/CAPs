'use strict';

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Create an HTTP server with the express app as the request handler
const server = http.createServer(app);

// Create a new socket.io instance attached to the HTTP server
const io = socketIo(server);

// Setup the socket.io connection event handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Set up event listeners for the socket
  socket.on('pickup', (payload) => {
    console.log('Event: pickup', payload);
    // Emit 'pickup' event to all connected clients
    io.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    console.log('Event: in-transit', payload);
    // Emit 'in-transit' event to all connected clients
    io.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    console.log('Event: delivered', payload);
    // Emit 'delivered' event to all connected clients
    io.emit('delivered', payload);
  });

  // Handle the socket disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server only if this script is being run directly,
// not when it is being imported as a module (for testing)
if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Socket.io server running on port ${port}`);
  });
}

// Export the server instance to be used in tests
module.exports = server;
