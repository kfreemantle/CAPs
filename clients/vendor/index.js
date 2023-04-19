"use strict";

const io = require("socket.io-client");
const handler = require("./handler");

const host = process.env.HOST || "http://localhost:3000/caps";
const socket = io.connect(host);

// Register the event listeners for the vendor
socket.on("in-transit", handler.handleInTransit);
socket.on("delivered", handler.handleDelivered);

// Emit the 'pickup' event every 5 seconds
setInterval(() => {
  handler.handlePickup.call(socket);
}, 5000);
