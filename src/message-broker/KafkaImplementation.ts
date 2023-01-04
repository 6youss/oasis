const { KafkaClient, Producer, Consumer } = require("kafka-node");

export class KafkaImplementation {
  constructor() {
    this.client = new KafkaClient();
    this.producer = new Producer(this.client);
    this.consumer = new Consumer(this.client, [], { autoCommit: true });
  }

  send(topic, message) {
    this.producer.send([{ topic, messages: message }], (error, result) => {
      console.log(error || result);
    });
  }

  subscribe(topic, callback) {
    this.consumer.addTopics([topic]);
    this.consumer.on("message", (message) => {
      callback(message.value);
    });
  }
}
