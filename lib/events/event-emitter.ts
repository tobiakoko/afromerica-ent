type EventCallback = (...args: any[]) => void | Promise<void>

class EventEmitter {
  private events = new Map<string, EventCallback[]>()

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  async emit(event: string, ...args: any[]): Promise<void> {
    const callbacks = this.events.get(event)
    if (callbacks) {
      await Promise.all(callbacks.map(cb => cb(...args)))
    }
  }
}

export const eventEmitter = new EventEmitter()