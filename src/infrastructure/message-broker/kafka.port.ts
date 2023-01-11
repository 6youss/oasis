import { KafkaClient, Producer, Consumer } from "kafka-node";
import { MessageBroker } from "./message-broker.adapter";

export class MbKafkaImplementation implements MessageBroker {
  client: KafkaClient | undefined;
  producer: Producer | undefined;
  consumer: Consumer | undefined;

  constructor() {}

  init() {
    this.client = new KafkaClient();
    this.producer = new Producer(this.client);
    this.consumer = new Consumer(this.client, [], { autoCommit: true });
  }

  send(topic: string, message: string) {
    if (!this.producer) {
      console.error("kafka not initialized, call init() before");
      return;
    }
    this.producer.send([{ topic, messages: message }], (error, result) => {
      console.log(error || result);
    });
  }

  subscribe(topic: string, callback: (message: string) => void) {
    if (!this.consumer) {
      console.error("kafka not initialized, call init() before");
      return;
    }
    this.consumer.addTopics([topic], () => {});
    this.consumer.on("message", (message) => {
      callback(message.value.toString());
    });
  }
}
