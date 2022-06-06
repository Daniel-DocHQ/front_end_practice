import { DomListener } from "./DomListener";

export class ExcelComponent extends DomListener {
  constructor($root, options) {
    super($root, options.listeners);
    this.name = options.name;
  }

  static logRoot() {
    return this.root;
  }

  toHTML() {
    return "";
  }

  init() {
    this.initDomListeners();
  }

  destroy() {
    this.removeDomListeners();
  }
}
