import { SOCKETS } from "../ws";
import { CbImplementation } from "./CbImplementation";
import { IMessageBroker, SubscriberCb } from "./IMessageBroker";

class MessageBroker implements IMessageBroker {
  constructor(private implementation: IMessageBroker) {}

  send(topic: string, message: string) {
    this.implementation.send(topic, message);
  }

  subscribe(topic: string, callback: SubscriberCb) {
    this.implementation.subscribe(topic, callback);
  }
}

const cbImplementation = new CbImplementation();

export const messageBroker = new MessageBroker(cbImplementation);

messageBroker.subscribe("get-reservations", (message) => {
  SOCKETS.forEach((socket) => {
    socket.send(message, false, true);
  });
});
