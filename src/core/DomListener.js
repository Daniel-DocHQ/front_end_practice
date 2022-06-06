import { capitalize } from "./utils";

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error("Root node is not provided for DomListener");
    }
    this.$root = $root;
    this.listeners = listeners;
  }

  initDomListeners() {
    this.listeners.forEach((listener) => {
      const method = getMethodName(listener);
      if (!this[method]) {
        throw new Error(
          `Method ${method} is not implemented in ${this.name} Component`
        );
      }
      this[method] = this[method].bind(this);
      this.$root.$el.addEventListener(listener, this[method]);
    });
  }

  removeDomListeners() {
    this.listeners.forEach((listener) => {
      const method = getMethodName(listener);
      const root = this.$root;
      this.$root.$el.removeEventListener(listener, this[method]);
      console.log(`Removed ${listener} listener from ${root}.`);
    });
  }
}

// click => onClick
function getMethodName(eventName) {
  return "on" + capitalize(eventName);
}
