export type Events = Record<string, unknown>;

export type Listener<Data = any> = (...args: Data[]) => void;

export class EventBus<EventsData extends Events> {
  private listeners: Map<keyof EventsData, Set<Listener>> = new Map();

  on<Key extends keyof EventsData>(
    event: Key,
    callback: (...args: Listener<EventsData[Key]>[]) => void
  ) {
    const eventListenersSet = this.listeners.get(event);

    if (!eventListenersSet) {
      this.listeners.set(event, new Set([callback]));
    } else {
      eventListenersSet.add(callback);
    }
  }

  off<Key extends keyof EventsData>(
    event: string,
    callback: (...args: Listener<EventsData[Key]>[]) => void
  ) {
    const eventListenersSet = this.listeners.get(event);

    if (!eventListenersSet) {
      throw new Error(`No event ${event}`);
    } else {
      eventListenersSet.delete(callback);
    }
  }

  emit<Key extends keyof EventsData>(
    event: string,
    ...args: EventsData[Key][]
  ) {
    const eventListenersSet = this.listeners.get(event);

    if (eventListenersSet) {
      eventListenersSet.forEach((listener) => listener(...args));
    }
  }
}
