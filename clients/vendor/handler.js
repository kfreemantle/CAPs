"use strict";

const Chance = require('chance');
const chance = new Chance();

function handlePickup() {
  const payload = {
    vendorId: '1-206-flowers',
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address(),
  };

  console.log('New order:', payload);
  this.emit('pickup', payload);
}

// New event handlers for 'in-transit' and 'delivered' events
function handleInTransit(payload) {
  console.log(`VENDOR: Order ${payload.orderId} is in transit`);
}

function handleDelivered(payload) {
  console.log(`VENDOR: Order ${payload.orderId} has been delivered`);
}

module.exports = { handlePickup, handleInTransit, handleDelivered };
