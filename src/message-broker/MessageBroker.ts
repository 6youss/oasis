import { IMessageBroker, SubscriberCb } from "./IMessageBroker";
import { KafkaImplementation } from "./KafkaImplementation";

class MessageBroker implements IMessageBroker {
  constructor(private implementation: IMessageBroker) {}

  send(topic: string, message: string) {
    this.implementation.send(topic, message);
  }

  subscribe(topic: string, callback: SubscriberCb) {
    this.implementation.subscribe(topic, callback);
  }
}

const kafkaImplementation = new KafkaImplementation();

export const messageBroker = new MessageBroker(kafkaImplementation);
