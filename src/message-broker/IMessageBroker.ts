export type SubscriberCb = (message: string) => void;

export interface IMessageBroker {
  send: (topic: string, message: string) => void;

  subscribe: (topic: string, callback: SubscriberCb) => void;
}
