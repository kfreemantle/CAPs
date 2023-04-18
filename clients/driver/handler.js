"use strict";

function handlePickup(payload) {
  console.log(`DRIVER: Picked up ${payload.orderId}`);
  
  // Simulate some time passing before emitting the 'in-transit' event
  setTimeout(() => {
    this.emit('in-transit', payload);
  }, 1000);

  setTimeout(() => {
    this.emit('delivered', payload);
  }, 3000);
}

function handleInTransit(payload) {
  console.log(`DRIVER: In transit ${payload.orderId}`);
}

function handleDelivered(payload) {
  console.log(`DRIVER: Delivered ${payload.orderId}`);
}

module.exports = { handlePickup, handleInTransit, handleDelivered };
