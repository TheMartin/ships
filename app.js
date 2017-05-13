/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 74);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    equal(v) {
        return this.x === v.x && this.y === v.y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    multiply(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    elementMultiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    elementDivide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    normalize() {
        return this.multiply(1 / norm(this));
    }
    normalized() {
        return this.clone().normalize();
    }
    rotate(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        const x = c * this.x - s * this.y;
        const y = s * this.x + c * this.y;
        this.x = x;
        this.y = y;
        return this;
    }
    rotated(a) {
        return this.clone().rotate(a);
    }
    angle() {
        return Math.atan2(this.x, -this.y);
    }
    static lerp(v1, v2, alpha) {
        return v1.clone().multiply(1 - alpha).add(v2.clone().multiply(alpha));
    }
    static random() {
        return new Vec2(Math.random(), Math.random());
    }
    static fromAngle(a) {
        return new Vec2(Math.sin(a), -Math.cos(a));
    }
    static equal(lhs, rhs) {
        return lhs.equal(rhs);
    }
}
Vec2.zero = new Vec2(0, 0);
exports.Vec2 = Vec2;
;
function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}
exports.dot = dot;
;
function cross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}
exports.cross = cross;
;
function norm2(v) {
    return dot(v, v);
}
exports.norm2 = norm2;
;
function norm(v) {
    return Math.sqrt(norm2(v));
}
exports.norm = norm;
;
function distance2(v1, v2) {
    return norm2(v1.clone().subtract(v2));
}
exports.distance2 = distance2;
;
function distance(v1, v2) {
    return Math.sqrt(distance2(v1, v2));
}
exports.distance = distance;
;
function lerp(x1, x2, alpha) {
    return (1 - alpha) * x1 + alpha * x2;
}
exports.lerp = lerp;
;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const vec2_1 = __webpack_require__(0);
class Position {
    constructor(pos) {
        this.pos = pos;
    }
    equal(other) {
        return this.pos.equal(other.pos);
    }
    clone() {
        return new Position(this.pos.clone());
    }
    serialize() {
        return [this.pos.x, this.pos.y];
    }
    static deserialize(data) {
        return new Position(new vec2_1.Vec2(data[0], data[1]));
    }
}
Position.t = "Position";
exports.Position = Position;
;
class Rotation {
    constructor(angle) {
        this.angle = angle;
    }
    equal(other) {
        return this.angle === other.angle;
    }
    clone() {
        return new Rotation(this.angle);
    }
    serialize() {
        return [this.angle];
    }
    static deserialize(data) {
        return new Rotation(data[0]);
    }
}
Rotation.t = "Rotation";
exports.Rotation = Rotation;
;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const uiManager_1 = __webpack_require__(12);
const spatial_1 = __webpack_require__(1);
const playable_1 = __webpack_require__(7);
const vec2_1 = __webpack_require__(0);
class Selectable {
    equal(other) {
        return true;
    }
    clone() {
        return new Selectable();
    }
    serialize() {
        return [];
    }
    static deserialize(data) {
        return new Selectable();
    }
}
Selectable.t = "Selectable";
exports.Selectable = Selectable;
;
class Selected {
}
Selected.t = "Selected";
exports.Selected = Selected;
;
class Box {
    constructor(a, b) {
        this.min = new vec2_1.Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
        this.max = new vec2_1.Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
}
;
function isWithin(v, box) {
    return v.x >= box.min.x
        && v.x <= box.max.x
        && v.y >= box.min.y
        && v.y <= box.max.y;
}
;
class SelectSingle {
    constructor(entity) {
        this.entity = entity;
        this.name = "SelectSingle";
    }
}
exports.SelectSingle = SelectSingle;
;
class SelectBox {
    constructor(box) {
        this.box = box;
        this.name = "SelectBox";
    }
}
exports.SelectBox = SelectBox;
;
class Unselect {
    constructor() {
        this.name = "Unselect";
    }
}
exports.Unselect = Unselect;
;
class SelectionSystem {
    constructor(inputQueue, spatialCache, player, ui, renderer, viewport) {
        this.spatialCache = spatialCache;
        this.ui = ui;
        this.renderer = renderer;
        this.viewport = viewport;
        inputQueue.setHandler("SelectSingle", (evt, interp, world) => {
            world.forEachEntity([Selectable.t, playable_1.Controlled.t], (id, components) => {
                let [selectable, controlled] = components;
                if (controlled.player.id !== player.id)
                    return;
                let selected = world.getComponent(id, Selected.t);
                if (!selected && id === evt.entity) {
                    world.addComponent(id, Selected.t, new Selected());
                }
                else if (selected && id !== evt.entity) {
                    world.removeComponent(id, Selected.t);
                }
            });
        });
        inputQueue.setHandler("Unselect", (evt, interp, world) => {
            world.forEachEntity([Selected.t], (id, components) => {
                world.removeComponent(id, Selected.t);
            });
        });
        inputQueue.setHandler("SelectBox", (evt, interp, world) => {
            world.forEachEntity([spatial_1.Position.t, Selectable.t, playable_1.Controlled.t], (id, components) => {
                let [position, , controlled] = components;
                if (controlled.player.id !== player.id)
                    return;
                let selected = world.getComponent(id, Selected.t);
                const within = isWithin(this.viewport.transform(this.spatialCache.interpolatePosition(position, id, interp)), evt.box);
                if (!selected && within) {
                    world.addComponent(id, Selected.t, new Selected());
                }
                else if (selected && !within) {
                    world.removeComponent(id, Selected.t);
                }
            });
        });
        ui.addEventListener("dragstart", (e) => {
            if (e.button === uiManager_1.MouseButton.Left)
                this.dragStart = this.viewport.inverseTransform(e.pos);
        });
        ui.addEventListener("dragend", (e) => {
            if (e.button === uiManager_1.MouseButton.Left) {
                inputQueue.enqueue(new SelectBox(new Box(this.viewport.transform(this.dragStart), this.dragCurrent)));
                this.dragStart = null;
                this.dragCurrent = null;
            }
        });
        ui.addEventListener("click", (e) => {
            if (e.button === uiManager_1.MouseButton.Left)
                inputQueue.enqueue(new Unselect());
        });
        ui.addEventListener("entityclick", (e) => {
            if (e.button === uiManager_1.MouseButton.Left)
                inputQueue.enqueue(new SelectSingle(e.entities[0]));
        });
    }
    update(dt, interp, world, inputQueue, deferred) {
        if (this.dragStart) {
            const mousePos = this.ui.mousePosition();
            if (mousePos)
                this.dragCurrent = this.ui.mousePosition().clone();
            if (this.dragCurrent)
                this.renderer.drawRect(this.viewport.transform(this.dragStart), this.dragCurrent, SelectionSystem.props);
        }
    }
}
SelectionSystem.props = {
    stroke: "rgb(0, 255, 0)",
    lineWidth: 1,
    fillColor: "rgba(0, 255, 0, 0.2)"
};
exports.SelectionSystem = SelectionSystem;
;
class DrawSelectedBox {
    constructor(spatialCache, renderer, viewport) {
        this.spatialCache = spatialCache;
        this.renderer = renderer;
        this.viewport = viewport;
    }
    update(dt, interp, world, inputQueue, deferred) {
        world.forEachEntity([Selected.t, spatial_1.Position.t], (id, components) => {
            let [, position] = components;
            let pos = this.viewport.transform(this.spatialCache.interpolatePosition(position, id, interp));
            const size = new vec2_1.Vec2(10, 10).multiply(this.viewport.scale);
            this.renderer.drawRect(pos.clone().subtract(size), pos.clone().add(size), DrawSelectedBox.props);
        });
    }
}
DrawSelectedBox.props = { stroke: "rgb(0, 255, 0)", lineWidth: 3 };
exports.DrawSelectedBox = DrawSelectedBox;
;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const vec2_1 = __webpack_require__(0);
class Velocity {
    constructor(vel) {
        this.vel = vel;
    }
    equal(other) {
        return this.vel.equal(other.vel);
    }
    clone() {
        return new Velocity(this.vel.clone());
    }
    serialize() {
        return [this.vel.x, this.vel.y];
    }
    static deserialize(data) {
        return new Velocity(new vec2_1.Vec2(data[0], data[1]));
    }
}
Velocity.t = "Velocity";
exports.Velocity = Velocity;
;
class AngularVelocity {
    constructor(vel) {
        this.vel = vel;
    }
    equal(other) {
        return this.vel === other.vel;
    }
    clone() {
        return new AngularVelocity(this.vel);
    }
    serialize() {
        return [this.vel];
    }
    static deserialize(data) {
        return new AngularVelocity(data[0]);
    }
}
AngularVelocity.t = "AngularVelocity";
exports.AngularVelocity = AngularVelocity;
;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(57)
var ieee754 = __webpack_require__(61)
var isArray = __webpack_require__(32)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

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
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
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

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
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
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
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
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class Targetable {
    equal(other) {
        return true;
    }
    clone() {
        return new Targetable();
    }
    serialize() {
        return [];
    }
    static deserialize(data) {
        return new Targetable();
    }
}
Targetable.t = "Targetable";
exports.Targetable = Targetable;
;
class AttackTarget {
    constructor() {
        this.target = null;
    }
    equal(other) {
        return this.target === other.target;
    }
    clone() {
        return AttackTarget.Make(this.target);
    }
    serialize() {
        return [this.target];
    }
    static deserialize(data) {
        return AttackTarget.Make(data[0]);
    }
    static Make(target) {
        let tgt = new AttackTarget();
        tgt.target = target;
        return tgt;
    }
}
AttackTarget.t = "AttackTarget";
exports.AttackTarget = AttackTarget;
;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
const vec2_1 = __webpack_require__(0);
const angle_1 = __webpack_require__(29);
class MoveToTarget {
    constructor() {
        this.target = null;
    }
    equal(other) {
        return (this.target !== null && other.target !== null && this.target.equal(other.target)) || (this.target === null && other.target === null);
    }
    clone() {
        return MoveToTarget.Make(this.target);
    }
    serialize() {
        return this.target ? [this.target.x, this.target.y] : [null];
    }
    static deserialize(data) {
        return MoveToTarget.Make(data[0] !== null
            ? new vec2_1.Vec2(data[0], data[1])
            : null);
    }
    static Make(target) {
        let tgt = new MoveToTarget();
        tgt.target = target;
        return tgt;
    }
}
MoveToTarget.t = "MoveToTarget";
exports.MoveToTarget = MoveToTarget;
;
class MoveTo {
    constructor(speed, angularSpeed) {
        this.speed = speed;
        this.angularSpeed = angularSpeed;
    }
    update(dt, world, deferred) {
        world.forEachEntity([spatial_1.Position.t, spatial_1.Rotation.t, kinematic_1.Velocity.t, kinematic_1.AngularVelocity.t, MoveToTarget.t], (id, components) => {
            let [position, rotation, velocity, angularVelocity, target] = components;
            if (target.target) {
                const toTarget = target.target.clone().subtract(position.pos);
                if (vec2_1.norm(toTarget) > 0.25) {
                    velocity.vel = toTarget.normalized().multiply(this.speed);
                    angularVelocity.vel = Math.sign(angle_1.angleDiff(rotation.angle, toTarget.angle())) * this.angularSpeed;
                }
                else {
                    target.target = null;
                }
            }
            else {
                velocity.vel = vec2_1.Vec2.zero.clone();
                angularVelocity.vel = 0;
            }
        });
    }
}
exports.MoveTo = MoveTo;
;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

(function (PlayerType) {
    PlayerType[PlayerType["Local"] = 0] = "Local";
    PlayerType[PlayerType["Ai"] = 1] = "Ai";
    PlayerType[PlayerType["Remote"] = 2] = "Remote";
})(exports.PlayerType || (exports.PlayerType = {}));
var PlayerType = exports.PlayerType;
;
class Player {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
}
exports.Player = Player;
;
class Controlled {
    constructor(player) {
        this.player = player;
    }
    equal(other) {
        return this.player.id === other.player.id;
    }
    clone() {
        return new Controlled(this.player);
    }
    serialize() {
        return [this.player.type, this.player.id];
    }
    static deserialize(data) {
        return new Controlled(new Player(data[0], data[1]));
    }
}
Controlled.t = "Controlled";
exports.Controlled = Controlled;
;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
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
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = __webpack_require__(22);
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(13);
util.inherits = __webpack_require__(8);
/*</replacement>*/

var Readable = __webpack_require__(34);
var Writable = __webpack_require__(24);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
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
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class Damageable {
    constructor(maxHitpoints) {
        this.maxHitpoints = maxHitpoints;
        this.hitpoints = maxHitpoints;
    }
    equal(other) {
        return this.hitpoints === other.hitpoints && this.maxHitpoints === other.maxHitpoints;
    }
    clone() {
        return Damageable.Make(this.maxHitpoints, this.hitpoints);
    }
    serialize() {
        return [this.maxHitpoints, this.hitpoints];
    }
    static deserialize(data) {
        return Damageable.Make(data[0], data[1]);
    }
    static Make(maxHitpoints, hitpoints) {
        let dmg = new Damageable(maxHitpoints);
        dmg.hitpoints = hitpoints;
        return dmg;
    }
}
Damageable.t = "Damageable";
exports.Damageable = Damageable;
;
class CheckDestroyed {
    update(dt, world, deferred) {
        world.forEachEntity([Damageable.t], (id, components) => {
            let [damageable] = components;
            if (damageable.hitpoints < 0) {
                deferred.push(() => { world.removeEntity(id); });
            }
        });
    }
}
exports.CheckDestroyed = CheckDestroyed;
;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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

process.nextTick = function (fun) {
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
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const selection_1 = __webpack_require__(2);
const attackTarget_1 = __webpack_require__(5);
const vec2_1 = __webpack_require__(0);
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
    MouseButton[MouseButton["Count"] = 3] = "Count";
})(exports.MouseButton || (exports.MouseButton = {}));
var MouseButton = exports.MouseButton;
;
function domButtonToMouseButton(button) {
    return button;
}
var ButtonState;
(function (ButtonState) {
    ButtonState[ButtonState["Up"] = 0] = "Up";
    ButtonState[ButtonState["Clicked"] = 1] = "Clicked";
    ButtonState[ButtonState["Dragged"] = 2] = "Dragged";
})(ButtonState || (ButtonState = {}));
;
var Events;
(function (Events) {
    class EntityClick {
    }
    Events.EntityClick = EntityClick;
    ;
    class MouseEvent {
    }
    Events.MouseEvent = MouseEvent;
    ;
    class MouseClick extends MouseEvent {
    }
    Events.MouseClick = MouseClick;
    ;
    class MouseDragStart extends MouseEvent {
    }
    Events.MouseDragStart = MouseDragStart;
    ;
    class MouseDragEnd extends MouseEvent {
    }
    Events.MouseDragEnd = MouseDragEnd;
    ;
    class MouseMove {
    }
    Events.MouseMove = MouseMove;
    ;
    class MouseScroll {
    }
    Events.MouseScroll = MouseScroll;
    ;
})(Events = exports.Events || (exports.Events = {}));
class Clickable {
    constructor(id, pos, radius) {
        this.id = id;
        this.pos = pos;
        this.radius = radius;
    }
}
;
class UiManager {
    constructor(rootElement, canvas) {
        this.rootElement = rootElement;
        this.canvas = canvas;
        this.mouseButtons = [ButtonState.Up, ButtonState.Up, ButtonState.Up];
        this.mousePos = new vec2_1.Vec2(0, 0);
        this.clickables = {};
        this.listeners = {
            entityclick: [],
            click: [],
            mousemove: [],
            dragstart: [],
            dragend: [],
            wheel: []
        };
        this.mousePos = new vec2_1.Vec2(this.canvas.width / 2, this.canvas.height / 2);
        canvas.addEventListener("mousedown", (e) => {
            this.mouseButtons[domButtonToMouseButton(e.button)] = ButtonState.Clicked;
        });
        canvas.addEventListener("mouseup", (e) => {
            let pos = new vec2_1.Vec2(e.clientX, e.clientY);
            let button = domButtonToMouseButton(e.button);
            if (this.mouseButtons[button] === ButtonState.Clicked) {
                const entities = Object.keys(this.clickables)
                    .filter(id => vec2_1.distance(this.clickables[id].pos, pos) < this.clickables[id].radius)
                    .map(id => this.clickables[id].id);
                if (entities.length > 0) {
                    this.invokeListeners("entityclick", { entities, button });
                }
                else {
                    this.invokeListeners("click", { pos, button });
                }
            }
            else if (this.mouseButtons[button] === ButtonState.Dragged) {
                this.invokeListeners("dragend", { pos, button });
            }
            this.mouseButtons[button] = ButtonState.Up;
        });
        canvas.addEventListener("wheel", (e) => {
            this.invokeListeners("wheel", { pos: this.mousePos ? this.mousePos.clone() : null, delta: Math.sign(e.deltaY) });
        });
        rootElement.addEventListener("mouseenter", (e) => {
            this.mousePos = new vec2_1.Vec2(e.clientX, e.clientY);
        });
        rootElement.addEventListener("mouseleave", (e) => {
            this.mousePos = null;
        });
        rootElement.addEventListener("mousemove", (e) => {
            const oldMousePos = this.mousePos.clone();
            const delta = oldMousePos.clone().subtract(new vec2_1.Vec2(e.clientX, e.clientY));
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            this.invokeListeners("mousemove", { pos: this.mousePos.clone(), delta });
            for (let i = MouseButton.Left; i < MouseButton.Count; ++i) {
                if (this.mouseButtons[i] === ButtonState.Clicked) {
                    this.invokeListeners("dragstart", { pos: oldMousePos, button: i });
                    this.mouseButtons[i] = ButtonState.Dragged;
                }
            }
        });
    }
    addEventListener(type, listener) {
        const normalizedType = type.toLowerCase();
        if (normalizedType in this.listeners)
            this.listeners[normalizedType].push(listener);
    }
    removeEventListener(type, listener) {
        const normalizedType = type.toLowerCase();
        if (normalizedType in this.listeners) {
            const index = this.listeners[normalizedType].indexOf(listener);
            if (index > -1)
                this.listeners[normalizedType].splice(index, 1);
        }
    }
    addElement(elem) {
        this.rootElement.appendChild(elem);
    }
    removeElement(elem) {
        this.rootElement.removeChild(elem);
    }
    canvasWidth() {
        return this.canvas.width;
    }
    canvasHeight() {
        return this.canvas.height;
    }
    canvasDimensions() {
        return new vec2_1.Vec2(this.canvasWidth(), this.canvasHeight());
    }
    mousePosition() {
        return this.mousePos;
    }
    updateClickables(world, spatialCache, interp, viewport) {
        this.clickables = {};
        world.forEachEntity([spatial_1.Position.t], (id, components) => {
            let [position] = components;
            if (world.getComponent(id, selection_1.Selectable.t) || world.getComponent(id, attackTarget_1.Targetable.t)) {
                let pos = viewport.transform(spatialCache.interpolatePosition(position, id, interp));
                this.clickables[id] = new Clickable(id, pos, 15);
            }
        });
    }
    invokeListeners(type, e) {
        if (!(type in this.listeners))
            return;
        for (let listener of this.listeners[type])
            listener(e);
    }
}
exports.UiManager = UiManager;
;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
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

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).Buffer))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const entities_1 = __webpack_require__(27);
const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
const attackTarget_1 = __webpack_require__(5);
const tracerEffect_1 = __webpack_require__(20);
const projectile_1 = __webpack_require__(18);
const vec2_1 = __webpack_require__(0);
const intercept_1 = __webpack_require__(30);
class Armed {
    constructor(cooldown, range, projectileSpeed, damage) {
        this.cooldown = cooldown;
        this.range = range;
        this.projectileSpeed = projectileSpeed;
        this.damage = damage;
        this.cooldownRemaining = 0;
    }
}
Armed.t = "Armed";
exports.Armed = Armed;
;
class Shooting {
    update(dt, world, deferred) {
        world.forEachEntity([spatial_1.Position.t, attackTarget_1.AttackTarget.t, Armed.t], (id, components) => {
            let [position, target, armed] = components;
            armed.cooldownRemaining = armed.cooldownRemaining - dt;
            let delta = 0;
            if (armed.cooldownRemaining < 0) {
                delta = -armed.cooldownRemaining;
                armed.cooldownRemaining = 0;
            }
            else if (armed.cooldownRemaining > 0)
                return;
            if (!world.containsEntity(target.target)) {
                target.target = null;
                return;
            }
            let targetId = target.target;
            let targetPos = world.getComponent(targetId, spatial_1.Position.t);
            let toTarget = targetPos.pos.clone().subtract(position.pos);
            if (vec2_1.norm(toTarget) > armed.range)
                return;
            let targetVel = world.getComponent(targetId, kinematic_1.Velocity.t);
            armed.cooldownRemaining = Math.max(armed.cooldown - delta, 0);
            deferred.push((world) => {
                let intercept = intercept_1.interceptVector(targetPos.pos, targetVel ? targetVel.vel : vec2_1.Vec2.zero, position.pos, armed.projectileSpeed);
                let initialVelocity = intercept ? intercept : toTarget.normalized().multiply(armed.projectileSpeed);
                let projectile = {
                    [spatial_1.Position.t]: new spatial_1.Position(position.pos.clone()),
                    [spatial_1.Rotation.t]: new spatial_1.Rotation(initialVelocity.angle()),
                    [kinematic_1.Velocity.t]: new kinematic_1.Velocity(initialVelocity),
                    [tracerEffect_1.TracerEffect.t]: new tracerEffect_1.TracerEffect(),
                    [projectile_1.Projectile.t]: new projectile_1.Projectile(targetId, armed.range, armed.projectileSpeed, armed.damage)
                };
                world.addEntity(entities_1.World.nextEntityId(), projectile);
            });
        });
    }
}
exports.Shooting = Shooting;
;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class Named {
    constructor(name) {
        this.name = name;
    }
    equal(other) {
        return this.name === other.name;
    }
    clone() {
        return new Named(this.name);
    }
    serialize() {
        return [this.name];
    }
    static deserialize(data) {
        return new Named(data[0]);
    }
}
Named.t = "Named";
exports.Named = Named;
;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
const damageable_1 = __webpack_require__(10);
const vec2_1 = __webpack_require__(0);
const intercept_1 = __webpack_require__(30);
class Projectile {
    constructor(target, range, speed, damage) {
        this.target = target;
        this.speed = speed;
        this.damage = damage;
        this.lifetime = 0;
        this.lifetime = range / speed;
    }
}
Projectile.t = "Projectile";
exports.Projectile = Projectile;
;
class MoveProjectiles {
    update(dt, world, deferred) {
        world.forEachEntity([spatial_1.Position.t, spatial_1.Rotation.t, kinematic_1.Velocity.t, Projectile.t], (id, components) => {
            let [position, rotation, velocity, projectile] = components;
            if (projectile.lifetime < 0) {
                deferred.push((world) => { world.removeEntity(id); });
                return;
            }
            projectile.lifetime -= dt;
            if (!world.containsEntity(projectile.target)) {
                projectile.target = null;
                return;
            }
            let [targetPos, targetVel] = world.getComponents(projectile.target, [spatial_1.Position.t, kinematic_1.Velocity.t]);
            let [damageable] = world.getOptionalComponents(projectile.target, [damageable_1.Damageable.t]);
            if (vec2_1.distance(targetPos.pos, position.pos) < 5) {
                if (damageable)
                    damageable.hitpoints -= projectile.damage;
                deferred.push((world) => { world.removeEntity(id); });
                return;
            }
            const intercept = intercept_1.interceptVector(targetPos.pos, targetVel.vel, position.pos, projectile.speed);
            if (intercept) {
                velocity.vel = intercept;
                rotation.angle = intercept.angle();
            }
        });
    }
}
exports.MoveProjectiles = MoveProjectiles;
;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const static_1 = __webpack_require__(26);
class RenderShape {
    constructor(shape) {
        this.shape = shape;
    }
    equal(other) {
        return this.shape === other.shape;
    }
    clone() {
        return new RenderShape(this.shape);
    }
    serialize() {
        return [this.shape === static_1.Static.Ship ? "Ship" : "NeutralShip"];
    }
    static deserialize(data) {
        return new RenderShape(static_1.Static[data[0]]);
    }
}
RenderShape.t = "RenderShape";
exports.RenderShape = RenderShape;
;
class ShapeRenderer {
    constructor(spatialCache, renderer, viewport) {
        this.spatialCache = spatialCache;
        this.renderer = renderer;
        this.viewport = viewport;
    }
    update(dt, interp, world, inputQueue, deferred) {
        world.forEachEntity([RenderShape.t, spatial_1.Position.t], (id, components) => {
            let [shape, position] = components;
            let rotation = world.getComponent(id, spatial_1.Rotation.t);
            this.renderer.drawShape(shape.shape, this.spatialCache.interpolatePosition(position, id, interp), rotation ? this.spatialCache.interpolateRotation(rotation, id, interp) : 0, 1, this.viewport);
        });
    }
}
exports.ShapeRenderer = ShapeRenderer;
;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
class TracerEffect {
    equal(other) {
        return true;
    }
    clone() {
        return new TracerEffect();
    }
    serialize() {
        return [];
    }
    static deserialize(data) {
        return new TracerEffect();
    }
}
TracerEffect.t = "TracerEffect";
exports.TracerEffect = TracerEffect;
;
class RenderTracer {
    constructor(spatialCache, renderer, viewport) {
        this.spatialCache = spatialCache;
        this.renderer = renderer;
        this.viewport = viewport;
    }
    update(dt, interp, world, inputQueue, deferred) {
        world.forEachEntity([spatial_1.Position.t, kinematic_1.Velocity.t, TracerEffect.t], (id, components) => {
            let [position, velocity,] = components;
            const pos = this.spatialCache.interpolatePosition(position, id, interp);
            const end = pos.clone().add(velocity.vel.clone().multiply(1 / 60));
            this.renderer.drawLine(pos, end, RenderTracer.tracerProps, this.viewport);
        });
    }
}
RenderTracer.tracerProps = { stroke: "rgb(245, 245, 220)", lineWidth: 2.5 };
exports.RenderTracer = RenderTracer;
;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var buffer = __webpack_require__(4);
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(9);

/*<replacement>*/
var util = __webpack_require__(13);
util.inherits = __webpack_require__(8);
/*</replacement>*/

util.inherits(Transform, Duplex);

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

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
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
  throw new Error('_transform() is not implemented');
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
};

// Doesn't matter what the args are here.
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

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



module.exports = Writable;

/*<replacement>*/
var processNextTick = __webpack_require__(22);
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(13);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(72)
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = __webpack_require__(25);
  } catch (_) {} finally {
    if (!Stream) Stream = __webpack_require__(15).EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = __webpack_require__(4).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(21);
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(9);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
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
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(9);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
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
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
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
  if (sync) processNextTick(cb, er);else cb(er);

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
      asyncWrite(afterWrite, stream, state, finished, cb);
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
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
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

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
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
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
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
  cb(new Error('_write() is not implemented'));
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

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
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
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(71).setImmediate))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

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

module.exports = Stream;

var EE = __webpack_require__(15).EventEmitter;
var inherits = __webpack_require__(8);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(35);
Stream.Writable = __webpack_require__(68);
Stream.Duplex = __webpack_require__(64);
Stream.Transform = __webpack_require__(67);
Stream.PassThrough = __webpack_require__(66);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
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

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
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
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
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

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
const shapeRenderer_1 = __webpack_require__(19);
const moveTo_1 = __webpack_require__(6);
const selection_1 = __webpack_require__(2);
const named_1 = __webpack_require__(17);
const playable_1 = __webpack_require__(7);
const attackTarget_1 = __webpack_require__(5);
const armed_1 = __webpack_require__(16);
const damageable_1 = __webpack_require__(10);
const shape_1 = __webpack_require__(42);
const vec2_1 = __webpack_require__(0);
class Static {
    static makeShip(pos, rot, name, shape, player) {
        return {
            [spatial_1.Position.t]: new spatial_1.Position(pos),
            [spatial_1.Rotation.t]: new spatial_1.Rotation(rot),
            [kinematic_1.Velocity.t]: new kinematic_1.Velocity(new vec2_1.Vec2(0, 0)),
            [kinematic_1.AngularVelocity.t]: new kinematic_1.AngularVelocity(0),
            [shapeRenderer_1.RenderShape.t]: new shapeRenderer_1.RenderShape(shape),
            [moveTo_1.MoveToTarget.t]: new moveTo_1.MoveToTarget(),
            [selection_1.Selectable.t]: new selection_1.Selectable(),
            [named_1.Named.t]: new named_1.Named(name),
            [playable_1.Controlled.t]: new playable_1.Controlled(player),
            [attackTarget_1.Targetable.t]: new attackTarget_1.Targetable(),
            [attackTarget_1.AttackTarget.t]: new attackTarget_1.AttackTarget(),
            [armed_1.Armed.t]: new armed_1.Armed(0.75, 1000, 350, 20),
            [damageable_1.Damageable.t]: new damageable_1.Damageable(300)
        };
    }
    ;
}
Static.Box = new shape_1.Shape({
    stroke: "black",
    lineWidth: 5,
    fillColor: "gray"
}, [new vec2_1.Vec2(-35, -35), new vec2_1.Vec2(-25, 25), new vec2_1.Vec2(25, 25), new vec2_1.Vec2(25, -25)]);
Static.shipVertices = [new vec2_1.Vec2(0, -15), new vec2_1.Vec2(-12, 15), new vec2_1.Vec2(0, 10.5), new vec2_1.Vec2(12, 15)];
Static.Ship = new shape_1.Shape({
    stroke: "hsla(207, 100%, 60%, 1)",
    lineWidth: 3,
    fillColor: "hsla(207, 100%, 30%, 0.8)"
}, Static.shipVertices);
Static.NeutralShip = new shape_1.Shape({
    stroke: "hsla(120, 100%, 60%, 1)",
    lineWidth: 3,
    fillColor: "hsla(120, 100%, 30%, 0.8)"
}, Static.shipVertices);
exports.Static = Static;
;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function delta(lhs, rhs) {
    let result = new Map();
    for (let [id, newComponent] of rhs.entries()) {
        let oldComponent = lhs.get(id);
        if (!oldComponent || !oldComponent.equal(newComponent)) {
            result.set(id, newComponent);
        }
    }
    for (let id of lhs.keys()) {
        if (!rhs.has(id)) {
            result.set(id, null);
        }
    }
    return result;
}
exports.delta = delta;
;
function applyDelta(components, delta) {
    for (let [id, newComponent] of delta.entries()) {
        if (newComponent === null) {
            components.delete(id);
        }
        else {
            components.set(id, newComponent);
        }
    }
}
exports.applyDelta = applyDelta;
;
function clone(components) {
    let clone = new Map();
    for (let [id, component] of components.entries()) {
        clone.set(id, component.clone());
    }
    return clone;
}
exports.clone = clone;
;
function serialize(components) {
    let result = [];
    for (let [id, component] of components.entries()) {
        result.push([id, component !== null ? component.serialize() : null]);
    }
    return result;
}
exports.serialize = serialize;
;
function deserialize(data, deserializer) {
    return new Map(data.map((item) => [item[0], item[1] !== null ? deserializer(item[1]) : null]));
}
exports.deserialize = deserialize;
;
class World {
    constructor(types) {
        const makeComponentStorage = (type) => [type, new Map()];
        this.componentData = new Map(types.map(makeComponentStorage));
    }
    static nextEntityId() {
        return World.EntityId++;
    }
    addEntity(id, components) {
        Object.keys(components).forEach(type => this.componentData.get(type).set(id, components[type]));
    }
    removeEntity(id) {
        for (let data of this.componentData.values())
            data.delete(id);
    }
    containsEntity(id) {
        for (let data of this.componentData.values()) {
            if (data.has(id))
                return true;
        }
        return false;
    }
    addComponent(id, type, component) {
        this.componentData.get(type).set(id, component);
    }
    removeComponent(id, type) {
        this.componentData.get(type).delete(id);
    }
    getComponent(id, type) {
        let data = this.componentData.get(type);
        let component = data ? data.get(id) : null;
        return component ? component : null;
    }
    forEachEntity(types, callback) {
        for (let id of this.findSmallestComponentFromTypes(types).keys()) {
            let components = this.getComponents(id, types);
            if (components)
                callback(id, components);
        }
    }
    getComponents(id, types) {
        let components = [];
        for (let type of types) {
            let component = this.componentData.get(type).get(id);
            if (!component)
                return null;
            components.push(component);
        }
        return components;
    }
    ;
    getOptionalComponents(id, types) {
        return types.map(type => this.getComponent(id, type));
    }
    getSnapshot(types) {
        const typeToKvPair = (type) => [type, clone(this.componentData.get(type))];
        return new Map(types.map(typeToKvPair));
    }
    replaceSnapshot(snapshot) {
        for (let [key, value] of snapshot.entries()) {
            this.componentData.set(key, clone(value));
        }
    }
    findSmallestComponentFromTypes(types) {
        let minSize = Number.POSITIVE_INFINITY;
        let minElement = null;
        for (let type of types) {
            let data = this.componentData.get(type);
            if (data && data.size < minSize) {
                minSize = data.size;
                minElement = data;
            }
        }
        if (minElement === null)
            console.log(types);
        return minElement;
    }
}
World.EntityId = 0;
exports.World = World;
;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const vec2_1 = __webpack_require__(0);
;
class Viewport {
    constructor(pos, rot, scale) {
        this.pos = pos;
        this.rot = rot;
        this.scale = scale;
    }
    transform(v) {
        return v.rotated(this.rot).multiply(this.scale).add(this.pos);
    }
    inverseTransform(v) {
        return v.clone().subtract(this.pos).multiply(1 / this.scale).rotate(-this.rot);
    }
}
Viewport.identity = new Viewport(vec2_1.Vec2.zero, 0, 1);
exports.Viewport = Viewport;
;
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
    }
    drawShape(shape, pos, rot, scale, viewport = Viewport.identity) {
        this.setTransform(viewport.transform(pos), rot + viewport.rot, scale * viewport.scale);
        this.setProps(shape.props);
        this.ctx.beginPath();
        this.ctx.moveTo(shape.vertices[0].x, shape.vertices[0].y);
        for (let i = 1; i < shape.vertices.length; ++i) {
            this.ctx.lineTo(shape.vertices[i].x, shape.vertices[i].y);
        }
        this.ctx.closePath();
        this.render(shape.props);
    }
    drawLine(a, b, props = {}, viewport = Viewport.identity) {
        this.setViewport(viewport);
        this.setProps(props);
        let oldDash = [];
        if (props.lineDash) {
            oldDash = this.ctx.getLineDash();
            this.ctx.setLineDash(props.lineDash);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.render(props);
        if (props.lineDash) {
            this.ctx.setLineDash(oldDash);
        }
    }
    drawRect(a, b, props = {}, viewport = Viewport.identity) {
        this.setViewport(viewport);
        this.setProps(props);
        const x = Math.min(a.x, b.x);
        const y = Math.min(a.y, b.y);
        const w = Math.abs(b.x - a.x);
        const h = Math.abs(b.y - a.y);
        if (props.fillColor) {
            this.ctx.fillRect(x, y, w, h);
        }
        if (props.stroke) {
            this.ctx.strokeRect(x, y, w, h);
        }
    }
    drawCircle(center, radius, props = {}, viewport = Viewport.identity) {
        this.setViewport(viewport);
        this.setProps(props);
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.render(props);
    }
    clear() {
        this.setIdentityTransform();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    setProps(props) {
        if (props.fillColor) {
            this.ctx.fillStyle = props.fillColor;
        }
        if (props.stroke) {
            this.ctx.strokeStyle = props.stroke;
            if (props.lineWidth) {
                this.ctx.lineWidth = props.lineWidth;
            }
        }
    }
    render(props) {
        if (props.fillColor) {
            this.ctx.fill();
        }
        if (props.stroke) {
            this.ctx.stroke();
        }
    }
    setViewport(viewport) {
        if (viewport == Viewport.identity) {
            this.setIdentityTransform();
        }
        else {
            this.setTransform(viewport.pos, viewport.rot, viewport.scale);
        }
    }
    setIdentityTransform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    setTransform(pos, rot, scale) {
        const xx = scale * Math.cos(rot);
        const xy = scale * Math.sin(rot);
        this.ctx.setTransform(xx, xy, -xy, xx, pos.x, pos.y);
    }
}
exports.Renderer = Renderer;
;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function fmod(a, b) {
    return a - Math.floor(a / b) * b;
}
function wrapAngle(a) {
    a = fmod(a, 2 * Math.PI);
    if (a < 0) {
        a += 2 * Math.PI;
    }
    return a;
}
exports.wrapAngle = wrapAngle;
;
function angleDiff(a, b) {
    const diff = fmod(b - a + Math.PI, 2 * Math.PI);
    return diff + (diff < 0 ? Math.PI : -Math.PI);
}
exports.angleDiff = angleDiff;
;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const vec2_1 = __webpack_require__(0);
function interceptVector(targetPos, targetVel, initialPos, speed) {
    if (speed <= 0)
        return null;
    const toTarget = targetPos.clone().subtract(initialPos);
    const a = vec2_1.norm2(targetVel) - speed * speed;
    const b = 2 * vec2_1.dot(targetVel, toTarget);
    const c = vec2_1.norm2(toTarget);
    if (a == 0) {
        const t = -c / b;
        return t > 0 ? toTarget.multiply(1 / t).add(targetVel).normalize().multiply(speed) : null;
    }
    const D = b * b - 4 * a * c;
    if (D < 0)
        return null;
    const t1 = (-b - Math.sqrt(D)) / (2 * a);
    const t2 = (-b + Math.sqrt(D)) / (2 * a);
    const t = t1 > 0 && t1 > t2 ? t1 : t2;
    return t > 0 ? toTarget.multiply(1 / t).add(targetVel).normalize().multiply(speed) : null;
}
exports.interceptVector = interceptVector;
;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

;
class VdomElement {
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
    static create(type, props, ...children) {
        return { type, props, children: children.filter(value => value !== null) };
    }
}
exports.VdomElement = VdomElement;
;
function isEventProp(name) {
    return /^on/.test(name);
}
function extractEventName(name) {
    return name.slice(2).toLowerCase();
}
function setProp($target, name, value) {
    if (!isEventProp(name)) {
        if (typeof value === "string") {
            $target.setAttribute(name, value);
        }
        else if (typeof value === "boolean") {
            if (value) {
                $target.setAttribute(name, "");
            }
            $target[name] = true;
        }
    }
}
function setProps($target, props) {
    Object.keys(props).forEach(name => setProp($target, name, props[name]));
}
function removeProp($target, name, oldValue) {
    if (!isEventProp(name)) {
        $target.removeAttribute(name);
        if (typeof oldValue === "boolean") {
            $target[name] = false;
        }
    }
}
function updateProp($target, name, newValue, oldValue) {
    if (!newValue) {
        removeProp($target, name, oldValue);
    }
    else if (!oldValue || oldValue !== newValue) {
        setProp($target, name, newValue);
    }
}
function updateProps($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => updateProp($target, name, newProps[name], oldProps[name]));
}
function addEventListeners($target, props) {
    Object.keys(props).forEach(name => {
        if (isEventProp(name))
            $target.addEventListener(extractEventName(name), props[name]);
    });
}
function isElement(node) {
    return node.type !== undefined;
}
function createElement(node) {
    if (typeof node === "string") {
        return document.createTextNode(node);
    }
    else {
        const $element = document.createElement(node.type);
        setProps($element, node.props);
        addEventListeners($element, node.props);
        node.children.map(createElement).forEach($child => $element.appendChild($child));
        return $element;
    }
}
exports.createElement = createElement;
function nodeTypeChanged(newNode, oldNode) {
    return typeof newNode !== typeof oldNode
        || typeof newNode === "string" && newNode !== oldNode
        || newNode.type !== oldNode.type;
}
function updateElementChildren($element, newNode, oldNode) {
    for (let i = 0; i < Math.min(newNode.children.length, oldNode.children.length); ++i) {
        if (nodeTypeChanged(newNode.children[i], oldNode.children[i])) {
            $element.replaceChild(createElement(newNode.children[i]), $element.childNodes[i]);
        }
        else if (isElement(newNode.children[i])) {
            updateProps($element.childNodes[i], newNode.children[i].props, oldNode.children[i].props);
            updateElementChildren($element.childNodes[i], newNode.children[i], oldNode.children[i]);
        }
    }
    if (oldNode.children.length > newNode.children.length) {
        for (let i = oldNode.children.length - 1; i >= newNode.children.length; --i)
            $element.removeChild($element.childNodes[i]);
    }
    else if (newNode.children.length > oldNode.children.length) {
        for (let i = oldNode.children.length; i < newNode.children.length; ++i)
            $element.appendChild(createElement(newNode.children[i]));
    }
}
exports.updateElementChildren = updateElementChildren;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(23);

/*<replacement>*/
var util = __webpack_require__(13);
util.inherits = __webpack_require__(8);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

module.exports = Readable;

/*<replacement>*/
var processNextTick = __webpack_require__(22);
/*</replacement>*/

/*<replacement>*/
var isArray = __webpack_require__(32);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(15).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = __webpack_require__(25);
  } catch (_) {} finally {
    if (!Stream) Stream = __webpack_require__(15).EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = __webpack_require__(4).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(21);
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(13);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(73);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(65);
var StringDecoder;

util.inherits(Readable, Stream);

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
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(9);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(36).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(9);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
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

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
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
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(36).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
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
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
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
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
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
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
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
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
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

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

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
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
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
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
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
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
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
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
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
}

// pause() and resume() are remnants of the legacy readable stream API
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
    processNextTick(resume_, stream, state);
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
}

// wrap an old-style stream as the async data source.
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
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
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
}

// Extracts only enough buffered data to satisfy the amount requested.
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
}

// Copies a specified amount of characters from the list of buffered data
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
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = bufferShim.allocUnsafe(n);
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
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var Stream = (function (){
  try {
    return __webpack_require__(25); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = __webpack_require__(34);
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(24);
exports.Duplex = __webpack_require__(9);
exports.Transform = __webpack_require__(23);
exports.PassThrough = __webpack_require__(33);

if (!process.browser && __webpack_require__.i({"ENV":"production"}).READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

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

var Buffer = __webpack_require__(4).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
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
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

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


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const game_1 = __webpack_require__(40);
const uiManager_1 = __webpack_require__(12);
const renderer_1 = __webpack_require__(28);
const Fullscreen = __webpack_require__(55);
const vdom_1 = __webpack_require__(31);
const Network = __webpack_require__(41);
var AppState;
(function (AppState) {
    AppState[AppState["MainMenu"] = 0] = "MainMenu";
    AppState[AppState["HostMp"] = 1] = "HostMp";
    AppState[AppState["JoinMp"] = 2] = "JoinMp";
})(AppState || (AppState = {}));
;
function encodeData(data) {
    return window.btoa(JSON.stringify(data));
}
;
function decodeData(data) {
    return JSON.parse(window.atob(data));
}
;
class App {
    constructor($root) {
        this.$root = $root;
        this.connection = null;
        this.root = null;
        this.state = AppState.MainMenu;
        this.root = vdom_1.VdomElement.create(this.$root.tagName, {});
        this.render();
    }
    static mount($root) {
        $root.addEventListener("contextmenu", (e) => { e.preventDefault(); });
        return new App($root);
    }
    readyGame(fullscreen) {
        let canvas = document.createElement("canvas");
        if (Fullscreen.fullscreenAvailable()) {
            if (fullscreen)
                Fullscreen.setFullscreen(this.$root);
            document.addEventListener("keydown", (e) => {
                if (e.keyCode !== 13)
                    return;
                if (Fullscreen.isFullscreen()) {
                    Fullscreen.disableFullscreen();
                }
                else {
                    Fullscreen.setFullscreen(this.$root);
                }
            });
        }
        let resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        while (this.$root.firstChild)
            this.$root.removeChild(this.$root.firstChild);
        this.$root.appendChild(canvas);
        let renderer = new renderer_1.Renderer(canvas);
        let ui = new uiManager_1.UiManager(this.$root, canvas);
        return new game_1.Game(ui, renderer);
    }
    render() {
        let elems = vdom_1.VdomElement.create(this.$root.tagName, {}, vdom_1.VdomElement.create("div", { "class": "title" }, "Ships"), vdom_1.VdomElement.create("div", { "class": "menu" }, {
            [AppState.MainMenu]: () => this.renderMainMenu(),
            [AppState.HostMp]: () => this.renderHostMpScreen(),
            [AppState.JoinMp]: () => this.renderJoinMpScreen()
        }[this.state]()), vdom_1.VdomElement.create("div", { "class": "fullscreen" }, vdom_1.VdomElement.create("input", { "id": "fullscreen", "type": "checkbox" }), vdom_1.VdomElement.create("label", { "for": "fullscreen" }, "Start fullscreen")));
        vdom_1.updateElementChildren(this.$root, elems, this.root);
        this.root = elems;
    }
    renderMainMenu() {
        return vdom_1.VdomElement.create("ul", {}, this.renderButton("Start singleplayer game", (e) => {
            let game = this.readyGame(document.getElementById("fullscreen").checked);
            game.startSingleplayer(60);
        }), this.renderButton("Host multiplayer game", (e) => {
            this.switchState(AppState.HostMp);
            this.connection = new Network.Server((data) => {
                document.getElementById("offer").value = encodeData(data);
            });
        }), this.renderButton("Join multiplayer game", (e) => {
            this.switchState(AppState.JoinMp);
        }));
    }
    renderHostMpScreen() {
        return vdom_1.VdomElement.create("div", {}, vdom_1.VdomElement.create("label", { "for": "offer" }, "Offer:"), vdom_1.VdomElement.create("textarea", { "id": "offer", "rows": "10", "cols": "50", "readonly": true }), vdom_1.VdomElement.create("label", { "for": "answer" }, "Answer:"), vdom_1.VdomElement.create("textarea", { "id": "answer", "rows": "10", "cols": "50" }), vdom_1.VdomElement.create("ul", {}, this.renderButton("Start", (e) => {
            let server = this.connection;
            server.acceptConnection(decodeData(document.getElementById("answer").value));
            server.onConnect(() => {
                let game = this.readyGame(document.getElementById("fullscreen").checked);
                game.startMultiplayerHost(60, 10, server);
            });
        }), this.renderButton("Back", (e) => {
            this.switchState(AppState.MainMenu);
            this.connection.destroy();
            this.connection = null;
        })));
    }
    renderJoinMpScreen() {
        return vdom_1.VdomElement.create("div", {}, vdom_1.VdomElement.create("label", { "for": "offer" }, "Offer:"), vdom_1.VdomElement.create("textarea", { "id": "offer", "rows": "10", "cols": "50" }), vdom_1.VdomElement.create("label", { "for": "answer" }, "Answer:"), vdom_1.VdomElement.create("textarea", { "id": "answer", "rows": "10", "cols": "50", "readonly": true }), vdom_1.VdomElement.create("ul", {}, this.renderButton("Generate answer", (e) => {
            let client = new Network.Client(decodeData(document.getElementById("offer").value), (data) => {
                document.getElementById("answer").value = encodeData(data);
            });
            client.onConnect(() => {
                let game = this.readyGame(document.getElementById("fullscreen").checked);
                game.startMultiplayerClient(60, 10, client);
            });
            this.connection = client;
        }), this.renderButton("Back", (e) => {
            this.switchState(AppState.MainMenu);
            if (this.connection) {
                this.connection.destroy();
                this.connection = null;
            }
        })));
    }
    renderButton(text, onclick) {
        return vdom_1.VdomElement.create("li", {}, vdom_1.VdomElement.create("a", {
            "href": "",
            "class": "btn",
            "onclick": (e) => {
                onclick(e);
                e.preventDefault();
            }
        }, text));
    }
    switchState(state) {
        if (this.state !== state) {
            this.state = state;
            this.render();
        }
    }
}
exports.App = App;
;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class Deferred {
    constructor() {
        this.queue = [];
    }
    push(fn) {
        this.queue.push(fn);
    }
    flush(world) {
        for (let fn of this.queue) {
            fn(world);
        }
        this.queue = [];
    }
}
exports.Deferred = Deferred;
;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const entities_1 = __webpack_require__(27);
const deferred_1 = __webpack_require__(39);
const spatialCache_1 = __webpack_require__(50);
const moveKinematic_1 = __webpack_require__(43);
const moveTo_1 = __webpack_require__(6);
const randomMoveTarget_1 = __webpack_require__(46);
const renderMoveTarget_1 = __webpack_require__(49);
const orderMove_1 = __webpack_require__(45);
const selection_1 = __webpack_require__(2);
const shapeRenderer_1 = __webpack_require__(19);
const statusWindow_1 = __webpack_require__(51);
const viewportController_1 = __webpack_require__(52);
const playable_1 = __webpack_require__(7);
const renderAttackTarget_1 = __webpack_require__(47);
const orderAttack_1 = __webpack_require__(44);
const armed_1 = __webpack_require__(16);
const projectile_1 = __webpack_require__(18);
const damageable_1 = __webpack_require__(10);
const tracerEffect_1 = __webpack_require__(20);
const renderHealthBar_1 = __webpack_require__(48);
const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
const shapeRenderer_2 = __webpack_require__(19);
const moveTo_2 = __webpack_require__(6);
const selection_2 = __webpack_require__(2);
const named_1 = __webpack_require__(17);
const playable_2 = __webpack_require__(7);
const attackTarget_1 = __webpack_require__(5);
const armed_2 = __webpack_require__(16);
const damageable_2 = __webpack_require__(10);
const tracerEffect_2 = __webpack_require__(20);
const projectile_2 = __webpack_require__(18);
const userInputQueue_1 = __webpack_require__(53);
const renderer_1 = __webpack_require__(28);
const vec2_1 = __webpack_require__(0);
const static_1 = __webpack_require__(26);
const shuffle_1 = __webpack_require__(56);
var MessageType;
(function (MessageType) {
    MessageType[MessageType["ServerUpdate"] = 0] = "ServerUpdate";
    MessageType[MessageType["ServerUpdateAck"] = 1] = "ServerUpdateAck";
    MessageType[MessageType["ClientUpdate"] = 2] = "ClientUpdate";
    MessageType[MessageType["ClientUpdateAck"] = 3] = "ClientUpdateAck";
})(MessageType || (MessageType = {}));
;
class Game {
    constructor(ui, renderer) {
        this.ui = ui;
        this.renderer = renderer;
        this.lastUpdate = 0;
        this.lastDraw = 0;
        this.fps = 0;
        this.componentTypes = [];
        this.networkComponentTypes = [];
        this.networkComponentDeserializers = null;
        this.networkEventTypes = [];
        this.networkEventDeserializers = null;
        this.world = null;
        this.spatialCache = new spatialCache_1.SpatialCache();
        this.updateSystems = [];
        this.renderSystems = [];
        this.viewport = renderer_1.Viewport.identity;
        this.players = [];
        this.inputQueue = new userInputQueue_1.UserInputQueue();
        this.players = [new playable_1.Player(playable_1.PlayerType.Local, 0), new playable_1.Player(playable_1.PlayerType.Ai, 1)];
        this.viewport = new renderer_1.Viewport(new vec2_1.Vec2(0, 0), 0, 1);
        this.componentTypes = [
            spatial_1.Position.t,
            spatial_1.Rotation.t,
            kinematic_1.Velocity.t,
            kinematic_1.AngularVelocity.t,
            shapeRenderer_2.RenderShape.t,
            moveTo_2.MoveToTarget.t,
            selection_2.Selectable.t,
            selection_2.Selected.t,
            named_1.Named.t,
            playable_2.Controlled.t,
            attackTarget_1.Targetable.t,
            attackTarget_1.AttackTarget.t,
            armed_2.Armed.t,
            damageable_2.Damageable.t,
            tracerEffect_2.TracerEffect.t,
            projectile_2.Projectile.t
        ];
        this.networkComponentTypes = [
            spatial_1.Position.t,
            spatial_1.Rotation.t,
            kinematic_1.Velocity.t,
            kinematic_1.AngularVelocity.t,
            shapeRenderer_2.RenderShape.t,
            moveTo_2.MoveToTarget.t,
            selection_2.Selectable.t,
            named_1.Named.t,
            playable_2.Controlled.t,
            attackTarget_1.Targetable.t,
            attackTarget_1.AttackTarget.t,
            damageable_2.Damageable.t,
            tracerEffect_2.TracerEffect.t
        ];
        this.networkComponentDeserializers = new Map([
            [spatial_1.Position.t, spatial_1.Position.deserialize],
            [spatial_1.Rotation.t, spatial_1.Rotation.deserialize],
            [kinematic_1.Velocity.t, kinematic_1.Velocity.deserialize],
            [kinematic_1.AngularVelocity.t, kinematic_1.AngularVelocity.deserialize],
            [shapeRenderer_2.RenderShape.t, shapeRenderer_2.RenderShape.deserialize],
            [moveTo_2.MoveToTarget.t, moveTo_2.MoveToTarget.deserialize],
            [selection_2.Selectable.t, selection_2.Selectable.deserialize],
            [named_1.Named.t, named_1.Named.deserialize],
            [playable_2.Controlled.t, playable_2.Controlled.deserialize],
            [attackTarget_1.Targetable.t, attackTarget_1.Targetable.deserialize],
            [attackTarget_1.AttackTarget.t, attackTarget_1.AttackTarget.deserialize],
            [damageable_2.Damageable.t, damageable_2.Damageable.deserialize],
            [tracerEffect_2.TracerEffect.t, tracerEffect_2.TracerEffect.deserialize]
        ]);
        this.networkEventTypes = [
            orderAttack_1.AttackOrder.t,
            orderMove_1.MoveOrder.t
        ];
        this.networkEventDeserializers = new Map([
            [orderAttack_1.AttackOrder.t, orderAttack_1.AttackOrder.deserialize],
            [orderMove_1.MoveOrder.t, orderMove_1.MoveOrder.deserialize]
        ]);
        this.world = new entities_1.World(this.componentTypes);
    }
    startSingleplayer(fps) {
        this.setUpSingleplayerSystems();
        this.fps = fps;
        this.lastUpdate = performance.now();
        this.lastDraw = performance.now();
        let updateFn = () => {
            setTimeout(updateFn, 1000 / this.fps);
            const now = performance.now();
            const dt = (now - this.lastUpdate) / 1000;
            this.lastUpdate = now;
            this.spatialCache.update(this.world);
            this.update(dt);
        };
        let drawFn = (now) => {
            requestAnimationFrame(drawFn);
            const dt = (now - this.lastDraw) / 1000;
            this.lastDraw = now;
            const interp = this.fps * (now - this.lastUpdate) / 1000;
            this.ui.updateClickables(this.world, this.spatialCache, interp, this.viewport);
            this.draw(dt, interp);
        };
        this.setUpScenario();
        setTimeout(updateFn, 1000 / this.fps);
        requestAnimationFrame(drawFn);
    }
    startMultiplayerHost(fps, netTickRate, server) {
        this.setUpHostSystems();
        let dummySnapshot = this.makeEmptyNetworkSnapshot();
        let snapshotHistory = [];
        let serverAckCounter = 0;
        let clientAckCounter = -1;
        this.fps = fps;
        this.lastUpdate = performance.now();
        this.lastDraw = performance.now();
        let updateFn = () => {
            setTimeout(updateFn, 1000 / this.fps);
            const now = performance.now();
            const dt = (now - this.lastUpdate) / 1000;
            this.lastUpdate = now;
            this.spatialCache.update(this.world);
            this.update(dt);
        };
        let drawFn = (now) => {
            requestAnimationFrame(drawFn);
            const dt = (now - this.lastDraw) / 1000;
            this.lastDraw = now;
            const interp = this.fps * (now - this.lastUpdate) / 1000;
            this.ui.updateClickables(this.world, this.spatialCache, interp, this.viewport);
            this.draw(dt, interp);
        };
        let sendUpdatesFn = () => {
            setTimeout(sendUpdatesFn, 1000 / netTickRate);
            const snapshot = this.world.getSnapshot(this.networkComponentTypes);
            const oldSnapshot = snapshotHistory.length > 0 ? snapshotHistory[0].snapshot : dummySnapshot;
            const clientDelta = this.networkComponentTypes.map((key) => {
                return [key, entities_1.delta(oldSnapshot.get(key), snapshot.get(key))];
            });
            const ack = serverAckCounter++;
            server.send({ type: MessageType.ServerUpdate, ack, delta: clientDelta.map(([key, value]) => { return [key, entities_1.serialize(value)]; }) });
            snapshotHistory.push({ ack, snapshot });
        };
        let messageHandlers = {
            [MessageType.ClientUpdate]: (data) => {
                const { ack, history } = data;
                if (ack > clientAckCounter) {
                    for (let item of history) {
                        if (item.ack > clientAckCounter)
                            item.events.forEach(([name, ...data]) => this.inputQueue.enqueue(this.networkEventDeserializers.get(name)(data)));
                    }
                    clientAckCounter = ack;
                }
                server.send({ type: MessageType.ClientUpdateAck, ack });
            },
            [MessageType.ServerUpdateAck]: (data) => {
                const ack = data.ack;
                snapshotHistory = snapshotHistory.filter(item => item.ack >= ack);
            }
        };
        server.onData((data) => {
            if (data.type in messageHandlers)
                messageHandlers[data.type](data);
        });
        this.setUpScenario();
        setTimeout(updateFn, 1000 / this.fps);
        requestAnimationFrame(drawFn);
        setTimeout(sendUpdatesFn, 1000 / netTickRate);
    }
    startMultiplayerClient(fps, netTickRate, client) {
        this.setUpClientSystems();
        let snapshot = this.makeEmptyNetworkSnapshot();
        let inputHistory = [];
        let serverAckCounter = -1;
        let clientAckCounter = 0;
        let unsentEvents = [];
        let handlers = {};
        this.networkEventTypes.forEach(type => {
            let handler = this.inputQueue.getHandler(type);
            handlers[type] = handler;
            this.inputQueue.setHandler(type, (e, interp, world) => {
                handler(e, interp, world);
                unsentEvents.push(e);
            });
        });
        this.fps = fps;
        this.lastUpdate = performance.now();
        this.lastDraw = performance.now();
        let drawFn = (now) => {
            requestAnimationFrame(drawFn);
            const dt = (now - this.lastDraw) / 1000;
            this.lastDraw = now;
            const interp = netTickRate * (now - this.lastUpdate) / 1000;
            this.ui.updateClickables(this.world, this.spatialCache, interp, this.viewport);
            this.draw(dt, interp);
        };
        let sendUpdatesFn = () => {
            setTimeout(sendUpdatesFn, 1000 / netTickRate);
            if (unsentEvents.length > 0) {
                const ack = clientAckCounter++;
                inputHistory.push({ ack, events: unsentEvents });
                unsentEvents = [];
                let history = inputHistory.map((item) => {
                    return { ack: item.ack, events: item.events.map(e => [e.name, ...e.serialize()]) };
                });
                client.send({ type: MessageType.ClientUpdate, ack, history });
            }
        };
        let messageHandlers = {
            [MessageType.ServerUpdate]: (data) => {
                let { ack, delta } = data;
                if (ack > serverAckCounter) {
                    this.lastUpdate = performance.now();
                    this.spatialCache.update(this.world);
                    delta.forEach(([key, data]) => {
                        entities_1.applyDelta(snapshot.get(key), entities_1.deserialize(data, this.networkComponentDeserializers.get(key)));
                    });
                    this.world.replaceSnapshot(snapshot);
                    inputHistory.map(item => item.events)
                        .reduceRight((rhs, lhs) => lhs.concat(rhs), unsentEvents)
                        .forEach(e => handlers[e.name](e, 0, this.world));
                    serverAckCounter = ack;
                }
                client.send({ type: MessageType.ServerUpdateAck, ack });
            },
            [MessageType.ClientUpdateAck]: (data) => {
                let { ack } = data;
                inputHistory = inputHistory.filter(item => item.ack > ack);
            }
        };
        client.onData((data) => {
            if (data.type in messageHandlers)
                messageHandlers[data.type](data);
        });
        requestAnimationFrame(drawFn);
        setTimeout(sendUpdatesFn, 1000 / netTickRate);
    }
    update(dt) {
        let deferred = new deferred_1.Deferred();
        for (let system of this.updateSystems) {
            system.update(dt, this.world, deferred);
        }
        deferred.flush(this.world);
    }
    draw(dt, interp) {
        this.renderer.clear();
        let deferred = new deferred_1.Deferred();
        for (let system of this.renderSystems) {
            system.update(dt, interp, this.world, this.inputQueue, deferred);
        }
        deferred.flush(this.world);
        this.inputQueue.flush(interp, this.world);
    }
    setUpScenario() {
        const corner = new vec2_1.Vec2(50, 50);
        const dimensions = new vec2_1.Vec2(600, 600);
        const names = shuffle_1.shuffle(["Arethusa", "Aurora", "Galatea", "Penelope", "Phaeton",
            "Bonaventure", "Dido", "Argonaut", "Scylla", "Swiftsure",
            "Minotaur", "Bellerophon", "Vanguard", "Collosus", "Audacious",
            "Warspite", "Valiant"]);
        for (let i = 0; i < 5; ++i) {
            this.world.addEntity(entities_1.World.nextEntityId(), static_1.Static.makeShip(vec2_1.Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i], static_1.Static.Ship, this.players[0]));
        }
        for (let i = 5; i < 10; ++i) {
            this.world.addEntity(entities_1.World.nextEntityId(), static_1.Static.makeShip(vec2_1.Vec2.random().elementMultiply(dimensions).add(corner), 0, names[i], static_1.Static.NeutralShip, this.players[1]));
        }
    }
    setUpSingleplayerSystems() {
        let player = this.players[0];
        let ai = this.players[1];
        this.updateSystems =
            [
                new randomMoveTarget_1.ChooseRandomMoveTarget(ai, new vec2_1.Vec2(0, 0), new vec2_1.Vec2(1000, 1000)),
                new moveTo_1.MoveTo(50, Math.PI / 3),
                new projectile_1.MoveProjectiles(),
                new armed_1.Shooting(),
                new moveKinematic_1.MoveKinematic(),
                new damageable_1.CheckDestroyed()
            ];
        this.renderSystems =
            [
                new viewportController_1.ViewportController(this.ui, 1000, 2, this.viewport),
                new selection_1.SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
                new orderMove_1.OrderMove(this.inputQueue, player, this.ui, this.viewport),
                new orderAttack_1.OrderAttack(this.inputQueue, player, this.ui, this.viewport),
                new selection_1.DrawSelectedBox(this.spatialCache, this.renderer, this.viewport),
                new renderMoveTarget_1.RenderMoveTarget(this.spatialCache, this.renderer, this.viewport),
                new renderAttackTarget_1.RenderAttackTarget(this.spatialCache, this.renderer, this.viewport),
                new shapeRenderer_1.ShapeRenderer(this.spatialCache, this.renderer, this.viewport),
                new tracerEffect_1.RenderTracer(this.spatialCache, this.renderer, this.viewport),
                new renderHealthBar_1.RenderHealthBar(this.spatialCache, this.renderer, this.viewport),
                new statusWindow_1.StatusWindow(this.spatialCache, this.ui)
            ];
    }
    setUpHostSystems() {
        let player = this.players[0];
        this.updateSystems =
            [
                new moveTo_1.MoveTo(50, Math.PI / 3),
                new projectile_1.MoveProjectiles(),
                new armed_1.Shooting(),
                new moveKinematic_1.MoveKinematic(),
                new damageable_1.CheckDestroyed()
            ];
        this.renderSystems =
            [
                new viewportController_1.ViewportController(this.ui, 1000, 2, this.viewport),
                new selection_1.SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
                new orderMove_1.OrderMove(this.inputQueue, player, this.ui, this.viewport),
                new orderAttack_1.OrderAttack(this.inputQueue, player, this.ui, this.viewport),
                new selection_1.DrawSelectedBox(this.spatialCache, this.renderer, this.viewport),
                new renderMoveTarget_1.RenderMoveTarget(this.spatialCache, this.renderer, this.viewport),
                new renderAttackTarget_1.RenderAttackTarget(this.spatialCache, this.renderer, this.viewport),
                new shapeRenderer_1.ShapeRenderer(this.spatialCache, this.renderer, this.viewport),
                new tracerEffect_1.RenderTracer(this.spatialCache, this.renderer, this.viewport),
                new renderHealthBar_1.RenderHealthBar(this.spatialCache, this.renderer, this.viewport),
                new statusWindow_1.StatusWindow(this.spatialCache, this.ui)
            ];
    }
    setUpClientSystems() {
        let player = this.players[1];
        this.renderSystems =
            [
                new viewportController_1.ViewportController(this.ui, 1000, 2, this.viewport),
                new selection_1.SelectionSystem(this.inputQueue, this.spatialCache, player, this.ui, this.renderer, this.viewport),
                new orderMove_1.OrderMove(this.inputQueue, player, this.ui, this.viewport),
                new orderAttack_1.OrderAttack(this.inputQueue, player, this.ui, this.viewport),
                new selection_1.DrawSelectedBox(this.spatialCache, this.renderer, this.viewport),
                new renderMoveTarget_1.RenderMoveTarget(this.spatialCache, this.renderer, this.viewport),
                new renderAttackTarget_1.RenderAttackTarget(this.spatialCache, this.renderer, this.viewport),
                new shapeRenderer_1.ShapeRenderer(this.spatialCache, this.renderer, this.viewport),
                new tracerEffect_1.RenderTracer(this.spatialCache, this.renderer, this.viewport),
                new renderHealthBar_1.RenderHealthBar(this.spatialCache, this.renderer, this.viewport),
                new statusWindow_1.StatusWindow(this.spatialCache, this.ui)
            ];
    }
    makeEmptyNetworkSnapshot() {
        return new Map(this.networkComponentTypes.map((key) => { return [key, new Map()]; }));
    }
}
exports.Game = Game;
;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const SimplePeer = __webpack_require__(70);
class Connection {
    constructor(config, onSignal) {
        this.peer = null;
        this.peer = SimplePeer(config);
        this.peer.on('signal', (data) => { onSignal(data); });
    }
    onConnect(callback) {
        this.peer.on('connect', callback);
    }
    send(data) {
        this.peer.send(JSON.stringify(data));
    }
    onData(callback) {
        this.peer.on('data', (data) => {
            if (typeof data === "string") {
                callback(JSON.parse(data));
            }
            else {
                callback(JSON.parse(data.toString()));
            }
        });
    }
    destroy() {
        this.peer.destroy();
        this.peer = null;
    }
}
Connection.DefaultConfig = {
    trickle: false,
    channelConfig: {
        ordered: false,
        maxRetransmits: 0
    }
};
;
class Server extends Connection {
    constructor(onSignal) {
        super(Object.assign({ initiator: true }, Connection.DefaultConfig), onSignal);
    }
    acceptConnection(data) {
        this.peer.signal(data);
    }
}
exports.Server = Server;
;
class Client extends Connection {
    constructor(offer, onSignal) {
        super(Connection.DefaultConfig, onSignal);
        this.peer.signal(offer);
    }
}
exports.Client = Client;
;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class Shape {
    constructor(props, vertices) {
        this.props = props;
        this.vertices = vertices;
    }
}
exports.Shape = Shape;
;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
class MoveKinematic {
    update(dt, world, deferred) {
        world.forEachEntity([spatial_1.Position.t, kinematic_1.Velocity.t], (id, components) => {
            let [position, velocity] = components;
            position.pos.add(velocity.vel.clone().multiply(dt));
        });
        world.forEachEntity([spatial_1.Rotation.t, kinematic_1.AngularVelocity.t], (id, components) => {
            let [rotation, velocity] = components;
            rotation.angle += velocity.vel * dt;
        });
    }
}
exports.MoveKinematic = MoveKinematic;
;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const uiManager_1 = __webpack_require__(12);
const attackTarget_1 = __webpack_require__(5);
const selection_1 = __webpack_require__(2);
const playable_1 = __webpack_require__(7);
class AttackOrder {
    constructor(entity, target) {
        this.entity = entity;
        this.target = target;
        this.name = AttackOrder.t;
    }
    serialize() {
        return [this.entity, this.target];
    }
    static deserialize(data) {
        return new AttackOrder(data[0], data[1]);
    }
}
AttackOrder.t = "AttackOrder";
exports.AttackOrder = AttackOrder;
;
class OrderAttack {
    constructor(inputQueue, player, ui, viewport) {
        this.player = player;
        this.orderQueue = [];
        inputQueue.setHandler(AttackOrder.t, (evt, interp, world) => {
            if (!world.containsEntity(evt.entity) || !world.containsEntity(evt.target))
                return;
            let attackTarget = world.getComponent(evt.entity, attackTarget_1.AttackTarget.t);
            if (attackTarget)
                attackTarget.target = evt.target;
        });
        ui.addEventListener("entityclick", (event) => {
            if (event.button === uiManager_1.MouseButton.Right)
                this.orderQueue.push(event.entities);
        });
    }
    update(dt, interp, world, inputQueue, deferred) {
        for (let order of this.orderQueue) {
            for (let entity of order) {
                if (!world.containsEntity(entity))
                    continue;
                let components = world.getComponents(entity, [playable_1.Controlled.t, attackTarget_1.Targetable.t]);
                if (!components)
                    continue;
                let [controlled,] = components;
                if (controlled.player.id !== this.player.id) {
                    world.forEachEntity([selection_1.Selected.t, attackTarget_1.AttackTarget.t, playable_1.Controlled.t], (id, components) => {
                        let [, , controlled] = components;
                        if (controlled.player.id === this.player.id)
                            inputQueue.enqueue(new AttackOrder(id, entity));
                    });
                    break;
                }
            }
        }
        this.orderQueue = [];
    }
}
exports.OrderAttack = OrderAttack;
;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const uiManager_1 = __webpack_require__(12);
const moveTo_1 = __webpack_require__(6);
const selection_1 = __webpack_require__(2);
const playable_1 = __webpack_require__(7);
const vec2_1 = __webpack_require__(0);
class MoveOrder {
    constructor(entity, target) {
        this.entity = entity;
        this.target = target;
        this.name = MoveOrder.t;
    }
    serialize() {
        return [this.entity, this.target.x, this.target.y];
    }
    static deserialize(data) {
        return new MoveOrder(data[0], new vec2_1.Vec2(data[1], data[2]));
    }
}
MoveOrder.t = "MoveOrder";
exports.MoveOrder = MoveOrder;
;
class OrderMove {
    constructor(inputQueue, player, ui, viewport) {
        this.player = player;
        this.orderQueue = [];
        inputQueue.setHandler(MoveOrder.t, (evt, interp, world) => {
            if (!world.containsEntity(evt.entity))
                return;
            let moveTarget = world.getComponent(evt.entity, moveTo_1.MoveToTarget.t);
            if (moveTarget)
                moveTarget.target = evt.target;
        });
        ui.addEventListener("click", (event) => {
            if (event.button === uiManager_1.MouseButton.Right) {
                this.orderQueue.push(viewport.inverseTransform(event.pos));
            }
        });
    }
    update(dt, interp, world, inputQueue, deferred) {
        for (let order of this.orderQueue) {
            world.forEachEntity([selection_1.Selected.t, moveTo_1.MoveToTarget.t, playable_1.Controlled.t], (id, components) => {
                let [, , controlled] = components;
                if (controlled.player.id === this.player.id)
                    inputQueue.enqueue(new MoveOrder(id, order));
            });
        }
        this.orderQueue = [];
    }
}
exports.OrderMove = OrderMove;
;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const moveTo_1 = __webpack_require__(6);
const playable_1 = __webpack_require__(7);
const vec2_1 = __webpack_require__(0);
class ChooseRandomMoveTarget {
    constructor(player, min, max) {
        this.player = player;
        this.min = min;
        this.size = max.clone().subtract(min);
    }
    update(dt, world, deferred) {
        world.forEachEntity([moveTo_1.MoveToTarget.t, playable_1.Controlled.t], (id, components) => {
            let [target, controlled] = components;
            if (controlled.player.id === this.player.id && !target.target)
                target.target = this.min.clone().add(new vec2_1.Vec2(Math.random(), Math.random()).elementMultiply(this.size));
        });
    }
}
exports.ChooseRandomMoveTarget = ChooseRandomMoveTarget;
;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const attackTarget_1 = __webpack_require__(5);
const selection_1 = __webpack_require__(2);
const spatial_1 = __webpack_require__(1);
class RenderAttackTarget {
    constructor(spatialCache, renderer, viewport) {
        this.spatialCache = spatialCache;
        this.renderer = renderer;
        this.viewport = viewport;
    }
    update(dt, interp, world, inputQueue, deferred) {
        world.forEachEntity([selection_1.Selected.t, attackTarget_1.AttackTarget.t], (id, components) => {
            let [, attackTarget] = components;
            if (!world.containsEntity(attackTarget.target)) {
                attackTarget.target = null;
                return;
            }
            let targetPosition = world.getComponent(attackTarget.target, spatial_1.Position.t);
            console.assert(targetPosition);
            let targetPos = this.spatialCache.interpolatePosition(targetPosition, attackTarget.target, interp);
            this.renderer.drawCircle(targetPos, 10, RenderAttackTarget.targetProps, this.viewport);
            this.renderer.drawCircle(targetPos, 5, RenderAttackTarget.targetProps, this.viewport);
            let position = world.getComponent(id, spatial_1.Position.t);
            if (position)
                this.renderer.drawLine(targetPos, this.spatialCache.interpolatePosition(position, id, interp), RenderAttackTarget.targetProps, this.viewport);
        });
    }
}
RenderAttackTarget.targetProps = { stroke: "rgb(255, 0, 0)", lineWidth: 1, lineDash: [1, 7] };
exports.RenderAttackTarget = RenderAttackTarget;
;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const selection_1 = __webpack_require__(2);
const damageable_1 = __webpack_require__(10);
const vec2_1 = __webpack_require__(0);
const clamp_1 = __webpack_require__(54);
class RenderHealthBar {
    constructor(spatialCache, renderer, viewport) {
        this.spatialCache = spatialCache;
        this.renderer = renderer;
        this.viewport = viewport;
    }
    update(dt, interp, world, inputQueue, deferred) {
        world.forEachEntity([spatial_1.Position.t, damageable_1.Damageable.t], (id, components) => {
            let [position, damageable] = components;
            let selected = world.getComponent(id, selection_1.Selected.t);
            if (!selected && damageable.hitpoints === damageable.maxHitpoints)
                return;
            const ratio = clamp_1.clamp(damageable.hitpoints / damageable.maxHitpoints, 0, 1);
            let pos = this.viewport.transform(this.spatialCache.interpolatePosition(position, id, interp)).add(RenderHealthBar.offset);
            this.renderer.drawRect(pos, RenderHealthBar.size.clone().elementMultiply(new vec2_1.Vec2(ratio, 1)).add(pos), RenderHealthBar.greenBarProps);
            this.renderer.drawRect(RenderHealthBar.size.clone().elementMultiply(new vec2_1.Vec2(ratio, 0)).add(pos), pos.add(RenderHealthBar.size), RenderHealthBar.redBarProps);
        });
    }
}
RenderHealthBar.offset = new vec2_1.Vec2(-20, -25);
RenderHealthBar.size = new vec2_1.Vec2(40, 3);
RenderHealthBar.redBarProps = { fillColor: "rgb(255, 0, 0)" };
RenderHealthBar.greenBarProps = { fillColor: "rgb(0, 255, 0)" };
exports.RenderHealthBar = RenderHealthBar;
;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const moveTo_1 = __webpack_require__(6);
const selection_1 = __webpack_require__(2);
const spatial_1 = __webpack_require__(1);
class RenderMoveTarget {
    constructor(spatialCache, renderer, viewport) {
        this.spatialCache = spatialCache;
        this.renderer = renderer;
        this.viewport = viewport;
    }
    update(dt, interp, world, inputQueue, deferred) {
        world.forEachEntity([selection_1.Selected.t, moveTo_1.MoveToTarget.t], (id, components) => {
            let [, moveTarget] = components;
            if (!moveTarget.target)
                return;
            this.renderer.drawCircle(moveTarget.target, 10, RenderMoveTarget.targetProps, this.viewport);
            this.renderer.drawCircle(moveTarget.target, 5, RenderMoveTarget.targetProps, this.viewport);
            let position = world.getComponent(id, spatial_1.Position.t);
            if (position)
                this.renderer.drawLine(this.spatialCache.interpolatePosition(position, id, interp), moveTarget.target, RenderMoveTarget.targetProps, this.viewport);
        });
    }
}
RenderMoveTarget.targetProps = { stroke: "rgb(0, 255, 0)", lineWidth: 1, lineDash: [5, 15] };
exports.RenderMoveTarget = RenderMoveTarget;
;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const spatial_1 = __webpack_require__(1);
const vec2_1 = __webpack_require__(0);
class SpatialCache {
    constructor() {
        this.positions = new Map();
        this.rotations = new Map();
    }
    update(world) {
        this.positions.clear();
        this.rotations.clear();
        world.forEachEntity([spatial_1.Position.t], (id, components) => {
            let [position] = components;
            this.positions.set(id, new spatial_1.Position(position.pos.clone()));
        });
        world.forEachEntity([spatial_1.Rotation.t], (id, components) => {
            let [rotation] = components;
            this.rotations.set(id, new spatial_1.Rotation(rotation.angle));
        });
    }
    interpolatePosition(pos, id, interp) {
        let position = pos.pos;
        let cachedPos = this.positions.get(id);
        if (cachedPos)
            position = vec2_1.Vec2.lerp(cachedPos.pos, position, interp);
        return position;
    }
    interpolateRotation(rot, id, interp) {
        let angle = rot.angle;
        let cachedRot = this.rotations.get(id);
        if (cachedRot)
            angle = vec2_1.lerp(cachedRot.angle, angle, interp);
        return angle;
    }
}
exports.SpatialCache = SpatialCache;
;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const selection_1 = __webpack_require__(2);
const spatial_1 = __webpack_require__(1);
const kinematic_1 = __webpack_require__(3);
const moveTo_1 = __webpack_require__(6);
const named_1 = __webpack_require__(17);
const attackTarget_1 = __webpack_require__(5);
const damageable_1 = __webpack_require__(10);
const vdom_1 = __webpack_require__(31);
const vec2_1 = __webpack_require__(0);
const angle_1 = __webpack_require__(29);
function positionToString(pos) {
    return pos.x.toFixed() + " : " + pos.y.toFixed();
}
;
function spatialInformation(position, rotation, spatialCache, id, interp, velocity) {
    let msgParts = [];
    if (position)
        msgParts.push(positionToString(spatialCache.interpolatePosition(position, id, interp)));
    if (rotation)
        msgParts.push((180 * angle_1.wrapAngle(spatialCache.interpolateRotation(rotation, id, interp)) / Math.PI).toFixed() + "°");
    if (velocity)
        msgParts.push(vec2_1.norm(velocity.vel).toFixed());
    return msgParts.join(" | ");
}
;
function entityName(world, id) {
    if (!world.containsEntity(id))
        return null;
    let name = world.getComponent(id, named_1.Named.t);
    return name ? name.name : null;
}
;
class StatusWindow {
    constructor(spatialCache, ui) {
        this.spatialCache = spatialCache;
        this.ui = ui;
        this.elem = vdom_1.VdomElement.create("div", { "class": "window" });
        this.$elem = vdom_1.createElement(this.elem);
    }
    update(dt, interp, world, inputQueue, deferred) {
        let elem = vdom_1.VdomElement.create("div", { "class": "window" });
        world.forEachEntity([selection_1.Selected.t], (id, components) => {
            let [name, position, rotation, velocity, moveTarget, attackTarget, damageable] = world.getOptionalComponents(id, [named_1.Named.t, spatial_1.Position.t, spatial_1.Rotation.t, kinematic_1.Velocity.t, moveTo_1.MoveToTarget.t, attackTarget_1.AttackTarget.t, damageable_1.Damageable.t]);
            elem.children.push(vdom_1.VdomElement.create("div", { "class": "ship" }, name
                ? vdom_1.VdomElement.create("span", { "class": "name" }, name.name)
                : null, damageable
                ? vdom_1.VdomElement.create("span", { "class": "hp" }, damageable.hitpoints.toFixed() + "/" + damageable.maxHitpoints.toFixed())
                : null, position || rotation || velocity
                ? vdom_1.VdomElement.create("span", { "class": "pos" }, spatialInformation(position, rotation, this.spatialCache, id, interp, velocity))
                : null, moveTarget && moveTarget.target
                ? vdom_1.VdomElement.create("span", { "class": "tgt" }, positionToString(moveTarget.target))
                : null, attackTarget && attackTarget.target
                ? vdom_1.VdomElement.create("span", { "class": "atk" }, entityName(world, attackTarget.target))
                : null));
        });
        vdom_1.updateElementChildren(this.$elem, elem, this.elem);
        this.elem = elem;
        if (this.elem.children.length == 0) {
            if (this.$elem.parentNode)
                this.ui.removeElement(this.$elem);
        }
        else {
            if (!this.$elem.parentNode)
                this.ui.addElement(this.$elem);
        }
    }
}
exports.StatusWindow = StatusWindow;
;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const uiManager_1 = __webpack_require__(12);
const vec2_1 = __webpack_require__(0);
class ViewportController {
    constructor(ui, scrollSpeed, scaleRatio, viewport) {
        this.ui = ui;
        this.scrollSpeed = scrollSpeed;
        this.scaleRatio = scaleRatio;
        this.viewport = viewport;
        this.dragging = false;
        ui.addEventListener("dragstart", (e) => {
            if (e.button === uiManager_1.MouseButton.Right) {
                this.lastMousePos = e.pos.clone();
                this.dragging = true;
            }
        });
        ui.addEventListener("dragend", (e) => {
            if (e.button === uiManager_1.MouseButton.Right)
                this.dragging = false;
        });
        ui.addEventListener("wheel", (e) => {
            const pos = e.pos ? e.pos : this.ui.canvasDimensions().multiply(0.5);
            const rescale = Math.pow(this.scaleRatio, -e.delta);
            this.viewport.scale *= rescale;
            this.viewport.pos = pos.add(this.viewport.pos.clone().subtract(pos).multiply(rescale));
        });
    }
    update(dt, interp, world, inputQueue, deferred) {
        const mousePos = this.ui.mousePosition();
        if (!mousePos)
            return;
        if (this.dragging) {
            this.viewport.pos.add(mousePos.clone().subtract(this.lastMousePos));
        }
        else {
            let screenScroll = new vec2_1.Vec2(0, 0);
            const relX = mousePos.x / this.ui.canvasWidth();
            const relY = mousePos.y / this.ui.canvasHeight();
            if (relX < 0.1) {
                screenScroll.x = Math.pow(vec2_1.lerp(1, 0, relX / 0.1), 2);
            }
            else if (relX > 0.9) {
                screenScroll.x = -Math.pow(vec2_1.lerp(0, 1, (relX - 0.9) / 0.1), 2);
            }
            if (relY < 0.1) {
                screenScroll.y = Math.pow(vec2_1.lerp(1, 0, relY / 0.1), 2);
            }
            else if (relY > 0.9) {
                screenScroll.y = -Math.pow(vec2_1.lerp(0, 1, (relY - 0.9) / 0.1), 2);
            }
            this.viewport.pos.add(screenScroll.multiply(this.scrollSpeed * dt));
        }
        this.lastMousePos = mousePos.clone();
    }
}
exports.ViewportController = ViewportController;
;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

;
class UserInputQueue {
    constructor() {
        this.handlers = {};
        this.queue = [];
    }
    enqueue(e) {
        this.queue.push(e);
    }
    getHandler(type) {
        return this.handlers[type];
    }
    setHandler(type, handler) {
        this.handlers[type] = handler;
    }
    flush(interp, world) {
        for (let e of this.queue) {
            if (e.name in this.handlers)
                this.handlers[e.name](e, interp, world);
        }
        this.queue = [];
    }
}
exports.UserInputQueue = UserInputQueue;
;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}
exports.clamp = clamp;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function fullscreenAvailable() {
    if ("fullscreenEnabled" in document) {
        return document.fullscreenEnabled;
    }
    else if ("webkitFullscreenEnabled" in document) {
        return document.webkitFullscreenEnabled;
    }
    else if ("mozFullScreenEnabled" in document) {
        return document.mozFullScreenEnabled;
    }
    return false;
}
exports.fullscreenAvailable = fullscreenAvailable;
;
function setFullscreen(element) {
    if ("fullscreenElement" in document) {
        if (document.fullscreenElement)
            return false;
        element.requestFullscreen();
        return true;
    }
    else if ("webkitFullscreenElement" in document) {
        if (document.webkitFullscreenElement)
            return false;
        element.webkitRequestFullscreen();
        return true;
    }
    else if ("mozFullScreenElement" in document) {
        if (document.mozFullScreenElement)
            return false;
        element.mozRequestFullScreen();
        return true;
    }
    return false;
}
exports.setFullscreen = setFullscreen;
;
function disableFullscreen() {
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.mozFullScreenElement && document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
}
exports.disableFullscreen = disableFullscreen;
;
function isFullscreen() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
}
exports.isFullscreen = isFullscreen;
;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function shuffle(array) {
    for (let i = array.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
exports.shuffle = shuffle;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(59);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(62);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 60 */
/***/ (function(module, exports) {

// originally pulled out of simple-peer

module.exports = function getBrowserRTC () {
  if (typeof window === 'undefined') return null
  var wrtc = {
    RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection,
    RTCSessionDescription: window.RTCSessionDescription ||
      window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
    RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate
  }
  if (!wrtc.RTCPeerConnection) return null
  return wrtc
}


/***/ }),
/* 61 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 62 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Buffer, process) {

function oldBrowser () {
  throw new Error('secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11')
}

var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // phantomjs needs to throw
  if (size > 65536) throw new Error('requested too many random bytes')
  // in case browserify  isn't using the Uint8Array version
  var rawBytes = new global.Uint8Array(size)

  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  if (size > 0) {  // getRandomValues fails on IE if size == 0
    crypto.getRandomValues(rawBytes)
  }
  // phantomjs doesn't like a buffer being passed here
  var bytes = new Buffer(rawBytes.buffer)

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(4).Buffer, __webpack_require__(11)))

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9)


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(4).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(21);
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
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
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return bufferShim.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = bufferShim.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(33)


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(23)


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(24)


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(11)))

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = Peer

var debug = __webpack_require__(58)('simple-peer')
var getBrowserRTC = __webpack_require__(60)
var inherits = __webpack_require__(8)
var randombytes = __webpack_require__(63)
var stream = __webpack_require__(35)

var MAX_BUFFERED_AMOUNT = 64 * 1024

inherits(Peer, stream.Duplex)

/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */
function Peer (opts) {
  var self = this
  if (!(self instanceof Peer)) return new Peer(opts)

  self._id = randombytes(4).toString('hex').slice(0, 7)
  self._debug('new peer %o', opts)

  opts = Object.assign({
    allowHalfOpen: false
  }, opts)

  stream.Duplex.call(self, opts)

  self.channelName = opts.initiator
    ? opts.channelName || randombytes(20).toString('hex')
    : null

  // Needed by _transformConstraints, so set this early
  self._isChromium = typeof window !== 'undefined' && !!window.webkitRTCPeerConnection

  self.initiator = opts.initiator || false
  self.channelConfig = opts.channelConfig || Peer.channelConfig
  self.config = opts.config || Peer.config
  self.constraints = self._transformConstraints(opts.constraints || Peer.constraints)
  self.offerConstraints = self._transformConstraints(opts.offerConstraints || {})
  self.answerConstraints = self._transformConstraints(opts.answerConstraints || {})
  self.reconnectTimer = opts.reconnectTimer || false
  self.sdpTransform = opts.sdpTransform || function (sdp) { return sdp }
  self.stream = opts.stream || false
  self.trickle = opts.trickle !== undefined ? opts.trickle : true

  self.destroyed = false
  self.connected = false

  self.remoteAddress = undefined
  self.remoteFamily = undefined
  self.remotePort = undefined
  self.localAddress = undefined
  self.localPort = undefined

  self._wrtc = (opts.wrtc && typeof opts.wrtc === 'object')
    ? opts.wrtc
    : getBrowserRTC()

  if (!self._wrtc) {
    if (typeof window === 'undefined') {
      throw new Error('No WebRTC support: Specify `opts.wrtc` option in this environment')
    } else {
      throw new Error('No WebRTC support: Not a supported browser')
    }
  }

  self._pcReady = false
  self._channelReady = false
  self._iceComplete = false // ice candidate trickle done (got null candidate)
  self._channel = null
  self._pendingCandidates = []
  self._previousStreams = []

  self._chunk = null
  self._cb = null
  self._interval = null
  self._reconnectTimeout = null

  self._pc = new (self._wrtc.RTCPeerConnection)(self.config, self.constraints)

  // We prefer feature detection whenever possible, but sometimes that's not
  // possible for certain implementations.
  self._isWrtc = Array.isArray(self._pc.RTCIceConnectionStates)
  self._isReactNativeWebrtc = typeof self._pc._peerConnectionId === 'number'

  self._pc.oniceconnectionstatechange = function () {
    self._onIceStateChange()
  }
  self._pc.onicegatheringstatechange = function () {
    self._onIceStateChange()
  }
  self._pc.onsignalingstatechange = function () {
    self._onSignalingStateChange()
  }
  self._pc.onicecandidate = function (event) {
    self._onIceCandidate(event)
  }

  // Other spec events, unused by this implementation:
  // - onconnectionstatechange
  // - onicecandidateerror
  // - onfingerprintfailure

  if (self.initiator) {
    var createdOffer = false
    self._pc.onnegotiationneeded = function () {
      if (!createdOffer) self._createOffer()
      createdOffer = true
    }

    self._setupData({
      channel: self._pc.createDataChannel(self.channelName, self.channelConfig)
    })
  } else {
    self._pc.ondatachannel = function (event) {
      self._setupData(event)
    }
  }

  if ('addTrack' in self._pc) {
    // WebRTC Spec, Firefox
    if (self.stream) {
      self.stream.getTracks().forEach(function (track) {
        self._pc.addTrack(track, self.stream)
      })
    }
    self._pc.ontrack = function (event) {
      self._onTrack(event)
    }
  } else {
    // Chrome, etc. This can be removed once all browsers support `ontrack`
    if (self.stream) self._pc.addStream(self.stream)
    self._pc.onaddstream = function (event) {
      self._onAddStream(event)
    }
  }

  // HACK: wrtc doesn't fire the 'negotionneeded' event
  if (self.initiator && self._isWrtc) {
    self._pc.onnegotiationneeded()
  }

  self._onFinishBound = function () {
    self._onFinish()
  }
  self.once('finish', self._onFinishBound)
}

Peer.WEBRTC_SUPPORT = !!getBrowserRTC()

/**
 * Expose config, constraints, and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config, opts.constraints, or opts.channelConfig
 * when constructing a Peer.
 */
Peer.config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:global.stun.twilio.com:3478?transport=udp'
    }
  ]
}
Peer.constraints = {}
Peer.channelConfig = {}

Object.defineProperty(Peer.prototype, 'bufferSize', {
  get: function () {
    var self = this
    return (self._channel && self._channel.bufferedAmount) || 0
  }
})

Peer.prototype.address = function () {
  var self = this
  return { port: self.localPort, family: 'IPv4', address: self.localAddress }
}

Peer.prototype.signal = function (data) {
  var self = this
  if (self.destroyed) throw new Error('cannot signal after peer is destroyed')
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      data = {}
    }
  }
  self._debug('signal()')

  if (data.candidate) {
    if (self._pc.remoteDescription) self._addIceCandidate(data.candidate)
    else self._pendingCandidates.push(data.candidate)
  }
  if (data.sdp) {
    self._pc.setRemoteDescription(new (self._wrtc.RTCSessionDescription)(data), function () {
      if (self.destroyed) return

      self._pendingCandidates.forEach(function (candidate) {
        self._addIceCandidate(candidate)
      })
      self._pendingCandidates = []

      if (self._pc.remoteDescription.type === 'offer') self._createAnswer()
    }, function (err) { self._destroy(err) })
  }
  if (!data.sdp && !data.candidate) {
    self._destroy(new Error('signal() called with invalid signal data'))
  }
}

Peer.prototype._addIceCandidate = function (candidate) {
  var self = this
  try {
    self._pc.addIceCandidate(
      new self._wrtc.RTCIceCandidate(candidate),
      noop,
      function (err) { self._destroy(err) }
    )
  } catch (err) {
    self._destroy(new Error('error adding candidate: ' + err.message))
  }
}

/**
 * Send text/binary data to the remote peer.
 * @param {TypedArrayView|ArrayBuffer|Buffer|string|Blob|Object} chunk
 */
Peer.prototype.send = function (chunk) {
  var self = this

  // HACK: `wrtc` module crashes on Node.js Buffer, so convert to Uint8Array
  // See: https://github.com/feross/simple-peer/issues/60
  if (self._isWrtc && Buffer.isBuffer(chunk)) {
    chunk = new Uint8Array(chunk)
  }

  self._channel.send(chunk)
}

Peer.prototype.destroy = function (onclose) {
  var self = this
  self._destroy(null, onclose)
}

Peer.prototype._destroy = function (err, onclose) {
  var self = this
  if (self.destroyed) return
  if (onclose) self.once('close', onclose)

  self._debug('destroy (error: %s)', err && (err.message || err))

  self.readable = self.writable = false

  if (!self._readableState.ended) self.push(null)
  if (!self._writableState.finished) self.end()

  self.destroyed = true
  self.connected = false
  self._pcReady = false
  self._channelReady = false
  self._previousStreams = null

  clearInterval(self._interval)
  clearTimeout(self._reconnectTimeout)
  self._interval = null
  self._reconnectTimeout = null
  self._chunk = null
  self._cb = null

  if (self._onFinishBound) self.removeListener('finish', self._onFinishBound)
  self._onFinishBound = null

  if (self._pc) {
    try {
      self._pc.close()
    } catch (err) {}

    self._pc.oniceconnectionstatechange = null
    self._pc.onicegatheringstatechange = null
    self._pc.onsignalingstatechange = null
    self._pc.onicecandidate = null
    if ('addTrack' in self._pc) {
      self._pc.ontrack = null
    } else {
      self._pc.onaddstream = null
    }
    self._pc.onnegotiationneeded = null
    self._pc.ondatachannel = null
  }

  if (self._channel) {
    try {
      self._channel.close()
    } catch (err) {}

    self._channel.onmessage = null
    self._channel.onopen = null
    self._channel.onclose = null
    self._channel.onerror = null
  }
  self._pc = null
  self._channel = null

  if (err) self.emit('error', err)
  self.emit('close')
}

Peer.prototype._setupData = function (event) {
  var self = this
  if (!event.channel) {
    // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
    // which is invalid behavior. Handle it gracefully.
    // See: https://github.com/feross/simple-peer/issues/163
    return self._destroy(new Error('Data channel event is missing `channel` property'))
  }

  self._channel = event.channel
  self._channel.binaryType = 'arraybuffer'

  if (typeof self._channel.bufferedAmountLowThreshold === 'number') {
    self._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT
  }

  self.channelName = self._channel.label

  self._channel.onmessage = function (event) {
    self._onChannelMessage(event)
  }
  self._channel.onbufferedamountlow = function () {
    self._onChannelBufferedAmountLow()
  }
  self._channel.onopen = function () {
    self._onChannelOpen()
  }
  self._channel.onclose = function () {
    self._onChannelClose()
  }
  self._channel.onerror = function (err) {
    self._destroy(err)
  }
}

Peer.prototype._read = function () {}

Peer.prototype._write = function (chunk, encoding, cb) {
  var self = this
  if (self.destroyed) return cb(new Error('cannot write after peer is destroyed'))

  if (self.connected) {
    try {
      self.send(chunk)
    } catch (err) {
      return self._destroy(err)
    }
    if (self._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      self._debug('start backpressure: bufferedAmount %d', self._channel.bufferedAmount)
      self._cb = cb
    } else {
      cb(null)
    }
  } else {
    self._debug('write before connect')
    self._chunk = chunk
    self._cb = cb
  }
}

// When stream finishes writing, close socket. Half open connections are not
// supported.
Peer.prototype._onFinish = function () {
  var self = this
  if (self.destroyed) return

  if (self.connected) {
    destroySoon()
  } else {
    self.once('connect', destroySoon)
  }

  // Wait a bit before destroying so the socket flushes.
  // TODO: is there a more reliable way to accomplish this?
  function destroySoon () {
    setTimeout(function () {
      self._destroy()
    }, 1000)
  }
}

Peer.prototype._createOffer = function () {
  var self = this
  if (self.destroyed) return

  self._pc.createOffer(function (offer) {
    if (self.destroyed) return
    offer.sdp = self.sdpTransform(offer.sdp)
    self._pc.setLocalDescription(offer, onSuccess, onError)

    function onSuccess () {
      if (self.destroyed) return
      if (self.trickle || self._iceComplete) sendOffer()
      else self.once('_iceComplete', sendOffer) // wait for candidates
    }

    function onError (err) {
      self._destroy(err)
    }

    function sendOffer () {
      var signal = self._pc.localDescription || offer
      self._debug('signal')
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      })
    }
  }, function (err) { self._destroy(err) }, self.offerConstraints)
}

Peer.prototype._createAnswer = function () {
  var self = this
  if (self.destroyed) return

  self._pc.createAnswer(function (answer) {
    if (self.destroyed) return
    answer.sdp = self.sdpTransform(answer.sdp)
    self._pc.setLocalDescription(answer, onSuccess, onError)

    function onSuccess () {
      if (self.destroyed) return
      if (self.trickle || self._iceComplete) sendAnswer()
      else self.once('_iceComplete', sendAnswer)
    }

    function onError (err) {
      self._destroy(err)
    }

    function sendAnswer () {
      var signal = self._pc.localDescription || answer
      self._debug('signal')
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      })
    }
  }, function (err) { self._destroy(err) }, self.answerConstraints)
}

Peer.prototype._onIceStateChange = function () {
  var self = this
  if (self.destroyed) return
  var iceConnectionState = self._pc.iceConnectionState
  var iceGatheringState = self._pc.iceGatheringState

  self._debug(
    'iceStateChange (connection: %s) (gathering: %s)',
    iceConnectionState,
    iceGatheringState
  )
  self.emit('iceStateChange', iceConnectionState, iceGatheringState)

  if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
    clearTimeout(self._reconnectTimeout)
    self._pcReady = true
    self._maybeReady()
  }
  if (iceConnectionState === 'disconnected') {
    if (self.reconnectTimer) {
      // If user has set `opt.reconnectTimer`, allow time for ICE to attempt a reconnect
      clearTimeout(self._reconnectTimeout)
      self._reconnectTimeout = setTimeout(function () {
        self._destroy()
      }, self.reconnectTimer)
    } else {
      self._destroy()
    }
  }
  if (iceConnectionState === 'failed') {
    self._destroy(new Error('Ice connection failed.'))
  }
  if (iceConnectionState === 'closed') {
    self._destroy()
  }
}

Peer.prototype.getStats = function (cb) {
  var self = this

  // Promise-based getStats() (standard)
  if (self._pc.getStats.length === 0) {
    self._pc.getStats().then(function (res) {
      var reports = []
      res.forEach(function (report) {
        reports.push(report)
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Two-parameter callback-based getStats() (deprecated, former standard)
  } else if (self._isReactNativeWebrtc) {
    self._pc.getStats(null, function (res) {
      var reports = []
      res.forEach(function (report) {
        reports.push(report)
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Single-parameter callback-based getStats() (non-standard)
  } else if (self._pc.getStats.length > 0) {
    self._pc.getStats(function (res) {
      var reports = []
      res.result().forEach(function (result) {
        var report = {}
        result.names().forEach(function (name) {
          report[name] = result.stat(name)
        })
        report.id = result.id
        report.type = result.type
        report.timestamp = result.timestamp
        reports.push(report)
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Unknown browser, skip getStats() since it's anyone's guess which style of
  // getStats() they implement.
  } else {
    cb(null, [])
  }
}

Peer.prototype._maybeReady = function () {
  var self = this
  self._debug('maybeReady pc %s channel %s', self._pcReady, self._channelReady)
  if (self.connected || self._connecting || !self._pcReady || !self._channelReady) return
  self._connecting = true

  self.getStats(function (err, items) {
    if (self.destroyed) return

    // Treat getStats error as non-fatal. It's not essential.
    if (err) items = []

    self._connecting = false
    self.connected = true

    var remoteCandidates = {}
    var localCandidates = {}
    var candidatePairs = {}

    items.forEach(function (item) {
      // TODO: Once all browsers support the hyphenated stats report types, remove
      // the non-hypenated ones
      if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
        remoteCandidates[item.id] = item
      }
      if (item.type === 'localcandidate' || item.type === 'local-candidate') {
        localCandidates[item.id] = item
      }
      if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
        candidatePairs[item.id] = item
      }
    })

    items.forEach(function (item) {
      // Spec-compliant
      if (item.type === 'transport') {
        setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId])
      }

      // Old implementations
      if (
        (item.type === 'googCandidatePair' && item.googActiveConnection === 'true') ||
        ((item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected)
      ) {
        setSelectedCandidatePair(item)
      }
    })

    function setSelectedCandidatePair (selectedCandidatePair) {
      var local = localCandidates[selectedCandidatePair.localCandidateId]

      if (local && local.ip) {
        // Spec
        self.localAddress = local.ip
        self.localPort = Number(local.port)
      } else if (local && local.ipAddress) {
        // Firefox
        self.localAddress = local.ipAddress
        self.localPort = Number(local.portNumber)
      } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
        // TODO: remove this once Chrome 58 is released
        local = selectedCandidatePair.googLocalAddress.split(':')
        self.localAddress = local[0]
        self.localPort = Number(local[1])
      }

      var remote = remoteCandidates[selectedCandidatePair.remoteCandidateId]

      if (remote && remote.ip) {
        // Spec
        self.remoteAddress = remote.ip
        self.remotePort = Number(remote.port)
      } else if (remote && remote.ipAddress) {
        // Firefox
        self.remoteAddress = remote.ipAddress
        self.remotePort = Number(remote.portNumber)
      } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
        // TODO: remove this once Chrome 58 is released
        remote = selectedCandidatePair.googRemoteAddress.split(':')
        self.remoteAddress = remote[0]
        self.remotePort = Number(remote[1])
      }
      self.remoteFamily = 'IPv4'

      self._debug(
        'connect local: %s:%s remote: %s:%s',
        self.localAddress, self.localPort, self.remoteAddress, self.remotePort
      )
    }

    if (self._chunk) {
      try {
        self.send(self._chunk)
      } catch (err) {
        return self._destroy(err)
      }
      self._chunk = null
      self._debug('sent chunk from "write before connect"')

      var cb = self._cb
      self._cb = null
      cb(null)
    }

    // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
    // fallback to using setInterval to implement backpressure.
    if (typeof self._channel.bufferedAmountLowThreshold !== 'number') {
      self._interval = setInterval(function () { self._onInterval() }, 150)
      if (self._interval.unref) self._interval.unref()
    }

    self._debug('connect')
    self.emit('connect')
  })
}

Peer.prototype._onInterval = function () {
  if (!this._cb || !this._channel || this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
    return
  }
  this._onChannelBufferedAmountLow()
}

Peer.prototype._onSignalingStateChange = function () {
  var self = this
  if (self.destroyed) return
  self._debug('signalingStateChange %s', self._pc.signalingState)
  self.emit('signalingStateChange', self._pc.signalingState)
}

Peer.prototype._onIceCandidate = function (event) {
  var self = this
  if (self.destroyed) return
  if (event.candidate && self.trickle) {
    self.emit('signal', {
      candidate: {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid
      }
    })
  } else if (!event.candidate) {
    self._iceComplete = true
    self.emit('_iceComplete')
  }
}

Peer.prototype._onChannelMessage = function (event) {
  var self = this
  if (self.destroyed) return
  var data = event.data
  if (data instanceof ArrayBuffer) data = Buffer.from(data)
  self.push(data)
}

Peer.prototype._onChannelBufferedAmountLow = function () {
  var self = this
  if (self.destroyed || !self._cb) return
  self._debug('ending backpressure: bufferedAmount %d', self._channel.bufferedAmount)
  var cb = self._cb
  self._cb = null
  cb(null)
}

Peer.prototype._onChannelOpen = function () {
  var self = this
  if (self.connected || self.destroyed) return
  self._debug('on channel open')
  self._channelReady = true
  self._maybeReady()
}

Peer.prototype._onChannelClose = function () {
  var self = this
  if (self.destroyed) return
  self._debug('on channel close')
  self._destroy()
}

Peer.prototype._onAddStream = function (event) {
  var self = this
  if (self.destroyed) return
  self._debug('on add stream')
  self.emit('stream', event.stream)
}

Peer.prototype._onTrack = function (event) {
  var self = this
  if (self.destroyed) return
  self._debug('on track')
  var id = event.streams[0].id
  if (self._previousStreams.indexOf(id) !== -1) return // Only fire one 'stream' event, even though there may be multiple tracks per stream
  self._previousStreams.push(id)
  self.emit('stream', event.streams[0])
}

Peer.prototype._debug = function () {
  var self = this
  var args = [].slice.call(arguments)
  args[0] = '[' + self._id + '] ' + args[0]
  debug.apply(null, args)
}

// Transform constraints objects into the new format (unless Chromium)
// TODO: This can be removed when Chromium supports the new format
Peer.prototype._transformConstraints = function (constraints) {
  var self = this

  if (Object.keys(constraints).length === 0) {
    return constraints
  }

  if ((constraints.mandatory || constraints.optional) && !self._isChromium) {
    // convert to new format

    // Merge mandatory and optional objects, prioritizing mandatory
    var newConstraints = Object.assign({}, constraints.optional, constraints.mandatory)

    // fix casing
    if (newConstraints.OfferToReceiveVideo !== undefined) {
      newConstraints.offerToReceiveVideo = newConstraints.OfferToReceiveVideo
      delete newConstraints['OfferToReceiveVideo']
    }

    if (newConstraints.OfferToReceiveAudio !== undefined) {
      newConstraints.offerToReceiveAudio = newConstraints.OfferToReceiveAudio
      delete newConstraints['OfferToReceiveAudio']
    }

    return newConstraints
  } else if (!constraints.mandatory && !constraints.optional && self._isChromium) {
    // convert to old format

    // fix casing
    if (constraints.offerToReceiveVideo !== undefined) {
      constraints.OfferToReceiveVideo = constraints.offerToReceiveVideo
      delete constraints['offerToReceiveVideo']
    }

    if (constraints.offerToReceiveAudio !== undefined) {
      constraints.OfferToReceiveAudio = constraints.offerToReceiveAudio
      delete constraints['offerToReceiveAudio']
    }

    return {
      mandatory: constraints // NOTE: All constraints are upgraded to mandatory
    }
  }

  return constraints
}

function noop () {}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).Buffer))

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(69);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

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

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
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

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 73 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const app_1 = __webpack_require__(37);
__webpack_require__(38);
app_1.App.mount(document.getElementById("content"));


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map