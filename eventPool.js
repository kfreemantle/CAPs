"use strict";

// Import the EventEmitter from the 'events' module in Node.js
const { EventEmitter } = require('events');

// Create a new instance of EventEmitter and export it
// This will be the global event pool for our application
module.exports = new EventEmitter();

// the whole purpose of the eventPool file is to act as the global emitter, I think?