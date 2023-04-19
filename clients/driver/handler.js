"use strict";

function pickup(socket, payload) {
  console.log(`DRIVER: Picked up order ${payload.orderId}`);
  setTimeout(() => {
    socket.emit('in-transit', payload);
    console.log(`DRIVER: Order ${payload.orderId} is in transit`);
  }, 1000);

  setTimeout(() => {
    socket.emit('delivered', payload);
    console.log(`DRIVER: Order ${payload.orderId} has been delivered`);
  }, 3000);
}

module.exports = {
  pickup,
};
