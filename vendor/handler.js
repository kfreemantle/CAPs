"use strict";

const Chance = require('chance');
const chance = new Chance();

// The simulatePickup function takes the storeName and an optional event pool as parameters
function simulatePickup(storeName, eventPool = require('../eventPool.js')) {
  // Create a simulated order payload with random customer and address data
  const payload = {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: `${chance.city()}, ${chance.state()}`,
  };

  // Emit a 'pickup' event to the event pool with the payload
  eventPool.emit('pickup', {
    event: 'pickup',
    time: new Date().toISOString(),
    payload,
  });

  // Listen for the 'delivered' event from the event pool
  eventPool.on('delivered', (event) => {
    if (event.payload.orderId === payload.orderId) {
      console.log(`VENDOR: Thank you for delivering ${event.payload.orderId}`);
    }
  });
}

module.exports = simulatePickup;
