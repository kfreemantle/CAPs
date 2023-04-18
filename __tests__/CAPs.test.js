'use strict';

const io = require('socket.io-client');
const socketURL = 'http://localhost:3000/caps';

const options = {
  transports: ['websocket'],
  'force new connection': true,
};

// Connect to the CAPs server using a test client
const clientSocket = io.connect(socketURL, options);

describe('CAPs Event Handlers', () => {
  // Before each test, remove all existing listeners for the 'pickup', 'in-transit', and 'delivered' events
  beforeEach(() => {
    clientSocket.removeAllListeners('pickup');
    clientSocket.removeAllListeners('in-transit');
    clientSocket.removeAllListeners('delivered');
  });

  // Test for 'pickup' event emission
  test('simulatePickup should emit pickup event', (done) => {
    // Listen for the 'pickup' event on the client socket
    clientSocket.on('pickup', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      // Signal that the test is complete by calling the done() function
      done();
    });
    // Emit a 'test-pickup' event to trigger the pickup event emission in the server
    clientSocket.emit('test-pickup');
  });

  // Test for 'in-transit' event handler
  test('vendorHandler should handle in-transit event', (done) => {
    // Listen for the 'in-transit' event on the client socket
    clientSocket.on('in-transit', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      // Signal that the test is complete by calling the done() function
      done();
    });
    // Emit a 'test-pickup' event to trigger the pickup event emission in the server
    clientSocket.emit('test-pickup');
  });

  // Test for 'delivered' event handler
  test('vendorHandler should handle delivered event', (done) => {
    // Listen for the 'delivered' event on the client socket
    clientSocket.on('delivered', (payload) => {
      // When the event is emitted, check if the payload is defined
      expect(payload).toBeDefined();
      // Signal that the test is complete by calling the done() function
      done();
    });
    // Emit a 'test-pickup' event to trigger the pickup event emission in the server
    clientSocket.emit('test-pickup');
  });
});
