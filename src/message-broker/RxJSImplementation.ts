const { Subject } = require("rxjs");

export class RxJSImplementation {
  constructor() {
    this.subjects = new Map();
  }

  send(topic, message) {
    if (!this.subjects.has(topic)) {
      this.subjects.set(topic, new Subject());
    }
    this.subjects.get(topic).next(message);
  }

  subscribe(topic, callback) {
    if (!this.subjects.has(topic)) {
      this.subjects.set(topic, new Subject());
    }
    this.subjects.get(topic).subscribe(callback);
  }
}
