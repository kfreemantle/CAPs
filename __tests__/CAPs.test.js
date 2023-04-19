'use strict';

const io = require('socket.io-client');
const { server } = require('../server');
const port = process.env.PORT || 3000;

const host = `http://localhost:${port}`;
const capsNamespace = `${host}/caps`;

const options = {
  transports: ['websocket'],
  forceNew: true,
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
    clientSocket = io.connect(capsNamespace, options);
    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  // Test for 'pickup' event emission
  test('simulatePickup should emit pickup event', (done) => {
    // Listen for the 'pickup' event on the client socket
    clientSocket.on('pickup', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      done();
    });

    // Emit a 'pickup' event from the client socket to simulate a new order
    clientSocket.emit('pickup', {
      vendorId: 'test-vendor',
      orderId: 'test-order',
      customer: 'test-customer',
      address: 'test-address',
    });
  });

  // Test for 'in-transit' event handler
  test('vendorHandler should handle in-transit event', (done) => {
    // Listen for the 'in-transit' event on the client socket
    clientSocket.on('in-transit', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      done();
    });

    // Emit a 'pickup' event from the client socket to simulate a new order
    clientSocket.emit('pickup', {
      vendorId: 'test-vendor',
      orderId: 'test-order',
      customer: 'test-customer',
      address: 'test-address',
    });
  });

  // Test for 'delivered' event handler
  test('vendorHandler should handle delivered event', (done) => {
    // Listen for the 'delivered' event on the client socket
    clientSocket.on('delivered', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      done();
    });

    // Emit a 'pickup' event from the client socket to simulate a new order
    clientSocket.emit('pickup', {
      vendorId: 'test-vendor',
      orderId: 'test-order',
      customer: 'test-customer',
      address: 'test-address',
    });
  });
});
