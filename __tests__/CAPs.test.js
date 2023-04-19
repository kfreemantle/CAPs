'use strict';

const { Server } = require("socket.io");
const Client = require("socket.io-client");
const caps = require("../server");
const driverHandler = require("../clients/driver/handler");
const flowerVendorHandler = require("../clients/flower-vendor/handler");
const widgetVendorHandler = require("../clients/widget-vendor/handler");
const Queue = require("../server/lib/queue");

// Test for the driverHandler functionality
describe("driverHandler", () => {
  // Test for the pickup event
  test("pickup event should log and emit the in-transit event", () => {
    const socket = { emit: jest.fn() };
    const payload = { orderId: "1234", store: "test-store" };
    driverHandler.pickup(socket, payload);

    // Check if the console.log and emit were called with the correct arguments
    expect(console.log).toHaveBeenCalledWith(`DRIVER: Picking up order ${payload.orderId}`);
    expect(socket.emit).toHaveBeenCalledWith("in-transit", payload);
  });

  // Test for the delivered event
  test("delivered event should log and emit the delivered event", () => {
    const socket = { emit: jest.fn() };
    const payload = { orderId: "1234", store: "test-store" };
    driverHandler.delivered(socket, payload);

    // Check if the console.log and emit were called with the correct arguments
    expect(console.log).toHaveBeenCalledWith(`DRIVER: Delivered order ${payload.orderId}`);
    expect(socket.emit).toHaveBeenCalledWith("delivered", payload);
  });
});

// Test for the flowerVendorHandler functionality
describe("flowerVendorHandler", () => {
  // Test for the delivered event
  test("delivered event should log and emit the received event", () => {
    const socket = { emit: jest.fn() };
    const payload = { orderId: "1234", store: "1-800-flowers" };
    flowerVendorHandler.delivered(socket, payload);

    // Check if the console.log and emit were called with the correct arguments
    expect(console.log).toHaveBeenCalledWith(`FLOWER VENDOR: Order ${payload.orderId} delivered`);
    expect(socket.emit).toHaveBeenCalledWith("received", {
      clientId: payload.store,
      eventName: "delivered",
      messageId: payload.orderId,
    });
  });
});

// Test for the widgetVendorHandler functionality
describe("widgetVendorHandler", () => {
  // Test for the delivered event
  test("delivered event should log and emit the received event", () => {
    const socket = { emit: jest.fn() };
    const payload = { orderId: "1234", store: "acme-widgets" };
    widgetVendorHandler.delivered(socket, payload);

    // Check if the console.log and emit were called with the correct arguments
    expect(console.log).toHaveBeenCalledWith(`WIDGET VENDOR: Order ${payload.orderId} delivered`);
    expect(socket.emit).toHaveBeenCalledWith("received", {
      clientId: payload.store,
      eventName: "delivered",
      messageId: payload.orderId,
    });
  });
});

// Test for the server queue functionality
describe("Server queue functionality", () => {
  let io, serverSocket, clientSocket, flowerVendorSocket, widgetVendorSocket, driverSocket;

  // Set up the sockets before running the tests
beforeAll((done) => {
  const httpServer = caps.server;
  io = new Server(httpServer);

  serverSocket = caps.io;
  clientSocket = new Client("http://localhost:3000/caps");
  flowerVendorSocket = new Client("http://localhost:3000/caps");
  widgetVendorSocket = new Client("http://localhost:3000/caps");
  driverSocket = new Client("http://localhost:3000/caps");

  done();
});

// Clean up the sockets after running the tests
afterAll(() => {
  io.close();
  clientSocket.close();
  flowerVendorSocket.close();
  widgetVendorSocket.close();
  driverSocket.close();
});

test("Server should add payload to the appropriate queue", () => {
  const payload = { orderId: "testOrderId", store: "1-800-flowers" };
  serverSocket.emit("pickup", payload);
  expect(Queue.pickupQueue).toContain(payload);
});

test("Server should remove payload from the queue after it's received by the client", (done) => {
  flowerVendorSocket.emit("received", { clientId: "1-800-flowers", eventName: "delivered", messageId: "testOrderId" });
  setTimeout(() => {
    expect(Queue.deliveredQueue["1-800-flowers"]).not.toContain("testOrderId");
    done();
  }, 1000);
});

test("Clients should subscribe to appropriate queues", (done) => {
  // Emit a test pickup event and check if the driver receives it
  clientSocket.emit("pickup", { orderId: "testDriverPickup", store: "1-800-flowers" });
  driverSocket.on("pickup", (payload) => {
    expect(payload).toEqual({ orderId: "testDriverPickup", store: "1-800-flowers" });
    done();
  });
});

test("Clients should request undelivered messages from the server", (done) => {
  flowerVendorSocket.emit("getAll", { clientId: "1-800-flowers", eventName: "delivered" });
  flowerVendorSocket.on("delivered", (payload) => {
    expect(payload).toEqual({ orderId: "testDriverPickup", store: "1-800-flowers" });
    done();
  });
});
});

