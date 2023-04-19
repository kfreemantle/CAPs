'use strict';

function delivered(socket, payload) {
  console.log(`VENDOR: Order ${payload.orderId} has been delivered`);
  socket.emit('received', { clientId: 'ACME Widgets', eventName: 'delivered', messageId: payload.orderId });
}

module.exports = {
  delivered,
};
