export type SubscriberCb = (message: string) => void;

export interface MessageBroker {
  send: (topic: string, message: string) => void;

  subscribe: (topic: string, callback: SubscriberCb) => void;
}
