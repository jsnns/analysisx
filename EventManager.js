/**
 * Created by jacobsansbury on 3/28/18.
 */
import { Singleton } from './util'

/** Basic EventManager used to queue and track events. */
class EventManager {
  /**
   * Create the EventManager
   * @param {Function} fire - the method to call when dequeue-ing an event.
   */
  constructor(fire) {
    this.fire = fire;
    // FIFO queue;
    this.queue = [];
  }

  /**
   * Queue an event.
   * @param {BaseTracker} event - the event to queue.
   */
  add(event) {
    this.queue.unshift(event);
    this.dequeue();
  }

  /**
   * @private manages dequeue-ing events.
   */
  dequeue() {
    const event = this.queue.pop();
    this.fire(event);
    if (this.queue.length > 0) this.dequeue();
  }
}

export default Singleton(EventManager);
