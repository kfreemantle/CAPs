'use strict';

class Queue {
  constructor() {
    this.queue = {};
  }

  // Add a message to the client's queue
  add(clientId, message) {
    if (!this.queue[clientId]) {
      this.queue[clientId] = [];
    }
    this.queue[clientId].push(message);
  }

  // Remove a message from the client's queue
  remove(clientId, messageId) {
    if (this.queue[clientId]) {
      this.queue[clientId] = this.queue[clientId].filter((message) => message.orderId !== messageId);
    }
  }

  // Get all messages for the specified client
  getAll(clientId) {
    return this.queue[clientId] || [];
  }
}

module.exports = Queue;
