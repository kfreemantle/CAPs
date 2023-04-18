"use strict";

// // Import the driver handler module (it will automatically start listening for events)
// require('./handler.js');

const io = require("socket.io-client");
const handler = require("./handler");

const host = process.env.HOST || "http://localhost:3000/caps";
const socket = io.connect(host);

// Register the event listeners for the driver
socket.on("pickup", handler.handlePickup);
socket.on("in-transit", handler.handleInTransit);
socket.on("delivered", handler.handleDelivered);
