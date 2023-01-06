import { IMessageBroker, SubscriberCb } from "./IMessageBroker";

export class MbCbImplementation implements IMessageBroker {
  subscribers = new Map<string, Set<(message: string) => void>>();

  constructor() {}

  send(topic: string, message: string) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.forEach((subscriber) => subscriber(message));
  }

  subscribe(topic: string, callback: SubscriberCb) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(callback);
  }
}
