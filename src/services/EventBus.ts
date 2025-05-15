export type Events = Record<string, unknown>;
export type Listener<Data = unknown> = Data extends unknown[]
  ? (...args: Data) => void
  : (arg: Data) => void;

export class EventBus<EventsData extends Events> {
  private listeners = new Map<keyof EventsData, Set<Listener>>();

  on<Key extends keyof EventsData>(
    event: Key,
    callback: Listener<EventsData[Key]>
  ): void {
    const handlers = this.listeners.get(event);
    if (!handlers) {
      this.listeners.set(event, new Set([callback]));
    } else {
      handlers.add(callback);
    }
  }

  off<Key extends keyof EventsData>(
    event: Key,
    callback: Listener<EventsData[Key]>
  ): void {
    const handlers = this.listeners.get(event);
    if (!handlers) {
      throw new Error(`No listeners for event "${String(event)}"`);
    }
    handlers.delete(callback);
  }

  emit<Key extends keyof EventsData>(
    event: Key,
    ...args: EventsData[Key] extends unknown[]
      ? EventsData[Key]
      : [EventsData[Key]]
  ): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => fn.apply(undefined, [args]));
    }
  }
}
