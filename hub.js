'use strict';

// Import the global event pool
const events = require('./eventPool.js');

// Import the vendor and driver handlers
const vendorHandler = require('./vendor/handler.js');
const driverHandler = require('./driver/handler.js');

// Initialize the vendor and driver event handlers
vendorHandler(events);
driverHandler(events);

// This module listens to all events in the event pool and logs a timestamp and the payload of every event
events.on('pickup', handleEvent);
events.on('in-transit', handleEvent);
events.on('delivered', handleEvent);

// The event handler function that will log the event information
function handleEvent(event) {
  console.log('EVENT:', {
    event: event.event,
    time: new Date(),
    payload: event.payload,
  });
}

// Start the pickup simulation process
events.emit('pickup', {
  event: 'pickup',
  payload: {
    store: '1-206-flowers',
    orderId: 'e3669048-7313-427b-b6cc-74010ca1f8f0',
    customer: 'Jamal Braun',
    address: 'Schmittfort, LA'
  }
});
