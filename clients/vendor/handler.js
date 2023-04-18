"use strict";

function handlePickup(payload) {
  console.log(`DRIVER: Picked up ${payload.orderId}`);
  this.emit("in-transit", payload);

  setTimeout(() => {
    this.emit("delivered", payload);
  }, 3000);
}

function handleInTransit(payload) {
  console.log(`DRIVER: In transit ${payload.orderId}`);
}

function handleDelivered(payload) {
  console.log(`DRIVER: Delivered ${payload.orderId}`);
}

module.exports = { handlePickup, handleInTransit, handleDelivered };
