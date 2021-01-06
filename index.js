var domElement = function (selector) {
  this.selector = selector || null;
  this.element = null;
};

domElement.prototype.init = function () {
  switch (this.selector[0]) {
    case "<":
      var matches = this.selector.match(/<([\w-]*)>/);
      if (matches === null || matches === undefined) {
        throw "Invalid Selector / Node";
        return false;
      }
      var nodeName = matches[0].replace("<", "").replace(">", "");
      this.element = document.createElement(nodeName);
      break;
    default:
      this.element = document.querySelector(this.selector);
  }
};

domElement.prototype.on = function (event, callback) {
  var evt = this.eventHandler.bindEvent(event, callback, this.element);
};

domElement.prototype.off = function (event) {
  var evt = this.eventHandler.unbindEvent(event, this.element);
};

domElement.prototype.val = function (newVal) {
  return newVal !== undefined
    ? (this.element.value = newVal)
    : this.element.value;
};

domElement.prototype.aftrender = function (html) {
  this.element.innerHTML = this.element.innerHTML + html;
};

domElement.prototype.prerender = function (html) {
  this.element.innerHTML = html + this.element.innerHTML;
};

domElement.prototype.render = function (html) {
  if (html === undefined) {
    return this.element.innerHTML;
  }
  this.element.innerHTML = html;
};

domElement.prototype.eventHandler = {
  events: [],
  bindEvent: function (event, callback, targetElement) {
    this.unbindEvent(event, targetElement);
    targetElement.addEventListener(event, callback, false);
    this.events.push({
      type: event,
      event: callback,
      target: targetElement,
    });
  },
  findEvent: function (event) {
    return this.events.filter(function (evt) {
      return evt.type === event;
    }, event)[0];
  },
  unbindEvent: function (event, targetElement) {
    var foundEvent = this.findEvent(event);
    if (foundEvent !== undefined) {
      targetElement.removeEventListener(event, foundEvent.event, false);
    }
    this.events = this.events.filter(function (evt) {
      return evt.type !== event;
    }, event);
  },
};

verge = function (selector) {
  var el = new domElement(selector);
  el.init();
  return el;
};

module.exports = verge;