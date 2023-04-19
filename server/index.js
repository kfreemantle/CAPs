'use strict';

const io = require('socket.io')(3000, {
  cors: {
    origin: '*',
  },
});
console.log('Socket.io server running on port 3000');

const capsNamespace = io.of('/caps');

capsNamespace.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // Allow clients to join a room
  socket.on('join', (room) => {
    console.log('Joining room:', room);
    socket.join(room);
  });

  // Listen for 'pickup' event and broadcast it
  socket.on('pickup', (payload) => {
    console.log('pickup:', payload);
    capsNamespace.emit('pickup', payload);
  });

  // Listen for 'in-transit' event and emit it to the specific vendor
  socket.on('in-transit', (payload) => {
    console.log('in-transit:', payload);
    socket.to(payload.vendorId).emit('in-transit', payload);
  });

  // Listen for 'delivered' event and emit it to the specific vendor
  socket.on('delivered', (payload) => {
    console.log('delivered:', payload);
    socket.to(payload.vendorId).emit('delivered', payload);
  });
});
