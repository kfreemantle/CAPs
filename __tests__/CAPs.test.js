'use strict';

// Import the required modules
const { EventEmitter } = require('events');
const simulatePickup = require('../vendor/handler.js'); 
const driverHandler = require('../driver/handler.js'); 
const eventPool = require('../eventPool.js');

// Use a custom event pool for testing to avoid conflicts with the global event pool
const testEventPool = new EventEmitter();

// Mock the event pool's emit and on methods to capture calls
jest.spyOn(testEventPool, 'emit');
jest.spyOn(testEventPool, 'on');

// Reset the mock calls before each test
beforeEach(() => {
  testEventPool.emit.mockClear();
  testEventPool.on.mockClear();
});

// Test if the simulatePickup function emits the 'pickup' event with the correct payload
test('simulatePickup should emit the pickup event with the correct payload', () => {
  const storeName = '1-206-flowers';
  simulatePickup(storeName, testEventPool);

  expect(testEventPool.emit).toHaveBeenCalledWith(
    'pickup',
    expect.objectContaining({
      event: 'pickup',
      payload: expect.objectContaining({
        store: storeName,
      }),
    })
  );
});

// Test if the driverHandler listens for the 'pickup' event and emits the 'in-transit' event
test('driverHandler should emit the in-transit event when listening for the pickup event', () => {
  const pickupEvent = {
    event: 'pickup',
    payload: {
      store: '1-206-flowers',
      orderId: '12345',
      customer: 'John Doe',
      address: 'Seattle, WA',
    },
  };

  driverHandler(testEventPool);
  testEventPool.emit('pickup', pickupEvent);

  expect(testEventPool.emit).toHaveBeenCalledWith(
    'in-transit',
    expect.objectContaining({
      event: 'in-transit',
      payload: pickupEvent.payload,
    })
  );
});

// Test if the driverHandler listens for the 'pickup' event and emits the 'delivered' event
test('driverHandler should emit the delivered event after a delay when listening for the pickup event', (done) => {
  const pickupEvent = {
    event: 'pickup',
    payload: {
      store: '1-206-flowers',
      orderId: '12345',
      customer: 'John Doe',
      address: 'Seattle, WA',
    },
  };

  driverHandler(testEventPool);
  testEventPool.emit('pickup', pickupEvent);

  // Use setTimeout to wait for the delay in driverHandler before checking if the 'delivered' event was emitted
  setTimeout(() => {
    expect(testEventPool.emit).toHaveBeenCalledWith(
      'delivered',
      expect.objectContaining({
        event: 'delivered',
        payload: pickupEvent.payload,
      })
    );
    done();
  }, 3100);
});
