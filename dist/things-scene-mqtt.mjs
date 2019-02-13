import { DataSource, RectPath, Shape, Component } from '@hatiolab/things-scene';

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;

if (typeof global$1.setTimeout === 'function') {
  cachedSetTimeout = setTimeout;
}

if (typeof global$1.clearTimeout === 'function') {
  cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

function nextTick(fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
} // v8 likes predictible objects

function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues

var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error('process.binding is not supported');
}
function cwd() {
  return '/';
}
function chdir(dir) {
  throw new Error('process.chdir is not supported');
}
function umask() {
  return 0;
} // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

var performance = global$1.performance || {};

var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
  return new Date().getTime();
}; // generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime


function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);

  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];

    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }

  return [seconds, nanoseconds];
}
var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}
var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var domain; // This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).

function EventHandlers() {}

EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}
// require('events') === require('events').EventEmitter

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.usingDomains = false;
EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function () {
  this.domain = null;

  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) ;
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
}; // These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.


function emitNone(handler, isFn, self) {
  if (isFn) handler.call(self);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) listeners[i].call(self);
  }
}

function emitOne(handler, isFn, self, arg1) {
  if (isFn) handler.call(self, arg1);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1);
  }
}

function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn) handler.call(self, arg1, arg2);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2);
  }
}

function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn) handler.call(self, arg1, arg2, arg3);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn) handler.apply(self, args);else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = type === 'error';
  events = this._events;
  if (events) doError = doError && events.error == null;else if (!doError) return false;
  domain = this.domain; // If there is no 'error' event listener then throw.

  if (doError) {
    er = arguments[1];

    if (domain) {
      if (!er) er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }

    return false;
  }

  handler = events[type];
  if (!handler) return false;
  var isFn = typeof handler === 'function';
  len = arguments.length;

  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;

    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;

    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;

    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower

    default:
      args = new Array(len - 1);

      for (i = 1; i < len; i++) args[i - 1] = arguments[i];

      emitMany(handler, isFn, this, args);
  }
  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  events = target._events;

  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    } // Check for listener leak


    if (!existing.warned) {
      m = $getMaxListeners(target);

      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}

function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function _onceWrap(target, type, listener) {
  var fired = false;

  function g() {
    target.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }

  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // emits a 'removeListener' event iff the listener was removed


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
  events = this._events;
  if (!events) return this;
  list = events[type];
  if (!list) return this;

  if (list === listener || list.listener && list.listener === listener) {
    if (--this._eventsCount === 0) this._events = new EventHandlers();else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list[0] = undefined;

      if (--this._eventsCount === 0) {
        this._events = new EventHandlers();
        return this;
      } else {
        delete events[type];
      }
    } else {
      spliceOne(list, position);
    }

    if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events;
  events = this._events;
  if (!events) return this; // not listening for removeListener, no need to emit

  if (!events.removeListener) {
    if (arguments.length === 0) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    } else if (events[type]) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);

    for (var i = 0, key; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = new EventHandlers();
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    do {
      this.removeListener(type, listeners[listeners.length - 1]);
    } while (listeners[0]);
  }

  return this;
};

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;
  if (!events) ret = [];else {
    evlistener = events[type];
    if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
  }
  return ret;
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
}; // About 1.5x faster than the two-arg version of Array#splice().


function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) list[i] = list[k];

  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);

  while (i--) copy[i] = arr[i];

  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

var immutable = extend;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
  var target = {};

  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
}

var processNextickArgs = createCommonjsModule(function (module) {

  if (!process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
    module.exports = {
      nextTick: nextTick$$1
    };
  } else {
    module.exports = process;
  }

  function nextTick$$1(fn, arg1, arg2, arg3) {
    if (typeof fn !== 'function') {
      throw new TypeError('"callback" argument must be a function');
    }

    var len = arguments.length;
    var args, i;

    switch (len) {
      case 0:
      case 1:
        return nextTick(fn);

      case 2:
        return nextTick(function afterTickOne() {
          fn.call(null, arg1);
        });

      case 3:
        return nextTick(function afterTickTwo() {
          fn.call(null, arg1, arg2);
        });

      case 4:
        return nextTick(function afterTickThree() {
          fn.call(null, arg1, arg2, arg3);
        });

      default:
        args = new Array(len - 1);
        i = 0;

        while (i < args.length) {
          args[i++] = arguments[i];
        }

        return nextTick(function afterTick() {
          fn.apply(null, args);
        });
    }
  }
});
var processNextickArgs_1 = processNextickArgs.nextTick;

var toString = {}.toString;

var isarray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;

function init() {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray(b64) {
  if (!inited) {
    init();
  }

  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  } // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice


  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0; // base64 is 4/3 + up to two characters of the original data

  arr = new Arr(len * 3 / 4 - placeHolders); // if there are placeholders, only get up to the last complete 4 chars

  l = placeHolders > 0 ? len - 4 : len;
  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];

  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  if (!inited) {
    init();
  }

  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  } // pad the end with zeros, but make sure to not forget the extra bytes


  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);
  return parts.join('');
}

function read(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;

  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;

  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }

  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);

    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }

    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;

  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString$1 = {}.toString;
var isArray = Array.isArray || function (arr) {
  return toString$1.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */

Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined ? global$1.TYPED_ARRAY_SUPPORT : true;
/*
 * Export kMaxLength after typed array support is determined.
 */

var _kMaxLength = kMaxLength();

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }

    that.length = length;
  }

  return that;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */


function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  } // Common case.


  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }

    return allocUnsafe(this, arg);
  }

  return from(this, arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192; // not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.

Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/


Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);

  if (size <= 0) {
    return createBuffer(that, size);
  }

  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }

  return createBuffer(that, size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/


Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }

  return that;
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */


Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */


Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }

  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }

  return that;
}

function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }

      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }

  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }

  return Buffer.alloc(+length);
}
Buffer.isBuffer = isBuffer;

function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}

Buffer.compare = function compare(a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;
  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;

    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;

  if (length === undefined) {
    length = 0;

    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;

  for (i = 0; i < list.length; ++i) {
    var buf = list[i];

    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    buf.copy(buffer, pos);
    pos += buf.length;
  }

  return buffer;
};

function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }

  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }

  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0; // Use a for loop to avoid recursion

  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;

      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;

      case 'hex':
        return len >>> 1;

      case 'base64':
        return base64ToBytes(string).length;

      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8

        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}

Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.
  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

  if (start === undefined || start < 0) {
    start = 0;
  } // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.


  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.


  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
} // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.


Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;

  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }

  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }

  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;

  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }

  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }

  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;

  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }

  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }

  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = INSPECT_MAX_BYTES;

  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }

  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }

  if (end === undefined) {
    end = target ? target.length : 0;
  }

  if (thisStart === undefined) {
    thisStart = 0;
  }

  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }

  if (thisStart >= thisEnd) {
    return -1;
  }

  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
}; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf


function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1; // Normalize byteOffset

  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }

  byteOffset = +byteOffset; // Coerce to Number.

  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  } // Normalize byteOffset: negative offsets start from the end of the buffer


  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  } // Normalize val


  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  } // Finally, search either indexOf (if dir is true) or lastIndexOf


  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }

    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]

    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }

    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();

    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }

      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read$$1(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;

  if (dir) {
    var foundIndex = -1;

    for (i = byteOffset; i < arrLength; i++) {
      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

    for (i = byteOffset; i >= 0; i--) {
      var found = true;

      for (var j = 0; j < valLength; j++) {
        if (read$$1(arr, i + j) !== read$$1(val, j)) {
          found = false;
          break;
        }
      }

      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;

  if (!length) {
    length = remaining;
  } else {
    length = Number(length);

    if (length > remaining) {
      length = remaining;
    }
  } // must be an even number of digits


  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }

  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }

  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write$$1(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0; // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0; // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;

    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    } // legacy write(string, encoding, offset, length) - remove in v0.13

  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';
  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;

  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }

          break;

        case 2:
          secondByte = buf[i + 1];

          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }

      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
} // Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety


var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;

  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  } // Decode in chunks to avoid "call stack size exceeded".


  var res = '';
  var i = 0;

  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }

  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }

  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }

  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = '';

  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }

  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';

  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }

  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;
  var newBuf;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);

    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */


function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;

  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];

  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
}; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }

  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
}; // Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])


Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }

    if (val.length === 1) {
      var code = val.charCodeAt(0);

      if (code < 256) {
        val = code;
      }
    }

    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }

    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } // Invalid ranges are not set to a default, so can range check early.


  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;

  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;

    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
}; // HELPER FUNCTIONS
// ================


var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

  if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

  while (str.length % 4 !== 0) {
    str = str + '=';
  }

  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i); // is surrogate component

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } // valid lead


        leadSurrogate = codePoint;
        continue;
      } // 2 leads in a row


      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      } // valid surrogate pair


      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null; // encode utf8

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }

  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }

  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
} // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually


function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}

function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
} // For Node v0.10 support. Remove this eventually.


function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0));
}

var bufferEs6 = /*#__PURE__*/Object.freeze({
            INSPECT_MAX_BYTES: INSPECT_MAX_BYTES,
            kMaxLength: _kMaxLength,
            Buffer: Buffer,
            SlowBuffer: SlowBuffer,
            isBuffer: isBuffer
});

var inherits;

if (typeof Object.create === 'function') {
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;

    var TempCtor = function () {};

    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

var inherits$1 = inherits;

var formatRegExp = /%[sdj%]/g;
function format(f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.

function deprecate(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global$1.process)) {
    return function () {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
}
var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = 0;

      debugs[set] = function () {
        var msg = format.apply(null, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
}
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/

function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
} // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray$1(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty$1(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty$1(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function (prev, cur) {
    if (cur.indexOf('\n') >= 0) ;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray$1(ar) {
  return Array.isArray(ar);
}
function isBoolean(arg) {
  return typeof arg === 'boolean';
}
function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
function isNumber(arg) {
  return typeof arg === 'number';
}
function isString(arg) {
  return typeof arg === 'string';
}
function isSymbol(arg) {
  return typeof arg === 'symbol';
}
function isUndefined(arg) {
  return arg === void 0;
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}
function isFunction(arg) {
  return typeof arg === 'function';
}
function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}
function isBuffer$1(maybeBuf) {
  return isBuffer(maybeBuf);
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


function log() {
  console.log('%s - %s', timestamp(), format.apply(null, arguments));
}
function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
}

function hasOwnProperty$1(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var util = {
  inherits: inherits$1,
  _extend: _extend,
  log: log,
  isBuffer: isBuffer$1,
  isPrimitive: isPrimitive,
  isFunction: isFunction,
  isError: isError,
  isDate: isDate,
  isObject: isObject,
  isRegExp: isRegExp,
  isUndefined: isUndefined,
  isSymbol: isSymbol,
  isString: isString,
  isNumber: isNumber,
  isNullOrUndefined: isNullOrUndefined,
  isNull: isNull,
  isBoolean: isBoolean,
  isArray: isArray$1,
  inspect: inspect,
  deprecate: deprecate,
  format: format,
  debuglog: debuglog
};

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = {
    data: v,
    next: null
  };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = {
    data: v,
    next: this.head
  };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;

  while (p = p.next) {
    ret += s + p.data;
  }

  return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return Buffer.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = Buffer.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;

  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }

  return ret;
};

// Copyright Joyent, Inc. and other Node contributors.

var isBufferEncoding = Buffer.isEncoding || function (encoding) {
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;

    default:
      return false;
  }
};

function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
} // StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.


function StringDecoder(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);

  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;

    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;

    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;

    default:
      this.write = passThroughWrite;
      return;
  } // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).


  this.charBuffer = new Buffer(6); // Number of bytes received for the current incomplete multi-byte character.

  this.charReceived = 0; // Number of bytes expected for the current incomplete multi-byte character.

  this.charLength = 0;
}
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .

StringDecoder.prototype.write = function (buffer) {
  var charStr = ''; // if our last write ended with an incomplete multibyte character

  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length; // add the new bytes to the char buffer

    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    } // remove bytes belonging to the current character from the buffer


    buffer = buffer.slice(available, buffer.length); // get the character that was split

    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding); // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character

    var charCode = charStr.charCodeAt(charStr.length - 1);

    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }

    this.charReceived = this.charLength = 0; // if there are no more bytes in this buffer, just emit our char

    if (buffer.length === 0) {
      return charStr;
    }

    break;
  } // determine and set charLength / charReceived


  this.detectIncompleteChar(buffer);
  var end = buffer.length;

  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);
  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end); // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character

  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  } // or just emit the charStr


  return charStr;
}; // detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.


StringDecoder.prototype.detectIncompleteChar = function (buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = buffer.length >= 3 ? 3 : buffer.length; // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.

  for (; i > 0; i--) {
    var c = buffer[buffer.length - i]; // See http://en.wikipedia.org/wiki/UTF-8#Description
    // 110XXXXX

    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    } // 1110XXXX


    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    } // 11110XXX


    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }

  this.charReceived = i;
};

StringDecoder.prototype.end = function (buffer) {
  var res = '';
  if (buffer && buffer.length) res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

Readable.ReadableState = ReadableState;
var debug = debuglog('stream');
inherits$1(Readable, EventEmitter);

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function listenerCount$1(emitter, type) {
  return emitter.listeners(type).length;
}

function ReadableState(options, stream) {
  options = options || {}; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm; // cast to ints.

  this.highWaterMark = ~~this.highWaterMark; // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.

  this.ranOut = false; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  if (!(this instanceof Readable)) return new Readable(options);
  this._readableState = new ReadableState(options, this); // legacy

  this.readable = true;
  if (options && typeof options.read === 'function') this._read = options.read;
  EventEmitter.call(this);
} // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.

Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;

    if (encoding !== state.encoding) {
      chunk = Buffer.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);

  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');

      stream.emit('error', _e);
    } else {
      var skipAdd;

      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false; // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode

      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
} // if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.


function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
} // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
}; // Don't raise the hwm > 8MB


var MAX_HWM = 0x800000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;

  if (!isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true; // emit 'readable' now to make sure it gets picked up.

  emitReadable(stream);
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;

  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;else len = state.length;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = !pipeOpts || pipeOpts.end !== false;
  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable) {
    debug('onunpipe');

    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  } // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.


  var increasedAwaitDrain = false;
  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);

    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (listenerCount$1(dest, 'error') === 0) dest.emit('error', er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && src.listeners('data').length) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var _i = 0; _i < len; _i++) {
      dests[_i].emit('unpipe', this);
    }

    return this;
  } // try to find the right one.


  var i = indexOf(state.pipes, dest);
  if (i === -1) return this;
  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = EventEmitter.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;

    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;

      if (!state.reading) {
        nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }

  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {}
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;
  var self = this;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
    var ret = self.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  }); // when we try to consume some more bytes, simply unpause the
  // underlying stream.

  self._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
}; // exposed for testing purposes only.


Readable._fromList = fromList; // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }
  return ret;
} // Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function fromListPartial(n, list, hasStrings) {
  var ret;

  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }

  return ret;
} // Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;

  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;

    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
} // Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;

  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;

    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState; // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.

  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}

// A bit simpler than readable streams.
Writable.WritableState = WritableState;
inherits$1(Writable, EventEmitter);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Object.defineProperty(this, 'buffer', {
    get: deprecate(function () {
      return this.getBuffer();
    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
  });
  options = options || {}; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm; // cast to ints.

  this.highWaterMark = ~~this.highWaterMark;
  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};
function Writable(options) {
  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);
  this._writableState = new WritableState(options, this); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  EventEmitter.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.

Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end'); // TODO: defer error events consistently everywhere, not just the cb

  stream.emit('error', er);
  nextTick(cb, er);
} // If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.


function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false; // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  if (er) {
    stream.emit('error', er);
    nextTick(cb, er);
    valid = false;
  }

  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;
  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
} // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.


function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) nextTick(cb, er);else cb(er);
  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      nextTick(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;

    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;

    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }

    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}

inherits$1(Duplex, Readable);
var keys = Object.keys(Writable.prototype);

for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  if (options && options.readable === false) this.readable = false;
  if (options && options.writable === false) this.writable = false;
  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
  this.once('end', onend);
} // the no-half-open enforcer

function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

// a transform stream is a readable/writable stream where you do
inherits$1(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;
  var cb = ts.writecb;
  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));
  ts.writechunk = null;
  ts.writecb = null;
  if (data !== null && data !== undefined) stream.push(data);
  cb(er);
  var rs = stream._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = new TransformState(this); // when the writable side finishes, then flush out anything remaining.

  var stream = this; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er) {
      done(stream, er);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('Not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er) {
  if (er) return stream.emit('error', er); // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  var ws = stream._writableState;
  var ts = stream._transformState;
  if (ws.length) throw new Error('Calling transform done when ws.length != 0');
  if (ts.transforming) throw new Error('Calling transform done when still transforming');
  return stream.push(null);
}

inherits$1(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

inherits$1(Stream, EventEmitter);
Stream.Readable = Readable;
Stream.Writable = Writable;
Stream.Duplex = Duplex;
Stream.Transform = Transform;
Stream.PassThrough = PassThrough; // Backwards-compat with node 0.4.x

Stream.Stream = Stream;
// part of this class) is overridden in the Readable class.

function Stream() {
  EventEmitter.call(this);
}

Stream.prototype.pipe = function (dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain); // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.

  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;

  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;
    dest.end();
  }

  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;
    if (typeof dest.destroy === 'function') dest.destroy();
  } // don't leave dangling pipes when there are errors.


  function onerror(er) {
    cleanup();

    if (EventEmitter.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror); // remove all the event listeners that were added.

  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);
    source.removeListener('end', onend);
    source.removeListener('close', onclose);
    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);
    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);
  dest.on('close', cleanup);
  dest.emit('pipe', source); // Allow for unix-like usage: A.pipe(B).pipe(C)

  return dest;
};

var safeBuffer = createCommonjsModule(function (module, exports) {
  /* eslint-disable node/no-deprecated-api */
  var Buffer = bufferEs6.Buffer; // alternative to using Object.keys for old browsers

  function copyProps(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  }

  if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = bufferEs6;
  } else {
    // Copy properties from require('buffer')
    copyProps(bufferEs6, exports);
    exports.Buffer = SafeBuffer;
  }

  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
  } // Copy static methods from Buffer


  copyProps(Buffer, SafeBuffer);

  SafeBuffer.from = function (arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
      throw new TypeError('Argument must not be a number');
    }

    return Buffer(arg, encodingOrOffset, length);
  };

  SafeBuffer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    var buf = Buffer(size);

    if (fill !== undefined) {
      if (typeof encoding === 'string') {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }

    return buf;
  };

  SafeBuffer.allocUnsafe = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    return Buffer(size);
  };

  SafeBuffer.allocUnsafeSlow = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    return bufferEs6.SlowBuffer(size);
  };
});
var safeBuffer_1 = safeBuffer.Buffer;

//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray$2(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }

  return objectToString$1(arg) === '[object Array]';
}

var isArray_1 = isArray$2;

function isBoolean$1(arg) {
  return typeof arg === 'boolean';
}

var isBoolean_1 = isBoolean$1;

function isNull$1(arg) {
  return arg === null;
}

var isNull_1 = isNull$1;

function isNullOrUndefined$1(arg) {
  return arg == null;
}

var isNullOrUndefined_1 = isNullOrUndefined$1;

function isNumber$1(arg) {
  return typeof arg === 'number';
}

var isNumber_1 = isNumber$1;

function isString$1(arg) {
  return typeof arg === 'string';
}

var isString_1 = isString$1;

function isSymbol$1(arg) {
  return typeof arg === 'symbol';
}

var isSymbol_1 = isSymbol$1;

function isUndefined$1(arg) {
  return arg === void 0;
}

var isUndefined_1 = isUndefined$1;

function isRegExp$1(re) {
  return objectToString$1(re) === '[object RegExp]';
}

var isRegExp_1 = isRegExp$1;

function isObject$1(arg) {
  return typeof arg === 'object' && arg !== null;
}

var isObject_1 = isObject$1;

function isDate$1(d) {
  return objectToString$1(d) === '[object Date]';
}

var isDate_1 = isDate$1;

function isError$1(e) {
  return objectToString$1(e) === '[object Error]' || e instanceof Error;
}

var isError_1 = isError$1;

function isFunction$1(arg) {
  return typeof arg === 'function';
}

var isFunction_1 = isFunction$1;

function isPrimitive$1(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

var isPrimitive_1 = isPrimitive$1;
var isBuffer$2 = isBuffer;

function objectToString$1(o) {
  return Object.prototype.toString.call(o);
}

var util$1 = {
  isArray: isArray_1,
  isBoolean: isBoolean_1,
  isNull: isNull_1,
  isNullOrUndefined: isNullOrUndefined_1,
  isNumber: isNumber_1,
  isString: isString_1,
  isSymbol: isSymbol_1,
  isUndefined: isUndefined_1,
  isRegExp: isRegExp_1,
  isObject: isObject_1,
  isDate: isDate_1,
  isError: isError_1,
  isFunction: isFunction_1,
  isPrimitive: isPrimitive_1,
  isBuffer: isBuffer$2
};

var inherits_browser = createCommonjsModule(function (module) {
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;

      var TempCtor = function () {};

      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }
});

var BufferList$1 = createCommonjsModule(function (module) {

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Buffer = safeBuffer.Buffer;

  function copyBuffer(src, target, offset) {
    src.copy(target, offset);
  }

  module.exports = function () {
    function BufferList() {
      _classCallCheck(this, BufferList);

      this.head = null;
      this.tail = null;
      this.length = 0;
    }

    BufferList.prototype.push = function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    };

    BufferList.prototype.unshift = function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    };

    BufferList.prototype.shift = function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    };

    BufferList.prototype.clear = function clear() {
      this.head = this.tail = null;
      this.length = 0;
    };

    BufferList.prototype.join = function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    };

    BufferList.prototype.concat = function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      if (this.length === 1) return this.head.data;
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    };

    return BufferList;
  }();

  if (util && util.inspect && util.inspect.custom) {
    module.exports.prototype[util.inspect.custom] = function () {
      var obj = util.inspect({
        length: this.length
      });
      return this.constructor.name + ' ' + obj;
    };
  }
});

/*<replacement>*/

/*</replacement>*/
// undocumented cb() API, needed for core, not for public API


function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextickArgs.nextTick(emitErrorNT, this, err);
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextickArgs.nextTick(emitErrorNT, _this, err);

      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

var destroy_1 = {
  destroy: destroy,
  undestroy: undestroy
};

/**
 * Module exports.
 */

var browser$2 = deprecate$1;
/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate$1(fn, msg) {
  if (config$1('noDeprecation')) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (config$1('throwDeprecation')) {
        throw new Error(msg);
      } else if (config$1('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
}
/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */


function config$1(name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!commonjsGlobal.localStorage) return false;
  } catch (_) {
    return false;
  }

  var val = commonjsGlobal.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

var streamBrowser = EventEmitter.EventEmitter;

/*<replacement>*/

/*</replacement>*/


var _stream_writable = Writable$1;
// there will be only 2 of these for each stream


function CorkedRequest$1(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var asyncWrite = processNextickArgs.nextTick;
/*</replacement>*/

/*<replacement>*/

var Duplex$1;
/*</replacement>*/

Writable$1.WritableState = WritableState$1;
/*<replacement>*/

util$1.inherits = inherits_browser;
/*</replacement>*/

/*<replacement>*/

var internalUtil = {
  deprecate: browser$2
};
/*</replacement>*/

/*<replacement>*/

/*</replacement>*/

/*<replacement>*/

var Buffer$1 = safeBuffer.Buffer;

var OurUint8Array = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer$1.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer$1.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/


util$1.inherits(Writable$1, streamBrowser);

function nop$1() {}

function WritableState$1(options, stream) {
  Duplex$1 = Duplex$1 || _stream_duplex;
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  var isDuplex = stream instanceof Duplex$1; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm; // cast to ints.

  this.highWaterMark = Math.floor(this.highWaterMark); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite$1(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest$1(this);
}

WritableState$1.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState$1.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable$1, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable$1) return false;
      return object && object._writableState instanceof WritableState$1;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable$1(options) {
  Duplex$1 = Duplex$1 || _stream_duplex; // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  if (!realHasInstance.call(Writable$1, this) && !(this instanceof Duplex$1)) {
    return new Writable$1(options);
  }

  this._writableState = new WritableState$1(options, this); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  streamBrowser.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable$1.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd$1(stream, cb) {
  var er = new Error('write after end'); // TODO: defer error events consistently everywhere, not just the cb

  stream.emit('error', er);
  processNextickArgs.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk$1(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  if (er) {
    stream.emit('error', er);
    processNextickArgs.nextTick(cb, er);
    valid = false;
  }

  return valid;
}

Writable$1.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer$1.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop$1;
  if (state.ended) writeAfterEnd$1(this, cb);else if (isBuf || validChunk$1(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer$1(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable$1.prototype.cork = function () {
  var state = this._writableState;
  state.corked++;
};

Writable$1.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer$1(this, state);
  }
};

Writable$1.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk$1(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer$1.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable$1.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer$1(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk$1(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite$1(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite$1(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError$1(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextickArgs.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    processNextickArgs.nextTick(finishMaybe$1, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er); // this can emit finish, but finish must
    // always follow error

    finishMaybe$1(stream, state);
  }
}

function onwriteStateUpdate$1(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite$1(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  onwriteStateUpdate$1(state);
  if (er) onwriteError$1(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish$1(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer$1(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite$1, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite$1(stream, state, finished, cb);
    }
  }
}

function afterWrite$1(stream, state, finished, cb) {
  if (!finished) onwriteDrain$1(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe$1(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain$1(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer$1(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite$1(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest$1(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite$1(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable$1.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable$1.prototype._writev = null;

Writable$1.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending && !state.finished) endWritable$1(this, state, cb);
};

function needFinish$1(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      stream.emit('error', err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe$1(stream, state);
  });
}

function prefinish$1(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextickArgs.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe$1(stream, state) {
  var need = needFinish$1(state);

  if (need) {
    prefinish$1(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }

  return need;
}

function endWritable$1(stream, state, cb) {
  state.ending = true;
  finishMaybe$1(stream, state);

  if (cb) {
    if (state.finished) processNextickArgs.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable$1.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable$1.prototype.destroy = destroy_1.destroy;
Writable$1.prototype._undestroy = destroy_1.undestroy;

Writable$1.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};

/*<replacement>*/

/*</replacement>*/

/*<replacement>*/


var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var _stream_duplex = Duplex$2;
/*<replacement>*/

util$1.inherits = inherits_browser;
/*</replacement>*/

util$1.inherits(Duplex$2, _stream_readable);
{
  // avoid scope creep, the keys array can then be collected
  var keys$1 = objectKeys(_stream_writable.prototype);

  for (var v$1 = 0; v$1 < keys$1.length; v$1++) {
    var method$1 = keys$1[v$1];
    if (!Duplex$2.prototype[method$1]) Duplex$2.prototype[method$1] = _stream_writable.prototype[method$1];
  }
}

function Duplex$2(options) {
  if (!(this instanceof Duplex$2)) return new Duplex$2(options);
  _stream_readable.call(this, options);
  _stream_writable.call(this, options);
  if (options && options.readable === false) this.readable = false;
  if (options && options.writable === false) this.writable = false;
  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
  this.once('end', onend$1);
}

Object.defineProperty(Duplex$2.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
}); // the no-half-open enforcer

function onend$1() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  processNextickArgs.nextTick(onEndNT$1, this);
}

function onEndNT$1(self) {
  self.end();
}

Object.defineProperty(Duplex$2.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex$2.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();
  processNextickArgs.nextTick(cb, err);
};

/*<replacement>*/


var Buffer$2 = safeBuffer.Buffer;
/*</replacement>*/

var isEncoding = Buffer$2.isEncoding || function (encoding) {
  encoding = '' + encoding;

  switch (encoding && encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;

    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;

  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';

      case 'latin1':
      case 'binary':
        return 'latin1';

      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;

      default:
        if (retried) return; // undefined

        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}
// modules monkey-patch it to support additional encodings

function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);

  if (typeof nenc !== 'string' && (Buffer$2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
} // StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.


var StringDecoder_1 = StringDecoder$1;

function StringDecoder$1(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;

  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;

    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;

    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;

    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }

  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer$2.allocUnsafe(nb);
}

StringDecoder$1.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;

  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }

  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder$1.prototype.end = utf8End; // Returns only complete characters in a Buffer

StringDecoder$1.prototype.text = utf8Text; // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer

StringDecoder$1.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
}; // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.


function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
} // Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.


function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }

    return nb;
  }

  return 0;
} // Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.


function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }

  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }

    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
} // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.


function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;

  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
} // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.


function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
} // For UTF-8, a replacement character is added when ending on a partial
// character.


function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
} // UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.


function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);

    if (r) {
      var c = r.charCodeAt(r.length - 1);

      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }

    return r;
  }

  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
} // For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.


function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';

  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }

  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;

  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }

  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
} // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)


function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

var string_decoder = {
  StringDecoder: StringDecoder_1
};

/*<replacement>*/

/*</replacement>*/


var _stream_readable = Readable$1;
/*<replacement>*/

/*</replacement>*/

/*<replacement>*/

var Duplex$3;
/*</replacement>*/

Readable$1.ReadableState = ReadableState$1;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/

/*</replacement>*/

/*<replacement>*/


var Buffer$3 = safeBuffer.Buffer;

var OurUint8Array$1 = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer$1(chunk) {
  return Buffer$3.from(chunk);
}

function _isUint8Array$1(obj) {
  return Buffer$3.isBuffer(obj) || obj instanceof OurUint8Array$1;
}
/*</replacement>*/

/*<replacement>*/


util$1.inherits = inherits_browser;
/*</replacement>*/

/*<replacement>*/

var debug$1 = void 0;

if (util && util.debuglog) {
  debug$1 = util.debuglog('stream');
} else {
  debug$1 = function () {};
}
/*</replacement>*/


var StringDecoder$2;
util$1.inherits(Readable$1, streamBrowser);
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener$1(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isarray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState$1(options, stream) {
  Duplex$3 = Duplex$3 || _stream_duplex;
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  var isDuplex = stream instanceof Duplex$3; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm; // cast to ints.

  this.highWaterMark = Math.floor(this.highWaterMark); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList$1();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder$2) StringDecoder$2 = string_decoder.StringDecoder;
    this.decoder = new StringDecoder$2(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable$1(options) {
  Duplex$3 = Duplex$3 || _stream_duplex;
  if (!(this instanceof Readable$1)) return new Readable$1(options);
  this._readableState = new ReadableState$1(options, this); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  streamBrowser.call(this);
}

Object.defineProperty(Readable$1.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable$1.prototype.destroy = destroy_1.destroy;
Readable$1.prototype._undestroy = destroy_1.undestroy;

Readable$1.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable$1.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer$3.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk$1(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable$1.prototype.unshift = function (chunk) {
  return readableAddChunk$1(this, chunk, null, true, false);
};

function readableAddChunk$1(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk$1(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid$1(state, chunk);

    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer$3.prototype) {
        chunk = _uint8ArrayToBuffer$1(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore$1(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData$1(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable$1(stream);
  }

  maybeReadMore$1(stream, state);
}

function chunkInvalid$1(state, chunk) {
  var er;

  if (!_isUint8Array$1(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  return er;
} // if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.


function needMoreData$1(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable$1.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable$1.prototype.setEncoding = function (enc) {
  if (!StringDecoder$2) StringDecoder$2 = string_decoder.StringDecoder;
  this._readableState.decoder = new StringDecoder$2(enc);
  this._readableState.encoding = enc;
  return this;
}; // Don't raise the hwm > 8MB


var MAX_HWM$1 = 0x800000;

function computeNewHighWaterMark$1(n) {
  if (n >= MAX_HWM$1) {
    n = MAX_HWM$1;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead$1(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark$1(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable$1.prototype.read = function (n) {
  debug$1('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug$1('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable$1(this);else emitReadable$1(this);
    return null;
  }

  n = howMuchToRead$1(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable$1(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug$1('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug$1('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug$1('reading or ended', doRead);
  } else if (doRead) {
    debug$1('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead$1(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList$1(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable$1(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk$1(stream, state) {
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true; // emit 'readable' now to make sure it gets picked up.

  emitReadable$1(stream);
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable$1(stream) {
  var state = stream._readableState;
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug$1('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextickArgs.nextTick(emitReadable_$1, stream);else emitReadable_$1(stream);
  }
}

function emitReadable_$1(stream) {
  debug$1('emit readable');
  stream.emit('readable');
  flow$1(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore$1(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextickArgs.nextTick(maybeReadMore_$1, stream, state);
  }
}

function maybeReadMore_$1(stream, state) {
  var len = state.length;

  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug$1('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;else len = state.length;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable$1.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable$1.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug$1('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextickArgs.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug$1('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug$1('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain$1(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug$1('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  } // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.


  var increasedAwaitDrain = false;
  src.on('data', ondata);

  function ondata(chunk) {
    debug$1('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);

    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf$1(state.pipes, dest) !== -1) && !cleanedUp) {
        debug$1('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug$1('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  } // Make sure our error handler is attached before userland ones.


  prependListener$1(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug$1('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug$1('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug$1('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain$1(src) {
  return function () {
    var state = src._readableState;
    debug$1('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow$1(src);
    }
  };
}

Readable$1.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }

    return this;
  } // try to find the right one.


  var index = indexOf$1(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable$1.prototype.on = function (ev, fn) {
  var res = streamBrowser.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;

    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;

      if (!state.reading) {
        processNextickArgs.nextTick(nReadingNextTick$1, this);
      } else if (state.length) {
        emitReadable$1(this);
      }
    }
  }

  return res;
};

Readable$1.prototype.addListener = Readable$1.prototype.on;

function nReadingNextTick$1(self) {
  debug$1('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable$1.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug$1('resume');
    state.flowing = true;
    resume$1(this, state);
  }

  return this;
};

function resume$1(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextickArgs.nextTick(resume_$1, stream, state);
  }
}

function resume_$1(stream, state) {
  if (!state.reading) {
    debug$1('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow$1(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable$1.prototype.pause = function () {
  debug$1('call pause flowing=%j', this._readableState.flowing);

  if (false !== this._readableState.flowing) {
    debug$1('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  return this;
};

function flow$1(stream) {
  var state = stream._readableState;
  debug$1('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {}
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable$1.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug$1('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug$1('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug$1('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable$1.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
}); // exposed for testing purposes only.

Readable$1._fromList = fromList$1; // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList$1(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial$1(n, state.buffer, state.decoder);
  }
  return ret;
} // Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function fromListPartial$1(n, list, hasStrings) {
  var ret;

  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString$1(n, list) : copyFromBuffer$1(n, list);
  }

  return ret;
} // Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBufferString$1(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;

  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;

    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
} // Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBuffer$1(n, list) {
  var ret = Buffer$3.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;

  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;

    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
}

function endReadable$1(stream) {
  var state = stream._readableState; // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.

  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextickArgs.nextTick(endReadableNT$1, state, stream);
  }
}

function endReadableNT$1(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf$1(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}

var _stream_transform = Transform$1;
/*<replacement>*/

util$1.inherits = inherits_browser;
/*</replacement>*/

util$1.inherits(Transform$1, _stream_duplex);

function afterTransform$1(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform$1(options) {
  if (!(this instanceof Transform$1)) return new Transform$1(options);
  _stream_duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform$1.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish$2);
}

function prefinish$2() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done$1(_this, er, data);
    });
  } else {
    done$1(this, null, null);
  }
}

Transform$1.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return _stream_duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform$1.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform$1.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform$1.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform$1.prototype._destroy = function (err, cb) {
  var _this2 = this;

  _stream_duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);

    _this2.emit('close');
  });
};

function done$1(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');
  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');
  return stream.push(null);
}

var _stream_passthrough = PassThrough$1;
/*<replacement>*/

util$1.inherits = inherits_browser;
/*</replacement>*/

util$1.inherits(PassThrough$1, _stream_transform);

function PassThrough$1(options) {
  if (!(this instanceof PassThrough$1)) return new PassThrough$1(options);
  _stream_transform.call(this, options);
}

PassThrough$1.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

var readableBrowser = createCommonjsModule(function (module, exports) {
  exports = module.exports = _stream_readable;
  exports.Stream = exports;
  exports.Readable = exports;
  exports.Writable = _stream_writable;
  exports.Duplex = _stream_duplex;
  exports.Transform = _stream_transform;
  exports.PassThrough = _stream_passthrough;
});
var readableBrowser_1 = readableBrowser.Stream;
var readableBrowser_2 = readableBrowser.Readable;
var readableBrowser_3 = readableBrowser.Writable;
var readableBrowser_4 = readableBrowser.Duplex;
var readableBrowser_5 = readableBrowser.Transform;
var readableBrowser_6 = readableBrowser.PassThrough;

var isImplemented = function () {
  var map, iterator, result;
  if (typeof Map !== 'function') return false;

  try {
    // WebKit doesn't support arguments and crashes
    map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
  } catch (e) {
    return false;
  }

  if (String(map) !== '[object Map]') return false;
  if (map.size !== 3) return false;
  if (typeof map.clear !== 'function') return false;
  if (typeof map.delete !== 'function') return false;
  if (typeof map.entries !== 'function') return false;
  if (typeof map.forEach !== 'function') return false;
  if (typeof map.get !== 'function') return false;
  if (typeof map.has !== 'function') return false;
  if (typeof map.keys !== 'function') return false;
  if (typeof map.set !== 'function') return false;
  if (typeof map.values !== 'function') return false;
  iterator = map.entries();
  result = iterator.next();
  if (result.done !== false) return false;
  if (!result.value) return false;
  if (result.value[0] !== 'raz') return false;
  if (result.value[1] !== 'one') return false;
  return true;
};

var noop$1 = function () {};

var _undefined = noop$1(); // Support ES3 engines


var isValue = function (val) {
  return val !== _undefined && val !== null;
};

var validValue = function (value) {
  if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
  return value;
};

var clear = function () {
  validValue(this).length = 0;
  return this;
};

var isImplemented$1 = function () {
  var numberIsNaN = Number.isNaN;
  if (typeof numberIsNaN !== "function") return false;
  return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
};

var shim = function (value) {
  // eslint-disable-next-line no-self-compare
  return value !== value;
};

var isNan = isImplemented$1() ? Number.isNaN : shim;

var isImplemented$2 = function () {
  var sign = Math.sign;
  if (typeof sign !== "function") return false;
  return sign(10) === 1 && sign(-20) === -1;
};

var shim$1 = function (value) {
  value = Number(value);
  if (isNaN(value) || value === 0) return value;
  return value > 0 ? 1 : -1;
};

var sign = isImplemented$2() ? Math.sign : shim$1;

var abs = Math.abs,
    floor = Math.floor;

var toInteger = function (value) {
  if (isNaN(value)) return 0;
  value = Number(value);
  if (value === 0 || !isFinite(value)) return value;
  return sign(value) * floor(abs(value));
};

var max = Math.max;

var toPosInteger = function (value) {
  return max(0, toInteger(value));
};

var indexOf$2 = Array.prototype.indexOf,
    objHasOwnProperty = Object.prototype.hasOwnProperty,
    abs$1 = Math.abs,
    floor$1 = Math.floor;

var eIndexOf = function (searchElement
/*, fromIndex*/
) {
  var i, length, fromIndex, val;
  if (!isNan(searchElement)) return indexOf$2.apply(this, arguments);
  length = toPosInteger(validValue(this).length);
  fromIndex = arguments[1];
  if (isNaN(fromIndex)) fromIndex = 0;else if (fromIndex >= 0) fromIndex = floor$1(fromIndex);else fromIndex = toPosInteger(this.length) - floor$1(abs$1(fromIndex));

  for (i = fromIndex; i < length; ++i) {
    if (objHasOwnProperty.call(this, i)) {
      val = this[i];
      if (isNan(val)) return i; // Jslint: ignore
    }
  }

  return -1;
};

var create = Object.create,
    getPrototypeOf = Object.getPrototypeOf,
    plainObject = {};

var isImplemented$3 = function ()
/* CustomCreate*/
{
  var setPrototypeOf = Object.setPrototypeOf,
      customCreate = arguments[0] || create;
  if (typeof setPrototypeOf !== "function") return false;
  return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};

var map = {
  function: true,
  object: true
};

var isObject$2 = function (value) {
  return isValue(value) && map[typeof value] || false;
};

var create$1 = Object.create,
    shim$2;

if (!isImplemented$3()) {
  shim$2 = shim$3;
}

var create_1 = function () {
  var nullObject, polyProps, desc;
  if (!shim$2) return create$1;
  if (shim$2.level !== 1) return create$1;
  nullObject = {};
  polyProps = {};
  desc = {
    configurable: false,
    enumerable: false,
    writable: true,
    value: undefined
  };
  Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
    if (name === "__proto__") {
      polyProps[name] = {
        configurable: true,
        enumerable: false,
        writable: true,
        value: undefined
      };
      return;
    }

    polyProps[name] = desc;
  });
  Object.defineProperties(nullObject, polyProps);
  Object.defineProperty(shim$2, "nullPolyfill", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: nullObject
  });
  return function (prototype, props) {
    return create$1(prototype === null ? nullObject : prototype, props);
  };
}();

var objIsPrototypeOf = Object.prototype.isPrototypeOf,
    defineProperty = Object.defineProperty,
    nullDesc = {
  configurable: true,
  enumerable: false,
  writable: true,
  value: undefined
},
    validate;

validate = function (obj, prototype) {
  validValue(obj);
  if (prototype === null || isObject$2(prototype)) return obj;
  throw new TypeError("Prototype must be null or an object");
};

var shim$3 = function (status) {
  var fn, set;
  if (!status) return null;

  if (status.level === 2) {
    if (status.set) {
      set = status.set;

      fn = function (obj, prototype) {
        set.call(validate(obj, prototype), prototype);
        return obj;
      };
    } else {
      fn = function (obj, prototype) {
        validate(obj, prototype).__proto__ = prototype;
        return obj;
      };
    }
  } else {
    fn = function self(obj, prototype) {
      var isNullBase;
      validate(obj, prototype);
      isNullBase = objIsPrototypeOf.call(self.nullPolyfill, obj);
      if (isNullBase) delete self.nullPolyfill.__proto__;
      if (prototype === null) prototype = self.nullPolyfill;
      obj.__proto__ = prototype;
      if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
      return obj;
    };
  }

  return Object.defineProperty(fn, "level", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: status.level
  });
}(function () {
  var tmpObj1 = Object.create(null),
      tmpObj2 = {},
      set,
      desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

  if (desc) {
    try {
      set = desc.set; // Opera crashes at this point

      set.call(tmpObj1, tmpObj2);
    } catch (ignore) {}

    if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return {
      set: set,
      level: 2
    };
  }

  tmpObj1.__proto__ = tmpObj2;
  if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return {
    level: 2
  };
  tmpObj1 = {};
  tmpObj1.__proto__ = tmpObj2;
  if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return {
    level: 1
  };
  return false;
}());

var setPrototypeOf = isImplemented$3() ? Object.setPrototypeOf : shim$3;

var validCallable = function (fn) {
  if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
  return fn;
};

var isImplemented$4 = function () {
  var assign = Object.assign,
      obj;
  if (typeof assign !== "function") return false;
  obj = {
    foo: "raz"
  };
  assign(obj, {
    bar: "dwa"
  }, {
    trzy: "trzy"
  });
  return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
};

var isImplemented$5 = function () {
  try {
    return true;
  } catch (e) {
    return false;
  }
};

var keys$2 = Object.keys;

var shim$4 = function (object) {
  return keys$2(isValue(object) ? Object(object) : object);
};

var keys$3 = isImplemented$5() ? Object.keys : shim$4;

var max$1 = Math.max;

var shim$5 = function (dest, src
/*, …srcn*/
) {
  var error,
      i,
      length = max$1(arguments.length, 2),
      assign;
  dest = Object(validValue(dest));

  assign = function (key) {
    try {
      dest[key] = src[key];
    } catch (e) {
      if (!error) error = e;
    }
  };

  for (i = 1; i < length; ++i) {
    src = arguments[i];
    keys$3(src).forEach(assign);
  }

  if (error !== undefined) throw error;
  return dest;
};

var assign = isImplemented$4() ? Object.assign : shim$5;

var forEach$1 = Array.prototype.forEach,
    create$2 = Object.create;

var process$1 = function (src, obj) {
  var key;

  for (key in src) obj[key] = src[key];
}; // eslint-disable-next-line no-unused-vars


var normalizeOptions = function (opts1
/*, …options*/
) {
  var result = create$2(null);
  forEach$1.call(arguments, function (options) {
    if (!isValue(options)) return;
    process$1(Object(options), result);
  });
  return result;
};

// Deprecated

var isCallable = function (obj) {
  return typeof obj === "function";
};

var str = "razdwatrzy";

var isImplemented$6 = function () {
  if (typeof str.contains !== "function") return false;
  return str.contains("dwa") === true && str.contains("foo") === false;
};

var indexOf$3 = String.prototype.indexOf;

var shim$6 = function (searchString
/*, position*/
) {
  return indexOf$3.call(this, searchString, arguments[1]) > -1;
};

var contains = isImplemented$6() ? String.prototype.contains : shim$6;

var d_1 = createCommonjsModule(function (module) {

  var d;

  d = module.exports = function (dscr, value
  /*, options*/
  ) {
    var c, e, w, options, desc;

    if (arguments.length < 2 || typeof dscr !== 'string') {
      options = value;
      value = dscr;
      dscr = null;
    } else {
      options = arguments[2];
    }

    if (dscr == null) {
      c = w = true;
      e = false;
    } else {
      c = contains.call(dscr, 'c');
      e = contains.call(dscr, 'e');
      w = contains.call(dscr, 'w');
    }

    desc = {
      value: value,
      configurable: c,
      enumerable: e,
      writable: w
    };
    return !options ? desc : assign(normalizeOptions(options), desc);
  };

  d.gs = function (dscr, get, set
  /*, options*/
  ) {
    var c, e, options, desc;

    if (typeof dscr !== 'string') {
      options = set;
      set = get;
      get = dscr;
      dscr = null;
    } else {
      options = arguments[3];
    }

    if (get == null) {
      get = undefined;
    } else if (!isCallable(get)) {
      options = get;
      get = set = undefined;
    } else if (set == null) {
      set = undefined;
    } else if (!isCallable(set)) {
      options = set;
      set = undefined;
    }

    if (dscr == null) {
      c = true;
      e = false;
    } else {
      c = contains.call(dscr, 'c');
      e = contains.call(dscr, 'e');
    }

    desc = {
      get: get,
      set: set,
      configurable: c,
      enumerable: e
    };
    return !options ? desc : assign(normalizeOptions(options), desc);
  };
});

var eventEmitter = createCommonjsModule(function (module, exports) {

  var apply = Function.prototype.apply,
      call = Function.prototype.call,
      create = Object.create,
      defineProperty = Object.defineProperty,
      defineProperties = Object.defineProperties,
      hasOwnProperty = Object.prototype.hasOwnProperty,
      descriptor = {
    configurable: true,
    enumerable: false,
    writable: true
  },
      on,
      once,
      off,
      emit,
      methods,
      descriptors,
      base;

  on = function (type, listener) {
    var data;
    validCallable(listener);

    if (!hasOwnProperty.call(this, '__ee__')) {
      data = descriptor.value = create(null);
      defineProperty(this, '__ee__', descriptor);
      descriptor.value = null;
    } else {
      data = this.__ee__;
    }

    if (!data[type]) data[type] = listener;else if (typeof data[type] === 'object') data[type].push(listener);else data[type] = [data[type], listener];
    return this;
  };

  once = function (type, listener) {
    var once, self;
    validCallable(listener);
    self = this;
    on.call(this, type, once = function () {
      off.call(self, type, once);
      apply.call(listener, this, arguments);
    });
    once.__eeOnceListener__ = listener;
    return this;
  };

  off = function (type, listener) {
    var data, listeners, candidate, i;
    validCallable(listener);
    if (!hasOwnProperty.call(this, '__ee__')) return this;
    data = this.__ee__;
    if (!data[type]) return this;
    listeners = data[type];

    if (typeof listeners === 'object') {
      for (i = 0; candidate = listeners[i]; ++i) {
        if (candidate === listener || candidate.__eeOnceListener__ === listener) {
          if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];else listeners.splice(i, 1);
        }
      }
    } else {
      if (listeners === listener || listeners.__eeOnceListener__ === listener) {
        delete data[type];
      }
    }

    return this;
  };

  emit = function (type) {
    var i, l, listener, listeners, args;
    if (!hasOwnProperty.call(this, '__ee__')) return;
    listeners = this.__ee__[type];
    if (!listeners) return;

    if (typeof listeners === 'object') {
      l = arguments.length;
      args = new Array(l - 1);

      for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

      listeners = listeners.slice();

      for (i = 0; listener = listeners[i]; ++i) {
        apply.call(listener, this, args);
      }
    } else {
      switch (arguments.length) {
        case 1:
          call.call(listeners, this);
          break;

        case 2:
          call.call(listeners, this, arguments[1]);
          break;

        case 3:
          call.call(listeners, this, arguments[1], arguments[2]);
          break;

        default:
          l = arguments.length;
          args = new Array(l - 1);

          for (i = 1; i < l; ++i) {
            args[i - 1] = arguments[i];
          }

          apply.call(listeners, this, args);
      }
    }
  };

  methods = {
    on: on,
    once: once,
    off: off,
    emit: emit
  };
  descriptors = {
    on: d_1(on),
    once: d_1(once),
    off: d_1(off),
    emit: d_1(emit)
  };
  base = defineProperties({}, descriptors);

  module.exports = exports = function (o) {
    return o == null ? create(base) : defineProperties(Object(o), descriptors);
  };

  exports.methods = methods;
});
var eventEmitter_1 = eventEmitter.methods;

var validTypes = {
  object: true,
  symbol: true
};

var isImplemented$7 = function () {
  if (typeof Symbol !== 'function') return false;

  try {
  } catch (e) {
    return false;
  } // Return 'true' also for polyfills


  if (!validTypes[typeof Symbol.iterator]) return false;
  if (!validTypes[typeof Symbol.toPrimitive]) return false;
  if (!validTypes[typeof Symbol.toStringTag]) return false;
  return true;
};

var isSymbol$2 = function (x) {
  if (!x) return false;
  if (typeof x === 'symbol') return true;
  if (!x.constructor) return false;
  if (x.constructor.name !== 'Symbol') return false;
  return x[x.constructor.toStringTag] === 'Symbol';
};

var validateSymbol = function (value) {
  if (!isSymbol$2(value)) throw new TypeError(value + " is not a symbol");
  return value;
};

var create$3 = Object.create,
    defineProperties = Object.defineProperties,
    defineProperty$1 = Object.defineProperty,
    objPrototype = Object.prototype,
    NativeSymbol,
    SymbolPolyfill,
    HiddenSymbol,
    globalSymbols = create$3(null),
    isNativeSafe;

if (typeof Symbol === 'function') {
  NativeSymbol = Symbol;

  try {
    String(NativeSymbol());
    isNativeSafe = true;
  } catch (ignore) {}
}

var generateName = function () {
  var created = create$3(null);
  return function (desc) {
    var postfix = 0,
        name,
        ie11BugWorkaround;

    while (created[desc + (postfix || '')]) ++postfix;

    desc += postfix || '';
    created[desc] = true;
    name = '@@' + desc;
    defineProperty$1(objPrototype, name, d_1.gs(null, function (value) {
      // For IE11 issue see:
      // https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
      //    ie11-broken-getters-on-dom-objects
      // https://github.com/medikoo/es6-symbol/issues/12
      if (ie11BugWorkaround) return;
      ie11BugWorkaround = true;
      defineProperty$1(this, name, d_1(value));
      ie11BugWorkaround = false;
    }));
    return name;
  };
}(); // Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false


HiddenSymbol = function Symbol(description) {
  if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
  return SymbolPolyfill(description);
}; // Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)


var polyfill = SymbolPolyfill = function Symbol(description) {
  var symbol;
  if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
  if (isNativeSafe) return NativeSymbol(description);
  symbol = create$3(HiddenSymbol.prototype);
  description = description === undefined ? '' : String(description);
  return defineProperties(symbol, {
    __description__: d_1('', description),
    __name__: d_1('', generateName(description))
  });
};

defineProperties(SymbolPolyfill, {
  for: d_1(function (key) {
    if (globalSymbols[key]) return globalSymbols[key];
    return globalSymbols[key] = SymbolPolyfill(String(key));
  }),
  keyFor: d_1(function (s) {
    var key;
    validateSymbol(s);

    for (key in globalSymbols) if (globalSymbols[key] === s) return key;
  }),
  // To ensure proper interoperability with other native functions (e.g. Array.from)
  // fallback to eventual native implementation of given symbol
  hasInstance: d_1('', NativeSymbol && NativeSymbol.hasInstance || SymbolPolyfill('hasInstance')),
  isConcatSpreadable: d_1('', NativeSymbol && NativeSymbol.isConcatSpreadable || SymbolPolyfill('isConcatSpreadable')),
  iterator: d_1('', NativeSymbol && NativeSymbol.iterator || SymbolPolyfill('iterator')),
  match: d_1('', NativeSymbol && NativeSymbol.match || SymbolPolyfill('match')),
  replace: d_1('', NativeSymbol && NativeSymbol.replace || SymbolPolyfill('replace')),
  search: d_1('', NativeSymbol && NativeSymbol.search || SymbolPolyfill('search')),
  species: d_1('', NativeSymbol && NativeSymbol.species || SymbolPolyfill('species')),
  split: d_1('', NativeSymbol && NativeSymbol.split || SymbolPolyfill('split')),
  toPrimitive: d_1('', NativeSymbol && NativeSymbol.toPrimitive || SymbolPolyfill('toPrimitive')),
  toStringTag: d_1('', NativeSymbol && NativeSymbol.toStringTag || SymbolPolyfill('toStringTag')),
  unscopables: d_1('', NativeSymbol && NativeSymbol.unscopables || SymbolPolyfill('unscopables'))
}); // Internal tweaks for real symbol producer

defineProperties(HiddenSymbol.prototype, {
  constructor: d_1(SymbolPolyfill),
  toString: d_1('', function () {
    return this.__name__;
  })
}); // Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype

defineProperties(SymbolPolyfill.prototype, {
  toString: d_1(function () {
    return 'Symbol (' + validateSymbol(this).__description__ + ')';
  }),
  valueOf: d_1(function () {
    return validateSymbol(this);
  })
});
defineProperty$1(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d_1('', function () {
  var symbol = validateSymbol(this);
  if (typeof symbol === 'symbol') return symbol;
  return symbol.toString();
}));
defineProperty$1(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d_1('c', 'Symbol')); // Proper implementaton of toPrimitive and toStringTag for returned symbol instances

defineProperty$1(HiddenSymbol.prototype, SymbolPolyfill.toStringTag, d_1('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag])); // Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149

defineProperty$1(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive, d_1('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

var es6Symbol = isImplemented$7() ? Symbol : polyfill;

var objToString = Object.prototype.toString,
    id = objToString.call(function () {
  return arguments;
}());

var isArguments = function (value) {
  return objToString.call(value) === id;
};

var objToString$1 = Object.prototype.toString,
    id$1 = objToString$1.call("");

var isString$2 = function (value) {
  return typeof value === "string" || value && typeof value === "object" && (value instanceof String || objToString$1.call(value) === id$1) || false;
};

var iteratorSymbol = es6Symbol.iterator,
    isArray$3 = Array.isArray;

var isIterable = function (value) {
  if (!isValue(value)) return false;
  if (isArray$3(value)) return true;
  if (isString$2(value)) return true;
  if (isArguments(value)) return true;
  return typeof value[iteratorSymbol] === "function";
};

var validIterable = function (value) {
  if (!isIterable(value)) throw new TypeError(value + " is not iterable");
  return value;
};

var isImplemented$8 = function () {
  var from = Array.from,
      arr,
      result;
  if (typeof from !== "function") return false;
  arr = ["raz", "dwa"];
  result = from(arr);
  return Boolean(result && result !== arr && result[1] === "dwa");
};

var objToString$2 = Object.prototype.toString,
    id$2 = objToString$2.call(noop$1);

var isFunction$2 = function (value) {
  return typeof value === "function" && objToString$2.call(value) === id$2;
};

var iteratorSymbol$1 = es6Symbol.iterator,
    isArray$4 = Array.isArray,
    call = Function.prototype.call,
    desc = {
  configurable: true,
  enumerable: true,
  writable: true,
  value: null
},
    defineProperty$2 = Object.defineProperty; // eslint-disable-next-line complexity, max-lines-per-function

var shim$7 = function (arrayLike
/*, mapFn, thisArg*/
) {
  var mapFn = arguments[1],
      thisArg = arguments[2],
      Context,
      i,
      j,
      arr,
      length,
      code,
      iterator,
      result,
      getIterator,
      value;
  arrayLike = Object(validValue(arrayLike));
  if (isValue(mapFn)) validCallable(mapFn);

  if (!this || this === Array || !isFunction$2(this)) {
    // Result: Plain array
    if (!mapFn) {
      if (isArguments(arrayLike)) {
        // Source: Arguments
        length = arrayLike.length;
        if (length !== 1) return Array.apply(null, arrayLike);
        arr = new Array(1);
        arr[0] = arrayLike[0];
        return arr;
      }

      if (isArray$4(arrayLike)) {
        // Source: Array
        arr = new Array(length = arrayLike.length);

        for (i = 0; i < length; ++i) arr[i] = arrayLike[i];

        return arr;
      }
    }

    arr = [];
  } else {
    // Result: Non plain array
    Context = this;
  }

  if (!isArray$4(arrayLike)) {
    if ((getIterator = arrayLike[iteratorSymbol$1]) !== undefined) {
      // Source: Iterator
      iterator = validCallable(getIterator).call(arrayLike);
      if (Context) arr = new Context();
      result = iterator.next();
      i = 0;

      while (!result.done) {
        value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;

        if (Context) {
          desc.value = value;
          defineProperty$2(arr, i, desc);
        } else {
          arr[i] = value;
        }

        result = iterator.next();
        ++i;
      }

      length = i;
    } else if (isString$2(arrayLike)) {
      // Source: String
      length = arrayLike.length;
      if (Context) arr = new Context();

      for (i = 0, j = 0; i < length; ++i) {
        value = arrayLike[i];

        if (i + 1 < length) {
          code = value.charCodeAt(0); // eslint-disable-next-line max-depth

          if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
        }

        value = mapFn ? call.call(mapFn, thisArg, value, j) : value;

        if (Context) {
          desc.value = value;
          defineProperty$2(arr, j, desc);
        } else {
          arr[j] = value;
        }

        ++j;
      }

      length = j;
    }
  }

  if (length === undefined) {
    // Source: array or array-like
    length = toPosInteger(arrayLike.length);
    if (Context) arr = new Context(length);

    for (i = 0; i < length; ++i) {
      value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];

      if (Context) {
        desc.value = value;
        defineProperty$2(arr, i, desc);
      } else {
        arr[i] = value;
      }
    }
  }

  if (Context) {
    desc.value = null;
    arr.length = length;
  }

  return arr;
};

var from_1 = isImplemented$8() ? Array.from : shim$7;

var copy = function (obj
/*, propertyNames, options*/
) {
  var copy = Object(validValue(obj)),
      propertyNames = arguments[1],
      options = Object(arguments[2]);
  if (copy !== obj && !propertyNames) return copy;
  var result = {};

  if (propertyNames) {
    from_1(propertyNames, function (propertyName) {
      if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
    });
  } else {
    assign(result, obj);
  }

  return result;
};

var bind = Function.prototype.bind,
    call$1 = Function.prototype.call,
    keys$4 = Object.keys,
    objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

var _iterate = function (method, defVal) {
  return function (obj, cb
  /*, thisArg, compareFn*/
  ) {
    var list,
        thisArg = arguments[2],
        compareFn = arguments[3];
    obj = Object(validValue(obj));
    validCallable(cb);
    list = keys$4(obj);

    if (compareFn) {
      list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
    }

    if (typeof method !== "function") method = list[method];
    return call$1.call(method, list, function (key, index) {
      if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
      return call$1.call(cb, thisArg, obj[key], key, obj, index);
    });
  };
};

var forEach$2 = _iterate("forEach");

var call$2 = Function.prototype.call;

var map$1 = function (obj, cb
/*, thisArg*/
) {
  var result = {},
      thisArg = arguments[2];
  validCallable(cb);
  forEach$2(obj, function (value, key, targetObj, index) {
    result[key] = call$2.call(cb, thisArg, value, key, targetObj, index);
  });
  return result;
};

var callable = validCallable,
    bind$1 = Function.prototype.bind,
    defineProperty$3 = Object.defineProperty,
    hasOwnProperty$2 = Object.prototype.hasOwnProperty,
    define;

define = function (name, desc, options) {
  var value = validValue(desc) && callable(desc.value),
      dgs;
  dgs = copy(desc);
  delete dgs.writable;
  delete dgs.value;

  dgs.get = function () {
    if (!options.overwriteDefinition && hasOwnProperty$2.call(this, name)) return value;
    desc.value = bind$1.call(value, options.resolveContext ? options.resolveContext(this) : this);
    defineProperty$3(this, name, desc);
    return this[name];
  };

  return dgs;
};

var autoBind = function (props
/*, options*/
) {
  var options = normalizeOptions(arguments[1]);
  if (options.resolveContext != null) validCallable(options.resolveContext);
  return map$1(props, function (desc, name) {
    return define(name, desc, options);
  });
};

var defineProperty$4 = Object.defineProperty,
    defineProperties$1 = Object.defineProperties,
    Iterator;

var es6Iterator = Iterator = function (list, context) {
  if (!(this instanceof Iterator)) throw new TypeError("Constructor requires 'new'");
  defineProperties$1(this, {
    __list__: d_1("w", validValue(list)),
    __context__: d_1("w", context),
    __nextIndex__: d_1("w", 0)
  });
  if (!context) return;
  validCallable(context.on);
  context.on("_add", this._onAdd);
  context.on("_delete", this._onDelete);
  context.on("_clear", this._onClear);
}; // Internal %IteratorPrototype% doesn't expose its constructor


delete Iterator.prototype.constructor;
defineProperties$1(Iterator.prototype, assign({
  _next: d_1(function () {
    var i;
    if (!this.__list__) return undefined;

    if (this.__redo__) {
      i = this.__redo__.shift();
      if (i !== undefined) return i;
    }

    if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;

    this._unBind();

    return undefined;
  }),
  next: d_1(function () {
    return this._createResult(this._next());
  }),
  _createResult: d_1(function (i) {
    if (i === undefined) return {
      done: true,
      value: undefined
    };
    return {
      done: false,
      value: this._resolve(i)
    };
  }),
  _resolve: d_1(function (i) {
    return this.__list__[i];
  }),
  _unBind: d_1(function () {
    this.__list__ = null;
    delete this.__redo__;
    if (!this.__context__) return;

    this.__context__.off("_add", this._onAdd);

    this.__context__.off("_delete", this._onDelete);

    this.__context__.off("_clear", this._onClear);

    this.__context__ = null;
  }),
  toString: d_1(function () {
    return "[object " + (this[es6Symbol.toStringTag] || "Object") + "]";
  })
}, autoBind({
  _onAdd: d_1(function (index) {
    if (index >= this.__nextIndex__) return;
    ++this.__nextIndex__;

    if (!this.__redo__) {
      defineProperty$4(this, "__redo__", d_1("c", [index]));
      return;
    }

    this.__redo__.forEach(function (redo, i) {
      if (redo >= index) this.__redo__[i] = ++redo;
    }, this);

    this.__redo__.push(index);
  }),
  _onDelete: d_1(function (index) {
    var i;
    if (index >= this.__nextIndex__) return;
    --this.__nextIndex__;
    if (!this.__redo__) return;
    i = this.__redo__.indexOf(index);
    if (i !== -1) this.__redo__.splice(i, 1);

    this.__redo__.forEach(function (redo, j) {
      if (redo > index) this.__redo__[j] = --redo;
    }, this);
  }),
  _onClear: d_1(function () {
    if (this.__redo__) clear.call(this.__redo__);
    this.__nextIndex__ = 0;
  })
})));
defineProperty$4(Iterator.prototype, es6Symbol.iterator, d_1(function () {
  return this;
}));

var array = createCommonjsModule(function (module) {

  var defineProperty = Object.defineProperty,
      ArrayIterator;

  ArrayIterator = module.exports = function (arr, kind) {
    if (!(this instanceof ArrayIterator)) throw new TypeError("Constructor requires 'new'");
    es6Iterator.call(this, arr);
    if (!kind) kind = "value";else if (contains.call(kind, "key+value")) kind = "key+value";else if (contains.call(kind, "key")) kind = "key";else kind = "value";
    defineProperty(this, "__kind__", d_1("", kind));
  };

  if (setPrototypeOf) setPrototypeOf(ArrayIterator, es6Iterator); // Internal %ArrayIteratorPrototype% doesn't expose its constructor

  delete ArrayIterator.prototype.constructor;
  ArrayIterator.prototype = Object.create(es6Iterator.prototype, {
    _resolve: d_1(function (i) {
      if (this.__kind__ === "value") return this.__list__[i];
      if (this.__kind__ === "key+value") return [i, this.__list__[i]];
      return i;
    })
  });
  defineProperty(ArrayIterator.prototype, es6Symbol.toStringTag, d_1("c", "Array Iterator"));
});

var string = createCommonjsModule(function (module) {

  var defineProperty = Object.defineProperty,
      StringIterator;

  StringIterator = module.exports = function (str) {
    if (!(this instanceof StringIterator)) throw new TypeError("Constructor requires 'new'");
    str = String(str);
    es6Iterator.call(this, str);
    defineProperty(this, "__length__", d_1("", str.length));
  };

  if (setPrototypeOf) setPrototypeOf(StringIterator, es6Iterator); // Internal %ArrayIteratorPrototype% doesn't expose its constructor

  delete StringIterator.prototype.constructor;
  StringIterator.prototype = Object.create(es6Iterator.prototype, {
    _next: d_1(function () {
      if (!this.__list__) return undefined;
      if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;

      this._unBind();

      return undefined;
    }),
    _resolve: d_1(function (i) {
      var char = this.__list__[i],
          code;
      if (this.__nextIndex__ === this.__length__) return char;
      code = char.charCodeAt(0);
      if (code >= 0xd800 && code <= 0xdbff) return char + this.__list__[this.__nextIndex__++];
      return char;
    })
  });
  defineProperty(StringIterator.prototype, es6Symbol.toStringTag, d_1("c", "String Iterator"));
});

var iteratorSymbol$2 = es6Symbol.iterator;

var get = function (obj) {
  if (typeof validIterable(obj)[iteratorSymbol$2] === "function") return obj[iteratorSymbol$2]();
  if (isArguments(obj)) return new array(obj);
  if (isString$2(obj)) return new string(obj);
  return new array(obj);
};

var isArray$5 = Array.isArray,
    call$3 = Function.prototype.call,
    some = Array.prototype.some;

var forOf = function (iterable, cb
/*, thisArg*/
) {
  var mode,
      thisArg = arguments[2],
      result,
      doBreak,
      broken,
      i,
      length,
      char,
      code;
  if (isArray$5(iterable) || isArguments(iterable)) mode = "array";else if (isString$2(iterable)) mode = "string";else iterable = get(iterable);
  validCallable(cb);

  doBreak = function () {
    broken = true;
  };

  if (mode === "array") {
    some.call(iterable, function (value) {
      call$3.call(cb, thisArg, value, doBreak);
      return broken;
    });
    return;
  }

  if (mode === "string") {
    length = iterable.length;

    for (i = 0; i < length; ++i) {
      char = iterable[i];

      if (i + 1 < length) {
        code = char.charCodeAt(0);
        if (code >= 0xd800 && code <= 0xdbff) char += iterable[++i];
      }

      call$3.call(cb, thisArg, char, doBreak);
      if (broken) break;
    }

    return;
  }

  result = iterable.next();

  while (!result.done) {
    call$3.call(cb, thisArg, result.value, doBreak);
    if (broken) return;
    result = iterable.next();
  }
};

var forEach$3 = Array.prototype.forEach,
    create$4 = Object.create; // eslint-disable-next-line no-unused-vars

var primitiveSet = function (arg
/*, …args*/
) {
  var set = create$4(null);
  forEach$3.call(arguments, function (name) {
    set[name] = true;
  });
  return set;
};

var iteratorKinds = primitiveSet('key', 'value', 'key+value');

var iterator = createCommonjsModule(function (module) {

  var toStringTagSymbol = es6Symbol.toStringTag,
      defineProperties = Object.defineProperties,
      unBind = es6Iterator.prototype._unBind,
      MapIterator;

  MapIterator = module.exports = function (map, kind) {
    if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
    es6Iterator.call(this, map.__mapKeysData__, map);
    if (!kind || !iteratorKinds[kind]) kind = 'key+value';
    defineProperties(this, {
      __kind__: d_1('', kind),
      __values__: d_1('w', map.__mapValuesData__)
    });
  };

  if (setPrototypeOf) setPrototypeOf(MapIterator, es6Iterator);
  MapIterator.prototype = Object.create(es6Iterator.prototype, {
    constructor: d_1(MapIterator),
    _resolve: d_1(function (i) {
      if (this.__kind__ === 'value') return this.__values__[i];
      if (this.__kind__ === 'key') return this.__list__[i];
      return [this.__list__[i], this.__values__[i]];
    }),
    _unBind: d_1(function () {
      this.__values__ = null;
      unBind.call(this);
    }),
    toString: d_1(function () {
      return '[object Map Iterator]';
    })
  });
  Object.defineProperty(MapIterator.prototype, toStringTagSymbol, d_1('c', 'Map Iterator'));
});

// Exports true if environment provides native `Map` implementation,

var isNativeImplemented = function () {
  if (typeof Map === 'undefined') return false;
  return Object.prototype.toString.call(new Map()) === '[object Map]';
}();

var iterator$1 = validIterable,
    call$4 = Function.prototype.call,
    defineProperties$2 = Object.defineProperties,
    getPrototypeOf$1 = Object.getPrototypeOf,
    MapPoly;

var polyfill$1 = MapPoly = function ()
/*iterable*/
{
  var iterable = arguments[0],
      keys,
      values,
      self;
  if (!(this instanceof MapPoly)) throw new TypeError('Constructor requires \'new\'');

  if (isNativeImplemented && setPrototypeOf && Map !== MapPoly) {
    self = setPrototypeOf(new Map(), getPrototypeOf$1(this));
  } else {
    self = this;
  }

  if (iterable != null) iterator$1(iterable);
  defineProperties$2(self, {
    __mapKeysData__: d_1('c', keys = []),
    __mapValuesData__: d_1('c', values = [])
  });
  if (!iterable) return self;
  forOf(iterable, function (value) {
    var key = validValue(value)[0];
    value = value[1];
    if (eIndexOf.call(keys, key) !== -1) return;
    keys.push(key);
    values.push(value);
  }, self);
  return self;
};

if (isNativeImplemented) {
  if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
  MapPoly.prototype = Object.create(Map.prototype, {
    constructor: d_1(MapPoly)
  });
}

eventEmitter(defineProperties$2(MapPoly.prototype, {
  clear: d_1(function () {
    if (!this.__mapKeysData__.length) return;
    clear.call(this.__mapKeysData__);
    clear.call(this.__mapValuesData__);
    this.emit('_clear');
  }),
  delete: d_1(function (key) {
    var index = eIndexOf.call(this.__mapKeysData__, key);
    if (index === -1) return false;

    this.__mapKeysData__.splice(index, 1);

    this.__mapValuesData__.splice(index, 1);

    this.emit('_delete', index, key);
    return true;
  }),
  entries: d_1(function () {
    return new iterator(this, 'key+value');
  }),
  forEach: d_1(function (cb
  /*, thisArg*/
  ) {
    var thisArg = arguments[1],
        iterator$$1,
        result;
    validCallable(cb);
    iterator$$1 = this.entries();
    result = iterator$$1._next();

    while (result !== undefined) {
      call$4.call(cb, thisArg, this.__mapValuesData__[result], this.__mapKeysData__[result], this);
      result = iterator$$1._next();
    }
  }),
  get: d_1(function (key) {
    var index = eIndexOf.call(this.__mapKeysData__, key);
    if (index === -1) return;
    return this.__mapValuesData__[index];
  }),
  has: d_1(function (key) {
    return eIndexOf.call(this.__mapKeysData__, key) !== -1;
  }),
  keys: d_1(function () {
    return new iterator(this, 'key');
  }),
  set: d_1(function (key, value) {
    var index = eIndexOf.call(this.__mapKeysData__, key),
        emit;

    if (index === -1) {
      index = this.__mapKeysData__.push(key) - 1;
      emit = true;
    }

    this.__mapValuesData__[index] = value;
    if (emit) this.emit('_add', index, key);
    return this;
  }),
  size: d_1.gs(function () {
    return this.__mapKeysData__.length;
  }),
  values: d_1(function () {
    return new iterator(this, 'value');
  }),
  toString: d_1(function () {
    return '[object Map]';
  })
}));
Object.defineProperty(MapPoly.prototype, es6Symbol.iterator, d_1(function () {
  return this.entries();
}));
Object.defineProperty(MapPoly.prototype, es6Symbol.toStringTag, d_1('c', 'Map'));

var es6Map = isImplemented() ? Map : polyfill$1;

/**
 * Module dependencies
 */


var Readable$2 = readableBrowser.Readable;
var streamsOpts = {
  objectMode: true
};
var defaultStoreOptions = {
  clean: true
  /**
   * es6-map can preserve insertion order even if ES version is older.
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Description
   * It should be noted that a Map which is a map of an object, especially
   * a dictionary of dictionaries, will only map to the object's insertion
   * order. In ES2015 this is ordered for objects but for older versions of
   * ES, this may be random and not ordered.
   *
   */

  /**
   * In-memory implementation of the message store
   * This can actually be saved into files.
   *
   * @param {Object} [options] - store options
   */

};

function Store(options) {
  if (!(this instanceof Store)) {
    return new Store(options);
  }

  this.options = options || {}; // Defaults

  this.options = immutable(defaultStoreOptions, options);
  this._inflights = new es6Map();
}
/**
 * Adds a packet to the store, a packet is
 * anything that has a messageId property.
 *
 */


Store.prototype.put = function (packet, cb) {
  this._inflights.set(packet.messageId, packet);

  if (cb) {
    cb();
  }

  return this;
};
/**
 * Creates a stream with all the packets in the store
 *
 */


Store.prototype.createStream = function () {
  var stream = new Readable$2(streamsOpts);
  var destroyed = false;
  var values = [];
  var i = 0;

  this._inflights.forEach(function (value, key) {
    values.push(value);
  });

  stream._read = function () {
    if (!destroyed && i < values.length) {
      this.push(values[i++]);
    } else {
      this.push(null);
    }
  };

  stream.destroy = function () {
    if (destroyed) {
      return;
    }

    var self = this;
    destroyed = true;
    nextTick(function () {
      self.emit('close');
    });
  };

  return stream;
};
/**
 * deletes a packet from the store.
 */


Store.prototype.del = function (packet, cb) {
  packet = this._inflights.get(packet.messageId);

  if (packet) {
    this._inflights.delete(packet.messageId);

    cb(null, packet);
  } else if (cb) {
    cb(new Error('missing packet'));
  }

  return this;
};
/**
 * get a packet from the store.
 */


Store.prototype.get = function (packet, cb) {
  packet = this._inflights.get(packet.messageId);

  if (packet) {
    cb(null, packet);
  } else if (cb) {
    cb(new Error('missing packet'));
  }

  return this;
};
/**
 * Close the store
 */


Store.prototype.close = function (cb) {
  if (this.options.clean) {
    this._inflights = null;
  }

  if (cb) {
    cb();
  }
};

var store = Store;

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;

function wrappy(fn, cb) {
  if (fn && cb) return wrappy(fn)(cb);
  if (typeof fn !== 'function') throw new TypeError('need wrapper function');
  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });
  return wrapper;

  function wrapper() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    var ret = fn.apply(this, args);
    var cb = args[args.length - 1];

    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }

    return ret;
  }
}

var once_1 = wrappy_1(once$1);
var strict = wrappy_1(onceStrict);
once$1.proto = once$1(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once$1(this);
    },
    configurable: true
  });
  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this);
    },
    configurable: true
  });
});

function once$1(fn) {
  var f = function () {
    if (f.called) return f.value;
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };

  f.called = false;
  return f;
}

function onceStrict(fn) {
  var f = function () {
    if (f.called) throw new Error(f.onceError);
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };

  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f;
}
once_1.strict = strict;

var noop$2 = function () {};

var isRequest = function (stream) {
  return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function (stream) {
  return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3;
};

var eos = function (stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once_1(callback || noop$2);
  var ws = stream._writableState;
  var rs = stream._readableState;
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function () {
    if (!stream.writable) onfinish();
  };

  var onfinish = function () {
    writable = false;
    if (!readable) callback.call(stream);
  };

  var onend = function () {
    readable = false;
    if (!writable) callback.call(stream);
  };

  var onexit = function (exitCode) {
    callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
  };

  var onerror = function (err) {
    callback.call(stream, err);
  };

  var onclose = function () {
    if (readable && !(rs && rs.ended)) return callback.call(stream, new Error('premature close'));
    if (writable && !(ws && ws.ended)) return callback.call(stream, new Error('premature close'));
  };

  var onrequest = function () {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !ws) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  if (isChildProcess(stream)) stream.on('exit', onexit);
  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('exit', onexit);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
};

var endOfStream = eos;

var duplexBrowser = _stream_duplex;

var Buffer$4 = safeBuffer.Buffer;

function BufferList$2(callback) {
  if (!(this instanceof BufferList$2)) return new BufferList$2(callback);
  this._bufs = [];
  this.length = 0;

  if (typeof callback == 'function') {
    this._callback = callback;

    var piper = function piper(err) {
      if (this._callback) {
        this._callback(err);

        this._callback = null;
      }
    }.bind(this);

    this.on('pipe', function onPipe(src) {
      src.on('error', piper);
    });
    this.on('unpipe', function onUnpipe(src) {
      src.removeListener('error', piper);
    });
  } else {
    this.append(callback);
  }

  duplexBrowser.call(this);
}

util.inherits(BufferList$2, duplexBrowser);

BufferList$2.prototype._offset = function _offset(offset) {
  var tot = 0,
      i = 0,
      _t;

  if (offset === 0) return [0, 0];

  for (; i < this._bufs.length; i++) {
    _t = tot + this._bufs[i].length;
    if (offset < _t || i == this._bufs.length - 1) return [i, offset - tot];
    tot = _t;
  }
};

BufferList$2.prototype.append = function append(buf) {
  var i = 0;

  if (Buffer$4.isBuffer(buf)) {
    this._appendBuffer(buf);
  } else if (Array.isArray(buf)) {
    for (; i < buf.length; i++) this.append(buf[i]);
  } else if (buf instanceof BufferList$2) {
    // unwrap argument into individual BufferLists
    for (; i < buf._bufs.length; i++) this.append(buf._bufs[i]);
  } else if (buf != null) {
    // coerce number arguments to strings, since Buffer(number) does
    // uninitialized memory allocation
    if (typeof buf == 'number') buf = buf.toString();

    this._appendBuffer(Buffer$4.from(buf));
  }

  return this;
};

BufferList$2.prototype._appendBuffer = function appendBuffer(buf) {
  this._bufs.push(buf);

  this.length += buf.length;
};

BufferList$2.prototype._write = function _write(buf, encoding, callback) {
  this._appendBuffer(buf);

  if (typeof callback == 'function') callback();
};

BufferList$2.prototype._read = function _read(size) {
  if (!this.length) return this.push(null);
  size = Math.min(size, this.length);
  this.push(this.slice(0, size));
  this.consume(size);
};

BufferList$2.prototype.end = function end(chunk) {
  duplexBrowser.prototype.end.call(this, chunk);

  if (this._callback) {
    this._callback(null, this.slice());

    this._callback = null;
  }
};

BufferList$2.prototype.get = function get(index) {
  return this.slice(index, index + 1)[0];
};

BufferList$2.prototype.slice = function slice(start, end) {
  if (typeof start == 'number' && start < 0) start += this.length;
  if (typeof end == 'number' && end < 0) end += this.length;
  return this.copy(null, 0, start, end);
};

BufferList$2.prototype.copy = function copy(dst, dstStart, srcStart, srcEnd) {
  if (typeof srcStart != 'number' || srcStart < 0) srcStart = 0;
  if (typeof srcEnd != 'number' || srcEnd > this.length) srcEnd = this.length;
  if (srcStart >= this.length) return dst || Buffer$4.alloc(0);
  if (srcEnd <= 0) return dst || Buffer$4.alloc(0);

  var copy = !!dst,
      off = this._offset(srcStart),
      len = srcEnd - srcStart,
      bytes = len,
      bufoff = copy && dstStart || 0,
      start = off[1],
      l,
      i; // copy/slice everything


  if (srcStart === 0 && srcEnd == this.length) {
    if (!copy) {
      // slice, but full concat if multiple buffers
      return this._bufs.length === 1 ? this._bufs[0] : Buffer$4.concat(this._bufs, this.length);
    } // copy, need to copy individual buffers


    for (i = 0; i < this._bufs.length; i++) {
      this._bufs[i].copy(dst, bufoff);

      bufoff += this._bufs[i].length;
    }

    return dst;
  } // easy, cheap case where it's a subset of one of the buffers


  if (bytes <= this._bufs[off[0]].length - start) {
    return copy ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes) : this._bufs[off[0]].slice(start, start + bytes);
  }

  if (!copy) // a slice, we need something to copy in to
    dst = Buffer$4.allocUnsafe(len);

  for (i = off[0]; i < this._bufs.length; i++) {
    l = this._bufs[i].length - start;

    if (bytes > l) {
      this._bufs[i].copy(dst, bufoff, start);
    } else {
      this._bufs[i].copy(dst, bufoff, start, start + bytes);

      break;
    }

    bufoff += l;
    bytes -= l;
    if (start) start = 0;
  }

  return dst;
};

BufferList$2.prototype.shallowSlice = function shallowSlice(start, end) {
  start = start || 0;
  end = end || this.length;
  if (start < 0) start += this.length;
  if (end < 0) end += this.length;

  var startOffset = this._offset(start),
      endOffset = this._offset(end),
      buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1);

  if (endOffset[1] == 0) buffers.pop();else buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1]);
  if (startOffset[1] != 0) buffers[0] = buffers[0].slice(startOffset[1]);
  return new BufferList$2(buffers);
};

BufferList$2.prototype.toString = function toString(encoding, start, end) {
  return this.slice(start, end).toString(encoding);
};

BufferList$2.prototype.consume = function consume(bytes) {
  while (this._bufs.length) {
    if (bytes >= this._bufs[0].length) {
      bytes -= this._bufs[0].length;
      this.length -= this._bufs[0].length;

      this._bufs.shift();
    } else {
      this._bufs[0] = this._bufs[0].slice(bytes);
      this.length -= bytes;
      break;
    }
  }

  return this;
};

BufferList$2.prototype.duplicate = function duplicate() {
  var i = 0,
      copy = new BufferList$2();

  for (; i < this._bufs.length; i++) copy.append(this._bufs[i]);

  return copy;
};

BufferList$2.prototype.destroy = function destroy() {
  this._bufs.length = 0;
  this.length = 0;
  this.push(null);
};

(function () {
  var methods = {
    'readDoubleBE': 8,
    'readDoubleLE': 8,
    'readFloatBE': 4,
    'readFloatLE': 4,
    'readInt32BE': 4,
    'readInt32LE': 4,
    'readUInt32BE': 4,
    'readUInt32LE': 4,
    'readInt16BE': 2,
    'readInt16LE': 2,
    'readUInt16BE': 2,
    'readUInt16LE': 2,
    'readInt8': 1,
    'readUInt8': 1
  };

  for (var m in methods) {
    (function (m) {
      BufferList$2.prototype[m] = function (offset) {
        return this.slice(offset, offset + methods[m])[m](0);
      };
    })(m);
  }
})();

var bl = BufferList$2;

function Packet() {
  this.cmd = null;
  this.retain = false;
  this.qos = 0;
  this.dup = false;
  this.length = -1;
  this.topic = null;
  this.payload = null;
}

var packet = Packet;

var constants = createCommonjsModule(function (module) {

  var Buffer = safeBuffer.Buffer;
  /* Protocol - protocol constants */

  var protocol = module.exports;
  /* Command code => mnemonic */

  protocol.types = {
    0: 'reserved',
    1: 'connect',
    2: 'connack',
    3: 'publish',
    4: 'puback',
    5: 'pubrec',
    6: 'pubrel',
    7: 'pubcomp',
    8: 'subscribe',
    9: 'suback',
    10: 'unsubscribe',
    11: 'unsuback',
    12: 'pingreq',
    13: 'pingresp',
    14: 'disconnect',
    15: 'reserved'
    /* Mnemonic => Command code */

  };
  protocol.codes = {};

  for (var k in protocol.types) {
    var v = protocol.types[k];
    protocol.codes[v] = k;
  }
  /* Header */


  protocol.CMD_SHIFT = 4;
  protocol.CMD_MASK = 0xF0;
  protocol.DUP_MASK = 0x08;
  protocol.QOS_MASK = 0x03;
  protocol.QOS_SHIFT = 1;
  protocol.RETAIN_MASK = 0x01;
  /* Length */

  protocol.LENGTH_MASK = 0x7F;
  protocol.LENGTH_FIN_MASK = 0x80;
  /* Connack */

  protocol.SESSIONPRESENT_MASK = 0x01;
  protocol.SESSIONPRESENT_HEADER = Buffer.from([protocol.SESSIONPRESENT_MASK]);
  protocol.CONNACK_HEADER = Buffer.from([protocol.codes['connack'] << protocol.CMD_SHIFT]);
  /* Connect */

  protocol.USERNAME_MASK = 0x80;
  protocol.PASSWORD_MASK = 0x40;
  protocol.WILL_RETAIN_MASK = 0x20;
  protocol.WILL_QOS_MASK = 0x18;
  protocol.WILL_QOS_SHIFT = 3;
  protocol.WILL_FLAG_MASK = 0x04;
  protocol.CLEAN_SESSION_MASK = 0x02;
  protocol.CONNECT_HEADER = Buffer.from([protocol.codes['connect'] << protocol.CMD_SHIFT]);

  function genHeader(type) {
    return [0, 1, 2].map(function (qos) {
      return [0, 1].map(function (dup) {
        return [0, 1].map(function (retain) {
          var buf = new Buffer(1);
          buf.writeUInt8(protocol.codes[type] << protocol.CMD_SHIFT | (dup ? protocol.DUP_MASK : 0) | qos << protocol.QOS_SHIFT | retain, 0, true);
          return buf;
        });
      });
    });
  }
  /* Publish */


  protocol.PUBLISH_HEADER = genHeader('publish');
  /* Subscribe */

  protocol.SUBSCRIBE_HEADER = genHeader('subscribe');
  /* Unsubscribe */

  protocol.UNSUBSCRIBE_HEADER = genHeader('unsubscribe');
  /* Confirmations */

  protocol.ACKS = {
    unsuback: genHeader('unsuback'),
    puback: genHeader('puback'),
    pubcomp: genHeader('pubcomp'),
    pubrel: genHeader('pubrel'),
    pubrec: genHeader('pubrec')
  };
  protocol.SUBACK_HEADER = Buffer.from([protocol.codes['suback'] << protocol.CMD_SHIFT]);
  /* Protocol versions */

  protocol.VERSION3 = Buffer.from([3]);
  protocol.VERSION4 = Buffer.from([4]);
  /* QoS */

  protocol.QOS = [0, 1, 2].map(function (qos) {
    return Buffer.from([qos]);
  });
  /* Empty packets */

  protocol.EMPTY = {
    pingreq: Buffer.from([protocol.codes['pingreq'] << 4, 0]),
    pingresp: Buffer.from([protocol.codes['pingresp'] << 4, 0]),
    disconnect: Buffer.from([protocol.codes['disconnect'] << 4, 0])
  };
});

var EE$1 = EventEmitter.EventEmitter;

function Parser() {
  if (!(this instanceof Parser)) return new Parser();
  this._states = ['_parseHeader', '_parseLength', '_parsePayload', '_newPacket'];

  this._resetState();
}

inherits_browser(Parser, EE$1);

Parser.prototype._resetState = function () {
  this.packet = new packet();
  this.error = null;
  this._list = bl();
  this._stateCounter = 0;
};

Parser.prototype.parse = function (buf) {
  if (this.error) this._resetState();

  this._list.append(buf);

  while ((this.packet.length !== -1 || this._list.length > 0) && this[this._states[this._stateCounter]]() && !this.error) {
    this._stateCounter++;
    if (this._stateCounter >= this._states.length) this._stateCounter = 0;
  }

  return this._list.length;
};

Parser.prototype._parseHeader = function () {
  // There is at least one byte in the buffer
  var zero = this._list.readUInt8(0);

  this.packet.cmd = constants.types[zero >> constants.CMD_SHIFT];
  this.packet.retain = (zero & constants.RETAIN_MASK) !== 0;
  this.packet.qos = zero >> constants.QOS_SHIFT & constants.QOS_MASK;
  this.packet.dup = (zero & constants.DUP_MASK) !== 0;

  this._list.consume(1);

  return true;
};

Parser.prototype._parseLength = function () {
  // There is at least one byte in the list
  var bytes = 0;
  var mul = 1;
  var length = 0;
  var result = true;
  var current;

  while (bytes < 5) {
    current = this._list.readUInt8(bytes++);
    length += mul * (current & constants.LENGTH_MASK);
    mul *= 0x80;
    if ((current & constants.LENGTH_FIN_MASK) === 0) break;

    if (this._list.length <= bytes) {
      result = false;
      break;
    }
  }

  if (result) {
    this.packet.length = length;

    this._list.consume(bytes);
  }

  return result;
};

Parser.prototype._parsePayload = function () {
  var result = false; // Do we have a payload? Do we have enough data to complete the payload?
  // PINGs have no payload

  if (this.packet.length === 0 || this._list.length >= this.packet.length) {
    this._pos = 0;

    switch (this.packet.cmd) {
      case 'connect':
        this._parseConnect();

        break;

      case 'connack':
        this._parseConnack();

        break;

      case 'publish':
        this._parsePublish();

        break;

      case 'puback':
      case 'pubrec':
      case 'pubrel':
      case 'pubcomp':
        this._parseMessageId();

        break;

      case 'subscribe':
        this._parseSubscribe();

        break;

      case 'suback':
        this._parseSuback();

        break;

      case 'unsubscribe':
        this._parseUnsubscribe();

        break;

      case 'unsuback':
        this._parseUnsuback();

        break;

      case 'pingreq':
      case 'pingresp':
      case 'disconnect':
        // These are empty, nothing to do
        break;

      default:
        this._emitError(new Error('Not supported'));

    }

    result = true;
  }

  return result;
};

Parser.prototype._parseConnect = function () {
  var protocolId; // Protocol ID

  var clientId; // Client ID

  var topic; // Will topic

  var payload; // Will payload

  var password; // Password

  var username; // Username

  var flags = {};
  var packet$$1 = this.packet; // Parse protocolId

  protocolId = this._parseString();
  if (protocolId === null) return this._emitError(new Error('Cannot parse protocolId'));

  if (protocolId !== 'MQTT' && protocolId !== 'MQIsdp') {
    return this._emitError(new Error('Invalid protocolId'));
  }

  packet$$1.protocolId = protocolId; // Parse constants version number

  if (this._pos >= this._list.length) return this._emitError(new Error('Packet too short'));
  packet$$1.protocolVersion = this._list.readUInt8(this._pos);

  if (packet$$1.protocolVersion !== 3 && packet$$1.protocolVersion !== 4) {
    return this._emitError(new Error('Invalid protocol version'));
  }

  this._pos++;

  if (this._pos >= this._list.length) {
    return this._emitError(new Error('Packet too short'));
  } // Parse connect flags


  flags.username = this._list.readUInt8(this._pos) & constants.USERNAME_MASK;
  flags.password = this._list.readUInt8(this._pos) & constants.PASSWORD_MASK;
  flags.will = this._list.readUInt8(this._pos) & constants.WILL_FLAG_MASK;

  if (flags.will) {
    packet$$1.will = {};
    packet$$1.will.retain = (this._list.readUInt8(this._pos) & constants.WILL_RETAIN_MASK) !== 0;
    packet$$1.will.qos = (this._list.readUInt8(this._pos) & constants.WILL_QOS_MASK) >> constants.WILL_QOS_SHIFT;
  }

  packet$$1.clean = (this._list.readUInt8(this._pos) & constants.CLEAN_SESSION_MASK) !== 0;
  this._pos++; // Parse keepalive

  packet$$1.keepalive = this._parseNum();
  if (packet$$1.keepalive === -1) return this._emitError(new Error('Packet too short')); // Parse clientId

  clientId = this._parseString();
  if (clientId === null) return this._emitError(new Error('Packet too short'));
  packet$$1.clientId = clientId;

  if (flags.will) {
    // Parse will topic
    topic = this._parseString();
    if (topic === null) return this._emitError(new Error('Cannot parse will topic'));
    packet$$1.will.topic = topic; // Parse will payload

    payload = this._parseBuffer();
    if (payload === null) return this._emitError(new Error('Cannot parse will payload'));
    packet$$1.will.payload = payload;
  } // Parse username


  if (flags.username) {
    username = this._parseString();
    if (username === null) return this._emitError(new Error('Cannot parse username'));
    packet$$1.username = username;
  } // Parse password


  if (flags.password) {
    password = this._parseBuffer();
    if (password === null) return this._emitError(new Error('Cannot parse password'));
    packet$$1.password = password;
  }

  return packet$$1;
};

Parser.prototype._parseConnack = function () {
  var packet$$1 = this.packet;
  if (this._list.length < 2) return null;
  packet$$1.sessionPresent = !!(this._list.readUInt8(this._pos++) & constants.SESSIONPRESENT_MASK);
  packet$$1.returnCode = this._list.readUInt8(this._pos);
  if (packet$$1.returnCode === -1) return this._emitError(new Error('Cannot parse return code'));
};

Parser.prototype._parsePublish = function () {
  var packet$$1 = this.packet;
  packet$$1.topic = this._parseString();
  if (packet$$1.topic === null) return this._emitError(new Error('Cannot parse topic')); // Parse messageId

  if (packet$$1.qos > 0) if (!this._parseMessageId()) {
    return;
  }
  packet$$1.payload = this._list.slice(this._pos, packet$$1.length);
};

Parser.prototype._parseSubscribe = function () {
  var packet$$1 = this.packet;
  var topic;
  var qos;

  if (packet$$1.qos !== 1) {
    return this._emitError(new Error('Wrong subscribe header'));
  }

  packet$$1.subscriptions = [];

  if (!this._parseMessageId()) {
    return;
  }

  while (this._pos < packet$$1.length) {
    // Parse topic
    topic = this._parseString();
    if (topic === null) return this._emitError(new Error('Cannot parse topic'));
    qos = this._list.readUInt8(this._pos++); // Push pair to subscriptions

    packet$$1.subscriptions.push({
      topic: topic,
      qos: qos
    });
  }
};

Parser.prototype._parseSuback = function () {
  this.packet.granted = [];

  if (!this._parseMessageId()) {
    return;
  } // Parse granted QoSes


  while (this._pos < this.packet.length) {
    this.packet.granted.push(this._list.readUInt8(this._pos++));
  }
};

Parser.prototype._parseUnsubscribe = function () {
  var packet$$1 = this.packet;
  packet$$1.unsubscriptions = []; // Parse messageId

  if (!this._parseMessageId()) {
    return;
  }

  while (this._pos < packet$$1.length) {
    var topic; // Parse topic

    topic = this._parseString();
    if (topic === null) return this._emitError(new Error('Cannot parse topic')); // Push topic to unsubscriptions

    packet$$1.unsubscriptions.push(topic);
  }
};

Parser.prototype._parseUnsuback = function () {
  if (!this._parseMessageId()) return this._emitError(new Error('Cannot parse messageId'));
};

Parser.prototype._parseMessageId = function () {
  var packet$$1 = this.packet;
  packet$$1.messageId = this._parseNum();

  if (packet$$1.messageId === null) {
    this._emitError(new Error('Cannot parse messageId'));

    return false;
  }

  return true;
};

Parser.prototype._parseString = function (maybeBuffer) {
  var length = this._parseNum();

  var result;
  var end = length + this._pos;
  if (length === -1 || end > this._list.length || end > this.packet.length) return null;
  result = this._list.toString('utf8', this._pos, end);
  this._pos += length;
  return result;
};

Parser.prototype._parseBuffer = function () {
  var length = this._parseNum();

  var result;
  var end = length + this._pos;
  if (length === -1 || end > this._list.length || end > this.packet.length) return null;
  result = this._list.slice(this._pos, end);
  this._pos += length;
  return result;
};

Parser.prototype._parseNum = function () {
  if (this._list.length - this._pos < 2) return -1;

  var result = this._list.readUInt16BE(this._pos);

  this._pos += 2;
  return result;
};

Parser.prototype._newPacket = function () {
  if (this.packet) {
    this._list.consume(this.packet.length);

    this.emit('packet', this.packet);
  }

  this.packet = new packet();
  return true;
};

Parser.prototype._emitError = function (err) {
  this.error = err;
  this.emit('error', err);
};

var parser = Parser;

var Buffer$5 = safeBuffer.Buffer;
var max$2 = 65536;
var cache = {};

function generateBuffer(i) {
  var buffer = Buffer$5.allocUnsafe(2);
  buffer.writeUInt8(i >> 8, 0);
  buffer.writeUInt8(i & 0x00FF, 0 + 1);
  return buffer;
}

function generateCache() {
  for (var i = 0; i < max$2; i++) {
    cache[i] = generateBuffer(i);
  }
}

var numbers = {
  cache: cache,
  generateCache: generateCache,
  generateNumber: generateBuffer
};

var Buffer$6 = safeBuffer.Buffer;
var empty = Buffer$6.allocUnsafe(0);
var zeroBuf = Buffer$6.from([0]);
var nextTick$1 = processNextickArgs.nextTick;
var numCache = numbers.cache;
var generateNumber = numbers.generateNumber;
var generateCache$1 = numbers.generateCache;
var writeNumber = writeNumberCached;
var toGenerate = true;

function generate(packet, stream) {
  if (stream.cork) {
    stream.cork();
    nextTick$1(uncork, stream);
  }

  if (toGenerate) {
    toGenerate = false;
    generateCache$1();
  }

  switch (packet.cmd) {
    case 'connect':
      return connect(packet, stream);

    case 'connack':
      return connack(packet, stream);

    case 'publish':
      return publish(packet, stream);

    case 'puback':
    case 'pubrec':
    case 'pubrel':
    case 'pubcomp':
    case 'unsuback':
      return confirmation(packet, stream);

    case 'subscribe':
      return subscribe(packet, stream);

    case 'suback':
      return suback(packet, stream);

    case 'unsubscribe':
      return unsubscribe(packet, stream);

    case 'pingreq':
    case 'pingresp':
    case 'disconnect':
      return emptyPacket(packet, stream);

    default:
      stream.emit('error', new Error('Unknown command'));
      return false;
  }
}
/**
 * Controls numbers cache.
 * Set to "false" to allocate buffers on-the-flight instead of pre-generated cache
 */


Object.defineProperty(generate, 'cacheNumbers', {
  get: function () {
    return writeNumber === writeNumberCached;
  },
  set: function (value) {
    if (value) {
      if (!numCache || Object.keys(numCache).length === 0) toGenerate = true;
      writeNumber = writeNumberCached;
    } else {
      toGenerate = false;
      writeNumber = writeNumberGenerated;
    }
  }
});

function uncork(stream) {
  stream.uncork();
}

function connect(opts, stream) {
  var settings = opts || {};
  var protocolId = settings.protocolId || 'MQTT';
  var protocolVersion = settings.protocolVersion || 4;
  var will = settings.will;
  var clean = settings.clean;
  var keepalive = settings.keepalive || 0;
  var clientId = settings.clientId || '';
  var username = settings.username;
  var password = settings.password;
  if (clean === undefined) clean = true;
  var length = 0; // Must be a string and non-falsy

  if (!protocolId || typeof protocolId !== 'string' && !Buffer$6.isBuffer(protocolId)) {
    stream.emit('error', new Error('Invalid protocolId'));
    return false;
  } else length += protocolId.length + 2; // Must be 3 or 4


  if (protocolVersion !== 3 && protocolVersion !== 4) {
    stream.emit('error', new Error('Invalid protocol version'));
    return false;
  } else length += 1; // ClientId might be omitted in 3.1.1, but only if cleanSession is set to 1


  if ((typeof clientId === 'string' || Buffer$6.isBuffer(clientId)) && (clientId || protocolVersion === 4) && (clientId || clean)) {
    length += clientId.length + 2;
  } else {
    if (protocolVersion < 4) {
      stream.emit('error', new Error('clientId must be supplied before 3.1.1'));
      return false;
    }

    if (clean * 1 === 0) {
      stream.emit('error', new Error('clientId must be given if cleanSession set to 0'));
      return false;
    }
  } // Must be a two byte number


  if (typeof keepalive !== 'number' || keepalive < 0 || keepalive > 65535 || keepalive % 1 !== 0) {
    stream.emit('error', new Error('Invalid keepalive'));
    return false;
  } else length += 2; // Connect flags


  length += 1; // If will exists...

  if (will) {
    // It must be an object
    if (typeof will !== 'object') {
      stream.emit('error', new Error('Invalid will'));
      return false;
    } // It must have topic typeof string


    if (!will.topic || typeof will.topic !== 'string') {
      stream.emit('error', new Error('Invalid will topic'));
      return false;
    } else {
      length += Buffer$6.byteLength(will.topic) + 2;
    } // Payload


    if (will.payload && will.payload) {
      if (will.payload.length >= 0) {
        if (typeof will.payload === 'string') {
          length += Buffer$6.byteLength(will.payload) + 2;
        } else {
          length += will.payload.length + 2;
        }
      } else {
        stream.emit('error', new Error('Invalid will payload'));
        return false;
      }
    } else {
      length += 2;
    }
  } // Username


  var providedUsername = false;

  if (username != null) {
    if (isStringOrBuffer(username)) {
      providedUsername = true;
      length += Buffer$6.byteLength(username) + 2;
    } else {
      stream.emit('error', new Error('Invalid username'));
      return false;
    }
  } // Password


  if (password != null) {
    if (!providedUsername) {
      stream.emit('error', new Error('Username is required to use password'));
      return false;
    }

    if (isStringOrBuffer(password)) {
      length += byteLength$1(password) + 2;
    } else {
      stream.emit('error', new Error('Invalid password'));
      return false;
    }
  } // Generate header


  stream.write(constants.CONNECT_HEADER); // Generate length

  writeLength(stream, length); // Generate protocol ID

  writeStringOrBuffer(stream, protocolId);
  stream.write(protocolVersion === 4 ? constants.VERSION4 : constants.VERSION3); // Connect flags

  var flags = 0;
  flags |= username != null ? constants.USERNAME_MASK : 0;
  flags |= password != null ? constants.PASSWORD_MASK : 0;
  flags |= will && will.retain ? constants.WILL_RETAIN_MASK : 0;
  flags |= will && will.qos ? will.qos << constants.WILL_QOS_SHIFT : 0;
  flags |= will ? constants.WILL_FLAG_MASK : 0;
  flags |= clean ? constants.CLEAN_SESSION_MASK : 0;
  stream.write(Buffer$6.from([flags])); // Keepalive

  writeNumber(stream, keepalive); // Client ID

  writeStringOrBuffer(stream, clientId); // Will

  if (will) {
    writeString(stream, will.topic);
    writeStringOrBuffer(stream, will.payload);
  } // Username and password


  if (username != null) {
    writeStringOrBuffer(stream, username);
  }

  if (password != null) {
    writeStringOrBuffer(stream, password);
  } // This is a small packet that happens only once on a stream
  // We assume the stream is always free to receive more data after this


  return true;
}

function connack(opts, stream) {
  var settings = opts || {};
  var rc = settings.returnCode; // Check return code

  if (typeof rc !== 'number') {
    stream.emit('error', new Error('Invalid return code'));
    return false;
  }

  stream.write(constants.CONNACK_HEADER);
  writeLength(stream, 2);
  stream.write(opts.sessionPresent ? constants.SESSIONPRESENT_HEADER : zeroBuf);
  return stream.write(Buffer$6.from([rc]));
}

function publish(opts, stream) {
  var settings = opts || {};
  var qos = settings.qos || 0;
  var retain = settings.retain ? constants.RETAIN_MASK : 0;
  var topic = settings.topic;
  var payload = settings.payload || empty;
  var id = settings.messageId;
  var length = 0; // Topic must be a non-empty string or Buffer

  if (typeof topic === 'string') length += Buffer$6.byteLength(topic) + 2;else if (Buffer$6.isBuffer(topic)) length += topic.length + 2;else {
    stream.emit('error', new Error('Invalid topic'));
    return false;
  } // Get the payload length

  if (!Buffer$6.isBuffer(payload)) length += Buffer$6.byteLength(payload);else length += payload.length; // Message ID must a number if qos > 0

  if (qos && typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'));
    return false;
  } else if (qos) length += 2; // Header


  stream.write(constants.PUBLISH_HEADER[qos][opts.dup ? 1 : 0][retain ? 1 : 0]); // Remaining length

  writeLength(stream, length); // Topic

  writeNumber(stream, byteLength$1(topic));
  stream.write(topic); // Message ID

  if (qos > 0) writeNumber(stream, id); // Payload

  return stream.write(payload);
}
/* Puback, pubrec, pubrel and pubcomp */


function confirmation(opts, stream) {
  var settings = opts || {};
  var type = settings.cmd || 'puback';
  var id = settings.messageId;
  var dup = settings.dup && type === 'pubrel' ? constants.DUP_MASK : 0;
  var qos = 0;
  if (type === 'pubrel') qos = 1; // Check message ID

  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'));
    return false;
  } // Header


  stream.write(constants.ACKS[type][qos][dup][0]); // Length

  writeLength(stream, 2); // Message ID

  return writeNumber(stream, id);
}

function subscribe(opts, stream) {
  var settings = opts || {};
  var dup = settings.dup ? constants.DUP_MASK : 0;
  var id = settings.messageId;
  var subs = settings.subscriptions;
  var length = 0; // Check message ID

  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'));
    return false;
  } else length += 2; // Check subscriptions


  if (typeof subs === 'object' && subs.length) {
    for (var i = 0; i < subs.length; i += 1) {
      var itopic = subs[i].topic;
      var iqos = subs[i].qos;

      if (typeof itopic !== 'string') {
        stream.emit('error', new Error('Invalid subscriptions - invalid topic'));
        return false;
      }

      if (typeof iqos !== 'number') {
        stream.emit('error', new Error('Invalid subscriptions - invalid qos'));
        return false;
      }

      length += Buffer$6.byteLength(itopic) + 2 + 1;
    }
  } else {
    stream.emit('error', new Error('Invalid subscriptions'));
    return false;
  } // Generate header


  stream.write(constants.SUBSCRIBE_HEADER[1][dup ? 1 : 0][0]); // Generate length

  writeLength(stream, length); // Generate message ID

  writeNumber(stream, id);
  var result = true; // Generate subs

  for (var j = 0; j < subs.length; j++) {
    var sub = subs[j];
    var jtopic = sub.topic;
    var jqos = sub.qos; // Write topic string

    writeString(stream, jtopic); // Write qos

    result = stream.write(constants.QOS[jqos]);
  }

  return result;
}

function suback(opts, stream) {
  var settings = opts || {};
  var id = settings.messageId;
  var granted = settings.granted;
  var length = 0; // Check message ID

  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'));
    return false;
  } else length += 2; // Check granted qos vector


  if (typeof granted === 'object' && granted.length) {
    for (var i = 0; i < granted.length; i += 1) {
      if (typeof granted[i] !== 'number') {
        stream.emit('error', new Error('Invalid qos vector'));
        return false;
      }

      length += 1;
    }
  } else {
    stream.emit('error', new Error('Invalid qos vector'));
    return false;
  } // header


  stream.write(constants.SUBACK_HEADER); // Length

  writeLength(stream, length); // Message ID

  writeNumber(stream, id);
  return stream.write(Buffer$6.from(granted));
}

function unsubscribe(opts, stream) {
  var settings = opts || {};
  var id = settings.messageId;
  var dup = settings.dup ? constants.DUP_MASK : 0;
  var unsubs = settings.unsubscriptions;
  var length = 0; // Check message ID

  if (typeof id !== 'number') {
    stream.emit('error', new Error('Invalid messageId'));
    return false;
  } else {
    length += 2;
  } // Check unsubs


  if (typeof unsubs === 'object' && unsubs.length) {
    for (var i = 0; i < unsubs.length; i += 1) {
      if (typeof unsubs[i] !== 'string') {
        stream.emit('error', new Error('Invalid unsubscriptions'));
        return false;
      }

      length += Buffer$6.byteLength(unsubs[i]) + 2;
    }
  } else {
    stream.emit('error', new Error('Invalid unsubscriptions'));
    return false;
  } // Header


  stream.write(constants.UNSUBSCRIBE_HEADER[1][dup ? 1 : 0][0]); // Length

  writeLength(stream, length); // Message ID

  writeNumber(stream, id); // Unsubs

  var result = true;

  for (var j = 0; j < unsubs.length; j++) {
    result = writeString(stream, unsubs[j]);
  }

  return result;
}

function emptyPacket(opts, stream) {
  return stream.write(constants.EMPTY[opts.cmd]);
}
/**
 * calcLengthLength - calculate the length of the remaining
 * length field
 *
 * @api private
 */


function calcLengthLength(length) {
  if (length >= 0 && length < 128) return 1;else if (length >= 128 && length < 16384) return 2;else if (length >= 16384 && length < 2097152) return 3;else if (length >= 2097152 && length < 268435456) return 4;else return 0;
}

function genBufLength(length) {
  var digit = 0;
  var pos = 0;
  var buffer = Buffer$6.allocUnsafe(calcLengthLength(length));

  do {
    digit = length % 128 | 0;
    length = length / 128 | 0;
    if (length > 0) digit = digit | 0x80;
    buffer.writeUInt8(digit, pos++);
  } while (length > 0);

  return buffer;
}
/**
 * writeLength - write an MQTT style length field to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <Number> length - length (>0)
 * @returns <Number> number of bytes written
 *
 * @api private
 */


var lengthCache = {};

function writeLength(stream, length) {
  var buffer = lengthCache[length];

  if (!buffer) {
    buffer = genBufLength(length);
    if (length < 16384) lengthCache[length] = buffer;
  }

  stream.write(buffer);
}
/**
 * writeString - write a utf8 string to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> string - string to write
 * @return <Number> number of bytes written
 *
 * @api private
 */


function writeString(stream, string) {
  var strlen = Buffer$6.byteLength(string);
  writeNumber(stream, strlen);
  stream.write(string, 'utf8');
}
/**
 * writeNumber - write a two byte number to the buffer
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> number - number to write
 * @return <Number> number of bytes written
 *
 * @api private
 */


function writeNumberCached(stream, number) {
  return stream.write(numCache[number]);
}

function writeNumberGenerated(stream, number) {
  return stream.write(generateNumber(number));
}
/**
 * writeStringOrBuffer - write a String or Buffer with the its length prefix
 *
 * @param <Buffer> buffer - destination
 * @param <Number> pos - offset
 * @param <String> toWrite - String or Buffer
 * @return <Number> number of bytes written
 */


function writeStringOrBuffer(stream, toWrite) {
  if (typeof toWrite === 'string') {
    writeString(stream, toWrite);
  } else if (toWrite) {
    writeNumber(stream, toWrite.length);
    stream.write(toWrite);
  } else writeNumber(stream, 0);
}

function byteLength$1(bufOrString) {
  if (!bufOrString) return 0;else if (bufOrString instanceof Buffer$6) return bufOrString.length;else return Buffer$6.byteLength(bufOrString);
}

function isStringOrBuffer(field) {
  return typeof field === 'string' || field instanceof Buffer$6;
}

var writeToStream = generate;

var Buffer$7 = safeBuffer.Buffer;
var EE$2 = EventEmitter.EventEmitter;

function generate$1(packet) {
  var stream = new Accumulator();
  writeToStream(packet, stream);
  return stream.concat();
}

function Accumulator() {
  this._array = new Array(20);
  this._i = 0;
}

inherits_browser(Accumulator, EE$2);

Accumulator.prototype.write = function (chunk) {
  this._array[this._i++] = chunk;
  return true;
};

Accumulator.prototype.concat = function () {
  var length = 0;
  var lengths = new Array(this._array.length);
  var list = this._array;
  var pos = 0;
  var i;
  var result;

  for (i = 0; i < list.length && list[i] !== undefined; i++) {
    if (typeof list[i] !== 'string') lengths[i] = list[i].length;else lengths[i] = Buffer$7.byteLength(list[i]);
    length += lengths[i];
  }

  result = Buffer$7.allocUnsafe(length);

  for (i = 0; i < list.length && list[i] !== undefined; i++) {
    if (typeof list[i] !== 'string') {
      list[i].copy(result, pos);
      pos += lengths[i];
    } else {
      result.write(list[i], pos);
      pos += lengths[i];
    }
  }

  return result;
};

var generate_1 = generate$1;

var parser$1 = parser;
var generate$2 = generate_1;
var writeToStream$1 = writeToStream;
var mqtt = {
  parser: parser$1,
  generate: generate$2,
  writeToStream: writeToStream$1
};

function ReInterval(callback, interval, args) {
  var self = this;
  this._callback = callback;
  this._args = args;
  this._interval = setInterval(callback, interval, this._args);

  this.reschedule = function (interval) {
    // if no interval entered, use the interval passed in on creation
    if (!interval) interval = self._interval;
    if (self._interval) clearInterval(self._interval);
    self._interval = setInterval(self._callback, interval, self._args);
  };

  this.clear = function () {
    if (self._interval) {
      clearInterval(self._interval);
      self._interval = undefined;
    }
  };

  this.destroy = function () {
    if (self._interval) {
      clearInterval(self._interval);
    }

    self._callback = undefined;
    self._interval = undefined;
    self._args = undefined;
  };
}

function reInterval() {
  if (typeof arguments[0] !== 'function') throw new Error('callback needed');
  if (typeof arguments[1] !== 'number') throw new Error('interval needed');
  var args;

  if (arguments.length > 0) {
    args = new Array(arguments.length - 2);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 2];
    }
  }

  return new ReInterval(arguments[0], arguments[1], args);
}

var reinterval = reInterval;

/**
 * Validate a topic to see if it's valid or not.
 * A topic is valid if it follow below rules:
 * - Rule #1: If any part of the topic is not `+` or `#`, then it must not contain `+` and '#'
 * - Rule #2: Part `#` must be located at the end of the mailbox
 *
 * @param {String} topic - A topic
 * @returns {Boolean} If the topic is valid, returns true. Otherwise, returns false.
 */

function validateTopic(topic) {
  var parts = topic.split('/');

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === '+') {
      continue;
    }

    if (parts[i] === '#') {
      // for Rule #2
      return i === parts.length - 1;
    }

    if (parts[i].indexOf('+') !== -1 || parts[i].indexOf('#') !== -1) {
      return false;
    }
  }

  return true;
}
/**
 * Validate an array of topics to see if any of them is valid or not
  * @param {Array} topics - Array of topics
 * @returns {String} If the topics is valid, returns null. Otherwise, returns the invalid one
 */


function validateTopics(topics) {
  if (topics.length === 0) {
    return 'empty_topic_list';
  }

  for (var i = 0; i < topics.length; i++) {
    if (!validateTopic(topics[i])) {
      return topics[i];
    }
  }

  return null;
}

var validations = {
  validateTopics: validateTopics
};

/**
 * Module dependencies
 */


var Writable$2 = readableBrowser.Writable;

var setImmediate$1 = commonjsGlobal.setImmediate || function (callback) {
  // works in node v0.8
  nextTick(callback);
};

var defaultConnectOptions = {
  keepalive: 60,
  reschedulePings: true,
  protocolId: 'MQTT',
  protocolVersion: 4,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  clean: true,
  resubscribe: true
};

function defaultId() {
  return 'mqttjs_' + Math.random().toString(16).substr(2, 8);
}

function sendPacket(client, packet, cb) {
  client.emit('packetsend', packet);
  var result = mqtt.writeToStream(packet, client.stream);

  if (!result && cb) {
    client.stream.once('drain', cb);
  } else if (cb) {
    cb();
  }
}

function flush(queue) {
  if (queue) {
    Object.keys(queue).forEach(function (messageId) {
      if (typeof queue[messageId] === 'function') {
        queue[messageId](new Error('Connection closed'));
        delete queue[messageId];
      }
    });
  }
}

function storeAndSend(client, packet, cb) {
  client.outgoingStore.put(packet, function storedPacket(err) {
    if (err) {
      return cb && cb(err);
    }

    sendPacket(client, packet, cb);
  });
}

function nop$2() {}
/**
 * MqttClient constructor
 *
 * @param {Stream} stream - stream
 * @param {Object} [options] - connection options
 * (see Connection#connect)
 */


function MqttClient(streamBuilder, options) {
  var k;
  var that = this;

  if (!(this instanceof MqttClient)) {
    return new MqttClient(streamBuilder, options);
  }

  this.options = options || {}; // Defaults

  for (k in defaultConnectOptions) {
    if (typeof this.options[k] === 'undefined') {
      this.options[k] = defaultConnectOptions[k];
    } else {
      this.options[k] = options[k];
    }
  }

  this.options.clientId = typeof this.options.clientId === 'string' ? this.options.clientId : defaultId();
  this.streamBuilder = streamBuilder; // Inflight message storages

  this.outgoingStore = this.options.outgoingStore || new store();
  this.incomingStore = this.options.incomingStore || new store(); // Should QoS zero messages be queued when the connection is broken?

  this.queueQoSZero = this.options.queueQoSZero === undefined ? true : this.options.queueQoSZero; // map of subscribed topics to support reconnection

  this._resubscribeTopics = {}; // map of a subscribe messageId and a topic

  this.messageIdToTopic = {}; // Ping timer, setup in _setupPingTimer

  this.pingTimer = null; // Is the client connected?

  this.connected = false; // Are we disconnecting?

  this.disconnecting = false; // Packet queue

  this.queue = []; // connack timer

  this.connackTimer = null; // Reconnect timer

  this.reconnectTimer = null;
  /**
   * MessageIDs starting with 1
   * ensure that nextId is min. 1, see https://github.com/mqttjs/MQTT.js/issues/810
   */

  this.nextId = Math.max(1, Math.floor(Math.random() * 65535)); // Inflight callbacks

  this.outgoing = {}; // Mark connected on connect

  this.on('connect', function () {
    if (this.disconnected) {
      return;
    }

    this.connected = true;
    var outStore = this.outgoingStore.createStream();
    this.once('close', remove);
    outStore.on('end', function () {
      that.removeListener('close', remove);
    });
    outStore.on('error', function (err) {
      that.removeListener('close', remove);
      that.emit('error', err);
    });

    function remove() {
      outStore.destroy();
      outStore = null;
    }

    function storeDeliver() {
      // edge case, we wrapped this twice
      if (!outStore) {
        return;
      }

      var packet = outStore.read(1);
      var cb;

      if (!packet) {
        // read when data is available in the future
        outStore.once('readable', storeDeliver);
        return;
      } // Avoid unnecessary stream read operations when disconnected


      if (!that.disconnecting && !that.reconnectTimer) {
        cb = that.outgoing[packet.messageId];

        that.outgoing[packet.messageId] = function (err, status) {
          // Ensure that the original callback passed in to publish gets invoked
          if (cb) {
            cb(err, status);
          }

          storeDeliver();
        };

        that._sendPacket(packet);
      } else if (outStore.destroy) {
        outStore.destroy();
      }
    } // start flowing


    storeDeliver();
  }); // Mark disconnected on stream close

  this.on('close', function () {
    this.connected = false;
    clearTimeout(this.connackTimer);
  }); // Setup ping timer

  this.on('connect', this._setupPingTimer); // Send queued packets

  this.on('connect', function () {
    var queue = this.queue;

    function deliver() {
      var entry = queue.shift();
      var packet = null;

      if (!entry) {
        return;
      }

      packet = entry.packet;

      that._sendPacket(packet, function (err) {
        if (entry.cb) {
          entry.cb(err);
        }

        deliver();
      });
    }

    deliver();
  });
  var firstConnection = true; // resubscribe

  this.on('connect', function () {
    if (!firstConnection && this.options.clean && Object.keys(this._resubscribeTopics).length > 0) {
      if (this.options.resubscribe) {
        this._resubscribeTopics.resubscribe = true;
        this.subscribe(this._resubscribeTopics);
      } else {
        this._resubscribeTopics = {};
      }
    }

    firstConnection = false;
  }); // Clear ping timer

  this.on('close', function () {
    if (that.pingTimer !== null) {
      that.pingTimer.clear();
      that.pingTimer = null;
    }
  }); // Setup reconnect timer on disconnect

  this.on('close', this._setupReconnect);
  EventEmitter.EventEmitter.call(this);

  this._setupStream();
}

inherits_browser(MqttClient, EventEmitter.EventEmitter);
/**
 * setup the event handlers in the inner stream.
 *
 * @api private
 */

MqttClient.prototype._setupStream = function () {
  var connectPacket;
  var that = this;
  var writable = new Writable$2();
  var parser = mqtt.parser(this.options);
  var completeParse = null;
  var packets = [];

  this._clearReconnect();

  this.stream = this.streamBuilder(this);
  parser.on('packet', function (packet) {
    packets.push(packet);
  });

  function nextTickWork() {
    nextTick(work);
  }

  function work() {
    var packet = packets.shift();
    var done = completeParse;

    if (packet) {
      that._handlePacket(packet, nextTickWork);
    } else {
      completeParse = null;
      done();
    }
  }

  writable._write = function (buf, enc, done) {
    completeParse = done;
    parser.parse(buf);
    work();
  };

  this.stream.pipe(writable); // Suppress connection errors

  this.stream.on('error', nop$2); // Echo stream close

  endOfStream(this.stream, this.emit.bind(this, 'close')); // Send a connect packet

  connectPacket = Object.create(this.options);
  connectPacket.cmd = 'connect'; // avoid message queue

  sendPacket(this, connectPacket); // Echo connection errors

  parser.on('error', this.emit.bind(this, 'error')); // many drain listeners are needed for qos 1 callbacks if the connection is intermittent

  this.stream.setMaxListeners(1000);
  clearTimeout(this.connackTimer);
  this.connackTimer = setTimeout(function () {
    that._cleanUp(true);
  }, this.options.connectTimeout);
};

MqttClient.prototype._handlePacket = function (packet, done) {
  this.emit('packetreceive', packet);

  switch (packet.cmd) {
    case 'publish':
      this._handlePublish(packet, done);

      break;

    case 'puback':
    case 'pubrec':
    case 'pubcomp':
    case 'suback':
    case 'unsuback':
      this._handleAck(packet);

      done();
      break;

    case 'pubrel':
      this._handlePubrel(packet, done);

      break;

    case 'connack':
      this._handleConnack(packet);

      done();
      break;

    case 'pingresp':
      this._handlePingresp(packet);

      done();
      break;

    default:
      // do nothing
      // maybe we should do an error handling
      // or just log it
      break;
  }
};

MqttClient.prototype._checkDisconnecting = function (callback) {
  if (this.disconnecting) {
    if (callback) {
      callback(new Error('client disconnecting'));
    } else {
      this.emit('error', new Error('client disconnecting'));
    }
  }

  return this.disconnecting;
};
/**
 * publish - publish <message> to <topic>
 *
 * @param {String} topic - topic to publish to
 * @param {String, Buffer} message - message to publish
 * @param {Object} [opts] - publish options, includes:
 *    {Number} qos - qos level to publish on
 *    {Boolean} retain - whether or not to retain the message
 *    {Boolean} dup - whether or not mark a message as duplicate
 * @param {Function} [callback] - function(err){}
 *    called when publish succeeds or fails
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example client.publish('topic', 'message');
 * @example
 *     client.publish('topic', 'message', {qos: 1, retain: true, dup: true});
 * @example client.publish('topic', 'message', console.log);
 */


MqttClient.prototype.publish = function (topic, message, opts, callback) {
  var packet; // .publish(topic, payload, cb);

  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  } // default opts


  var defaultOpts = {
    qos: 0,
    retain: false,
    dup: false
  };
  opts = immutable(defaultOpts, opts);

  if (this._checkDisconnecting(callback)) {
    return this;
  }

  packet = {
    cmd: 'publish',
    topic: topic,
    payload: message,
    qos: opts.qos,
    retain: opts.retain,
    messageId: this._nextId(),
    dup: opts.dup
  };

  switch (opts.qos) {
    case 1:
    case 2:
      // Add to callbacks
      this.outgoing[packet.messageId] = callback || nop$2;

      this._sendPacket(packet);

      break;

    default:
      this._sendPacket(packet, callback);

      break;
  }

  return this;
};
/**
 * subscribe - subscribe to <topic>
 *
 * @param {String, Array, Object} topic - topic(s) to subscribe to, supports objects in the form {'topic': qos}
 * @param {Object} [opts] - optional subscription options, includes:
 *    {Number} qos - subscribe qos level
 * @param {Function} [callback] - function(err, granted){} where:
 *    {Error} err - subscription error (none at the moment!)
 *    {Array} granted - array of {topic: 't', qos: 0}
 * @returns {MqttClient} this - for chaining
 * @api public
 * @example client.subscribe('topic');
 * @example client.subscribe('topic', {qos: 1});
 * @example client.subscribe({'topic': 0, 'topic2': 1}, console.log);
 * @example client.subscribe('topic', console.log);
 */


MqttClient.prototype.subscribe = function () {
  var packet;
  var args = Array.prototype.slice.call(arguments);
  var subs = [];
  var obj = args.shift();
  var resubscribe = obj.resubscribe;
  var callback = args.pop() || nop$2;
  var opts = args.pop();
  var invalidTopic;
  var that = this;
  delete obj.resubscribe;

  if (typeof obj === 'string') {
    obj = [obj];
  }

  if (typeof callback !== 'function') {
    opts = callback;
    callback = nop$2;
  }

  invalidTopic = validations.validateTopics(obj);

  if (invalidTopic !== null) {
    setImmediate$1(callback, new Error('Invalid topic ' + invalidTopic));
    return this;
  }

  if (this._checkDisconnecting(callback)) {
    return this;
  }

  var defaultOpts = {
    qos: 0
  };
  opts = immutable(defaultOpts, opts);

  if (Array.isArray(obj)) {
    obj.forEach(function (topic) {
      if (that._resubscribeTopics[topic] < opts.qos || !that._resubscribeTopics.hasOwnProperty(topic) || resubscribe) {
        subs.push({
          topic: topic,
          qos: opts.qos
        });
      }
    });
  } else {
    Object.keys(obj).forEach(function (k) {
      if (that._resubscribeTopics[k] < obj[k] || !that._resubscribeTopics.hasOwnProperty(k) || resubscribe) {
        subs.push({
          topic: k,
          qos: obj[k]
        });
      }
    });
  }

  packet = {
    cmd: 'subscribe',
    subscriptions: subs,
    qos: 1,
    retain: false,
    dup: false,
    messageId: this._nextId()
  };

  if (!subs.length) {
    callback(null, []);
    return;
  } // subscriptions to resubscribe to in case of disconnect


  if (this.options.resubscribe) {
    var topics = [];
    subs.forEach(function (sub) {
      if (that.options.reconnectPeriod > 0) {
        that._resubscribeTopics[sub.topic] = sub.qos;
        topics.push(sub.topic);
      }
    });
    that.messageIdToTopic[packet.messageId] = topics;
  }

  this.outgoing[packet.messageId] = function (err, packet) {
    if (!err) {
      var granted = packet.granted;

      for (var i = 0; i < granted.length; i += 1) {
        subs[i].qos = granted[i];
      }
    }

    callback(err, subs);
  };

  this._sendPacket(packet);

  return this;
};
/**
 * unsubscribe - unsubscribe from topic(s)
 *
 * @param {String, Array} topic - topics to unsubscribe from
 * @param {Function} [callback] - callback fired on unsuback
 * @returns {MqttClient} this - for chaining
 * @api public
 * @example client.unsubscribe('topic');
 * @example client.unsubscribe('topic', console.log);
 */


MqttClient.prototype.unsubscribe = function (topic, callback) {
  var packet = {
    cmd: 'unsubscribe',
    qos: 1,
    messageId: this._nextId()
  };
  var that = this;
  callback = callback || nop$2;

  if (this._checkDisconnecting(callback)) {
    return this;
  }

  if (typeof topic === 'string') {
    packet.unsubscriptions = [topic];
  } else if (typeof topic === 'object' && topic.length) {
    packet.unsubscriptions = topic;
  }

  if (this.options.resubscribe) {
    packet.unsubscriptions.forEach(function (topic) {
      delete that._resubscribeTopics[topic];
    });
  }

  this.outgoing[packet.messageId] = callback;

  this._sendPacket(packet);

  return this;
};
/**
 * end - close connection
 *
 * @returns {MqttClient} this - for chaining
 * @param {Boolean} force - do not wait for all in-flight messages to be acked
 * @param {Function} cb - called when the client has been closed
 *
 * @api public
 */


MqttClient.prototype.end = function (force, cb) {
  var that = this;

  if (typeof force === 'function') {
    cb = force;
    force = false;
  }

  function closeStores() {
    that.disconnected = true;
    that.incomingStore.close(function () {
      that.outgoingStore.close(function () {
        if (cb) {
          cb.apply(null, arguments);
        }

        that.emit('end');
      });
    });

    if (that._deferredReconnect) {
      that._deferredReconnect();
    }
  }

  function finish() {
    // defer closesStores of an I/O cycle,
    // just to make sure things are
    // ok for websockets
    that._cleanUp(force, setImmediate$1.bind(null, closeStores));
  }

  if (this.disconnecting) {
    return this;
  }

  this._clearReconnect();

  this.disconnecting = true;

  if (!force && Object.keys(this.outgoing).length > 0) {
    // wait 10ms, just to be sure we received all of it
    this.once('outgoingEmpty', setTimeout.bind(null, finish, 10));
  } else {
    finish();
  }

  return this;
};
/**
 * removeOutgoingMessage - remove a message in outgoing store
 * the outgoing callback will be called withe Error('Message removed') if the message is removed
 *
 * @param {Number} mid - messageId to remove message
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example client.removeOutgoingMessage(client.getLastMessageId());
 */


MqttClient.prototype.removeOutgoingMessage = function (mid) {
  var cb = this.outgoing[mid];
  delete this.outgoing[mid];
  this.outgoingStore.del({
    messageId: mid
  }, function () {
    cb(new Error('Message removed'));
  });
  return this;
};
/**
 * reconnect - connect again using the same options as connect()
 *
 * @param {Object} [opts] - optional reconnect options, includes:
 *    {Store} incomingStore - a store for the incoming packets
 *    {Store} outgoingStore - a store for the outgoing packets
 *    if opts is not given, current stores are used
 * @returns {MqttClient} this - for chaining
 *
 * @api public
 */


MqttClient.prototype.reconnect = function (opts) {
  var that = this;

  var f = function () {
    if (opts) {
      that.options.incomingStore = opts.incomingStore;
      that.options.outgoingStore = opts.outgoingStore;
    } else {
      that.options.incomingStore = null;
      that.options.outgoingStore = null;
    }

    that.incomingStore = that.options.incomingStore || new store();
    that.outgoingStore = that.options.outgoingStore || new store();
    that.disconnecting = false;
    that.disconnected = false;
    that._deferredReconnect = null;

    that._reconnect();
  };

  if (this.disconnecting && !this.disconnected) {
    this._deferredReconnect = f;
  } else {
    f();
  }

  return this;
};
/**
 * _reconnect - implement reconnection
 * @api privateish
 */


MqttClient.prototype._reconnect = function () {
  this.emit('reconnect');

  this._setupStream();
};
/**
 * _setupReconnect - setup reconnect timer
 */


MqttClient.prototype._setupReconnect = function () {
  var that = this;

  if (!that.disconnecting && !that.reconnectTimer && that.options.reconnectPeriod > 0) {
    if (!this.reconnecting) {
      this.emit('offline');
      this.reconnecting = true;
    }

    that.reconnectTimer = setInterval(function () {
      that._reconnect();
    }, that.options.reconnectPeriod);
  }
};
/**
 * _clearReconnect - clear the reconnect timer
 */


MqttClient.prototype._clearReconnect = function () {
  if (this.reconnectTimer) {
    clearInterval(this.reconnectTimer);
    this.reconnectTimer = null;
  }
};
/**
 * _cleanUp - clean up on connection end
 * @api private
 */


MqttClient.prototype._cleanUp = function (forced, done) {
  if (done) {
    this.stream.on('close', done);
  }

  if (forced) {
    if (this.options.reconnectPeriod === 0 && this.options.clean) {
      flush(this.outgoing);
    }

    this.stream.destroy();
  } else {
    this._sendPacket({
      cmd: 'disconnect'
    }, setImmediate$1.bind(null, this.stream.end.bind(this.stream)));
  }

  if (!this.disconnecting) {
    this._clearReconnect();

    this._setupReconnect();
  }

  if (this.pingTimer !== null) {
    this.pingTimer.clear();
    this.pingTimer = null;
  }

  if (done && !this.connected) {
    this.stream.removeListener('close', done);
    done();
  }
};
/**
 * _sendPacket - send or queue a packet
 * @param {String} type - packet type (see `protocol`)
 * @param {Object} packet - packet options
 * @param {Function} cb - callback when the packet is sent
 * @api private
 */


MqttClient.prototype._sendPacket = function (packet, cb) {
  if (!this.connected) {
    if ((packet.qos || 0) === 0 && this.queueQoSZero || packet.cmd !== 'publish') {
      this.queue.push({
        packet: packet,
        cb: cb
      });
    } else if (packet.qos > 0) {
      cb = this.outgoing[packet.messageId];
      this.outgoingStore.put(packet, function (err) {
        if (err) {
          return cb && cb(err);
        }
      });
    } else if (cb) {
      cb(new Error('No connection to broker'));
    }

    return;
  } // When sending a packet, reschedule the ping timer


  this._shiftPingInterval();

  switch (packet.cmd) {
    case 'publish':
      break;

    case 'pubrel':
      storeAndSend(this, packet, cb);
      return;

    default:
      sendPacket(this, packet, cb);
      return;
  }

  switch (packet.qos) {
    case 2:
    case 1:
      storeAndSend(this, packet, cb);
      break;

    /**
     * no need of case here since it will be caught by default
     * and jshint comply that before default it must be a break
     * anyway it will result in -1 evaluation
     */

    case 0:
    /* falls through */

    default:
      sendPacket(this, packet, cb);
      break;
  }
};
/**
 * _setupPingTimer - setup the ping timer
 *
 * @api private
 */


MqttClient.prototype._setupPingTimer = function () {
  var that = this;

  if (!this.pingTimer && this.options.keepalive) {
    this.pingResp = true;
    this.pingTimer = reinterval(function () {
      that._checkPing();
    }, this.options.keepalive * 1000);
  }
};
/**
 * _shiftPingInterval - reschedule the ping interval
 *
 * @api private
 */


MqttClient.prototype._shiftPingInterval = function () {
  if (this.pingTimer && this.options.keepalive && this.options.reschedulePings) {
    this.pingTimer.reschedule(this.options.keepalive * 1000);
  }
};
/**
 * _checkPing - check if a pingresp has come back, and ping the server again
 *
 * @api private
 */


MqttClient.prototype._checkPing = function () {
  if (this.pingResp) {
    this.pingResp = false;

    this._sendPacket({
      cmd: 'pingreq'
    });
  } else {
    // do a forced cleanup since socket will be in bad shape
    this._cleanUp(true);
  }
};
/**
 * _handlePingresp - handle a pingresp
 *
 * @api private
 */


MqttClient.prototype._handlePingresp = function () {
  this.pingResp = true;
};
/**
 * _handleConnack
 *
 * @param {Object} packet
 * @api private
 */


MqttClient.prototype._handleConnack = function (packet) {
  var rc = packet.returnCode;
  var errors = ['', 'Unacceptable protocol version', 'Identifier rejected', 'Server unavailable', 'Bad username or password', 'Not authorized'];
  clearTimeout(this.connackTimer);

  if (rc === 0) {
    this.reconnecting = false;
    this.emit('connect', packet);
  } else if (rc > 0) {
    var err = new Error('Connection refused: ' + errors[rc]);
    err.code = rc;
    this.emit('error', err);
  }
};
/**
 * _handlePublish
 *
 * @param {Object} packet
 * @api private
 */

/*
those late 2 case should be rewrite to comply with coding style:

case 1:
case 0:
  // do not wait sending a puback
  // no callback passed
  if (1 === qos) {
    this._sendPacket({
      cmd: 'puback',
      messageId: mid
    });
  }
  // emit the message event for both qos 1 and 0
  this.emit('message', topic, message, packet);
  this.handleMessage(packet, done);
  break;
default:
  // do nothing but every switch mus have a default
  // log or throw an error about unknown qos
  break;

for now i just suppressed the warnings
*/


MqttClient.prototype._handlePublish = function (packet, done) {
  done = typeof done !== 'undefined' ? done : nop$2;
  var topic = packet.topic.toString();
  var message = packet.payload;
  var qos = packet.qos;
  var mid = packet.messageId;
  var that = this;

  switch (qos) {
    case 2:
      this.incomingStore.put(packet, function (err) {
        if (err) {
          return done(err);
        }

        that._sendPacket({
          cmd: 'pubrec',
          messageId: mid
        }, done);
      });
      break;

    case 1:
      // emit the message event
      this.emit('message', topic, message, packet);
      this.handleMessage(packet, function (err) {
        if (err) {
          return done(err);
        } // send 'puback' if the above 'handleMessage' method executed
        // successfully.


        that._sendPacket({
          cmd: 'puback',
          messageId: mid
        }, done);
      });
      break;

    case 0:
      // emit the message event
      this.emit('message', topic, message, packet);
      this.handleMessage(packet, done);
      break;

    default:
      // do nothing
      // log or throw an error about unknown qos
      break;
  }
};
/**
 * Handle messages with backpressure support, one at a time.
 * Override at will.
 *
 * @param Packet packet the packet
 * @param Function callback call when finished
 * @api public
 */


MqttClient.prototype.handleMessage = function (packet, callback) {
  callback();
};
/**
 * _handleAck
 *
 * @param {Object} packet
 * @api private
 */


MqttClient.prototype._handleAck = function (packet) {
  /* eslint no-fallthrough: "off" */
  var mid = packet.messageId;
  var type = packet.cmd;
  var response = null;
  var cb = this.outgoing[mid];
  var that = this;

  if (!cb) {
    // Server sent an ack in error, ignore it.
    return;
  } // Process


  switch (type) {
    case 'pubcomp': // same thing as puback for QoS 2

    case 'puback':
      // Callback - we're done
      delete this.outgoing[mid];
      this.outgoingStore.del(packet, cb);
      break;

    case 'pubrec':
      response = {
        cmd: 'pubrel',
        qos: 2,
        messageId: mid
      };

      this._sendPacket(response);

      break;

    case 'suback':
      delete this.outgoing[mid];

      if (packet.granted.length === 1 && (packet.granted[0] & 0x80) !== 0) {
        // suback with Failure status
        var topics = this.messageIdToTopic[mid];

        if (topics) {
          topics.forEach(function (topic) {
            delete that._resubscribeTopics[topic];
          });
        }
      }

      cb(null, packet);
      break;

    case 'unsuback':
      delete this.outgoing[mid];
      cb(null);
      break;

    default:
      that.emit('error', new Error('unrecognized packet type'));
  }

  if (this.disconnecting && Object.keys(this.outgoing).length === 0) {
    this.emit('outgoingEmpty');
  }
};
/**
 * _handlePubrel
 *
 * @param {Object} packet
 * @api private
 */


MqttClient.prototype._handlePubrel = function (packet, callback) {
  callback = typeof callback !== 'undefined' ? callback : nop$2;
  var mid = packet.messageId;
  var that = this;
  var comp = {
    cmd: 'pubcomp',
    messageId: mid
  };
  that.incomingStore.get(packet, function (err, pub) {
    if (!err && pub.cmd !== 'pubrel') {
      that.emit('message', pub.topic, pub.payload, pub);
      that.incomingStore.put(packet, function (err) {
        if (err) {
          return callback(err);
        }

        that.handleMessage(pub, function (err) {
          if (err) {
            return callback(err);
          }

          that._sendPacket(comp, callback);
        });
      });
    } else {
      that._sendPacket(comp, callback);
    }
  });
};
/**
 * _nextId
 * @return unsigned int
 */


MqttClient.prototype._nextId = function () {
  // id becomes current state of this.nextId and increments afterwards
  var id = this.nextId++; // Ensure 16 bit unsigned int (max 65535, nextId got one higher)

  if (this.nextId === 65536) {
    this.nextId = 1;
  }

  return id;
};
/**
 * getLastMessageId
 * @return unsigned int
 */


MqttClient.prototype.getLastMessageId = function () {
  return this.nextId === 1 ? 65535 : this.nextId - 1;
};

var client = MqttClient;

/*! https://mths.be/punycode v1.4.1 by @mathias */

/** Highest positive signed 32-bit float value */
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */

var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80

var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars

var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */

var errors = {
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};
/** Convenience shortcuts */

var baseMinusTMin = base - tMin;
var floor$2 = Math.floor;
var stringFromCharCode = String.fromCharCode;
/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */

function error(type) {
  throw new RangeError(errors[type]);
}
/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */


function map$2(array, fn) {
  var length = array.length;
  var result = [];

  while (length--) {
    result[length] = fn(array[length]);
  }

  return result;
}
/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */


function mapDomain(string, fn) {
  var parts = string.split('@');
  var result = '';

  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@';
    string = parts[1];
  } // Avoid `split(regex)` for IE8 compatibility. See #17.


  string = string.replace(regexSeparators, '\x2E');
  var labels = string.split('.');
  var encoded = map$2(labels, fn).join('.');
  return result + encoded;
}
/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */


function ucs2decode(string) {
  var output = [],
      counter = 0,
      length = string.length,
      value,
      extra;

  while (counter < length) {
    value = string.charCodeAt(counter++);

    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);

      if ((extra & 0xFC00) == 0xDC00) {
        // low surrogate
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }

  return output;
}
/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */


function digitToBasic(digit, flag) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
}
/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */


function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$2(delta / damp) : delta >> 1;
  delta += floor$2(delta / numPoints);

  for (;
  /* no initialization */
  delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$2(delta / baseMinusTMin);
  }

  return floor$2(k + (baseMinusTMin + 1) * delta / (delta + skew));
}
/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */

function encode(input) {
  var n,
      delta,
      handledCPCount,
      basicLength,
      bias,
      j,
      m,
      q,
      k,
      t,
      currentValue,
      output = [],

  /** `inputLength` will hold the number of code points in `input`. */
  inputLength,

  /** Cached calculation results */
  handledCPCountPlusOne,
      baseMinusT,
      qMinusT; // Convert the input in UCS-2 to Unicode

  input = ucs2decode(input); // Cache the length

  inputLength = input.length; // Initialize the state

  n = initialN;
  delta = 0;
  bias = initialBias; // Handle the basic code points

  for (j = 0; j < inputLength; ++j) {
    currentValue = input[j];

    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  handledCPCount = basicLength = output.length; // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.
  // Finish the basic string - if it is not empty - with a delimiter

  if (basicLength) {
    output.push(delimiter);
  } // Main encoding loop:


  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    for (m = maxInt, j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow


    handledCPCountPlusOne = handledCPCount + 1;

    if (m - n > floor$2((maxInt - delta) / handledCPCountPlusOne)) {
      error('overflow');
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < n && ++delta > maxInt) {
        error('overflow');
      }

      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer
        for (q = delta, k = base;;
        /* no condition */
        k += base) {
          t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

          if (q < t) {
            break;
          }

          qMinusT = q - t;
          baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
          q = floor$2(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }

  return output.join('');
}
/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */

function toASCII(input) {
  return mapDomain(input, function (string) {
    return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
  });
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty$3(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var isArray$6 = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
}

function stringify(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';

  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map$3(objectKeys$1(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;

      if (isArray$6(obj[k])) {
        return map$3(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
}

function map$3(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];

  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }

  return res;
}

var objectKeys$1 = Object.keys || function (obj) {
  var res = [];

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }

  return res;
};

function parse(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1000;

  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty$3(obj, k)) {
      obj[k] = v;
    } else if (isArray$6(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}

// Copyright Joyent, Inc. and other Node contributors.
var urlModule = {
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  format: urlFormat,
  Url: Url
};
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
} // Reference: RFC 3986, RFC 1808, RFC 2396
// define these here so at least they only have to be
// compiled once on the first module load.

var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,
    // Special case for a simple path URL
simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    // RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
    // RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},
    // protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},
    // protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
};

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;
  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  return parse$1(this, url, parseQueryString, slashesDenoteHost);
};

function parse$1(self, url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError('Parameter \'url\' must be a string, not ' + typeof url);
  } // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916


  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);
  var rest = url; // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"

  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);

    if (simplePath) {
      self.path = rest;
      self.href = rest;
      self.pathname = simplePath[1];

      if (simplePath[2]) {
        self.search = simplePath[2];

        if (parseQueryString) {
          self.query = parse(self.search.substr(1));
        } else {
          self.query = self.search.substr(1);
        }
      } else if (parseQueryString) {
        self.search = '';
        self.query = {};
      }

      return self;
    }
  }

  var proto = protocolPattern.exec(rest);

  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    self.protocol = lowerProto;
    rest = rest.substr(proto.length);
  } // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.


  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';

    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      self.slashes = true;
    }
  }

  var i, hec, l, p;

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c
    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.
    // find the first instance of any hostEndingChars
    var hostEnd = -1;

    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    } // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.


    var auth, atSign;

    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    } // Now we have a portion which is definitely the auth.
    // Pull that off.


    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      self.auth = decodeURIComponent(auth);
    } // the host is the remaining to the left of the first non-host char


    hostEnd = -1;

    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    } // if we still have not hit it, then the entire thing is a host.


    if (hostEnd === -1) hostEnd = rest.length;
    self.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd); // pull out port.

    parseHost(self); // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.

    self.hostname = self.hostname || ''; // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.

    var ipv6Hostname = self.hostname[0] === '[' && self.hostname[self.hostname.length - 1] === ']'; // validate a little.

    if (!ipv6Hostname) {
      var hostparts = self.hostname.split(/\./);

      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;

        if (!part.match(hostnamePartPattern)) {
          var newpart = '';

          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          } // we test again with ASCII char only


          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);

            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }

            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }

            self.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (self.hostname.length > hostnameMaxLen) {
      self.hostname = '';
    } else {
      // hostnames are always lower case.
      self.hostname = self.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      self.hostname = toASCII(self.hostname);
    }

    p = self.port ? ':' + self.port : '';
    var h = self.hostname || '';
    self.host = h + p;
    self.href += self.host; // strip [ and ] from the hostname
    // the host field still retains them, though

    if (ipv6Hostname) {
      self.hostname = self.hostname.substr(1, self.hostname.length - 2);

      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  } // now rest is set to the post-host stuff.
  // chop off any delim chars.


  if (!unsafeProtocol[lowerProto]) {
    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);

      if (esc === ae) {
        esc = escape(ae);
      }

      rest = rest.split(ae).join(esc);
    }
  } // chop off from the tail first.


  var hash = rest.indexOf('#');

  if (hash !== -1) {
    // got a fragment string.
    self.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }

  var qm = rest.indexOf('?');

  if (qm !== -1) {
    self.search = rest.substr(qm);
    self.query = rest.substr(qm + 1);

    if (parseQueryString) {
      self.query = parse(self.query);
    }

    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    self.search = '';
    self.query = {};
  }

  if (rest) self.pathname = rest;

  if (slashedProtocol[lowerProto] && self.hostname && !self.pathname) {
    self.pathname = '/';
  } //to support http.request


  if (self.pathname || self.search) {
    p = self.pathname || '';
    var s = self.search || '';
    self.path = p + s;
  } // finally, reconstruct the href based on what has been validated.


  self.href = format$1(self);
  return self;
} // format a parsed object into a url string


function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = parse$1({}, obj);
  return format$1(obj);
}

function format$1(self) {
  var auth = self.auth || '';

  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = self.protocol || '',
      pathname = self.pathname || '',
      hash = self.hash || '',
      host = false,
      query = '';

  if (self.host) {
    host = auth + self.host;
  } else if (self.hostname) {
    host = auth + (self.hostname.indexOf(':') === -1 ? self.hostname : '[' + this.hostname + ']');

    if (self.port) {
      host += ':' + self.port;
    }
  }

  if (self.query && isObject(self.query) && Object.keys(self.query).length) {
    query = stringify(self.query);
  }

  var search = self.search || query && '?' + query || '';
  if (protocol && protocol.substr(-1) !== ':') protocol += ':'; // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.

  if (self.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;
  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');
  return protocol + host + pathname + search + hash;
}

Url.prototype.format = function () {
  return format$1(this);
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);

  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  } // hash is always overridden, no matter what.
  // even href="" will remove it.


  result.hash = relative.hash; // if the relative url is empty, then there's nothing left to do here.

  if (relative.href === '') {
    result.href = result.format();
    return result;
  } // hrefs like //foo/bar always cut to the protocol.


  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);

    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    } //urlParse appends trailing / to urls like http://www.example.com


    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  var relPath;

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);

      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }

      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;

    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      relPath = (relative.pathname || '').split('/');

      while (relPath.length && !(relative.host = relPath.shift()));

      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }

    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port; // to support http.request

    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }

    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];
  relPath = relative.pathname && relative.pathname.split('/') || []; // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.

  if (psychotic) {
    result.hostname = '';
    result.port = null;

    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }

    result.host = '';

    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;

      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }

      relative.host = null;
    }

    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  var authInHost;

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath; // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift(); //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

      authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }

    result.search = relative.search;
    result.query = relative.query; //to support http.request

    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }

    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null; //to support http.request

    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }

    result.href = result.format();
    return result;
  } // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.


  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === ''; // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0

  var up = 0;

  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];

    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  } // if the path is allowed to go above the root, restore leading ..s


  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/'; // put the host back

  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : ''; //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

    authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  } //to support request.http


  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }

  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  return parseHost(this);
};

function parseHost(self) {
  var host = self.host;
  var port = portPattern.exec(host);

  if (port) {
    port = port[0];

    if (port !== ':') {
      self.port = port.substr(1);
    }

    host = host.substr(0, host.length - port.length);
  }

  if (host) self.hostname = host;
}

var tls = {};

/*
  variables port and host can be removed since
  you have all required information in opts object
*/


function buildBuilder(client, opts) {
  var port, host;
  opts.port = opts.port || 1883;
  opts.hostname = opts.hostname || opts.host || 'localhost';
  port = opts.port;
  host = opts.hostname;
  return tls.createConnection(port, host);
}

var tcp = buildBuilder;

function buildBuilder$1(mqttClient, opts) {
  var connection;
  opts.port = opts.port || 8883;
  opts.host = opts.hostname || opts.host || 'localhost';
  opts.rejectUnauthorized = opts.rejectUnauthorized !== false;
  delete opts.path;
  connection = tls.connect(opts);
  /* eslint no-use-before-define: [2, "nofunc"] */

  connection.on('secureConnect', function () {
    if (opts.rejectUnauthorized && !connection.authorized) {
      connection.emit('error', new Error('TLS not authorized'));
    } else {
      connection.removeListener('error', handleTLSerrors);
    }
  });

  function handleTLSerrors(err) {
    // How can I get verify this error is a tls error?
    if (opts.rejectUnauthorized) {
      mqttClient.emit('error', err);
    } // close this connection to match the behaviour of net
    // otherwise all we get is an error from the connection
    // and close event doesn't fire. This is a work around
    // to enable the reconnect code to work the same as with
    // net.createConnection


    connection.end();
  }

  connection.on('error', handleTLSerrors);
  return connection;
}

var tls_1 = buildBuilder$1;

var streamShift = shift;

function shift(stream) {
  var rs = stream._readableState;
  if (!rs) return null;
  return rs.objectMode ? stream.read() : stream.read(getStateLength(rs));
}

function getStateLength(state) {
  if (state.buffer.length) {
    // Since node 6.3.0 state.buffer is a BufferList not an array
    if (state.buffer.head) {
      return state.buffer.head.data.length;
    }

    return state.buffer[0].length;
  }

  return state.length;
}

var SIGNAL_FLUSH = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([0]) : new Buffer([0]);

var onuncork = function (self, fn) {
  if (self._corked) self.once('uncork', fn);else fn();
};

var autoDestroy = function (self, err) {
  if (self._autoDestroy) self.destroy(err);
};

var destroyer = function (self, end) {
  return function (err) {
    if (err) autoDestroy(self, err.message === 'premature close' ? null : err);else if (end && !self._ended) self.end();
  };
};

var end = function (ws, fn) {
  if (!ws) return fn();
  if (ws._writableState && ws._writableState.finished) return fn();
  if (ws._writableState) return ws.end(fn);
  ws.end();
  fn();
};

var toStreams2 = function (rs) {
  return new readableBrowser.Readable({
    objectMode: true,
    highWaterMark: 16
  }).wrap(rs);
};

var Duplexify = function (writable, readable, opts) {
  if (!(this instanceof Duplexify)) return new Duplexify(writable, readable, opts);
  readableBrowser.Duplex.call(this, opts);
  this._writable = null;
  this._readable = null;
  this._readable2 = null;
  this._autoDestroy = !opts || opts.autoDestroy !== false;
  this._forwardDestroy = !opts || opts.destroy !== false;
  this._forwardEnd = !opts || opts.end !== false;
  this._corked = 1; // start corked

  this._ondrain = null;
  this._drained = false;
  this._forwarding = false;
  this._unwrite = null;
  this._unread = null;
  this._ended = false;
  this.destroyed = false;
  if (writable) this.setWritable(writable);
  if (readable) this.setReadable(readable);
};

inherits_browser(Duplexify, readableBrowser.Duplex);

Duplexify.obj = function (writable, readable, opts) {
  if (!opts) opts = {};
  opts.objectMode = true;
  opts.highWaterMark = 16;
  return new Duplexify(writable, readable, opts);
};

Duplexify.prototype.cork = function () {
  if (++this._corked === 1) this.emit('cork');
};

Duplexify.prototype.uncork = function () {
  if (this._corked && --this._corked === 0) this.emit('uncork');
};

Duplexify.prototype.setWritable = function (writable) {
  if (this._unwrite) this._unwrite();

  if (this.destroyed) {
    if (writable && writable.destroy) writable.destroy();
    return;
  }

  if (writable === null || writable === false) {
    this.end();
    return;
  }

  var self = this;
  var unend = endOfStream(writable, {
    writable: true,
    readable: false
  }, destroyer(this, this._forwardEnd));

  var ondrain = function () {
    var ondrain = self._ondrain;
    self._ondrain = null;
    if (ondrain) ondrain();
  };

  var clear = function () {
    self._writable.removeListener('drain', ondrain);

    unend();
  };

  if (this._unwrite) nextTick(ondrain); // force a drain on stream reset to avoid livelocks

  this._writable = writable;

  this._writable.on('drain', ondrain);

  this._unwrite = clear;
  this.uncork(); // always uncork setWritable
};

Duplexify.prototype.setReadable = function (readable) {
  if (this._unread) this._unread();

  if (this.destroyed) {
    if (readable && readable.destroy) readable.destroy();
    return;
  }

  if (readable === null || readable === false) {
    this.push(null);
    this.resume();
    return;
  }

  var self = this;
  var unend = endOfStream(readable, {
    writable: false,
    readable: true
  }, destroyer(this));

  var onreadable = function () {
    self._forward();
  };

  var onend = function () {
    self.push(null);
  };

  var clear = function () {
    self._readable2.removeListener('readable', onreadable);

    self._readable2.removeListener('end', onend);

    unend();
  };

  this._drained = true;
  this._readable = readable;
  this._readable2 = readable._readableState ? readable : toStreams2(readable);

  this._readable2.on('readable', onreadable);

  this._readable2.on('end', onend);

  this._unread = clear;

  this._forward();
};

Duplexify.prototype._read = function () {
  this._drained = true;

  this._forward();
};

Duplexify.prototype._forward = function () {
  if (this._forwarding || !this._readable2 || !this._drained) return;
  this._forwarding = true;
  var data;

  while (this._drained && (data = streamShift(this._readable2)) !== null) {
    if (this.destroyed) continue;
    this._drained = this.push(data);
  }

  this._forwarding = false;
};

Duplexify.prototype.destroy = function (err) {
  if (this.destroyed) return;
  this.destroyed = true;
  var self = this;
  nextTick(function () {
    self._destroy(err);
  });
};

Duplexify.prototype._destroy = function (err) {
  if (err) {
    var ondrain = this._ondrain;
    this._ondrain = null;
    if (ondrain) ondrain(err);else this.emit('error', err);
  }

  if (this._forwardDestroy) {
    if (this._readable && this._readable.destroy) this._readable.destroy();
    if (this._writable && this._writable.destroy) this._writable.destroy();
  }

  this.emit('close');
};

Duplexify.prototype._write = function (data, enc, cb) {
  if (this.destroyed) return cb();
  if (this._corked) return onuncork(this, this._write.bind(this, data, enc, cb));
  if (data === SIGNAL_FLUSH) return this._finish(cb);
  if (!this._writable) return cb();
  if (this._writable.write(data) === false) this._ondrain = cb;else cb();
};

Duplexify.prototype._finish = function (cb) {
  var self = this;
  this.emit('preend');
  onuncork(this, function () {
    end(self._forwardEnd && self._writable, function () {
      // haxx to not emit prefinish twice
      if (self._writableState.prefinished === false) self._writableState.prefinished = true;
      self.emit('prefinish');
      onuncork(self, cb);
    });
  });
};

Duplexify.prototype.end = function (data, enc, cb) {
  if (typeof data === 'function') return this.end(null, null, data);
  if (typeof enc === 'function') return this.end(data, null, enc);
  this._ended = true;
  if (data) this.write(data);
  if (!this._writableState.ending) this.write(SIGNAL_FLUSH);
  return readableBrowser.Writable.prototype.end.call(this, cb);
};

var duplexify = Duplexify;

var ws = null;

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket;
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket;
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket;
}

var wsFallback = ws;

var Transform$2 = readableBrowser.Transform;
var Buffer$8 = safeBuffer.Buffer;
var stream$1 = WebSocketStream;

function buildProxy(options, socketWrite, socketEnd) {
  var proxy = new Transform$2({
    objectMode: options.objectMode
  });
  proxy._write = socketWrite;
  proxy._flush = socketEnd;
  return proxy;
}

function WebSocketStream(target, protocols, options) {
  var stream, socket;
  var isBrowser = process.title === 'browser';
  var isNative = !!commonjsGlobal.WebSocket;
  var socketWrite = isBrowser ? socketWriteBrowser : socketWriteNode;

  if (protocols && !Array.isArray(protocols) && 'object' === typeof protocols) {
    // accept the "options" Object as the 2nd argument
    options = protocols;
    protocols = null;

    if (typeof options.protocol === 'string' || Array.isArray(options.protocol)) {
      protocols = options.protocol;
    }
  }

  if (!options) options = {};

  if (options.objectMode === undefined) {
    options.objectMode = !(options.binary === true || options.binary === undefined);
  }

  var proxy = buildProxy(options, socketWrite, socketEnd);

  if (!options.objectMode) {
    proxy._writev = writev;
  } // browser only: sets the maximum socket buffer size before throttling


  var bufferSize = options.browserBufferSize || 1024 * 512; // browser only: how long to wait when throttling

  var bufferTimeout = options.browserBufferTimeout || 1000; // use existing WebSocket object that was passed in

  if (typeof target === 'object') {
    socket = target; // otherwise make a new one
  } else {
    // special constructor treatment for native websockets in browsers, see
    // https://github.com/maxogden/websocket-stream/issues/82
    if (isNative && isBrowser) {
      socket = new wsFallback(target, protocols);
    } else {
      socket = new wsFallback(target, protocols, options);
    }

    socket.binaryType = 'arraybuffer';
  } // was already open when passed in


  if (socket.readyState === socket.OPEN) {
    stream = proxy;
  } else {
    stream = duplexify.obj();
    socket.onopen = onopen;
  }

  stream.socket = socket;
  socket.onclose = onclose;
  socket.onerror = onerror;
  socket.onmessage = onmessage;
  proxy.on('close', destroy);
  var coerceToBuffer = !options.objectMode;

  function socketWriteNode(chunk, enc, next) {
    // avoid errors, this never happens unless
    // destroy() is called
    if (socket.readyState !== socket.OPEN) {
      next();
      return;
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer$8.from(chunk, 'utf8');
    }

    socket.send(chunk, next);
  }

  function socketWriteBrowser(chunk, enc, next) {
    if (socket.bufferedAmount > bufferSize) {
      setTimeout(socketWriteBrowser, bufferTimeout, chunk, enc, next);
      return;
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer$8.from(chunk, 'utf8');
    }

    try {
      socket.send(chunk);
    } catch (err) {
      return next(err);
    }

    next();
  }

  function socketEnd(done) {
    socket.close();
    done();
  }

  function onopen() {
    stream.setReadable(proxy);
    stream.setWritable(proxy);
    stream.emit('connect');
  }

  function onclose() {
    stream.end();
    stream.destroy();
  }

  function onerror(err) {
    stream.destroy(err);
  }

  function onmessage(event) {
    var data = event.data;
    if (data instanceof ArrayBuffer) data = Buffer$8.from(data);else data = Buffer$8.from(data, 'utf8');
    proxy.push(data);
  }

  function destroy() {
    socket.close();
  } // this is to be enabled only if objectMode is false


  function writev(chunks, cb) {
    var buffers = new Array(chunks.length);

    for (var i = 0; i < chunks.length; i++) {
      if (typeof chunks[i].chunk === 'string') {
        buffers[i] = Buffer$8.from(chunks[i], 'utf8');
      } else {
        buffers[i] = chunks[i].chunk;
      }
    }

    this._write(Buffer$8.concat(buffers), 'binary', cb);
  }

  return stream;
}

/* global wx */


var socketOpen = false;
var socketMsgQueue = [];

function sendSocketMessage(msg) {
  if (socketOpen) {
    wx.sendSocketMessage({
      data: msg.buffer || msg
    });
  } else {
    socketMsgQueue.push(msg);
  }
}

function WebSocket$1(url, protocols) {
  var ws = {
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    readyState: socketOpen ? 1 : 0,
    send: sendSocketMessage,
    close: wx.closeSocket,
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null
  };
  wx.connectSocket({
    url: url,
    protocols: protocols
  });
  wx.onSocketOpen(function (res) {
    ws.readyState = ws.OPEN;
    socketOpen = true;

    for (var i = 0; i < socketMsgQueue.length; i++) {
      sendSocketMessage(socketMsgQueue[i]);
    }

    socketMsgQueue = [];
    ws.onopen && ws.onopen.apply(ws, arguments);
  });
  wx.onSocketMessage(function (res) {
    ws.onmessage && ws.onmessage.apply(ws, arguments);
  });
  wx.onSocketClose(function () {
    ws.onclose && ws.onclose.apply(ws, arguments);
    ws.readyState = ws.CLOSED;
    socketOpen = false;
  });
  wx.onSocketError(function () {
    ws.onerror && ws.onerror.apply(ws, arguments);
    ws.readyState = ws.CLOSED;
    socketOpen = false;
  });
  return ws;
}

function buildUrl(opts, client) {
  var protocol = opts.protocol === 'wxs' ? 'wss' : 'ws';
  var url = protocol + '://' + opts.hostname + opts.path;

  if (opts.port && opts.port !== 80 && opts.port !== 443) {
    url = protocol + '://' + opts.hostname + ':' + opts.port + opts.path;
  }

  if (typeof opts.transformWsUrl === 'function') {
    url = opts.transformWsUrl(url, opts, client);
  }

  return url;
}

function setDefaultOpts(opts) {
  if (!opts.hostname) {
    opts.hostname = 'localhost';
  }

  if (!opts.path) {
    opts.path = '/';
  }

  if (!opts.wsOptions) {
    opts.wsOptions = {};
  }
}

function createWebSocket(client, opts) {
  var websocketSubProtocol = opts.protocolId === 'MQIsdp' && opts.protocolVersion === 3 ? 'mqttv3.1' : 'mqtt';
  setDefaultOpts(opts);
  var url = buildUrl(opts, client);
  return stream$1(WebSocket$1(url, [websocketSubProtocol]));
}

function buildBuilder$2(client, opts) {
  opts.hostname = opts.hostname || opts.host;

  if (!opts.hostname) {
    throw new Error('Could not determine host. Specify host manually.');
  }

  return createWebSocket(client, opts);
}

var wx_1 = buildBuilder$2;

var ws$1 = createCommonjsModule(function (module) {

  var WSS_OPTIONS = ['rejectUnauthorized', 'ca', 'cert', 'key', 'pfx', 'passphrase'];
  var IS_BROWSER = process.title === 'browser';

  function buildUrl(opts, client) {
    var url = opts.protocol + '://' + opts.hostname + ':' + opts.port + opts.path;

    if (typeof opts.transformWsUrl === 'function') {
      url = opts.transformWsUrl(url, opts, client);
    }

    return url;
  }

  function setDefaultOpts(opts) {
    if (!opts.hostname) {
      opts.hostname = 'localhost';
    }

    if (!opts.port) {
      if (opts.protocol === 'wss') {
        opts.port = 443;
      } else {
        opts.port = 80;
      }
    }

    if (!opts.path) {
      opts.path = '/';
    }

    if (!opts.wsOptions) {
      opts.wsOptions = {};
    }

    if (!IS_BROWSER && opts.protocol === 'wss') {
      // Add cert/key/ca etc options
      WSS_OPTIONS.forEach(function (prop) {
        if (opts.hasOwnProperty(prop) && !opts.wsOptions.hasOwnProperty(prop)) {
          opts.wsOptions[prop] = opts[prop];
        }
      });
    }
  }

  function createWebSocket(client, opts) {
    var websocketSubProtocol = opts.protocolId === 'MQIsdp' && opts.protocolVersion === 3 ? 'mqttv3.1' : 'mqtt';
    setDefaultOpts(opts);
    var url = buildUrl(opts, client);
    return stream$1(url, [websocketSubProtocol], opts.wsOptions);
  }

  function buildBuilder(client, opts) {
    return createWebSocket(client, opts);
  }

  function buildBuilderBrowser(client, opts) {
    if (!opts.hostname) {
      opts.hostname = opts.host;
    }

    if (!opts.hostname) {
      // Throwing an error in a Web Worker if no `hostname` is given, because we
      // can not determine the `hostname` automatically.  If connecting to
      // localhost, please supply the `hostname` as an argument.
      if (typeof document === 'undefined') {
        throw new Error('Could not determine host. Specify host manually.');
      }

      var parsed = urlModule.parse(document.URL);
      opts.hostname = parsed.hostname;

      if (!opts.port) {
        opts.port = parsed.port;
      }
    }

    return createWebSocket(client, opts);
  }

  if (IS_BROWSER) {
    module.exports = buildBuilderBrowser;
  } else {
    module.exports = buildBuilder;
  }
});

var protocols = {};

if (process.title !== 'browser') {
  protocols.mqtt = tcp;
  protocols.tcp = tcp;
  protocols.ssl = tls_1;
  protocols.tls = tls_1;
  protocols.mqtts = tls_1;
} else {
  protocols.wx = wx_1;
  protocols.wxs = wx_1;
}

protocols.ws = ws$1;
protocols.wss = ws$1;
/**
 * Parse the auth attribute and merge username and password in the options object.
 *
 * @param {Object} [opts] option object
 */

function parseAuthOptions(opts) {
  var matches;

  if (opts.auth) {
    matches = opts.auth.match(/^(.+):(.+)$/);

    if (matches) {
      opts.username = matches[1];
      opts.password = matches[2];
    } else {
      opts.username = opts.auth;
    }
  }
}
/**
 * connect - connect to an MQTT broker.
 *
 * @param {String} [brokerUrl] - url of the broker, optional
 * @param {Object} opts - see MqttClient#constructor
 */


function connect$1(brokerUrl, opts) {
  if (typeof brokerUrl === 'object' && !opts) {
    opts = brokerUrl;
    brokerUrl = null;
  }

  opts = opts || {};

  if (brokerUrl) {
    var parsed = urlModule.parse(brokerUrl, true);

    if (parsed.port != null) {
      parsed.port = Number(parsed.port);
    }

    opts = immutable(parsed, opts);

    if (opts.protocol === null) {
      throw new Error('Missing protocol');
    }

    opts.protocol = opts.protocol.replace(/:$/, '');
  } // merge in the auth options if supplied


  parseAuthOptions(opts); // support clientId passed in the query string of the url

  if (opts.query && typeof opts.query.clientId === 'string') {
    opts.clientId = opts.query.clientId;
  }

  if (opts.cert && opts.key) {
    if (opts.protocol) {
      if (['mqtts', 'wss', 'wxs'].indexOf(opts.protocol) === -1) {
        switch (opts.protocol) {
          case 'mqtt':
            opts.protocol = 'mqtts';
            break;

          case 'ws':
            opts.protocol = 'wss';
            break;

          case 'wx':
            opts.protocol = 'wxs';
            break;

          default:
            throw new Error('Unknown protocol for secure connection: "' + opts.protocol + '"!');
        }
      }
    } else {
      // don't know what protocol he want to use, mqtts or wss
      throw new Error('Missing secure protocol key');
    }
  }

  if (!protocols[opts.protocol]) {
    var isSecure = ['mqtts', 'wss'].indexOf(opts.protocol) !== -1;
    opts.protocol = ['mqtt', 'mqtts', 'ws', 'wss', 'wx', 'wxs'].filter(function (key, index) {
      if (isSecure && index % 2 === 0) {
        // Skip insecure protocols when requesting a secure one.
        return false;
      }

      return typeof protocols[key] === 'function';
    })[0];
  }

  if (opts.clean === false && !opts.clientId) {
    throw new Error('Missing clientId for unclean clients');
  }

  if (opts.protocol) {
    opts.defaultProtocol = opts.protocol;
  }

  function wrapper(client$$1) {
    if (opts.servers) {
      if (!client$$1._reconnectCount || client$$1._reconnectCount === opts.servers.length) {
        client$$1._reconnectCount = 0;
      }

      opts.host = opts.servers[client$$1._reconnectCount].host;
      opts.port = opts.servers[client$$1._reconnectCount].port;
      opts.protocol = !opts.servers[client$$1._reconnectCount].protocol ? opts.defaultProtocol : opts.servers[client$$1._reconnectCount].protocol;
      opts.hostname = opts.host;
      client$$1._reconnectCount++;
    }

    return protocols[opts.protocol](client$$1, opts);
  }

  return new client(wrapper, opts);
}

var connect_1 = connect$1;
var connect_2 = connect$1;
var MqttClient_1 = client;
var Store_1 = store;
connect_1.connect = connect_2;
connect_1.MqttClient = MqttClient_1;
connect_1.Store = Store_1;

/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: "string",
    label: "broker",
    name: "broker",
    placeholder: "WebSocket hostname"
  }, {
    type: "number",
    label: "port",
    name: "port",
    placeholder: "15675"
  }, {
    type: "string",
    label: "path",
    name: "path",
    placeholder: "/mqtt or /ws"
  }, {
    type: "string",
    label: "user",
    name: "user"
  }, {
    type: "string",
    label: "password",
    name: "password",
    property: "password"
  }, {
    type: "string",
    label: "topic",
    name: "topic"
  }, {
    type: "number",
    label: "qos",
    name: "qos",
    placeholder: "0..2"
  }, {
    type: "string",
    label: "client-id",
    name: "clientId"
  }, {
    type: "select",
    label: "role",
    name: "role",
    property: {
      options: [{
        display: "Subscriber",
        value: "subscriber"
      }, {
        display: "Publisher",
        value: "publisher"
      }]
    }
  }, {
    type: "select",
    label: "data-format",
    name: "dataFormat",
    property: {
      options: [{
        display: "Plain Text",
        value: "text"
      }, {
        display: "JSON",
        value: "json"
      }]
    }
  }, {
    type: "checkbox",
    label: "retain",
    name: "retain"
  }, {
    type: "checkbox",
    label: "ssl",
    name: "ssl"
  }]
};
const MQTT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACpCAMAAABu4E1nAAAAulBMVEVHcEzh1uvj1+3f2ezk2Ozk1u3h2Ozh4Ovl5O7g0O/j1e3i1uvl1+zDwdy2tNe+vNvGxN6yr9TIxt+8udnMyuHV1OavrNOopdDPzeO6t9iBfq7KyOCsqdK0sdXEwt3BvtvS0OSDMIekoM24tteKPo9wCHJ6Hn1/KYPZ2OiHN4t3F3mTUJh9I4CXV52QSpXd3Ol0EHaNRJKbX6GrfbKmdK2eZaWia6mLiLaVkr2xibmdmsS7nsbGsdLj1+x6ayFYAAAADXRSTlMA72knP6XI/v4Qg+JLWzYOpwAAD0xJREFUeF5iwAE4BxIwEA9YuFjZGG0HGDCysTIxE3YqK6PtoAHcXHgdzMNmO8gAKwsDDsDMZjsIASv2VMwEVwBgzVyX3bShKNxbgpPUF8AcsIxtKs/0uNNM+ReppH3/1yq6wELetoVEdzvTHynRl2+WFvuQW9FU1b6fo5os26k5r9VcLteyk2rqrG3bm5pinEZNpYY+fjaPX7Z68n4Oaq7XzSaVUh7bNmkTO6vVKkGEf30A+8H+YtHYk7IsG48xh5gTrte0E6wfwfcKlpAaTjxOnt+oOZ1OaZq+9VPXtWQsHXF71P6ffgbez6SwPg6s5LyHx70ZYLkpLG5jeNXDT3DzV7gdYx1wNbAem4Y72hG2IbiwkzvH1VID88zabQqf3fwFLmdMFjYKRq2LS2NwG/zsCS6xq0/jUgs+GFzYjQlDKZio2nbABTAJw+cR1sr127Wn1ToRIm203Di7wGXr1oUFLq7aLwYWejx2cZo6jJtA7BfaNXftCrsu7o+fnNC2D8OXEbsUNy11ILrjMrvmrtWGluJ+cIoWVQQ9FFfJIbj9UYZ3F20XuLzVrPSq2bfajxq2H9fui9qluG91p3mzJXZtNTg1BtyPUOu8lTy4OM09rBM6D8vsloLJIiG8Wi5SC1zY9RQDwTV+eRVnF7hixCXJ/flfS9vCbmDt4jCT37RaaFc0pHZVLYxBaC1ucRuLs4qwa3nFdandCrhOFD4MtDQLfrsPD1O88mye38fYrS3uaoJrX2hf+v8kSQu7Zkj2vLWLw7jQrwsT/Ri7tWRi7960xARXxzZpE8duE1a7wK31lJ2Kwwa4wXYlY8Ad5H4xtImSC7ukGAguqV33rLI0ccgi7QIX2VWclnaVOHZvwbVLcXUc0iV2RTUJQwLa1Qp2PbW78/QYcO1tW2AXuNbtJ02r2C3vbcL7+i2Re3ChN95ugyxMaLVrFIN71faBtQtcfdvk7g737LWLIissLnVLo9sUntr14EKvixvQu7fhqjlutd0WYSjsxNQucG16u2OoXaw4CvdREtTgpt2M28JTu9tXtTvqFdtwu28Wt6Vujd3EtXsjduct5/e4Sm8dbbdL9NAkkB6b2kXthrwlSt7/2+k0RGW3ZIwTWoM78AL31sBuyHIO3Lrn5ToNlyi7nLGU0EJvawZviUW1a4brNJzC7AI3f0qreR8u59G1q+zqNPAou51aGSgt7CILy2vXytVpkFmMXclEQWkRXRTDLaB2yXJOccU6xq5gogXtZbvbF63FxT4WYNfzltBZ0OEVeYxdwThomR3R8XRdtT2ux27gcq7H4rKU/IH9dksmCS2g00v1zC5wg2uXm7tWE1y/XT6h7aQUgt2N5JdC0cJu5HKO2rXh5TF2QWt8nbenspPCJc4LvNQWLOd6Rtwu3O4GtEijOn6b8imzTI//U+3CrjwG2nVoFcH4sH7SQRb8guV8We2ieMPsurTARRTzE4gFPy+yC1zbZFmY3Stomztc3PPDoe4AfJxnFyfRZgDuLsCuQ2u6ieLas1MuhwwfHLsZteurXU5wZ9l1aKe4O4LbP5N2YhQMuzHLeaTdA2gLgrt2cPVDYyS6s/qfY5bzaLuUluBe7nBPYyLkNno5d+3ObgaHFrhHiouj03QQLK8LajemGaa0Dm72CNc8ow4eeHOCG2FXHmfazR23BPdMcYeDueXdRti1coE7b2dwaZXdpz1GcGvL261Dv5zTq9aZE31272gbH+5mijvw8iziEw7sYiPLPHYntFgJfT0GXHvfRBq3nHPg1nPsbkFrl8J5PYZzOxvfObj0pgF347fr0hq7r3APFLcspY1D4HLu2GWMbb12HVrgzuox4Jr4ijxyOe/MDz/i7LVLaZsipMfssZ3VG/7lvKctucU9euxOaSefw+3HcE+PARd6g2qX9pjH7pQWP93O7DHgQi+t3YC3BH+Ae5n8LpcpLezSHvPjmm1Hrj21S+1ypxgoLn4Xh1bxQm4T0mPlqFdcw7+coxjWL+0S2ugeK8f08pi3BG7aC7tr0CbAnddjFJfbNOxCl/MSN616btehTUAbso+5uCYN28DlnAM3rZ7bdWgTJ7pPcLf5a1ydBrEJ3XZx0y5Pcae0q4TYDVgfgWvSUIfWbjlGd/8E16VdGVrYjegxPuLyQLu4aV31DPc8dWtxYTeqx7gNbxf45RzR3TzD3bl/F3mf3dnrI+QCV56DvpwjuiJ7jOvSJojush6zd02ugz7hILqyeojr0Fq5yVRuRI9x4Ip12HKOGnuMe5cExTundpUqikvtikvQco4ndxSX0CIMsBvbY7A7uxj4YFdnYU9xM9D+kxWJAgZtzD5GcWfXrn0SWSC4E9rf3t/f//jz29/fsxa1G/Jj8Nuz7J4D7HJkgdp1aNV8/fr19/e/vn3fTeyG9hhphrl2tV5kgdg9gvY/Vs5wO1EYiMJP4KpaV6s9llKCFmUXUAHV93+uncS03EArM7Dpb875zu3NNcxMeKtwwzAKN/F5ZHG55TzE9f0KV1w5t78RDXWRdoO4BBxFb/m1Y47RqnAvsti1zxVPDXWRtolLa59dvR9xh49iF3D9ltgFdeHH2/dq6rq0xNvETZJ9fuuUY4A7Zx/O8SQ38GrqurSWd69XhUsrOC/Er8H4urUcyw/nZHivpu4T0H5oWIvrqksrzAeyHMMfflpTaSnahK6H6jq0BPsBuK66iv7imyDHUN0LxC63hDM3G23hqou0xGp4f1BXKbW7iXIMzynLUtiXoKU3mqMu0tJC7zZxDa+knDf3AdcXV87pqZWH6i4q2oBorXcf4CanddfYHQuHH7W4Fw/VRVqDS7yPcVV0kOQYBsNQVMLx5/cUA3WRlnAZ3qX1duXnGAZDyaqc/4ZgoGfwYoDjhCBo866yKxtBMLThonXBPZx2MD00hIsBNW1bvass8P7KzjE8j/2SVs4LErdS16UN2r2rKnn55bwv6xZrYeWcDDStKp5eXVvw7mN11WbMzDG07kVawtFj41+4QJsGKQHzvauSg+g12I6tyUo4Wtxni+vSphqV711au4H4vbIYiCrnVlzP4Lq0Vt0PtnfV5sbLMfSCcPjxomPBqgu0fzTuXV62d1V0Fb0GlzoXJJVzGwtW3RnQWlwNzPUurQMzx/yvedYRY/gRHiRxX2d6ubQG15qX712V83PMDjdzx1pQXKMu0tLq4l0VjwTHx4Jwh6yWGoo7mZkFtDuLK/auSteC8xjRlsKGJf077lZAWsAVejcYMNoSUDj/JWtY0iOLhraEK/Qu4DJj12404cw5ibu1tKit1LuAy8kx/7NH9SKbOdfz+Ns6LfH28O6DHEN1bYqJhh/J7M/brUuLuHLv7kYPcbHMpVOMN9aCl7YId1vRxhqWcLt6Nxa1V4247MO5DjHCRdoY1O3i3SMvx6y4srEWeqBOC+p28u6Z2ZYw4k6kF9tnddq4n3eTKzPHjLii4UcKsfe6E+Ke3g2nzPPYXVyJumaf/QXaLI77ejcYccp5vhVXMvxI+2yBtIa1r3dPzLYEiVusRMOP+iNMQJvFrrppq3ejb9Q9s3LMiCsbfiyXhUNLrELvRmFD3XDKy7GCxBXdTPIpox3ahrrfebdN3YDZliBx30Uz58XSd2kzsXejpnePvNdgErcUDXGTFYD2ZHDpb4fqynM3ubFeg/VRbCC5v0qRuwLak1U3E3s3cdQNeG0JuGPGi91iOUZtP3Gd3E353pW9BpdmnwnMUC5L1Naqm7neTVu820yGZMpqS+h9JvlswNylfaCuLHdjTjnP7LOF5LMBBdKa9V0ypCzvJqDulVPO0/tsIvlsQAm0+clVdyf1Ltb6J5xyHtGOJd/08pE2P92BwQ0y74K6Z05booTpJNbh3KEFdUFctndR3f2IMdXiaytIPhtwcWhz8K5dEu+iugdOW6LQrVzBDcsXpLW8GQTZrqt3wzWjLVF+9smZsQs3DY/5MUfvxnLvIu6R0V7VVlh5DHWbN7aOBPu/vEu84YTRXtVW4N9fdWmtuobXrM7eNc5ltFeNFTQuL3aRNrfq5rDVOns3UZtVe3tVW8Gjxfyml6OtUddaN+udu+rMmM4j2lfAbTmcD5HWqAs7rad3U8aYSKEryRqX89kAl/Zw7OLdzY/q3tpvS+g5cdNdYsXu8B9rZ6DaNgxFUa8LA1ZCszCxwNhmlrCKul1oQ9sI+/+/q7pPUp9Qal27jb7g+HF4kkHvSmnBOt/dWnUf+C1jHBs3BFerm9MCF0tgubu8uv++82siXoWtCbg8giw3weMeUnm5u1Oq6/i0xFHEnVbdnDbCntPdjt/Owy1xnWkjsQE5LZbCftRd8N4s6S1jiKtTVyQ24I/SCuyZ3XX0uts3/Kib5AIJ3M1pZUVzz+Tu/w3FxVHBTMEtaJ0UVxsZc3fH3b1Z02kJTGkFFXjbXRa1zXmpuzvurmO3jLd/sT/Ioo0hp3UoLnUXsFrdurt+3dFbxviXjKy07a40mbP3pA6wKC7puyoDcfeW3zL2tCtjp8hwtc5o3SHyRtwTd6O53F3Q3gbcgU5LYNQ0ZROS6m4QhRzyuwfnl6r7prsAnuYuYMF7oNMS2M00Pc/U2m6LDO8Qib0RcV3CLd1VGai7eXU7OvWF3cwKriDXDucSih0T/Z3HBbErq1v+uHN3tbrXdFrC72bP2ZhNpe2KtgtkYkcVgJp3Bt2DARt4u1nuDmxIDbuZtVrd8cN5C0o8QAAVjAu42hlQ3Lfc7Wa469hwxxZHXE0tHW8MqxQ9vwjFTbiZDCOb2nR3H+n0qm8KvxOtrTSGVkQAbXMp5kZcV25qWO90954OqeFAnmaYKtUVaz81oA3mrp3KUOkMs9y9FoJaH8NgQ8omrFTXgvBCaGOu/1DiFm33Pe4u2fQqRnI0cHes7ZpYWtCmlz76iDu6q813t7cEV55z2BfVLSPIWsH7nGibrwXuR91NuAc2bPsj0mp1T9tum79Rs9AXalQG7bvgVdiZ7j6x0ADfcJ/3iqvqKq4RtMtGaaEu1s8+4EZ1VYaZfTfh3oEAK7lYNoZfvuGWgbupujo4AGmVNntZaah0hjnuBtodCw3A9rAvcs5tq9U1Cqu0KoPn7cFb6QzM3bwxgKAWGnDlaU0euJufdo2NSF+aE9rm4vVVuNXQ973TpTJHoQtBimOwfkhnQDEWXg7o4/EI2tIGY+3LbOGAiwGLaxmYWW0HIeBmZoADBgbmQX2THSPLkLkl0JaNiGsNmQbvDYwAiZJSuDJ1+dQAAAAASUVORK5CYII=";
class Mqtt extends DataSource(RectPath(Shape)) {
  static get image() {
    if (!Mqtt._image) {
      Mqtt._image = new Image();
      Mqtt._image.src = MQTT_IMAGE;
    }

    return Mqtt._image;
  }

  ready() {
    super.ready();
    if (!this.app.isViewMode) return;

    this._initMqttConnection();
  }

  _initMqttConnection() {
    try {
      this._client && this._client.end(true, () => {});
    } catch (e) {
      console.error(e);
    }

    delete this._client;
    var {
      broker,
      port = 8441,
      clientId = "THINGS-BOARD",
      topic,
      qos = 1,
      retain = false,
      path = "/mqtt",
      dataFormat = "text",
      user,
      password,
      ssl = false,
      role = "subscriber"
    } = this.model;

    if (!broker) {
      console.warn("broker not defined");
      return;
    }

    clientId = [clientId, role, Date.now()].join("-");
    var client = connect_1.connect(`ws://${broker}:${port}${path}`, {
      keepalive: 10,
      clientId,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false
      },
      username: user,
      password: password,
      rejectUnauthorized: false
    });
    client.on("error", err => {
      console.error(err);
      client.end();
    });
    client.on("connect", packet => {
      console.log("client connected:", clientId, packet);
      role != "publisher" && client.subscribe(topic, {
        qos,
        onSuccess: () => {
          console.log("subscription success");
        },
        onFailure: failure => {
          console.log("subscription failed", failure.errorCode, failure.errorMessage);
        }
      });
    });
    client.on("message", (topic, message, packet) => {
      this.data = this._convertDataFormat(message.toString(), dataFormat);
    });
    client.on("close", () => {
      console.log(clientId + " disconnected");
    });
    this._client = client;
  }

  dispose() {
    try {
      this._client && this._client.end(true, () => {});
    } catch (e) {
      console.error(e);
    }

    delete this._client;
    super.dispose();
  }

  _draw(context) {
    /*
     * TODO role이 publisher 인지 subscriber 인지에 따라서 구분할 수 있는 표시를 추가할 것.
     */
    var {
      left,
      top,
      width,
      height
    } = this.bounds;
    context.beginPath();
    context.drawImage(Mqtt.image, left, top, width, height);
  }

  onchangeData(data, before) {
    super.onchangeData(data, before);
    const {
      topic,
      role = "subscriber"
    } = this.model;

    if (!this._client || !this._client.connected) {
      return;
    }

    if (role == "subscriber") {
      return;
    }

    this._client.publish(topic, JSON.stringify(data.data), {
      qos: 0,
      retain: false
    });
  }

  get nature() {
    return NATURE;
  }

}
Component.register("mqtt", Mqtt);

/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

export { Mqtt };
