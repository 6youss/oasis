import { IMessageBroker } from "./IMessageBroker";

import { KafkaClient, Producer, Consumer } from "kafka-node";

export class KafkaImplementation implements IMessageBroker {
  client = new KafkaClient();
  producer = new Producer(this.client);
  consumer = new Consumer(this.client, [], { autoCommit: true });

  constructor() {}

  send(topic: string, message: string) {
    this.producer.send([{ topic, messages: message }], (error, result) => {
      console.log(error || result);
    });
  }

  subscribe(topic: string, callback: (message: string) => void) {
    this.consumer.addTopics([topic], () => {});
    this.consumer.on("message", (message) => {
      callback(message.value.toString());
    });
  }
}
