export default class EventManager {
  constructor() {
    this.events = [];
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this.clearEventListeners = this.clearEventListeners.bind(this);
  }

  addEventListener(target, event, handler) {
    this.events.push({ target, event, handler });
    target.addEventListener(event, handler);
  }

  removeEventListener(target, event) {
    const toBeRemoved = this.events.find(e => (e.target === target && e.event === event));
    toBeRemoved.target.removeEventListener(toBeRemoved.event, toBeRemoved.handler);
  }

  clearEventListeners() {
    this.events.forEach(({ target, event, handler }) => target.removeEventListener(event, handler));
  }
}
