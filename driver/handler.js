"use strict";

// The driverHandler function takes an optional event pool as a parameter
function driverHandler(eventPool = require('../eventPool.js')) {

  // Listen for the 'pickup' event from the event pool
  eventPool.on('pickup', (event) => {
    console.log(`DRIVER: Picked up ${event.payload.orderId}`);

    // Emit an 'in-transit' event to the event pool with the payload
    eventPool.emit('in-transit', {
      event: 'in-transit',
      time: new Date().toISOString(),
      payload: event.payload,
    });

    // Simulate a delivery delay and then emit a 'delivered' event to the event pool with the payload
    setTimeout(() => {
      console.log(`DRIVER: Delivered ${event.payload.orderId}`);
      eventPool.emit('delivered', {
        event: 'delivered',
        time: new Date().toISOString(),
        payload: event.payload,
      });
    }, 3000);
  });
}

module.exports = driverHandler;
