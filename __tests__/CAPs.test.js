'use strict';

const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const Queue = require("../server/lib/queue");
const driverHandler = require("../clients/driver/handler");
const flowerVendorHandler = require("../clients/flower-vendor/handler");
const widgetVendorHandler = require("../clients/widget-vendor/handler");

beforeAll((done) => {
  // Create the server instance and start the server
  server = createServer(caps.app);
  caps.start(server);

  // Create the serverSocket instance
  serverSocket = caps.io();

  // Connect the driver client to the server
  driverSocket = caps.io("http://localhost:3000");
  driverSocket.on("connect", () => {
    // Set the driver's event listeners
    driverSocket.on("pickup", (payload) => {
      driverHandler.pickup(driverSocket, payload);
    });
    driverSocket.on("delivered", (payload) => {
      driverHandler.delivered(driverSocket, payload);
    });
  });

  // Connect the flower vendor client to the server
  flowerVendorSocket = caps.io("http://localhost:3000");
  flowerVendorSocket.on("connect", () => {
    // Set the flower vendor's event listeners
    flowerVendorSocket.on("delivered", (payload) => {
      flowerVendorHandler.delivered(flowerVendorSocket, payload);
    });
  });

  // Connect the widget vendor client to the server
  widgetVendorSocket = caps.io("http://localhost:3000");
  widgetVendorSocket.on("connect", () => {
    // Set the widget vendor's event listeners
    widgetVendorSocket.on("delivered", (payload) => {
      widgetVendorHandler.delivered(widgetVendorSocket, payload);
    });
  });

  done();
});

afterAll((done) => {
  // Close the server and client sockets
  driverSocket.close();
  flowerVendorSocket.close();
  widgetVendorSocket.close();
  server.close(done);
});

describe("driverHandler", () => {
  test("pickup event should log and emit the in-transit event", () => {
    const logSpy = jest.spyOn(console, "log");
    const emitSpy = jest.fn();

    const socket = { emit: emitSpy };
    const payload = { orderId: "1234", store: "test-store" };

    driverHandler.pickup(socket, payload);

    expect(logSpy).toHaveBeenCalledWith(`DRIVER: Picked up order ${payload.orderId}`);
    expect(emitSpy).toHaveBeenCalledWith("in-transit", payload);
  });

  test("delivered event should log and emit the delivered event", () => {
    const logSpy = jest.spyOn(console, "log");
    const emitSpy = jest.fn();

    const socket = { emit: emitSpy };
    const payload = { orderId: "1234", store: "test-store" };

    driverHandler.delivered(socket, payload);

    expect(logSpy).toHaveBeenCalledWith(`DRIVER: Delivered order ${payload.orderId}`);
    expect(emitSpy).toHaveBeenCalledWith("delivered", payload);
  });
});

describe("flowerVendorHandler", () => {
  test("delivered event should log and emit the received event", () => {
    const logSpy = jest.spyOn(console, "log");
    const emitSpy = jest.fn();

    const socket = { emit: emitSpy };
    const payload = { orderId: "1234", store: "1-800-flowers" };

    flowerVendorHandler.delivered(socket, payload);

    expect(logSpy).toHaveBeenCalledWith(`FLOWER VENDOR: Order ${payload.orderId} delivered`);
    expect(emitSpy).toHaveBeenCalledWith("received", {
      clientId: payload.store,
      eventName: "delivered",
      messageId: payload.orderId,
    });
  });
});

describe("widgetVendorHandler", () => {
  test("delivered event should log and emit the received event", () => {
    const logSpy = jest.spyOn(console, "log");
    const emitSpy = jest.fn();

    const socket = { emit: emitSpy };
    const payload = { orderId: "1234", store: "widget-vendor" };

    widgetVendorHandler.delivered(socket, payload);

    expect(logSpy).toHaveBeenCalledWith(`WIDGET VENDOR: Order ${payload.orderId} delivered`);
    expect(emitSpy).toHaveBeenCalledWith("received", {
      clientId: payload.store,
      eventName: "delivered",
      messageId: payload.orderId,
    });
  });
});

describe("Server queue functionality", () => {
  test("Server should add payload to the appropriate queue", () => {
    const payload = { orderId: "testOrderId", store: "1-800-flowers" };
    serverSocket.emit("pickup", payload);
    expect(Queue.pickupQueue).toContain(payload);
  });

  test("Server should remove payload from the queue after it's received by the client", (done) => {
    const payload = { orderId: "testOrderId", store: "1-800-flowers" };
    flowerVendorSocket.emit("received", { clientId: payload.store, eventName: "delivered", messageId: payload.orderId });
    setTimeout(() => {
      expect(Queue.deliveredQueue[payload.store]).not.toContain(payload.orderId);
      done();
    }, 1000);
  });

  test("Clients should subscribe to appropriate queues", (done) => {
    clientSocket.emit("subscribe", { clientId: "1-800-flowers", eventName: "delivered" });
    clientSocket.emit("subscribe", { clientId: "widget-vendor", eventName: "delivered" });
    setTimeout(() => {
      expect(Queue.subscribers.delivered["1-800-flowers"]).toBeDefined();
      expect(Queue.subscribers.delivered["widget-vendor"]).toBeDefined();
      done();
    }, 1000);
  });

  test("Clients should request undelivered messages from the server", (done) => {
    flowerVendorSocket.emit("getAll", { clientId: "1-800-flowers", eventName: "delivered" });
    flowerVendorSocket.on("delivered", (payload) => {
      expect(payload).toEqual({ orderId: "testDriverPickup", store: "1-800-flowers" });
      done();
    });
  });
});
