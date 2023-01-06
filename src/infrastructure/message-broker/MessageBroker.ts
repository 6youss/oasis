import { IMessageBroker, SubscriberCb } from "./IMessageBroker";

export class MessageBroker implements IMessageBroker {
  constructor(private implementation: IMessageBroker) {}

  send(topic: string, message: string) {
    this.implementation.send(topic, message);
  }

  subscribe(topic: string, callback: SubscriberCb) {
    this.implementation.subscribe(topic, callback);
  }
}
