class Dom {
  constructor(selector) {
    this.$el =
      typeof selector === "string"
        ? document.querySelector(selector) // selector its string
        : selector; // selector is DOM node
  }

  html(html) {
    if (typeof html === "string") {
      this.$el.innerHTML = html;
      return this;
    }
    return this.$el.outerHTML.trim(); // parameter is DOM node
  }

  clear() {
    this.html("");
    return this;
  }

  attribute(name, value = "") {
    this.$el.setAttribute(name, value);
    return this;
  }

  on(evenType, callback) {
    this.$el.addEventListener(evenType, callback);
  }

  findAll(selector) {
    return this.$el.querySelectorAll(selector);
  }

  find(selector) {
    return this.$el.querySelector(selector);
  }

  style() {
    return this.$el.style.type;
  }

  append(node) {
    if (node instanceof Dom) node = node.$el;

    if (Element.prototype.append) {
      this.$el.append(node);
    } else {
      this.$el.appendChild(node);
    }
    return this;
  }
}

export function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, classes = "") => {
  const nativeElement = document.createElement(tagName);
  if (classes) {
    nativeElement.classList.add(classes);
  }

  return $(nativeElement);
};
