import { KafkaImplementation } from "./KafkaImplementation";
import { RxJSImplementation } from "./RxJSImplementation";

class MessageBroker {
  constructor() {
    this.implementation = null;
  }

  setImplementation(implementation) {
    this.implementation = implementation;
  }

  send(topic, message) {
    this.implementation.send(topic, message);
  }

  subscribe(topic, callback) {
    this.implementation.subscribe(topic, callback);
  }
}

export const messageBroker = new MessageBroker();

// Use Kafka as the messaging technology
messageBroker.setImplementation(new KafkaImplementation());

// Use RxJS as the messaging technology
messageBroker.setImplementation(new RxJSImplementation());
