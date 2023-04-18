"use strict";

// // Import the driver handler module (it will automatically start listening for events)
// require('./handler.js');

const io = require('socket.io-client');
const { handlePickup, handleInTransit, handleDelivered } = require('./handler');

const socket = io.connect('http://localhost:3000/caps');

socket.on('pickup', handlePickup.bind(socket));
socket.on('in-transit', handleInTransit);
socket.on('delivered', handleDelivered);
