// Source: https://github.com/bencates/Jasmine-Prototype
var readFixtures = function() {
  return jasmine.getFixtures().proxyCallTo_('read', arguments);
};

var preloadFixtures = function() {
  jasmine.getFixtures().proxyCallTo_('preload', arguments);
};

var loadFixtures = function() {
  jasmine.getFixtures().proxyCallTo_('load', arguments);
};

var setFixtures = function(html) {
  jasmine.getFixtures().set(html);
};

var sandbox = function(attributes) {
  return jasmine.getFixtures().sandbox(attributes);
};

var spyOnEvent = function(selector, eventName) {
  jasmine.Prototype.events.spyOn(selector, eventName);
};

var triggerEvent = function(selector, eventName) {
  jasmine.Prototype.events.trigger(selector, eventName);
};
// Element.addMethods({ trigger: jasmine.Prototype.events.trigger });

jasmine.getFixtures = function() {
  return jasmine.currentFixtures_ = jasmine.currentFixtures_ || new jasmine.Fixtures();
};

jasmine.Fixtures = Class.create({
  initialize: function() {
    this.containerId = 'jasmine-fixtures';
    this.fixturesCache_ = {};
    this.fixturesPath = '/spec/javascripts/fixtures';
  },
  
  set: function(html) {
    this.cleanUp();
    this.createContainer_(html);
  },
  
  preload: function() {
    this.read.apply(this, arguments);
  },
  
  load: function() {
    this.cleanUp();
    this.createContainer_(this.read.apply(this, arguments));
  },
  
  read: function() {
    var htmlChunks = [];
    
    var fixtureUrls = arguments;
    for(var urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++) {
      htmlChunks.push(this.getFixtureHtml_(fixtureUrls[urlIndex]));
    }
    
    return htmlChunks.join('');
  },
  
  clearCache: function(attribute){
    this.fixturesCache_ = {};
  },
  
  cleanUp: function() {
    var container = $(this.containerId);
    if(container) container.remove();
  },
  
  sandbox: function(attributes) {
    var attributesToSet = attributes || {};
    return new Element('div', {id: 'sandbox'}).writeAttribute(attributesToSet);
  },
  
  createContainer_: function(html) {
    var container;
    if(Object.isElement(html)) {
      container = new Element('div', {id: this.containerId}).insert(html);
    } else {
      container = '<div id="' + this.containerId + '">' + html + '</div>';
    }

    // NOTE Calling private function, to avoid parsing of script tags, Cormac
    _insert($$('body').first(), {bottom: container});
  },
  
  getFixtureHtml_: function(url) {  
    if (typeof this.fixturesCache_[url] == 'undefined') {
      this.loadFixtureIntoCache_(url);
    }
    return this.fixturesCache_[url];
  },
  
  loadFixtureIntoCache_: function(relativeUrl) {
    var url = this.fixturesPath.match('/$') ? this.fixturesPath + relativeUrl : this.fixturesPath + '/' + relativeUrl;
    new Ajax.Request(url, {
      method: 'get',
      asynchronous: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
      onSuccess: function(response) {
        this.fixturesCache_[relativeUrl] = response.responseText;
      }.bind(this),
      onFailure: function(response) {
          throw Error('Fixture could not be loaded: ' + url + ' (status: ' + response.status + ', message: ' + response.statusText + ')');
      }
    });
  },
  
  proxyCallTo_: function(methodName, passedArguments) {
    return this[methodName].apply(this, passedArguments);
  }
});

jasmine.Prototype = function() {};

jasmine.Prototype.browserTagCaseIndependentHtml = function(html) {
  return new Element('div').insert(html).innerHTML;
};

jasmine.Prototype.elementToString = function(element) {
  return new Element('div').insert(element.cloneNode(true)).innerHTML;
};

jasmine.Prototype.matchersClass = {};

(function(namespace) {
  var data = {
    spiedEvents: {},
    handlers:    []
  };

  namespace.events = {
    spyOn: function(selector, eventName) {
      var handler = function(e) {
        data.spiedEvents[[selector, eventName]] = e;
      };
      if (Object.isElement(selector))
        selector.observe(eventName, handler);
      else
        $$(selector).invoke('observe', eventName, handler);
      data.handlers.push(handler);
    },

    trigger: function(element, eventName) {
      var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
      };
      var defaultOptions = {
        bubbles: true, cancelable: true, pointerX: 0, pointerY: 0, button: 0,
        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false
      };
      var options = Object.extend(Object.clone(defaultOptions), arguments[2] || { });
      var oEvent, eventType = null;

      element = $(element);

      for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
      }

      if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

      if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
          oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else {
          oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, 
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
      }
      else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        oEvent = Object.extend(document.createEventObject(), options);
        element.fireEvent('on' + eventName, oEvent);
      }
      return element;
    },

    wasTriggered: function(selector, eventName) {
      return !!(data.spiedEvents[[selector, eventName]]);
    },

    cleanUp: function() {
      data.spiedEvents = {};
      data.handlers    = [];
    }
  };
})(jasmine.Prototype);

(function(){
  var getEventHandlers = function(element) {
    element = $(element);
    var events;
    try {
      if (element.getStorage)
        events = element.getStorage().get('prototype_event_registry').toObject();
      else // Prototype < 1.6.1
        events = Event.cache[element._eventId || (element._prototypeEventID || [])[0]];
    } catch (e) {
      events = {};
    }
    return events || {};
  };
  
  var PrototypeMatchers = {
    toHaveClass: function(className) {
      return this.actual.hasClassName(className);
    },

    toBeVisible: function() {
      return this.actual.getStyle('display') != 'none';
    },

    toBeHidden: function() {
      return this.actual.getStyle('display') == 'none';
    },

    toBeSelected: function() {
      return !!this.actual.selected;
    },

    toBeChecked: function() {
      return !!this.actual.checked;
    },

    toBeEmpty: function() {
      return this.actual.empty();
    },

    toBeAnElement: function() {
      return Object.isElement(this.actual);
    },

    toHaveAttr: function(attributeName, expectedAttributeValue) {
      if (expectedAttributeValue != null)
        return this.actual.readAttribute(attributeName) == expectedAttributeValue;
      else
        return this.actual.hasAttribute(attributeName);
    },

    toHaveId: function(id) {
      return this.actual.readAttribute('id') == id;
    },

    toHaveHtml: function(html) {
      return this.actual.innerHTML == jasmine.Prototype.browserTagCaseIndependentHtml(html);
    },

    toHaveText: function(text) {
      if (text && text instanceof RegExp)
        return text.test(this.actual.innerHTML);
      else
        return this.actual.innerHTML == text;
    },

    toHaveValue: function(value) {
      if (this.actual.hasAttribute('value'))
        return this.actual.getValue() == value;
      else return false;
    },

    toBe: function(selector) {
      return new Selector(selector).match(this.actual);
    },

    toContain: function(selector) {
      return !!this.actual.down(selector);
    },

    toBeDisabled: function(selector){
      return !!this.actual.disabled;
    },

    // tests the existence of a specific event binding
    toHandle: function(eventName) {
      var events = getEventHandlers(this.actual);
      return events.hasOwnProperty(eventName);
    },

    // tests the existence of a specific event binding + handler
    toHandleWith: function(eventName, eventHandler) {
      var events = getEventHandlers(this.actual);
      if (events.hasOwnProperty(eventName)) {
        return events[eventName].any(function(item) {
          return item.handler === eventHandler;
        });
      }
      return false;
    }
  };

  var hasProperty = function(actualValue, expectedValue) {
    if (expectedValue === undefined) {
      return actualValue !== undefined;
    }
    return actualValue == expectedValue;
  };

  var bindMatcher = function(methodName) {
    var builtInMatcher = jasmine.Matchers.prototype[methodName];

    jasmine.Prototype.matchersClass[methodName] = function() {
      if (Object.isElement(this.actual)) {
        var result = PrototypeMatchers[methodName].apply(this, arguments);
        this.actual = jasmine.Prototype.elementToString(this.actual);
        return result;
      }

      if (builtInMatcher) {
        return builtInMatcher.apply(this, arguments);
      }

      return false;
    };
  };

  for(var methodName in PrototypeMatchers) {
    bindMatcher(methodName);
  }
})();

beforeEach(function() {
  this.addMatchers(jasmine.Prototype.matchersClass);
  this.addMatchers({
    toHaveBeenTriggeredOn: function(selector) {
      this.message = function() {
        return [
          "Expected event " + this.actual + " to have been triggered on" + selector,
          "Expected event " + this.actual + " not to have been triggered on" + selector
        ];
      };
      return jasmine.Prototype.events.wasTriggered(selector, this.actual);
    }
  });
});

afterEach(function() {
  jasmine.getFixtures().cleanUp();
  jasmine.Prototype.events.cleanUp();
});

// NOTE - Copied from Prototype, to remove the automatic parsing and removal of <script> tags, Cormac
function _insert(element, insertions) {
    element = $(element);

    if (Object.isString(insertions) || Object.isNumber(insertions) ||
        Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
          insertions = {bottom:insertions};

    var content, insert, tagName, childNodes

    for (var position in insertions) {
      content  = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content);

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));
    }

    return element;
}