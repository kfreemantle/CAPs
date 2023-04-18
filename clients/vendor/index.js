"use strict";

// // Import the simulatePickup function from the handler
// const simulatePickup = require('./handler.js');

// // Trigger a simulated package pickup event for a given store name
// simulatePickup('1-206-flowers');

const io = require('socket.io-client');
const { handlePickup } = require('./handler');

const socket = io.connect('http://localhost:3000/caps');

const vendorId = '1-206-flowers';
socket.emit('join', vendorId);

socket.on('pickup', handlePickup);
socket.on('delivered', (payload) => {
  console.log(`Thank you for your order ${payload.customer}`);
});
