'use strict';

const io = require('socket.io-client');
const server = require('../server/index');
const port = 3000;

const host = `http://localhost:${port}`;

const simulatePickup = (clientSocket, payload) => {
  clientSocket.emit('pickup', payload);
};

describe('CAPs Event Handlers', () => {
  let clientSocket;

  beforeAll((done) => {
    server.listen(port, () => done());
  });

  afterAll((done) => {
    server.close(() => done());
  });

  beforeEach((done) => {
    clientSocket = io.connect(host, { forceNew: true });
    clientSocket.on('connect', () => done());
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  // Test for 'pickup' event emission
  test('simulatePickup should emit pickup event', (done) => {
    const pickupPayload = {
      vendorId: 'test-vendor',
      orderId: 'test-order',
      customer: 'test-customer',
      address: 'test-address',
    };

    clientSocket.on('pickup', (payload) => {
      expect(payload).toBeDefined();
      expect(payload).toEqual(pickupPayload);
      done();
    });

    simulatePickup(clientSocket, pickupPayload);
  });

  // Test for 'in-transit' event handler
  test('CAPs should handle in-transit event', (done) => {
    // Listen for the 'in-transit' event on the client socket
    clientSocket.on('in-transit', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      done();
    });

    // Emit the 'in-transit' event to trigger the event handler
    clientSocket.emit('in-transit', {});
  });

  // Test for 'delivered' event handler
  test('CAPs should handle delivered event', (done) => {
    // Listen for the 'delivered' event on the client socket
    clientSocket.on('delivered', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      done();
    });

    // Emit the 'delivered' event to trigger the event handler
    clientSocket.emit('delivered', {});
  });
});
