var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// deno:https://deno.land/x/mysql@v2.12.1/src/constant/errors.ts
var ConnnectionError = class extends Error {
  constructor(msg) {
    super(msg);
  }
};
var WriteError = class extends ConnnectionError {
  constructor(msg) {
    super(msg);
  }
};
var ReadError = class extends ConnnectionError {
  constructor(msg) {
    super(msg);
  }
};
var ResponseTimeoutError = class extends ConnnectionError {
  constructor(msg) {
    super(msg);
  }
};
var ProtocolError = class extends ConnnectionError {
  constructor(msg) {
    super(msg);
  }
};

// deno:https://deno.land/std@0.104.0/async/deferred.ts
function deferred() {
  let methods;
  let state2 = "pending";
  const promise = new Promise((resolve, reject) => {
    methods = {
      async resolve(value) {
        await value;
        state2 = "fulfilled";
        resolve(value);
      },
      // deno-lint-ignore no-explicit-any
      reject(reason) {
        state2 = "rejected";
        reject(reason);
      }
    };
  });
  Object.defineProperty(promise, "state", {
    get: () => state2
  });
  return Object.assign(promise, methods);
}

// deno:https://deno.land/std@0.104.0/async/mux_async_iterator.ts
var _computedKey;
_computedKey = Symbol.asyncIterator;
var MuxAsyncIterator = class {
  iteratorCount = 0;
  yields = [];
  // deno-lint-ignore no-explicit-any
  throws = [];
  signal = deferred();
  add(iterable) {
    ++this.iteratorCount;
    this.callIteratorNext(iterable[Symbol.asyncIterator]());
  }
  async callIteratorNext(iterator) {
    try {
      const { value, done } = await iterator.next();
      if (done) {
        --this.iteratorCount;
      } else {
        this.yields.push({
          iterator,
          value
        });
      }
    } catch (e) {
      this.throws.push(e);
    }
    this.signal.resolve();
  }
  async *iterate() {
    while (this.iteratorCount > 0) {
      await this.signal;
      for (let i = 0; i < this.yields.length; i++) {
        const { iterator, value } = this.yields[i];
        yield value;
        this.callIteratorNext(iterator);
      }
      if (this.throws.length) {
        for (const e of this.throws) {
          throw e;
        }
        this.throws.length = 0;
      }
      this.yields.length = 0;
      this.signal = deferred();
    }
  }
  [_computedKey]() {
    return this.iterate();
  }
};

// deno:https://deno.land/std@0.104.0/async/tee.ts
var _computedKey2;
var noop = () => {
};
_computedKey2 = Symbol.asyncIterator;
var AsyncIterableClone = class {
  currentPromise;
  resolveCurrent = noop;
  consumed;
  consume = noop;
  constructor() {
    this.currentPromise = new Promise((resolve) => {
      this.resolveCurrent = resolve;
    });
    this.consumed = new Promise((resolve) => {
      this.consume = resolve;
    });
  }
  reset() {
    this.currentPromise = new Promise((resolve) => {
      this.resolveCurrent = resolve;
    });
    this.consumed = new Promise((resolve) => {
      this.consume = resolve;
    });
  }
  async next() {
    const res = await this.currentPromise;
    this.consume();
    this.reset();
    return res;
  }
  async push(res) {
    this.resolveCurrent(res);
    await this.consumed;
  }
  [_computedKey2]() {
    return this;
  }
};

// deno:https://deno.land/std@0.77.0/fmt/colors.ts
var noColor = globalThis.Deno?.noColor ?? true;
var enabled = !noColor;
function code(open, close) {
  return {
    open: `\x1B[${open.join(";")}m`,
    close: `\x1B[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run(str, code3) {
  return enabled ? `${code3.open}${str.replace(code3.regexp, code3.open)}${code3.close}` : str;
}
function green(str) {
  return run(str, code([
    32
  ], 39));
}
var ANSI_PATTERN = new RegExp([
  "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
  "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
].join("|"), "g");

// deno:https://deno.land/x/bytes_formater@v1.4.0/format.ts
function format(data) {
  const bytes = new Uint8Array(data.buffer);
  let out = "         +-------------------------------------------------+\n";
  out += `         |${green("  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f ")}|
`;
  out += "+--------+-------------------------------------------------+----------------+\n";
  const lineCount = Math.ceil(bytes.length / 16);
  for (let line = 0; line < lineCount; line++) {
    const start2 = line * 16;
    const addr = start2.toString(16).padStart(8, "0");
    const lineBytes = bytes.slice(start2, start2 + 16);
    out += `|${green(addr)}| `;
    lineBytes.forEach((byte) => out += byte.toString(16).padStart(2, "0") + " ");
    if (lineBytes.length < 16) {
      out += "   ".repeat(16 - lineBytes.length);
    }
    out += "|";
    lineBytes.forEach(function(byte) {
      return out += byte > 31 && byte < 127 ? green(String.fromCharCode(byte)) : ".";
    });
    if (lineBytes.length < 16) {
      out += " ".repeat(16 - lineBytes.length);
    }
    out += "|\n";
  }
  out += "+--------+-------------------------------------------------+----------------+";
  return out;
}

// deno:https://deno.land/std@0.104.0/encoding/base64.ts
var base64abc = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/"
];
function encode(data) {
  const uint8 = typeof data === "string" ? new TextEncoder().encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
  let result = "", i;
  const l = uint8.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
    result += base64abc[(uint8[i - 1] & 15) << 2 | uint8[i] >> 6];
    result += base64abc[uint8[i] & 63];
  }
  if (i === l + 1) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === l) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
    result += base64abc[(uint8[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
function decode(b64) {
  const binString = atob(b64);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

// deno:https://deno.land/std@0.104.0/hash/_wasm/wasm.js
var cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true
});
cachedTextDecoder.decode();
var cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
var heap = new Array(32).fill(void 0);
heap.push(void 0, null, true, false);
var heap_next = heap.length;
function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function getObject(idx) {
  return heap[idx];
}
function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
var WASM_VECTOR_LEN = 0;
var cachedTextEncoder = new TextEncoder("utf-8");
var encodeString = function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code3 = arg.charCodeAt(offset);
    if (code3 > 127) break;
    mem[ptr + offset] = code3;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function create_hash(algorithm) {
  var ptr0 = passStringToWasm0(algorithm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len0 = WASM_VECTOR_LEN;
  var ret = wasm.create_hash(ptr0, len0);
  return DenoHash.__wrap(ret);
}
function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1);
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function update_hash(hash2, data) {
  _assertClass(hash2, DenoHash);
  var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
  var len0 = WASM_VECTOR_LEN;
  wasm.update_hash(hash2.ptr, ptr0, len0);
}
var cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}
function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function digest_hash(hash2) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(hash2, DenoHash);
    wasm.digest_hash(retptr, hash2.ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v0 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v0;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
var DenoHashFinalization = new FinalizationRegistry((ptr) => wasm.__wbg_denohash_free(ptr));
var DenoHash = class _DenoHash {
  static __wrap(ptr) {
    const obj = Object.create(_DenoHash.prototype);
    obj.ptr = ptr;
    DenoHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DenoHashFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_denohash_free(ptr);
  }
};
var imports = {
  __wbindgen_placeholder__: {
    __wbindgen_string_new: function(arg0, arg1) {
      var ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    },
    __wbindgen_throw: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_rethrow: function(arg0) {
      throw takeObject(arg0);
    }
  }
};
var wasmModule = new WebAssembly.Module(decode("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QX9zcnNqQc76z8p6akEGd2ogAyALaiANIAVzIARzakELdyACaiIKajYCECAAIAEgEGogBWogAiAHaiAEIBZzIApzakELd2o2AgwLyjQCCH8EfiMAQeADayICJAAgAiABNgIMIAIgADYCCAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUF9ag4HAAcIAggDAQgLAkACQCAAQYCAwABBAxCPAUUNACAAQaiAwABBAxCPAUUNASAAQdCAwABBAxCPAQ0JIAJBsAFqQQxqQgA3AgAgAkGwAWpBFGpCADcCACACQbABakEcakIANwIAIAJBsAFqQSRqQgA3AgAgAkGwAWpBLGpCADcCACACQbABakE0akIANwIAIAJBsAFqQTxqQgA3AgAgAkIANwK0ASACQcAANgKwASACQcgCaiACQbABakHEABCXARogAkHYAGoiAyACQcgCakE8aikCADcDACACQdAAaiIEIAJByAJqQTRqKQIANwMAIAJByABqIgUgAkHIAmpBLGopAgA3AwAgAkHAAGoiBiACQcgCakEkaikCADcDACACQThqIgcgAkHIAmpBHGopAgA3AwAgAkEwaiIIIAJByAJqQRRqKQIANwMAIAJBIGpBCGoiCSACQcgCakEMaikCADcDACACIAIpAswCNwMgQeAAEAkiAUUNDCABQQA2AgggAUIANwMAIAEgAikDIDcCDCABQRRqIAkpAwA3AgAgAUEcaiAIKQMANwIAIAFBJGogBykDADcCACABQSxqIAYpAwA3AgAgAUE0aiAFKQMANwIAIAFBPGogBCkDADcCACABQcQAaiADKQMANwIAIAFB1ABqQQApAoibQDcCACABQQApAoCbQDcCTEHUgMAAIQMMHwsgAkGwAWpBDGoiAUIANwIAIAJCADcCtAEgAkEQNgKwASACQcgCakEQaiIEIAJBsAFqQRBqIgUoAgA2AgAgAkHIAmpBCGoiAyACQbABakEIaiIGKQMANwMAIAJBIGpBCGoiByACQcgCakEMaiIIKQIANwMAIAIgAikDsAE3A8gCIAIgAikCzAI3AyAgAUIANwIAIAJCADcCtAEgAkEQNgKwASAEIAUoAgA2AgAgAyAGKQMANwMAIAIgAikDsAE3A8gCIAJBEGpBCGoiBCAIKQIANwMAIAIgAikCzAI3AxAgAyAHKQMANwMAIAIgAikDIDcDyAJB1AAQCSIBRQ0JIAFBADYCACABIAIpA8gCNwIEIAFCADcCFCABIAIpAxA3AkQgAUEcakIANwIAIAFBJGpCADcCACABQSxqQgA3AgAgAUE0akIANwIAIAFBPGpCADcCACABQQxqIAMpAwA3AgAgAUHMAGogBCkDADcCAEGEgMAAIQMMHgsgAkGwAWpBDGpCADcCACACQbABakEUakIANwIAIAJBsAFqQRxqQgA3AgAgAkGwAWpBJGpCADcCACACQbABakEsakIANwIAIAJBsAFqQTRqQgA3AgAgAkGwAWpBPGpCADcCACACQgA3ArQBIAJBwAA2ArABIAJByAJqIAJBsAFqQcQAEJcBGiACQdgAaiIDIAJByAJqQTxqKQIANwMAIAJB0ABqIgQgAkHIAmpBNGopAgA3AwAgAkHIAGoiBSACQcgCakEsaikCADcDACACQcAAaiIGIAJByAJqQSRqKQIANwMAIAJBOGoiByACQcgCakEcaikCADcDACACQTBqIgggAkHIAmpBFGopAgA3AwAgAkEgakEIaiIJIAJByAJqQQxqKQIANwMAIAIgAikCzAI3AyBB4AAQCSIBRQ0JIAFBADYCCCABQgA3AwAgASACKQMgNwIMIAFBFGogCSkDADcCACABQRxqIAgpAwA3AgAgAUEkaiAHKQMANwIAIAFBLGogBikDADcCACABQTRqIAUpAwA3AgAgAUE8aiAEKQMANwIAIAFBxABqIAMpAwA3AgAgAUHUAGpBACkCiJtANwIAIAFBACkCgJtANwJMQayAwAAhAwwdCwJAAkAgAEH4gMAAQQkQjwFFDQAgAEGogcAAQQkQjwFFDQEgAEG8hMAAIAEQjwFFDQQgAEHshMAAIAEQjwFFDQUgAEGchcAAIAEQjwFFDQYgAEHMhcAAIAEQjwENCCACQQA2ArABIAJBsAFqQQRyQQBByAAQnQEaIAJByAA2ArABIAJByAJqIAJBsAFqQcwAEJcBGiACQSBqIAJByAJqQQRyQcgAEJcBGkGYAhAJIgFFDRkgAUEAQcwBEJ0BQcwBaiACQSBqQcgAEJcBGkHYhcAAIQMMHgsgAkGwAWpBDGpCADcCACACQbABakEUakIANwIAIAJBsAFqQRxqQgA3AgAgAkGwAWpBJGpCADcCACACQbABakEsakIANwIAIAJBsAFqQTRqQgA3AgAgAkGwAWpBPGpCADcCACACQgA3ArQBIAJBwAA2ArABIAJByAJqIAJBsAFqQcQAEJcBGiACQSBqQThqIgMgAkHIAmpBPGopAgA3AwAgAkEgakEwaiIEIAJByAJqQTRqKQIANwMAIAJBIGpBKGoiBSACQcgCakEsaikCADcDACACQcAAaiIGIAJByAJqQSRqKQIANwMAIAJBIGpBGGoiByACQcgCakEcaikCADcDACACQSBqQRBqIgggAkHIAmpBFGopAgA3AwAgAkEgakEIaiIJIAJByAJqQQxqKQIANwMAIAIgAikCzAI3AyBB4AAQCSIBRQ0LIAFCADcDACABQQA2AhwgASACKQMgNwIgIAFBACkDuJtANwMIIAFBEGpBACkDwJtANwMAIAFBGGpBACgCyJtANgIAIAFBKGogCSkDADcCACABQTBqIAgpAwA3AgAgAUE4aiAHKQMANwIAIAFBwABqIAYpAwA3AgAgAUHIAGogBSkDADcCACABQdAAaiAEKQMANwIAIAFB2ABqIAMpAwA3AgBBhIHAACEDDB0LIAJBsAFqQQxqQgA3AgAgAkGwAWpBFGpCADcCACACQbABakEcakIANwIAIAJBsAFqQSRqQgA3AgAgAkGwAWpBLGpCADcCACACQbABakE0akIANwIAIAJBsAFqQTxqQgA3AgAgAkIANwK0ASACQcAANgKwASACQcgCaiACQbABakHEABCXARogAkHYAGoiAyACQcgCakE8aikCADcDACACQdAAaiIEIAJByAJqQTRqKQIANwMAIAJBIGpBKGoiBSACQcgCakEsaikCADcDACACQSBqQSBqIgYgAkHIAmpBJGopAgA3AwAgAkEgakEYaiIHIAJByAJqQRxqKQIANwMAIAJBIGpBEGoiCCACQcgCakEUaikCADcDACACQSBqQQhqIgkgAkHIAmpBDGopAgA3AwAgAiACKQLMAjcDIEH4ABAJIgFFDQsgAUIANwMAIAFBADYCMCABIAIpAyA3AjQgAUEAKQOQm0A3AwggAUEQakEAKQOYm0A3AwAgAUEYakEAKQOgm0A3AwAgAUEgakEAKQOom0A3AwAgAUEoakEAKQOwm0A3AwAgAUE8aiAJKQMANwIAIAFBxABqIAgpAwA3AgAgAUHMAGogBykDADcCACABQdQAaiAGKQMANwIAIAFB3ABqIAUpAwA3AgAgAUHkAGogBCkDADcCACABQewAaiADKQMANwIAQbSBwAAhAwwcCwJAAkACQAJAIABB/IHAAEEGEI8BRQ0AIABBqILAAEEGEI8BRQ0BIABB1ILAAEEGEI8BRQ0CIABBgIPAAEEGEI8BRQ0DIABB/IXAAEEGEI8BDQkgAkHlAmoiA0EAKQOInEAiCjcAACACQd0CakEAKQOAnEAiCzcAACACQdUCakEAKQP4m0AiDDcAACACQQApA/CbQCINNwDNAkH4DhAJIgFFDRsgAUIANwMAIAEgDTcDCCABQRBqIAw3AwAgAUEYaiALNwMAIAFBIGogCjcDACABQShqQQBBwwAQnQEaIAFBADoA8A4gAUGIAWogAykAADcAACABQYMBaiACQcgCakEYaikAADcAACABQfsAaiACQcgCakEQaikAADcAACABQfMAaiACQdACaikAADcAACABIAIpAMgCNwBrQYSGwAAhAwwfCyACQbABakEMakIANwIAIAJBsAFqQRRqQgA3AgAgAkGwAWpBHGpCADcCACACQbABakEkakIANwIAIAJBsAFqQSxqQgA3AgAgAkGwAWpBNGpCADcCACACQbABakE8akIANwIAIAJCADcCtAEgAkHAADYCsAEgAkHIAmogAkGwAWpBxAAQlwEaIAJB2ABqIgMgAkHIAmpBPGopAgA3AwAgAkHQAGoiBCACQcgCakE0aikCADcDACACQcgAaiIFIAJByAJqQSxqKQIANwMAIAJBwABqIgYgAkHIAmpBJGopAgA3AwAgAkE4aiIHIAJByAJqQRxqKQIANwMAIAJBMGoiCCACQcgCakEUaikCADcDACACQSBqQQhqIgkgAkHIAmpBDGopAgA3AwAgAiACKQLMAjcDIEHwABAJIgFFDQ4gASACKQMgNwIMIAFBADYCCCABQgA3AwAgAUEcaiAIKQMANwIAIAFBFGogCSkDADcCACABQSRqIAcpAwA3AgAgAUEsaiAGKQMANwIAIAFBNGogBSkDADcCACABQTxqIAQpAwA3AgAgAUHEAGogAykDADcCACABQdQAakEAKQLUm0A3AgAgAUEAKQLMm0A3AkwgAUHkAGpBACkC5JtANwIAIAFB3ABqQQApAtybQDcCAEGEgsAAIQMMHgsgAkGwAWpBDGpCADcCACACQbABakEUakIANwIAIAJBsAFqQRxqQgA3AgAgAkGwAWpBJGpCADcCACACQbABakEsakIANwIAIAJBsAFqQTRqQgA3AgAgAkGwAWpBPGpCADcCACACQgA3ArQBIAJBwAA2ArABIAJByAJqIAJBsAFqQcQAEJcBGiACQdgAaiIDIAJByAJqQTxqKQIANwMAIAJB0ABqIgQgAkHIAmpBNGopAgA3AwAgAkHIAGoiBSACQcgCakEsaikCADcDACACQcAAaiIGIAJByAJqQSRqKQIANwMAIAJBOGoiByACQcgCakEcaikCADcDACACQTBqIgggAkHIAmpBFGopAgA3AwAgAkEgakEIaiIJIAJByAJqQQxqKQIANwMAIAIgAikCzAI3AyBB8AAQCSIBRQ0OIAEgAikDIDcCDCABQQA2AgggAUIANwMAIAFBHGogCCkDADcCACABQRRqIAkpAwA3AgAgAUEkaiAHKQMANwIAIAFBLGogBikDADcCACABQTRqIAUpAwA3AgAgAUE8aiAEKQMANwIAIAFBxABqIAMpAwA3AgAgAUHUAGpBACkD+JtANwIAIAFBACkD8JtANwJMIAFB5ABqQQApA4icQDcCACABQdwAakEAKQOAnEA3AgBBsILAACEDDB0LIAJBADYCsAEgAkGwAWpBBHJBAEGAARCdARogAkGAATYCsAEgAkHIAmogAkGwAWpBhAEQlwEaIAJBIGogAkHIAmpBBHJBgAEQlwEaQdgBEAkiAUUNDiABQgA3AwggAUIANwMAIAFBADYCUCABQQApA5CcQDcDECABQRhqQQApA5icQDcDACABQSBqQQApA6CcQDcDACABQShqQQApA6icQDcDACABQTBqQQApA7CcQDcDACABQThqQQApA7icQDcDACABQcAAakEAKQPAnEA3AwAgAUHIAGpBACkDyJxANwMAIAFB1ABqIAJBIGpBgAEQlwEaQdyCwAAhAwwcCyACQQA2ArABIAJBsAFqQQRyQQBBgAEQnQEaIAJBgAE2ArABIAJByAJqIAJBsAFqQYQBEJcBGiACQSBqIAJByAJqQQRyQYABEJcBGkHYARAJIgFFDQ4gAUIANwMIIAFCADcDACABQQA2AlAgAUEAKQPQnEA3AxAgAUEYakEAKQPYnEA3AwAgAUEgakEAKQPgnEA3AwAgAUEoakEAKQPonEA3AwAgAUEwakEAKQPwnEA3AwAgAUE4akEAKQP4nEA3AwAgAUHAAGpBACkDgJ1ANwMAIAFByABqQQApA4idQDcDACABQdQAaiACQSBqQYABEJcBGkGIg8AAIQMMGwsCQAJAAkAgACkAAELz0IWb08WMmTRRDQAgACkAAELz0IWb08XMmjZRDQEgACkAAELz0IWb0+WMnDRRDQIgACkAAELz0IWb06XNmDJSDQcgAkEANgKwASACQbABakEEckEAQcgAEJ0BGiACQcgANgKwASACQcgCaiACQbABakHMABCXARogAkEgaiACQcgCakEEckHIABCXARpBmAIQCSIBRQ0UIAFBAEHMARCdAUHMAWogAkEgakHIABCXARpBmITAACEDDB0LIAJBADYCsAEgAkGwAWpBBHJBAEGQARCdARogAkGQATYCsAEgAkHIAmogAkGwAWpBlAEQlwEaIAJBIGogAkHIAmpBBHJBkAEQlwEaQeACEAkiAUUNECABQQBBzAEQnQFBzAFqIAJBIGpBkAEQlwEaQayDwAAhAwwcCyACQQA2ArABIAJBsAFqQQRyQQBBiAEQnQEaIAJBiAE2ArABIAJByAJqIAJBsAFqQYwBEJcBGiACQSBqIAJByAJqQQRyQYgBEJcBGkHYAhAJIgFFDRAgAUEAQcwBEJ0BQcwBaiACQSBqQYgBEJcBGkHQg8AAIQMMGwsgAkEANgKwASACQbABakEEckEAQegAEJ0BGiACQegANgKwASACQcgCaiACQbABakHsABCXARogAkEgaiACQcgCakEEckHoABCXARpBuAIQCSIBRQ0QIAFBAEHMARCdAUHMAWogAkEgakHoABCXARpB9IPAACEDDBoLIAJBADYCsAEgAkGwAWpBBHJBAEGQARCdARogAkGQATYCsAEgAkHIAmogAkGwAWpBlAEQlwEaIAJBIGogAkHIAmpBBHJBkAEQlwEaQeACEAkiAUUNESABQQBBzAEQnQFBzAFqIAJBIGpBkAEQlwEaQciEwAAhAwwZCyACQQA2ArABIAJBsAFqQQRyQQBBiAEQnQEaIAJBiAE2ArABIAJByAJqIAJBsAFqQYwBEJcBGiACQSBqIAJByAJqQQRyQYgBEJcBGkHYAhAJIgFFDREgAUEAQcwBEJ0BQcwBaiACQSBqQYgBEJcBGkH4hMAAIQMMGAsgAkEANgKwASACQbABakEEckEAQegAEJ0BGiACQegANgKwASACQcgCaiACQbABakHsABCXARogAkEgaiACQcgCakEEckHoABCXARpBuAIQCSIBRQ0RIAFBAEHMARCdAUHMAWogAkEgakHoABCXARpBqIXAACEDDBcLIAAoAABB89CFiwNGDRULIAJBATYCJCACIAJBCGo2AiBBOBAJIgNFDRIgAkI4NwK0ASACIAM2ArABIAIgAkGwAWo2AhAgAkHcAmpBATYCACACQgE3AswCIAJBxIbAADYCyAIgAiACQSBqNgLYAiACQRBqQYyHwAAgAkHIAmoQGw0TIAIoArABIAIoArgBEAAhAwJAIAIoArQBRQ0AIAIoArABEA8LAkAgAUUNACAAEA8LIAMQtQEAC0HUAEEEQQAoArynQCICQQIgAhsRBAAAC0HgAEEIQQAoArynQCICQQIgAhsRBAAAC0HgAEEIQQAoArynQCICQQIgAhsRBAAAC0HgAEEIQQAoArynQCICQQIgAhsRBAAAC0H4AEEIQQAoArynQCICQQIgAhsRBAAAC0HwAEEIQQAoArynQCICQQIgAhsRBAAAC0HwAEEIQQAoArynQCICQQIgAhsRBAAAC0HYAUEIQQAoArynQCICQQIgAhsRBAAAC0HYAUEIQQAoArynQCICQQIgAhsRBAAAC0HgAkEIQQAoArynQCICQQIgAhsRBAAAC0HYAkEIQQAoArynQCICQQIgAhsRBAAAC0G4AkEIQQAoArynQCICQQIgAhsRBAAAC0GYAkEIQQAoArynQCICQQIgAhsRBAAAC0HgAkEIQQAoArynQCICQQIgAhsRBAAAC0HYAkEIQQAoArynQCICQQIgAhsRBAAAC0G4AkEIQQAoArynQCICQQIgAhsRBAAAC0GYAkEIQQAoArynQCICQQIgAhsRBAAAC0H4DkEIQQAoArynQCICQQIgAhsRBAAAC0E4QQFBACgCvKdAIgJBAiACGxEEAAALQaSHwABBMyACQcgCakHYh8AAQeiHwAAQfwALIAJBsAFqQQxqQgA3AgAgAkGwAWpBFGpCADcCACACQbABakEcakIANwIAIAJBsAFqQSRqQgA3AgAgAkGwAWpBLGpCADcCACACQbABakE0akIANwIAIAJBsAFqQTxqQgA3AgAgAkIANwK0ASACQcAANgKwASACQcgCaiACQbABakHEABCXARogAkEgakE4aiIDIAJByAJqQTxqKQIANwMAIAJBIGpBMGoiBCACQcgCakE0aikCADcDACACQSBqQShqIgUgAkHIAmpBLGopAgA3AwAgAkHAAGoiBiACQcgCakEkaikCADcDACACQSBqQRhqIgcgAkHIAmpBHGopAgA3AwAgAkEgakEQaiIIIAJByAJqQRRqKQIANwMAIAJBIGpBCGoiCSACQcgCakEMaikCADcDACACIAIpAswCNwMgQeAAEAkiAUUNASABQgA3AwAgAUEANgIcIAEgAikDIDcCICABQQApA7ibQDcDCCABQRBqQQApA8CbQDcDACABQRhqQQAoAsibQDYCACABQShqIAkpAwA3AgAgAUEwaiAIKQMANwIAIAFBOGogBykDADcCACABQcAAaiAGKQMANwIAIAFByABqIAUpAwA3AgAgAUHQAGogBCkDADcCACABQdgAaiADKQMANwIAQdiBwAAhAwsgABAPAkBBDBAJIgANAEEMQQRBACgCvKdAIgJBAiACGxEEAAALIAAgAzYCCCAAIAE2AgQgAEEANgIAIAJB4ANqJAAgAA8LQeAAQQhBACgCvKdAIgJBAiACGxEEAAALuSQBU38jAEHAAGsiA0E4akIANwMAIANBMGpCADcDACADQShqQgA3AwAgA0EgakIANwMAIANBGGpCADcDACADQRBqQgA3AwAgA0EIakIANwMAIANCADcDACAAKAIQIQQgACgCDCEFIAAoAgghBiAAKAIEIQcgACgCACEIAkAgAkEGdCICRQ0AIAEgAmohCQNAIAMgASgAACICQRh0IAJBCHRBgID8B3FyIAJBCHZBgP4DcSACQRh2cnI2AgAgAyABQQRqKAAAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYCBCADIAFBCGooAAAiAkEYdCACQQh0QYCA/AdxciACQQh2QYD+A3EgAkEYdnJyNgIIIAMgAUEMaigAACICQRh0IAJBCHRBgID8B3FyIAJBCHZBgP4DcSACQRh2cnI2AgwgAyABQRBqKAAAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYCECADIAFBFGooAAAiAkEYdCAC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E3M2AgAgACACIBFzQRl3IAVzNgIUIAAgDSAQc0EZdyAHczYCECAAIA4gBnNBGXcgDHM2AhwgACAPIAhzQRl3IAFzNgIYC98ZAht/An4jAEGwAmsiAyQAAkACQAJAAkACQAJAAkACQAJAAkACQCAAQekAai0AAEEGdCAALQBoaiIERQ0AIAAgASACQYAIIARrIgQgBCACSxsiBRA5GiACIAVrIgJFDQEgA0H4AGpBEGogAEEQaiIEKQMANwMAIANB+ABqQRhqIABBGGoiBikDADcDACADQfgAakEgaiAAQSBqIgcpAwA3AwAgA0H4AGpBMGogAEEwaikDADcDACADQfgAakE4aiAAQThqKQMANwMAIANB+ABqQcAAaiAAQcAAaikDADcDACADQfgAakHIAGogAEHIAGopAwA3AwAgA0H4AGpB0ABqIABB0ABqKQMANwMAIANB+ABqQdgAaiAAQdgAaikDADcDACADQfgAakHgAGogAEHgAGopAwA3AwAgAyAAKQMINwOAASADIAApAyg3A6ABIABB6QBqLQAAIQggAC0AaiEJIAMgAC0AaCIKOgDgASADIAApAwAiHjcDeCADIAkgCEVyQQJyIgg6AOEBIANB6AFqQRhqIgkgBykCADcDACADQegBakEQaiIHIAYpAgA3AwAgA0HoAWpBCGoiBiAEKQIANwMAIAMgACkCCDcD6AEgA0HoAWogA0H4AGpBKGogCiAeIAgQCiAJKAIAIQggBygCACEHIAYoAgAhCSADKAKEAiEKIAMoAvwBIQsgAygC9AEhDCADKALsASENIAMoAugBIQ4gACAAKQMAEBcgAEHwDmoiDy0AACIGQTdPDQIgACAGQQV0aiIEQZABaiAONgIAIARBrAFqIAo2AgAgBEGoAWogCDYCACAEQaQBaiALNgIAIARBoAFqIAc2AgAgBEGcAWogDDYCACAEQZgBaiAJNgIAIARBlAFqIA02AgAgDyAGQQFqOgAAIABBKGoiBEIANwMAIARBCGpCADcDACAEQRBqQgA3AwAgBEEYakIANwMAIARBIGpCADcDACAEQShqQgA3AwAgBEEwakIANwMAIARBOGpCADcDACAAQQA7AWggAEEIaiIEIAApA3A3AwAgBEEIaiAAQfgAaikDADcDACAEQRBqIABBgAFqKQMANwMAIARBGGogAEGIAWopAwA3AwAgACAAKQMAQgF8NwMAIAEgBWohAQsCQCACQYEISQ0AIABBkAFqIQ4gAEHwAGohByAAKQMAIR8gA0EIakEoaiEKIANBCGpBCGohDSADQfgAakEoaiEJIANB+ABqQQhqIQsgAEHwDmohDANAIB9CCoYhHkF/IAJBAXZndkEBaiEFA0AgBSIEQQF2IQUgHiAEQX9qrYNCAFINAAsgBEEKdq0hHgJAAkAgBEGBCEkNACACIARJDQYgAC0AaiEIIANB+ABqQThqQgA3AwAgA0H4AGpBMGpCADcDACAJQgA3AwAgA0H4AGpBIGpCADcDACADQfgAakEYakIANwMAIANB+ABqQRBqQgA3AwAgC0IANwMAIANCADcDeCABIAQgByAfIAggA0H4AGpBwAAQDiEFIANBkAJqQRhqQgA3AwAgA0GQAmpBEGpCADcDACADQZACakEIakIANwMAIANCADcDkAICQCAFQQNJDQADQCAFQQV0IgVBwQBPDQkgA0H4AGogBSAHIAggA0GQAmpBIBAhIgVBBXQiBkHBAE8NCiAGQSFPDQsgA0H4AGogA0GQAmogBhCXARogBUECSw0ACwsgAygCtAEhECADKAKwASERIAMoAqwBIRIgAygCqAEhEyADKAKkASEUIAMoAqABIRUgAygCnAEhFiADKAKYASEXIAMoApQBIQggAygCkAEhDyADKAKMASEYIAMoAogBIRkgAygChAEhGiADKAKAASEbIAMoAnwhHCADKAJ4IR0gACAAKQMAEBcgDC0AACIGQTdPDQogDiAGQQV0aiIFIB02AgAgBSAINgIcIAUgDzYCGCAFIBg2AhQgBSAZNgIQIAUgGjYCDCAFIBs2AgggBSAcNgIEIAwgBkEBajoAACAAIAApAwAgHkIBiHwQFyAMLQAAIgZBN08NCyAOIAZBBXRqIgUgFzYCACAFIBA2AhwgBSARNgIYIAUgEjYCFCAFIBM2AhAgBSAUNgIMIAUgFTYCCCAFIBY2AgQgDCAGQQFqOgAADAELIAlCADcDACAJQQhqIg9CADcDACAJQRBqIhhCADcDACAJQRhqIhlCADcDACAJQSBqIhpCADcDACAJQShqIhtCADcDACAJQTBqIhxCADcDACAJQThqIh1CADcDACALIAcpAwA3AwAgC0EIaiIFIAdBCGopAwA3AwAgC0EQaiIGIAdBEGopAwA3AwAgC0EYaiIIIAdBGGopAwA3AwAgA0EAOwHgASADIB83A3ggAyAALQBqOgDiASADQfgAaiABIAQQORogDSALKQMANwMAIA1BCGogBSkDADcDACANQRBqIAYpAwA3AwAgDUEYaiAIKQMANwMAIAogCSkDADcDACAKQQhqIA8pAwA3AwAgCkEQaiAYKQMANwMAIApBGGogGSkDADcDACAKQSBqIBopAwA3AwAgCkEoaiAbKQMANwMAIApBMGogHCkDADcDACAKQThqIB0pAwA3AwAgAy0A4gEhDyADLQDhASEYIAMgAy0A4AEiGToAcCADIAMpA3giHzcDCCADIA8gGEVyQQJyIg86AHEgA0HoAWpBGGoiGCAIKQIANwMAIANB6AFqQRBqIgggBikCADcDACADQegBakEIaiIGIAUpAgA3AwAgAyALKQIANwPoASADQegBaiAKIBkgHyAPEAogGCgCACEPIAgoAgAhCCAGKAIAIRggAygChAIhGSADKAL8ASEaIAMoAvQBIRsgAygC7AEhHCADKALoASEdIAAgACkDABAXIAwtAAAiBkE3Tw0LIA4gBkEFdGoiBSAdNgIAIAUgGTYCHCAFIA82AhggBSAaNgIUIAUgCDYCECAFIBs2AgwgBSAYNgIIIAUgHDYCBCAMIAZBAWo6AAALIAAgACkDACAefCIfNwMAIAIgBEkNCyABIARqIQEgAiAEayICQYAISw0ACwsgAkUNACAAIAEgAhA5GiAAIAApAwAQFwsgA0GwAmokAA8LIANBkAJqQQhqIgQgCTYCACADQZACakEQaiIFIAc2AgAgA0GQAmpBGGoiBiAINgIAIAMgDDYCnAIgA0GBAWoiByAEKQIANwAAIAMgCzYCpAIgA0GJAWoiBCAFKQIANwAAIAMgCjYCrAIgA0GRAWoiBSAGKQIANwAAIAMgDTYClAIgAyAONgKQAiADIAMpApACNwB5IANBCGpBGGogBSkAADcDACADQQhqQRBqIAQpAAA3AwAgA0EIakEIaiAHKQAANwMAIAMgAykAeTcDCEGQncAAQSsgA0EIakHMi8AAQfCKwAAQfwALIAQgAkGgisAAEIUBAAsgBUHAAEGMicAAEIUBAAsgBkHAAEGcicAAEIUBAAsgBkEgQayJwAAQhQEACyADQZACakEIaiIEIBs2AgAgA0GQAmpBEGoiBSAZNgIAIANBkAJqQRhqIgYgDzYCACADIBo2ApwCIANBgQFqIgcgBCkDADcAACADIBg2AqQCIANBiQFqIgQgBSkDADcAACADIAg2AqwCIANBkQFqIgUgBikDADcAACADIBw2ApQCIAMgHTYCkAIgAyADKQOQAjcAeSADQQhqQRhqIAUpAAA3AwAgA0EIakEQaiAEKQAANwMAIANBCGpBCGogBykAADcDACADIAMpAHk3AwhBkJ3AAEErIANBCGpBzIvAAEHwisAAEH8ACyADQZACakEIaiIEIBU2AgAgA0GQAmpBEGoiBSATNgIAIANBkAJqQRhqIgYgETYCACADIBQ2ApwCIANBgQFqIgcgBCkDADcAACADIBI2AqQCIANBiQFqIgQgBSkDADcAACADIBA2AqwCIANBkQFqIgUgBikDADcAACADIBY2ApQCIAMgFzYCkAIgAyADKQOQAjcAeSADQQhqQRhqIAUpAAA3AwAgA0EIakEQaiAEKQAANwMAIANBCGpBCGogBykAADcDACADIAMpAHk3AwhBkJ3AAEErIANBCGpBzIvAAEHwisAAEH8ACyADQZgCaiIEIBg2AgAgA0GgAmoiBSAINgIAIANBqAJqIgYgDzYCACADIBs2ApwCIANB8QFqIgcgBCkDADcAACADIBo2AqQCIANB+QFqIgggBSkDADcAACADIBk2AqwCIANBgQJqIgAgBikDADcAACADIBw2ApQCIAMgHTYCkAIgAyADKQOQAjcA6QEgBiAAKQAANwMAIAUgCCkAADcDACAEIAcpAAA3AwAgAyADKQDpATcDkAJBkJ3AAEErIANBkAJqQcyLwABB8IrAABB/AAsgBCACQbCKwAAQhAEAC+oRARh/IwAhAiAAKAIAIQMgACgCCCEEIAAoAgwhBSAAKAIEIQYgAkHAAGsiAkEYaiIHQgA3AwAgAkEgaiIIQgA3AwAgAkE4aiIJQgA3AwAgAkEwaiIKQgA3AwAgAkEoaiILQgA3AwAgAkEIaiIMIAEpAAg3AwAgAkEQaiINIAEpABA3AwAgByABKAAYIg42AgAgCCABKAAgIg82AgAgAiABKQAANwMAIAIgASgAHCIQNgIcIAIgASgAJCIRNgIkIAsgASgAKCISNgIAIAIgASgALCILNgIsIAogASgAMCITNgIAIAIgASgANCIKNgI0IAkgASgAOCIUNgIAIAIgASgAPCIJNgI8IAAgAyANKAIAIg0gDyATIAIoAgAiFSARIAogAigCBCIWIAIoAhQiFyAKIBEgFyAWIBMgDyANIAYgFSADIAQgBnFqIAUgBkF/c3FqakH4yKq7fWpBB3dqIgFqIAYgAigCDCIYaiAEIAwoAgAiDGogBSAWaiABIAZxaiAEIAFBf3NxakHW7p7GfmpBDHcgAWoiAiABcWogBiACQX9zcWpB2+GBoQJqQRF3IAJqIgcgAnFqIAEgB0F/c3FqQe6d9418akEWdyAHaiIBIAdxaiACIAFBf3NxakGvn/Crf2pBB3cgAWoiCGogECABaiAOIAdqIBcgAmogCCABcWogByAIQX9zcWpBqoyfvARqQQx3IAhqIgIgCHFqIAEgAkF/c3FqQZOMwcF6akERdyACaiIBIAJxaiAIIAFBf3NxakGBqppqakEWdyABaiIHIAFxaiACIAdBf3NxakHYsYLMBmpBB3cgB2oiCGogCyAHaiASIAFqIBEgAmogCCAHcWogASAIQX9zcWpBr++T2nhqQQx3IAhqIgIgCHFqIAcgAkF/c3FqQbG3fWpBEXcgAmoiASACcWogCCABQX9zcWpBvq/zynhqQRZ3IAFqIgcgAXFqIAIgB0F/c3FqQaKiwNwGakEHdyAHaiIIaiAUIAFqIAogAmogCCAHcWogASAIQX9zcWpBk+PhbGpBDHcgCGoiAiAIcWogByACQX9zIhlxakGOh+WzempBEXcgAmoiASAZcWogCSAHaiABIAJxaiAIIAFBf3MiGXFqQaGQ0M0EakEWdyABaiIHIAJxakHiyviwf2pBBXcgB2oiCGogCyABaiAIIAdBf3NxaiAOIAJqIAcgGXFqIAggAXFqQcDmgoJ8akEJdyAIaiICIAdxakHRtPmyAmpBDncgAmoiASACQX9zcWogFSAHaiACIAhBf3NxaiABIAhxakGqj9vNfmpBFHcgAWoiByACcWpB3aC8sX1qQQV3IAdqIghqIAkgAWogCCAHQX9zcWogEiACaiAHIAFBf3NxaiAIIAFxakHTqJASakEJdyAIaiICIAdxakGBzYfFfWpBDncgAmoiASACQX9zcWogDSAHaiACIAhBf3NxaiABIAhxakHI98++fmpBFHcgAWoiByACcWpB5puHjwJqQQV3IAdqIghqIBggAWogCCAHQX9zcWogFCACaiAHIAFBf3NxaiAIIAFxakHWj9yZfGpBCXcgCGoiAiAHcWpBh5vUpn9qQQ53IAJqIgEgAkF/c3FqIA8gB2ogAiAIQX9zcWogASAIcWpB7anoqgRqQRR3IAFqIgcgAnFqQYXSj896akEFdyAHaiIIaiATIAdqIAwgAmogByABQX9zcWogCCABcWpB+Me+Z2pBCXcgCGoiAiAIQX9zcWogECABaiAIIAdBf3NxaiACIAdxakHZhby7BmpBDncgAmoiByAIcWpBipmp6XhqQRR3IAdqIgggB3MiGSACc2pBwvJoakEEdyAIaiIBaiALIAdqIAEgCHMgDyACaiAZIAFzakGB7ce7eGpBC3cgAWoiAnNqQaLC9ewGakEQdyACaiIHIAJzIBQgCGogAiABcyAHc2pBjPCUb2pBF3cgB2oiAXNqQcTU+6V6akEEdyABaiIIaiAQIAdqIAggAXMgDSACaiABIAdzIAhzakGpn/veBGpBC3cgCGoiAnNqQeCW7bV/akEQdyACaiIHIAJzIBIgAWogAiAIcyAHc2pB8Pj+9XtqQRd3IAdqIgFzakHG/e3EAmpBBHcgAWoiCGogGCAHaiAIIAFzIBUgAmogASAHcyAIc2pB+s+E1X5qQQt3IAhqIgJzakGF4bynfWpBEHcgAmoiByACcyAOIAFqIAIgCHMgB3NqQYW6oCRqQRd3IAdqIgFzakG5oNPOfWpBBHcgAWoiCGogDCABaiATIAJqIAEgB3MgCHNqQeWz7rZ+akELdyAIaiICIAhzIAkgB2ogCCABcyACc2pB+PmJ/QFqQRB3IAJqIgFzakHlrLGlfGpBF3cgAWoiByACQX9zciABc2pBxMSkoX9qQQZ3IAdqIghqIBcgB2ogFCABaiAQIAJqIAggAUF/c3IgB3NqQZf/q5kEakEKdyAIaiICIAdBf3NyIAhzakGnx9DcempBD3cgAmoiASAIQX9zciACc2pBucDOZGpBFXcgAWoiByACQX9zciABc2pBw7PtqgZqQQZ3IAdqIghqIBYgB2ogEiABaiAYIAJqIAggAUF/c3IgB3NqQZKZs/h4akEKdyAIaiICIAdBf3NyIAhzakH96L9/akEPdyACaiIBIAhBf3NyIAJzakHRu5GseGpBFXcgAWoiByACQX9zciABc2pBz/yh/QZqQQZ3IAdqIghqIAogB2ogDiABaiAJIAJqIAggAUF/c3IgB3NqQeDNs3FqQQp3IAhqIgIgB0F/c3IgCHNqQZSGhZh6akEPdyACaiIBIAhBf3NyIAJzakGho6DwBGpBFXcgAWoiByACQX9zciABc2pBgv3Nun9qQQZ3IAdqIghqNgIAIAAgBSALIAJqIAggAUF/c3IgB3NqQbXk6+l7akEKdyAIaiICajYCDCAAIAQgDCABaiACIAdBf3NyIAhzakG7pd/WAmpBD3cgAmoiAWo2AgggACABIAZqIBEgB2ogASAIQX9zciACc2pBkaeb3H5qQRV3ajYCBAuYEAEFfyAAIAEtAAAiAjoAECAAIAEtAAEiAzoAESAAIAEtAAIiBDoAEiAAIAEtAAMiBToAEyAAIAEtAAQiBjoAFCAAIAIgAC0AAHM6ACAgACADIAAtAAFzOgAhIAAgBCAALQACczoAIiAAIAUgAC0AA3M6ACMgACAGIAAtAARzOgAkIAAgAS0ABSICOgAVIAAgAS0ABiIDOgAWIAAgAS0AByIEOgAXIAAgAS0ACCIFOgAYIAAgAS0ACSIGOgAZIAAgAiAALQAFczoAJSAAIAMgAC0ABnM6ACYgACAEIAAtAAdzOgAnIAAgBSAALQAIczoAKCAAIAEtAAoiAjoAGiAAIAEtAAsiAzoAGyAAIAEtAAwiBDoAHCAAIAEtAA0iBToAHSAAIAYgAC0ACXM6ACkgACACIAAtAApzOgAqIAAgAyAALQALczoAKyAAIAQgAC0ADHM6ACwgACAFIAAtAA1zOgAtIAAgAS0ADiICOgAeIAAgAiAALQAOczoALiAAIAEtAA8iAjoAHyAAIAIgAC0AD3M6AC9BACECQQAhAwNAIAAgA2oiBCAELQAAIAJB/wFxQZiYwABqLQAAcyICOgAAIANBAWoiA0EwRw0AC0EAIQMDQCAAIANqIgQgBC0AACACQf8BcUGYmMAAai0AAHMiAjoAACADQQFqIgNBMEcNAAsgAkEBaiEDQQAhAgNAIAAgAmoiBCAELQAAIANB/wFxQZiYwABqLQAAcyIDOgAAIAJBAWoiAkEwRw0ACyADQQJqIQNBACECA0AgACACaiIEIAQtAAAgA0H/AXFBmJjAAGotAABzIgM6AAAgAkEBaiICQTBHDQALIANBA2ohA0EAIQIDQCAAIAJqIgQgBC0AACADQf8BcUGYmMAAai0AAHMiAzoAACACQQFqIgJBMEcNAAsgA0EEaiEDQQAhAgNAIAAgAmoiBCAELQAAIANB/wFxQZiYwABqLQAAcyIDOgAAIAJBAWoiAkEwRw0ACyADQQVqIQNBACECA0AgACACaiIEIAQtAAAgA0H/AXFBmJjAAGotAABzIgM6AAAgAkEBaiICQTBHDQALIANBBmohA0EAIQIDQCAAIAJqIgQgBC0AACADQf8BcUGYmMAAai0AAHMiAzoAACACQQFqIgJBMEcNAAsgA0EHaiEDQQAhAgNAIAAgAmoiBCAELQAAIANB/wFxQZiYwABqLQAAcyIDOgAAIAJBAWoiAkEwRw0ACyADQQhqIQNBACECA0AgACACaiIEIAQtAAAgA0H/AXFBmJjAAGotAABzIgM6AAAgAkEBaiICQTBHDQALIANBCWohA0EAIQIDQCAAIAJqIgQgBC0AACADQf8BcUGYmMAAai0AAHMiAzoAACACQQFqIgJBMEcNAAsgA0EKaiEDQQAhAgNAIAAgAmoiBCAELQAAIANB/wFxQZiYwABqLQAAcyIDOgAAIAJBAWoiAkEwRw0ACyADQQtqIQNBACECA0AgACACaiIEIAQtAAAgA0H/AXFBmJjAAGotAABzIgM6AAAgAkEBaiICQTBHDQALIANBDGohA0EAIQIDQCAAIAJqIgQgBC0AACADQf8BcUGYmMAAai0AAHMiAzoAACACQQFqIgJBMEcNAAsgA0ENaiEDQQAhAgNAIAAgAmoiBCAELQAAIANB/wFxQZiYwABqLQAAcyIDOgAAIAJBAWoiAkEwRw0ACyADQQ5qIQNBACECA0AgACACaiIEIAQtAAAgA0H/AXFBmJjAAGotAABzIgM6AAAgAkEBaiICQTBHDQALIANBD2ohA0EAIQIDQCAAIAJqIgQgBC0AACADQf8BcUGYmMAAai0AAHMiAzoAACACQQFqIgJBMEcNAAsgA0EQaiEDQQAhAgNAIAAgAmoiBCAELQAAIANB/wFxQZiYwABqLQAAcyIDOgAAIAJBAWoiAkEwRw0ACyAAIAAtADAgAS0AACAAQT9qIgItAABzQZiYwABqLQAAcyIDOgAwIABBMWoiBCAELQAAIAEtAAEgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBMmoiBCAELQAAIAEtAAIgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBM2oiBCAELQAAIAEtAAMgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBNGoiBCAELQAAIAEtAAQgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBNWoiBCAELQAAIAEtAAUgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBNmoiBCAELQAAIAEtAAYgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBN2oiBCAELQAAIAEtAAcgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBOGoiBCAELQAAIAEtAAggA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBOWoiBCAELQAAIAEtAAkgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBOmoiBCAELQAAIAEtAAogA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBO2oiBCAELQAAIAEtAAsgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBPGoiBCAELQAAIAEtAAwgA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBPWoiBCAELQAAIAEtAA0gA3NB/wFxQZiYwABqLQAAcyIDOgAAIABBPmoiACAALQAAIAEtAA4gA3NB/wFxQZiYwABqLQAAcyIAOgAAIAIgAi0AACABLQAPIABzQf8BcUGYmMAAai0AAHM6AAALyg4CDn8BfiMAQaACayIHJAACQAJAAkACQAJAAkACQAJAAkAgAUGBCEkNAEF/IAFBf2pBC3YiCGd2QQp0QYAIakGACCAIGyIIIAFLDQMgB0EIakEAQYABEJ0BGiABIAhrIQkgACAIaiEKIAhBCnatIAN8IRUgCEGACEcNASAHQQhqQSBqIQtB4AAhASAAQYAIIAIgAyAEIAdBCGpBIBAOIQgMAgsgB0IANwOIAUEAIQsCQCABQYB4cSIMRQ0AQQAgDGshCkEBIQkgACEIA0AgCUEBcUUNBUEBIQsgB0EBOgCMASAHIAg2AogBIAhBgAhqIQhBACEJIApBgAhqIgoNAAsLIAFB/wdxIQkCQCAGQQV2IgggDEEARyIKIAogCEsbRQ0AIAcoAogBIQggB0EIakEYaiIKIAJBGGopAgA3AwAgB0EIakEQaiILIAJBEGopAgA3AwAgB0EIakEIaiIBIAJBCGopAgA3AwAgByACKQIANwMIIAdBCGogCEHAACADIARBAXIQCiAHQQhqIAhBwABqQcAAIAMgBBAKIAdBCGogCEGAAWpBwAAgAyAEEAogB0EIaiAIQcABakHAACADIAQQCiAHQQhqIAhBgAJqQcAAIAMgBBAKIAdBCGogCEHAAmpBwAAgAyAEEAogB0EIaiAIQYADakHAACADIAQQCiAHQQhqIAhBwANqQcAAIAMgBBAKIAdBCGogCEGABGpBwAAgAyAEEAogB0EIaiAIQcAEakHAACADIAQQCiAHQQhqIAhBgAVqQcAAIAMgBBAKIAdBCGogCEHABWpBwAAgAyAEEAogB0EIaiAIQYAGakHAACADIAQQCiAHQQhqIAhBwAZqQcAAIAMgBBAKIAdBCGogCEGAB2pBwAAgAyAEEAogB0EIaiAIQcAHakHAACADIARBAnIQCiAFIAopAwA3ABggBSALKQMANwAQIAUgASkDADcACCAFIAcpAwg3AAAgBy0AjAEhCwsgC0H/AXEhCAJAIAkNACAIQQBHIQgMCAsgB0GQAWpBMGoiDUIANwMAIAdBkAFqQThqIg5CADcDACAHQZABakHAAGoiD0IANwMAIAdBkAFqQcgAaiIQQgA3AwAgB0GQAWpB0ABqIhFCADcDACAHQZABakHYAGoiEkIANwMAIAdBkAFqQeAAaiITQgA3AwAgB0GQAWpBIGoiCiACQRhqKQIANwMAIAdBkAFqQRhqIgEgAkEQaikCADcDACAHQZABakEQaiIUIAJBCGopAgA3AwAgB0IANwO4ASAHIAQ6APoBIAcgAikCADcDmAEgB0EAOwH4ASAHIAhBAEciCK0gA3w3A5ABIAdBkAFqIAAgDGogCRA5GiAHQQhqQRBqIBQpAwA3AwAgB0EIakEYaiABKQMANwMAIAdBCGpBIGogCikDADcDACAHQQhqQTBqIA0pAwA3AwAgB0EIakE4aiAOKQMANwMAIAdBCGpBwABqIA8pAwA3AwAgB0EIakHIAGogECkDADcDACAHQQhqQdAAaiARKQMANwMAIAdBCGpB2ABqIBIpAwA3AwAgB0EIakHgAGogEykDADcDACAHIAcpA5gBNwMQIAcgBykDuAE3AzAgBy0A+gEhCSAHLQD5ASEEIAcgBy0A+AEiAjoAcCAHIAcpA5ABIgM3AwggByAJIARFckECciIJOgBxIAdBgAJqQRhqIgQgCikDADcDACAHQYACakEQaiIKIAEpAwA3AwAgB0GAAmpBCGoiASAUKQMANwMAIAcgBykDmAE3A4ACIAdBgAJqIAdBMGogAiADIAkQCiAIQQV0IghBIGoiCSAGSw0EIAQoAgAhCSAKKAIAIQogASgCACEEIAcoApQCIQIgBygCjAIhASAHKAKEAiEAIAcoAoACIQYgBSAIaiIIIAcoApwCNgAcIAggCTYAGCAIIAI2ABQgCCAKNgAQIAggATYADCAIIAQ2AAggCCAANgAEIAggBjYAAEECQQEgC0H/AXEbIQgMBwtBwAAhASAHQQhqQcAAaiELIAAgCCACIAMgBCAHQQhqQcAAEA4hCAsgCiAJIAIgFSAEIAsgARAOIQkCQCAIQQFHDQAgBkE/TQ0EIAUgBykACDcAACAFQThqIAdBCGpBOGopAAA3AAAgBUEwaiAHQQhqQTBqKQAANwAAIAVBKGogB0EIakEoaikAADcAACAFQSBqIAdBCGpBIGopAAA3AAAgBUEYaiAHQQhqQRhqKQAANwAAIAVBEGogB0EIakEQaikAADcAACAFQQhqIAdBCGpBCGopAAA3AABBAiEIDAYLIAkgCGpBBXQiCEGBAU8NBCAHQQhqIAggAiAEIAUgBhAhIQgMBQtBvInAAEEjQeCJwAAQlAEACyAHIAg2AghBkJ3AAEErIAdBCGpB3IvAAEHwisAAEH8ACyAJIAZB7IjAABCFAQALQcAAIAZB8InAABCFAQALIAhBgAFBgIrAABCFAQALIAdBoAJqJAAgCAvMDgEHfyAAQXhqIgEgAEF8aigCACICQXhxIgBqIQMCQAJAIAJBAXENACACQQNxRQ0BIAEoAgAiAiAAaiEAAkBBACgChKdAIAEgAmsiAUcNACADKAIEQQNxQQNHDQFBACAANgL8pkAgAyADKAIEQX5xNgIEIAEgAEEBcjYCBCABIABqIAA2AgAPCwJAAkAgAkGAAkkNACABKAIYIQQCQAJAIAEoAgwiBSABRw0AIAFBFEEQIAEoAhQiBRtqKAIAIgINAUEAIQUMAwsgASgCCCICIAU2AgwgBSACNgIIDAILIAFBFGogAUEQaiAFGyEGA0AgBiEHAkAgAiIFQRRqIgYoAgAiAg0AIAVBEGohBiAFKAIQIQILIAINAAsgB0EANgIADAELAkAgAUEMaigCACIFIAFBCGooAgAiBkYNACAGIAU2AgwgBSAGNgIIDAILQQBBACgC7KNAQX4gAkEDdndxNgLso0AMAQsgBEUNAAJAAkAgASgCHEECdEH8pcAAaiICKAIAIAFGDQAgBEEQQRQgBCgCECABRhtqIAU2AgAgBUUNAgwBCyACIAU2AgAgBQ0AQQBBACgC8KNAQX4gASgCHHdxNgLwo0AMAQsgBSAENgIYAkAgASgCECICRQ0AIAUgAjYCECACIAU2AhgLIAEoAhQiAkUNACAFQRRqIAI2AgAgAiAFNgIYCwJAAkAgAygCBCICQQJxRQ0AIAMgAkF+cTYCBCABIABBAXI2AgQgASAAaiAANgIADAELAkACQEEAKAKIp0AgA0YNAEEAKAKEp0AgA0cNAUEAIAE2AoSnQEEAQQAoAvymQCAAaiIANgL8pkAgASAAQQFyNgIEIAEgAGogADYCAA8LQQAgATYCiKdAQQBBACgCgKdAIABqIgA2AoCnQCABIABBAXI2AgQCQCABQQAoAoSnQEcNAEEAQQA2AvymQEEAQQA2AoSnQAtBACgCpKdAIgIgAE8NAkEAKAKIp0AiAEUNAgJAQQAoAoCnQCIFQSlJDQBBlKfAACEBA0ACQCABKAIAIgMgAEsNACADIAEoAgRqIABLDQILIAEoAggiAQ0ACwsCQAJAQQAoApynQCIADQBB/x8hAQwBC0EAIQEDQCABQQFqIQEgACgCCCIADQALIAFB/x8gAUH/H0sbIQELQQAgATYCrKdAIAUgAk0NAkEAQX82AqSnQA8LIAJBeHEiBSAAaiEAAkACQAJAIAVBgAJJDQAgAygCGCEEAkACQCADKAIMIgUgA0cNACADQRRBECADKAIUIgUbaigCACICDQFBACEFDAMLIAMoAggiAiAFNgIMIAUgAjYCCAwCCyADQRRqIANBEGogBRshBgNAIAYhBwJAIAIiBUEUaiIGKAIAIgINACAFQRBqIQYgBSgCECECCyACDQALIAdBADYCAAwBCwJAIANBDGooAgAiBSADQQhqKAIAIgNGDQAgAyAFNgIMIAUgAzYCCAwCC0EAQQAoAuyjQEF+IAJBA3Z3cTYC7KNADAELIARFDQACQAJAIAMoAhxBAnRB/KXAAGoiAigCACADRg0AIARBEEEUIAQoAhAgA0YbaiAFNgIAIAVFDQIMAQsgAiAFNgIAIAUNAEEAQQAoAvCjQEF+IAMoAhx3cTYC8KNADAELIAUgBDYCGAJAIAMoAhAiAkUNACAFIAI2AhAgAiAFNgIYCyADKAIUIgNFDQAgBUEUaiADNgIAIAMgBTYCGAsgASAAQQFyNgIEIAEgAGogADYCACABQQAoAoSnQEcNAEEAIAA2AvymQAwBCwJAAkACQCAAQYACSQ0AQR8hAwJAIABB////B0sNACAAQQYgAEEIdmciA2tBH3F2QQFxIANBAXRrQT5qIQMLIAFCADcCECABQRxqIAM2AgAgA0ECdEH8pcAAaiECAkACQAJAAkACQAJAQQAoAvCjQCIFQQEgA0EfcXQiBnFFDQAgAigCACIFKAIEQXhxIABHDQEgBSEDDAILQQAgBSAGcjYC8KNAIAIgATYCACABQRhqIAI2AgAMAwsgAEEAQRkgA0EBdmtBH3EgA0EfRht0IQIDQCAFIAJBHXZBBHFqQRBqIgYoAgAiA0UNAiACQQF0IQIgAyEFIAMoAgRBeHEgAEcNAAsLIAMoAggiACABNgIMIAMgATYCCCABQRhqQQA2AgAgASADNgIMIAEgADYCCAwCCyAGIAE2AgAgAUEYaiAFNgIACyABIAE2AgwgASABNgIIC0EAQQAoAqynQEF/aiIBNgKsp0AgAQ0DQQAoApynQCIADQFB/x8hAQwCCyAAQQN2IgNBA3RB9KPAAGohAAJAAkBBACgC7KNAIgJBASADdCIDcUUNACAAKAIIIQMMAQtBACACIANyNgLso0AgACEDCyAAIAE2AgggAyABNgIMIAEgADYCDCABIAM2AggPC0EAIQEDQCABQQFqIQEgACgCCCIADQALIAFB/x8gAUH/H0sbIQELQQAgATYCrKdADwsLlQwBGH8jACECIAAoAgAhAyAAKAIIIQQgACgCDCEFIAAoAgQhBiACQcAAayICQRhqIgdCADcDACACQSBqIghCADcDACACQThqIglCADcDACACQTBqIgpCADcDACACQShqIgtCADcDACACQQhqIgwgASkACDcDACACQRBqIg0gASkAEDcDACAHIAEoABgiDjYCACAIIAEoACAiDzYCACACIAEpAAA3AwAgAiABKAAcIhA2AhwgAiABKAAkIhE2AiQgCyABKAAoIhI2AgAgAiABKAAsIgs2AiwgCiABKAAwIhM2AgAgAiABKAA0Igo2AjQgCSABKAA4IhQ2AgAgAiABKAA8IhU2AjwgACADIBMgCyASIBEgDyAQIA4gBiAEIAUgBiADIAYgBHFqIAUgBkF/c3FqIAIoAgAiFmpBA3ciAXFqIAQgAUF/c3FqIAIoAgQiF2pBB3ciByABcWogBiAHQX9zcWogDCgCACIMakELdyIIIAdxaiABIAhBf3NxaiACKAIMIhhqQRN3IgkgCHEgAWogByAJQX9zcWogDSgCACINakEDdyIBIAlxIAdqIAggAUF/c3FqIAIoAhQiGWpBB3ciAiABcSAIaiAJIAJBf3NxampBC3ciByACcSAJaiABIAdBf3NxampBE3ciCCAHcSABaiACIAhBf3NxampBA3ciASAIcSACaiAHIAFBf3NxampBB3ciAiABcSAHaiAIIAJBf3NxampBC3ciByACcSAIaiABIAdBf3NxampBE3ciCCAHcSABaiACIAhBf3NxampBA3ciASAUIAEgCiABIAhxIAJqIAcgAUF/c3FqakEHdyIJcSAHaiAIIAlBf3NxampBC3ciAiAJciAVIAIgCXEiByAIaiABIAJBf3NxampBE3ciAXEgB3JqIBZqQZnzidQFakEDdyIHIA8gAiAJIAcgASACcnEgASACcXJqIA1qQZnzidQFakEFdyIIIAcgAXJxIAcgAXFyampBmfOJ1AVqQQl3IgIgCHIgEyABIAIgCCAHcnEgCCAHcXJqakGZ84nUBWpBDXciAXEgAiAIcXJqIBdqQZnzidQFakEDdyIHIBEgAiAIIAcgASACcnEgASACcXJqIBlqQZnzidQFakEFdyIIIAcgAXJxIAcgAXFyampBmfOJ1AVqQQl3IgIgCHIgCiABIAIgCCAHcnEgCCAHcXJqakGZ84nUBWpBDXciAXEgAiAIcXJqIAxqQZnzidQFakEDdyIHIBIgAiAOIAggByABIAJycSABIAJxcmpqQZnzidQFakEFdyIIIAcgAXJxIAcgAXFyampBmfOJ1AVqQQl3IgIgCHIgFCABIAIgCCAHcnEgCCAHcXJqakGZ84nUBWpBDXciAXEgAiAIcXJqIBhqQZnzidQFakEDdyIHIBUgASALIAIgECAIIAcgASACcnEgASACcXJqakGZ84nUBWpBBXciCCAHIAFycSAHIAFxcmpqQZnzidQFakEJdyIJIAggB3JxIAggB3FyampB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IQMgAiEFIAIoAgRBeHEgAUcNAAsLIAIoAggiASAANgIMIAIgADYCCCAAQRhqQQA2AgAgACACNgIMIAAgATYCCA8LIAYgADYCACAAQRhqIAU2AgALIAAgADYCDCAAIAA2AggPCyABQQN2IgJBA3RB9KPAAGohAQJAAkBBACgC7KNAIgNBASACdCICcUUNACABKAIIIQIMAQtBACADIAJyNgLso0AgASECCyABIAA2AgggAiAANgIMIAAgATYCDCAAIAI2AggLzwsCEH8EfiMAQeABayICJAACQAJAAkAgAUHwDmotAAAiA0UNACABQZABaiEEAkACQAJAAkAgAUHpAGotAAAiBUEGdEEAIAEtAGgiBmtHDQAgA0F+aiEHIANBAU0NBiACQfAAakEQaiABQfgAaikDADcDACACQfAAakEYaiABQYABaikDADcDACACQZABaiABQYgBaikDADcDACACQaABaiAEIAdBBXRqIgVBCGopAwA3AwAgAkGoAWogBUEQaikDADcDAEHAACEGIAJB8ABqQcAAaiAFQRhqKQMANwMAIAIgASkDcDcDeCACIAUpAwA3A5gBIANBBXQgBGpBYGoiBSkDACESIAUpAwghEyAFKQMQIRQgAS0AaiEIIAJB0AFqIAUpAxg3AwAgAkHIAWogFDcDACACQcABaiATNwMAIAJBuAFqIBI3AwBCACESIAJCADcDcCACIAhBBHIiCToA2QEgAkHAADoA2AEgB0UNAiACQfAAakEIaiEFIAkhCgwBCyACQfAAakEQaiABQRBqKQMANwMAIAJB8ABqQRhqIAFBGGopAwA3AwAgAkHwAGpBIGogAUEgaikDADcDACACQfAAakEwaiABQTBqKQMANwMAIAJB8ABqQThqIAFBOGopAwA3AwAgAkHwAGpBwABqIAFBwABqKQMANwMAIAJB8ABqQcgAaiABQcgAaikDADcDACACQfAAakHQAGogAUHQAGopAwA3AwAgAkHwAGpB2ABqIAFB2ABqKQMANwMAIAJB8ABqQeAAaiABQeAAaikDADcDACACIAEpAwg3A3ggAiABKQMoNwOYASACIAEtAGoiByAFRXJBAnIiCjoA2QEgAiAGOgDYASACIAEpAwAiEjcDcCAHQQRyIQkgAkH4AGohBSADIQcLQQEgB2shCyABQfAAaiEIIAQgB0F/aiIMQQV0aiEBIAJBmAFqIQcDQCAMIANPDQIgAkEYaiIEIAVBGGoiDSkCADcDACACQRBqIg4gBUEQaiIPKQIANwMAIAJBCGoiECAFQQhqIhEpAgA3AwAgAiAFKQIANwMAIAIgByAGIBIgChAKIBApAwAhEiAOKQMAIRMgBCkDACEUIAIpAwAhFSANIAhBGGopAwA3AwAgDyAIQRBqKQMANwMAIBEgCEEIaikDADcDACAFIAgpAwA3AwAgByABKQMANwMAIAdBCGogAUEIaikDADcDACAHQRBqIAFBEGopAwA3AwAgB0EYaiABQRhqKQMANwMAIAIgFDcD0AEgAiATNwPIASACIBI3A8ABIAIgFTcDuAEgAiAJOgDZAUHAACEGIAJBwAA6ANgBQgAhEiACQgA3A3AgAUFgaiEBIAkhCiALQQFqIgtBAUcNAAsLIAIgAkHwAGpB8AAQlwEiAS0AaSEIIAEtAGghBgwCC0EAIAtrIANB0IrAABCHAQALIAJBEGogAUEQaikDADcDACACQRhqIAFBGGopAwA3AwAgAkEgaiABQSBqKQMANwMAIAJBMGogAUEwaikDADcDACACQThqIAFBOGopAwA3AwAgAkHAAGogAUHAAGopAwA3AwAgAkHIAGogAUHIAGopAwA3AwAgAkHQAGogAUHQAGopAwA3AwAgAkHYAGogAUHYAGopAwA3AwAgAkHgAGogAUHgAGopAwA3AwAgAiABKQMINwMIIAIgASkDKDcDKCABQekAai0AACEFIAEtAGohByACIAEtAGgiBjoAaCACIAEpAwA3AwAgAiAHIAVFckECciIIOgBpCyACQfAAakEYaiIBIAJBIGopAwA3AwAgAkHwAGpBEGoiBSACQRhqKQMANwMAIAJB8ABqQQhqIgcgAkEQaikDADcDACACIAIpAwg3A3AgAkHwAGogAkEoaiAGQgAgCEEIchAKIAAgASkDADcAGCAAIAUpAwA3ABAgACAHKQMANwAIIAAgAikDcDcAACACQeABaiQADwsgByADQcCKwAAQhwEAC6cIAgF/LX4gACkDwAEhAiAAKQOYASEDIAApA3AhBCAAKQNIIQUgACkDICEGIAApA7gBIQcgACkDkAEhCCAAKQNoIQkgACkDQCEKIAApAxghCyAAKQOwASEMIAApA4gBIQ0gACkDYCEOIAApAzghDyAA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IAJBkAFqQTBqKQMANwAAIABBKGogAkGQAWpBKGopAwA3AAAgAEEgaiAKKQMANwAAIABBGGogBCkDADcAACAAQRBqIAwpAwA3AAAgAEEIaiANKQMANwAAIAAgAikDkAE3AAAgAkHAADoAiAEgAiAIOgCJASACQgA3AyAgBCARKQIANwMAIAwgECkCADcDACANIA4pAgA3AwAgAiAGKQIANwOQASACQZABaiAAQcAAQgAgCBAKIAQoAgAhCyAMKAIAIQwgDSgCACENIAIoAqwBIQ4gAigCpAEhECACKAKcASERIAIoApQBIRIgAigCkAEhEyAPQf8BcSIEQTdPDQMgByAEQQV0aiIEIBM2AgAgBCAONgIcIAQgCzYCGCAEIBA2AhQgBCAMNgIQIAQgETYCDCAEIA02AgggBCASNgIEIAMgD0EBaiIEOgAAIARB/wFxIAVLDQALCyACQdABaiQADwtBnKLAAEErQZCKwAAQlAEACyACIA42AqwBIAIgCzYCqAEgAiAQNgKkASACIAw2AqABIAIgETYCnAEgAiANNgKYASACIBI2ApQBIAIgEzYCkAFBkJ3AAEErIAJBkAFqQcyLwABB8IrAABB/AAunBgERfyMAQYABayICJAACQAJAIAEoAgAiA0EQTw0AIAFBBGoiBCADakEQIANrIgMgAxCdARogAUEANgIAIAFBFGoiAyAEEA0gAkEQakEIaiIEIAFBzABqIgUpAAA3AwAgAiABQcQAaiIGKQAANwMQIAMgAkEQahANIAJBCGoiByABQRxqIggpAgA3AwAgAiABKQIUNwMAIAJBEGpBKGoiCUIANwMAIAJBEGpBIGoiCkIANwMAIAJBEGpBGGoiC0IANwMAIAJBEGpBEGoiDEIANwMAIARCADcDACACQgA3AxAgAkHQAGpBDGoiDUIANwIAIAJCADcCVCACQRA2AlAgAkHoAGpBEGogAkHQAGpBEGooAgA2AgAgAkHoAGpBCGoiDiACQdAAakEIaiIPKQMANwMAIAIgAikDUDcDaCACQRBqQThqIhAgAkHoAGpBDGoiESkCADcDACACQRBqQTBqIhIgAikCbDcDACAFIBApAwA3AAAgBiASKQMANwAAIAFBPGogCSkDADcAACABQTRqIAopAwA3AAAgAUEsaiALKQMANwAAIAFBJGogDCkDADcAACAIIAQpAwA3AAAgASACKQMQNwAUIAFBADYCAEEQEAkiBUUNASAFIAIpAwA3AAAgBUEIaiAHKQMANwAAIAlCADcDACAKQgA3AwAgC0IANwMAIAJBEGpBEGoiBkIANwMAIARCADcDACACQgA3AxAgDUIANwIAIAJCADcCVCACQRA2AlAgAkHoAGpBEGogAkHQAGpBEGooAgA2AgAgDiAPKQMANwMAIAIgAikDUDcDaCAQIBEpAgA3AwAgEiACKQJsNwMAIANBOGogECkDADcAACADQTBqIBIpAwA3AAAgA0EoaiAJKQMANwAAIANBIGogCikDADcAACADQRhqIAspAwA3AAAgA0EQaiAGKQMANwAAIANBCGogBCkDADcAACADIAIpAxA3AAAgAUEANgIAIABBEDYCBCAAIAU2AgAgAkGAAWokAA8LQbqfwABBFyACQRBqQeCawABB8JrAABB/AAtBEEEBQQAoArynQCICQQIgAhsRBAAAC/YFAgd/CH4jAEGgAWsiAiQAIAJBMGpBLGpCADcCACACQTBqQSRqQgA3AgAgAkEwakEcakIANwIAIAJBMGpBFGpCADcCACACQTBqQQxqQgA3AgAgAkIANwI0IAJBMDYCMCACQegAakEwaiACQTBqQTBqKAIANgIAIAJB6ABqQShqIAJBMGpBKGopAwA3AwAgAkHoAGpBIGogAkEwakEgaikDADcDACACQegAakEYaiACQTBqQRhqKQMANwMAIAJB6ABqQRBqIAJBMGpBEGopAwA3AwAgAkHoAGpBCGogAkEwakEIaikDADcDACACIAIpAzA3A2ggAkEoaiIDIAJB6ABqQSxqKQIANwMAIAJBIGoiBCACQegAakEkaikCADcDACACQRhqIgUgAkHoAGpBHGopAgA3AwAgAkEQaiIGIAJB6ABqQRRqKQIANwMAIAJBCGoiByACQegAakEMaikCADcDACACIAIpAmw3AwAgASACEB0gAUIANwMIIAFCADcDACABQQA2AlAgAUEAKQOQnEAiCTcDECABQRhqQQApA5icQCIKNwMAIAFBIGpBACkDoJxAIgs3AwAgAUEoakEAKQOonEAiDDcDACABQTBqQQApA7CcQCINNwMAIAFBOGpBACkDuJxAIg43AwAgAUHAAGpBACkDwJxAIg83AwAgAUHIAGpBACkDyJxAIhA3AwACQEEwEAkiCA0AQTBBAUEAKAK8p0AiAkECIAIbEQQAAAsgCCACKQMANwAAIAhBKGogAykDADcAACAIQSBqIAQpAwA3AAAgCEEYaiAFKQMANwAAIAhBEGogBikDADcAACAIQQhqIAcpAwA3AAAgAUIANwMIIAFCADcDACABQQA2AlAgAUEQaiIBIAk3AwAgAUEIaiAKNwMAIAFBEGogCzcDACABQRhqIAw3AwAgAUEgaiANNwMAIAFBKGogDjcDACABQTBqIA83AwAgAUE4aiAQNwMAIABBMDYCBCAAIAg2AgAgAkGgAWokAAvhBQIJfwh+IwBB0AFrIgIkACACQcAAakEMakIANwIAIAJBwABqQRRqQgA3AgAgAkHAAGpBHGpCADcCACACQcAAakEkakIANwIAIAJBwABqQSxqQgA3AgAgAkHAAGpBNGpCADcCACACQcAAakE8akIANwIAIAJCADcCRCACQcAANgJAIAJBiAFqIAJBwABqQcQAEJcBGiACQThqIgMgAkGIAWpBPGopAgA3AwAgAkEwaiIEIAJBiAFqQTRqKQIANwMAIAJBKGoiBSACQYgBakEsaikCADcDACACQSBqIgYgAkGIAWpBJGopAgA3AwAgAkEYaiIHIAJBiAFqQRxqKQIANwMAIAJBEGoiCCACQYgBakEUaikCADcDACACQQhqIgkgAkGIAWpBDGopAgA3AwAgAiACKQKMATcDACABIAIQFiABQgA3AwggAUIANwMAIAFBADYCUCABQQApA9CcQCILNwMQIAFBGGpBACkD2JxAIgw3AwAgAUEgakEAKQPgnEAiDTcDACABQShqQQApA+icQCIONwMAIAFBMGpBACkD8JxAIg83AwAgAUE4akEAKQP4nEAiEDcDACABQcAAakEAKQOAnUAiETcDACABQcgAakEAKQOInUAiEjcDAAJAQcAAEAkiCg0AQcAAQQFBACgCvKdAIgJBAiACGxEEAAALIAogAikDADcAACAKQThqIAMpAwA3AAAgCkEwaiAEKQMANwAAIApBKGogBSkDADcAACAKQSBqIAYpAwA3AAAgCkEYaiAHKQMANwAAIApBEGogCCkDADcAACAKQQhqIAkpAwA3AAAgAUIANwMIIAFCADcDACABQQA2AlAgAUEQaiIBIAs3AwAgAUEIaiAMNwMAIAFBEGogDTcDACABQRhq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AwA3AwAgAkHIAGpBCGogAkEgakEIaikDADcDACACQcgAakEgaiACQSBqQSBqKAIANgIAIAIgAikDIDcDSCACQRBqIAJByABqQRRqKQIANwMAIAJBCGogAkHIAGpBDGopAgA3AwAgAkEYaiACQcgAakEcaikCADcDACACIAIpAkw3AwAgAiABEBIgAUIANwMAIAFBIGogAUGIAWopAwA3AwAgAUEYaiABQYABaikDADcDACABQRBqIAFB+ABqKQMANwMAIAEgASkDcDcDCCABQShqQQBBwgAQnQEhAwJAIAFB8A5qIgQtAABFDQAgBEEAOgAACwJAQSAQCSIEDQBBIEEBQQAoArynQCICQQIgAhsRBAAACyAEIAIpAwA3AAAgBEEYaiACQRhqKQMANwAAIARBEGogAkEQaikDADcAACAEQQhqIAJBCGopAwA3AAAgAUIANwMAIAFBCGoiBUEYaiABQfAAaiIBQRhqKQMANwMAIAVBEGogAUEQaikDADcDACAFQQhqIAFBCGopAwA3AwAgBSABKQMANwMAIANBAEHCABCdARogAEEgNgIEIAAgBDYCACACQfAAaiQAC4kEAQd/IwBBoANrIgIkACACQegCakEsakIANwIAIAJB6AJqQSRqQgA3AgAgAkHoAmpBHGpCADcCACACQegCakEUakIANwIAIAJB6AJqQQxqQgA3AgAgAkIANwLsAiACQTA2AugCIAJBMGpBMGogAkHoAmpBMGooAgA2AgAgAkEwakEoaiACQegCakEoaikDADcDACACQTBqQSBqIAJB6AJqQSBqKQMANwMAIAJBMGpBGGogAkHoAmpBGGopAwA3AwAgAkEwakEQaiACQegCakEQaikDADcDACACQTBqQQhqIAJB6AJqQQhqKQMANwMAIAIgAikD6AI3AzAgAkEoaiIDIAJBMGpBLGopAgA3AwAgAkEgaiIEIAJBMGpBJGopAgA3AwAgAkEYaiIFIAJBMGpBHGopAgA3AwAgAkEQaiIGIAJBMGpBFGopAgA3AwAgAkEIaiIHIAJBMGpBDGopAgA3AwAgAiACKQI0NwMAIAJBMGogAUG4AhCXARogAkEwaiACEFoCQEEwEAkiCA0AQTBBAUEAKAK8p0AiAkECIAIbEQQAAAsgCCACKQMANwAAIAhBKGogAykDADcAACAIQSBqIAQpAwA3AAAgCEEYaiAFKQMANwAAIAhBEGogBikDADcAACAIQQhqIAcpAwA3AAAgARAPIABBMDYCBCAAIAg2AgAgAkGgA2okAAuJBAEHfyMAQaADayICJAAgAkHoAmpBLGpCADcCACACQegCakEkakIANwIAIAJB6AJqQRxqQgA3AgAgAkHoAmpBFGpCADcCACACQegCakEMakIANwIAIAJCADcC7AIgAkEwNgLoAiACQTBqQTBqIAJB6AJqQTBqKAIANgIAIAJBMGpBKGogAkHoAmpBKGopAwA3AwAgAkEwakEgaiACQegCakEgaikDADcDACACQTBqQRhqIAJB6AJqQRhqKQMANwMAIAJBMGpBEGogAkHoAmpBEGopAwA3AwAgAkEwakEIaiACQegCakEIaikDADcDACACIAIpA+gCNwMwIAJBKGoiAyACQTBqQSxqKQIANwMAIAJBIGoiBCACQTBqQSRqKQIANwMAIAJBGGoiBSACQTBqQRxqKQIANwMAIAJBEGoiBiACQTBqQRRqKQIANwMAIAJBCGoiByACQTBqQQxqKQIANwMAIAIgAikCNDcDACACQTBqIAFBuAIQlwEaIAJBMGogAhBZAkBBMBAJIggNAEEwQQFBACgCvKdAIgJBAiACGxEEAAALIAggAikDADcAACAIQShqIAMpAwA3AAAgCEEgaiAEKQMANwAAIAhBGGogBSkDADcAACAIQRBqIAYpAwA3AAAgCEEIaiAHKQMANwAAIAEQDyAAQTA2AgQgACAINgIAIAJBoANqJAALiQQBB38jAEHAAmsiAiQAIAJBiAJqQSxqQgA3AgAgAkGIAmpBJGpCADcCACACQYgCakEcakIANwIAIAJBiAJqQRRqQgA3AgAgAkGIAmpBDGpCADcCACACQgA3AowCIAJBMDYCiAIgAkEwakEwaiACQYgCakEwaigCADYCACACQTBqQShqIAJBiAJqQShqKQMANwMAIAJBMGpBIGogAkGIAmpBIGopAwA3AwAgAkEwakEYaiACQYgCakEYaikDADcDACACQTBqQRBqIAJBiAJqQRBqKQMANwMAIAJBMGpBCGogAkGIAmpBCGopAwA3AwAgAiACKQOIAjcDMCACQShqIgMgAkEwakEsaikCADcDACACQSBqIgQgAkEwakEkaikCADcDACACQRhqIgUgAkEwakEcaikCADcDACACQRBqIgYgAkEwakEUaikCADcDACACQQhqIgcgAkEwakEMaikCADcDACACIAIpAjQ3AwAgAkEwaiABQdgBEJcBGiACQTBqIAIQHQJAQTAQCSIIDQBBMEEBQQAoArynQCICQQIgAhsRBAAACyAIIAIpAwA3AAAgCEEoaiADKQMANwAAIAhBIGogBCkDADcAACAIQRhqIAUpAwA3AAAgCEEQaiAGKQMANwAAIAhBCGogBykDADcAACABEA8gAEEwNgIEIAAgCDYCACACQcACaiQAC4gEAQd/IwBBoAFrIgIkACACQTBqQSxqQgA3AgAgAkEwakEkakIANwIAIAJBMGpBHGpCADcCACACQTBqQRRqQgA3AgAgAkEwakEMakIANwIAIAJCADcCNCACQTA2AjAgAkHoAGpBMGogAkEwakEwaigCADYCACACQegAakEoaiACQTBqQShqKQMANwMAIAJB6ABqQSBqIAJBMGpBIGopAwA3AwAgAkHoAGpBGGogAkEwakEYaikDADcDACACQegAakEQaiACQTBqQRBqKQMANwMAIAJB6ABqQQhqIAJBMGpBCGopAwA3AwAgAiACKQMwNwNoIAJBKGoiAyACQegAakEsaikCADcDACACQSBqIgQgAkHoAGpBJGopAgA3AwAgAkEYaiIFIAJB6ABqQRxqKQIANwMAIAJBEGoiBiACQegAakEUaikCADcDACACQQhqIgcgAkHoAGpBDGopAgA3AwAgAiACKQJsNwMAIAEgAhBZIAFBAEHMARCdASEIAkBBMBAJIgENAEEwQQFBACgCvKdAIgJBAiACGxEEAAALIAEgAikDADcAACABQShqIAMpAwA3AAAgAUEgaiAEKQMANwAAIAFBGGogBSkDADcAACABQRBqIAYpAwA3AAAgAUEIaiAHKQMANwAAIAhBAEHMARCdARogAEEwNgIEIAAgATYCACACQaABaiQAC4gEAQd/IwBBoAFrIgIkACACQTBqQSxqQgA3AgAgAkEwakEkakIANwIAIAJBMGpBHGpCADcCACACQTBqQRRqQgA3AgAgAkEwakEMakIANwIAIAJCADcCNCACQTA2AjAgAkHoAGpBMGogAkEwakEwaigCADYCACACQegAakEoaiACQTBqQShqKQMANwMAIAJB6ABqQSBqIAJBMGpBIGopAwA3AwAgAkHoAGpBGGogAkEwakEYaikDADcDACACQegAakEQaiACQTBqQRBqKQMANwMAIAJB6ABqQQhqIAJBMGpBCGopAwA3AwAgAiACKQMwNwNoIAJBKGoiAyACQegAakEsaikCADcDACACQSBqIgQgAkHoAGpBJGopAgA3AwAgAkEYaiIFIAJB6ABqQRxqKQIANwMAIAJBEGoiBiACQegAakEUaikCADcDACACQQhqIgcgAkHoAGpBDGopAgA3AwAgAiACKQJsNwMAIAEgAhBaIAFBAEHMARCdASEIAkBBMBAJIgENAEEwQQFBACgCvKdAIgJBAiACGxEEAAALIAEgAikDADcAACABQShqIAMpAwA3AAAgAUEgaiAEKQMANwAAIAFBGGogBSkDADcAACABQRBqIAYpAwA3AAAgAUEIaiAHKQMANwAAIAhBAEHMARCdARogAEEwNgIEIAAgATYCACACQaABaiQAC/QDAQl/IwBBoANrIgIkACACQdgCakEMakIANwIAIAJB2AJqQRRqQgA3AgAgAkHYAmpBHGpCADcCACACQdgCakEkakIANwIAIAJB2AJqQSxqQgA3AgAgAkHYAmpBNGpCADcCACACQdgCakE8akIANwIAIAJCADcC3AIgAkHAADYC2AIgAkHAAGogAkHYAmpBxAAQlwEaIAJBOGoiAyACQcAAakE8aikCADcDACACQTBqIgQgAkHAAGpBNGopAgA3AwAgAkEoaiIFIAJBwABqQSxqKQIANwMAIAJBIGoiBiACQcAAakEkaikCADcDACACQRhqIgcgAkHAAGpBHGopAgA3AwAgAkEQaiIIIAJBwABqQRRqKQIANwMAIAJBCGoiCSACQcAAakEMaikCADcDACACIAIpAkQ3AwAgAkHAAGogAUGYAhCXARogAkHAAGogAhBLAkBBwAAQCSIKDQBBwABBAUEAKAK8p0AiAkECIAIbEQQAAAsgCiACKQMANwAAIApBOGogAykDADcAACAKQTBqIAQpAwA3AAAgCkEoaiAFKQMANwAAIApBIGogBikDADcAACAKQRhqIAcpAwA3AAAgCkEQaiAIKQMANwAAIApBCGogCSkDADcAACABEA8gAEHAADYCBCAAIAo2AgAgAkGgA2okAAv0AwEJfyMAQaADayICJAAgAkHYAmpBDGpCADcCACACQdgCakEUakIANwIAIAJB2AJqQRxqQgA3AgAgAkHYAmpBJGpCADcCACACQdgCakEsakIANwIAIAJB2AJqQTRqQgA3AgAgAkHYAmpBPGpCADcCACACQgA3AtwCIAJBwAA2AtgCIAJBwABqIAJB2AJqQcQAEJcBGiACQThqIgMgAkHAAGpBPGopAgA3AwAgAkEwaiIEIAJBwABqQTRqKQIANwMAIAJBKGoiBSACQcAAakEsaikCADcDACACQSBqIgYgAkHAAGpBJGopAgA3AwAgAkEYaiIHIAJBwABqQRxqKQIANwMAIAJBEGoiCCACQcAAakEUaikCADcDACACQQhqIgkgAkHAAGpBDGopAgA3AwAgAiACKQJENwMAIAJBwABqIAFBmAIQlwEaIAJBwABqIAIQSgJAQcAAEAkiCg0AQcAAQQFBACgCvKdAIgJBAiACGxEEAAALIAogAikDADcAACAKQThqIAMpAwA3AAAgCkEwaiAEKQMANwAAIApBKGogBSkDADcAACAKQSBqIAYpAwA3AAAgCkEYaiAHKQMANwAAIApBEGogCCkDADcAACAKQQhqIAkpAwA3AAAgARAPIABBwAA2AgQgACAKNgIAIAJBoANqJAAL9AMBCX8jAEHgAmsiAiQAIAJBmAJqQQxqQgA3AgAgAkGYAmpBFGpCADcCACACQZgCakEcakIANwIAIAJBmAJqQSRqQgA3AgAgAkGYAmpBLGpCADcCACACQZgCakE0akIANwIAIAJBmAJqQTxqQgA3AgAgAkIANwKcAiACQcAANgKYAiACQcAAaiACQZgCakHEABCXARogAkE4aiIDIAJBwABqQTxqKQIANwMAIAJBMGoiBCACQcAAakE0aikCADcDACACQShqIgUgAkHAAGpBLGopAgA3AwAgAkEgaiIGIAJBwABqQSRqKQIANwMAIAJBGGoiByACQcAAakEcaikCADcDACACQRBqIgggAkHAAGpBFGopAgA3AwAgAkEIaiIJIAJBwABqQQxqKQIANwMAIAIgAikCRDcDACACQcAAaiABQdgBEJcBGiACQcAAaiACEBYCQEHAABAJIgoNAEHAAEEBQQAoArynQCICQQIgAhsRBAAACyAKIAIpAwA3AAAgCkE4aiADKQMANwAAIApBMGogBCkDADcAACAKQShqIAUpAwA3AAAgCkEgaiAGKQMANwAAIApBGGogBykDADcAACAKQRBqIAgpAwA3AAAgCkEIaiAJKQMANwAAIAEQDyAAQcAANgIEIAAgCjYCACACQeACaiQAC/MDAQl/IwBB0AFrIgIkACACQcAAakEMakIANwIAIAJBwABqQRRqQgA3AgAgAkHAAGpBHGpCADcCACACQcAAakEkakIANwIAIAJBwABqQSxqQgA3AgAgAkHAAGpBNGpCADcCACACQcAAakE8akIANwIAIAJCADcCRCACQcAANgJAIAJBiAFqIAJBwABqQcQAEJcBGiACQThqIgMgAkGIAWpBPGopAgA3AwAgAkEwaiIEIAJBiAFqQTRqKQIANwMAIAJBKGoiBSACQYgBakEsaikCADcDACACQSBqIgYgAkGIAWpBJGopAgA3AwAgAkEYaiIHIAJBiAFqQRxqKQIANwMAIAJBEGoiCCACQYgBakEUaikCADcDACACQQhqIgkgAkGIAWpBDGopAgA3AwAgAiACKQKMATcDACABIAIQSiABQQBBzAEQnQEhCgJAQcAAEAkiAQ0AQcAAQQFBACgCvKdAIgJBAiACGxEEAAALIAEgAikDADcAACABQThqIAMpAwA3AAAgAUEwaiAEKQMANwAAIAFBKGogBSkDADcAACABQSBqIAYpAwA3AAAgAUEYaiAHKQMANwAAIAFBEGogCCkDADcAACABQQhqIAkpAwA3AAAgCkEAQcwBEJ0BGiAAQcAANgIEIAAgATYCACACQdABaiQAC/MDAQl/IwBB0AFrIgIkACACQcAAakEMakIANwIAIAJBwABqQRRqQgA3AgAgAkHAAGpBHGpCADcCACACQcAAakEkakIANwIAIAJBwABqQSxqQgA3AgAgAkHAAGpBNGpCADcCACACQcAAakE8akIANwIAIAJCADcCRCACQcAANgJAIAJBiAFqIAJBwABqQcQAEJcBGiACQThqIgMgAkGIAWpBPGopAgA3AwAgAkEwaiIEIAJBiAFqQTRqKQIANwMAIAJBKGoiBSACQYgBakEsaikCADcDACACQSBqIgYgAkGIAWpBJGopAgA3AwAgAkEYaiIHIAJBiAFqQRxqKQIANwMAIAJBEGoiCCACQYgBakEUaikCADcDACACQQhqIgkgAkGIAWpBDGopAgA3AwAgAiACKQKMATcDACABIAIQSyABQQBBzAEQnQEhCgJAQcAAEAkiAQ0AQcAAQQFBACgCvKdAIgJBAiACGxEEAAALIAEgAikDADcAACABQThqIAMpAwA3AAAgAUEwaiAEKQMANwAAIAFBKGogBSkDADcAACABQSBqIAYpAwA3AAAgAUEYaiAHKQMANwAAIAFBEGogCCkDADcAACABQQhqIAkpAwA3AAAgCkEAQcwBEJ0BGiAAQcAANgIEIAAgATYCACACQdABaiQAC/ADAgV/BH4jAEHwAGsiAiQAIAJBIGpBHGpCADcCACACQSBqQRRqQgA3AgAgAkEgakEMakIANwIAIAJCADcCJCACQSA2AiAgAkHIAGpBIGogAkEgakEgaigCADYCACACQcgAakEYaiACQSBqQRhqKQMANwMAIAJByABqQRBqIAJBIGpBEGopAwA3AwAgAkHIAGpBCGogAkEgakEIaikDADcDACACIAIpAyA3A0ggAkEYaiIDIAJByABqQRxqKQIANwMAIAJBEGoiBCACQcgAakEUaikCADcDACACQQhqIgUgAkHIAGpBDGopAgA3AwAgAiACKQJMNwMAIAEgAhAuIAFBADYCCCABQgA3AwAgAUEAKQPwm0AiBzcCTCABQdQAakEAKQP4m0AiCDcCACABQdwAakEAKQOAnEAiCTcCACABQeQAakEAKQOInEAiCjcCAAJAQSAQCSIGDQBBIEEBQQAoArynQCICQQIgAhsRBAAACyAGIAIpAwA3AAAgBkEYaiADKQMANwAAIAZBEGogBCkDADcAACAGQQhqIAUpAwA3AAAgAUEANgIIIAFCADcDACABQcwAaiIBIAc3AgAgAUEIaiAINwIAIAFBEGogCTcCACABQRhqIAo3AgAgAEEgNgIEIAAgBjYCACACQfAAaiQAC7cDAgF/BH4jAEEgayICJAAgABBIIAJBCGogAEHUAGopAgAiAzcDACACQRBqIABB3ABqKQIAIgQ3AwAgAkEYaiAAQeQAaikCACIFNwMAIAEgACkCTCIGpyIAQRh0IABBCHRBgID8B3FyIABBCHZBgP4DcSAAQRh2cnI2AAAgASADpyIAQRh0IABBCHRBgID8B3FyIABBCHZBgP4DcSAAQRh2cnI2AAggASAEpyIAQRh0IABBCHRBgID8B3FyIABBCHZBgP4DcSAAQRh2cnI2ABAgASAFpyIAQRh0IABBCHRBgID8B3FyIABBCHZBgP4DcSAAQRh2cnI2ABggAiAGNwMAIAEgAigCBCIAQRh0IABBCHRBgID8B3FyIABBCHZBgP4DcSAAQRh2cnI2AAQgASACKAIMIgBBGHQgAEEIdEGAgPwHcXIgAEEIdkGA/gNxIABBGHZycjYADCABIAIoAhQiAEEYdCAAQQh0QYCA/AdxciAAQQh2QYD+A3EgAEEYdnJyNgAUIAEgAigCHCIAQRh0IABBCHRBgID8B3FyIABBCHZBgP4DcSAAQRh2cnI2ABwgAkEgaiQAC9kDAgV/BH4jAEHgAGsiAiQAIAJBIGpBHGpBADYCACACQSBqQRRqQgA3AgAgAkEgakEMakIANwIAIAJCADcCJCACQRw2AiAgAkHAAGpBEGogAkEgakEQaikDADcDACACQcAAakEIaiACQSBqQQhqKQMANwMAIAJBwABqQRhqIAJBIGpBGGopAwA3AwAgAkEIaiIDIAJBwABqQQxqKQIANwMAIAJBEGoiBCACQcAAakEUaikCADcDACACQRhqIgUgAkHAAGpBHGooAgA2AgAgAiACKQMgNwNAIAIgAikCRDcDACABIAIQPSABQQA2AgggAUIANwMAIAFBACkCzJtAIgc3AkwgAUHUAGpBACkC1JtAIgg3AgAgAUHcAGpBACkC3JtAIgk3AgAgAUHkAGpBACkC5JtAIgo3AgACQEEcEAkiBg0AQRxBAUEAKAK8p0AiAkECIAIbEQQAAAsgBiACKQMANwAAIAZBGGogBSgCADYAACAGQRBqIAQpAwA3AAAgBkEIaiADKQMANwAAIAFBADYCCCABQgA3AwAgAUHMAGoiASAHNwIAIAFBCGogCDcCACABQRBqIAk3AgAgAUEYaiAKNwIAIABBHDYCBCAAIAY2AgAgAkHgAGokAAvCAwEGfyMAQdABayICJAAgAkGgAWpBJGpCADcCACACQaABakEcakIANwIAIAJBoAFqQRRqQgA3AgAgAkGgAWpBDGpCADcCACACQgA3AqQBIAJBKDYCoAEgAkEoakEoaiACQaABakEoaigCADYCACACQShqQSBqIAJBoAFqQSBqKQMANwMAIAJBKGpBGGogAkGgAWpBGGopAwA3AwAgAkEoakEQaiACQaABakEQaikDADcDACACQShqQQhqIAJBoAFqQQhqKQMANwMAIAIgAikDoAE3AyggAkEgaiIDIAJBKGpBJGopAgA3AwAgAkEYaiIEIAJBKGpBHGopAgA3AwAgAkEQaiIFIAJBKGpBFGopAgA3AwAgAkEIaiIGIAJBKGpBDGopAgA3AwAgAiACKQIsNwMAIAJBKGogAUH4ABCXARogAkEoaiACEEkCQEEoEAkiBw0AQShBAUEAKAK8p0AiAkECIAIbEQQAAAsgByACKQMANwAAIAdBIGogAykDADcAACAHQRhqIAQpAwA3AAAgB0EQaiAFKQMANwAAIAdBCGogBikDADcAACABEA8gAEEoNgIEIAAgBzYCACACQdABaiQAC9MDAgR/An4gAEEQaiEBIABBCGopAwAhBSAAKQMAIQYCQAJAAkACQCAAKAJQIgJBgAFHDQAgASAAQdQAakEBEANBACECIABBADYCUAwBCyACQf8ASw0BCyAAQdQAaiIDIAJqQYABOgAAIAAgACgCUCIEQQFqIgI2AlACQCACQYEBTw0AIABB0ABqIAJqQQRqQQBB/wAgBGsQnQEaAkBBgAEgACgCUGtBEE8NACABIANBARADIAAoAlAiAkGBAU8NAyADQQAgAhCdARoLIABBzAFqIAZCOIYgBkIohkKAgICAgIDA/wCDhCAGQhiGQoCAgICA4D+DIAZCCIZCgICAgPAfg4SEIAZCCIhCgICA+A+DIAZCGIhCgID8B4OEIAZCKIhCgP4DgyAGQjiIhISENwIAIABBxAFqIAVCOIYgBUIohkKAgICAgIDA/wCDhCAFQhiGQoCAgICA4D+DIAVCCIZCgICAgPAfg4SEIAVCCIhCgICA+A+DIAVCGIhCgID8B4OEIAVCKIhCgP4DgyAFQjiIhISENwIAIAEgA0EBEAMgAEEANgJQDwsgAkGAAUHcncAAEIQBAAsgAkGAAUHsncAAEIcBAAsgAkGAAUH8ncAAEIUBAAuHAwEFfyMAQcABayICJAAgAkGYAWpBHGpCADcCACACQZgBakEUakIANwIAIAJBmAFqQQxqQgA3AgAgAkIANwKcASACQSA2ApgBIAJBKGpBIGogAkGYAWpBIGooAgA2AgAgAkEoakEYaiACQZgBakEYaikDADcDACACQShqQRBqIAJBmAFqQRBqKQMANwMAIAJBKGpBCGogAkGYAWpBCGopAwA3AwAgAiACKQOYATcDKCACQQhqQRhqIgMgAkEoakEcaikCADcDACACQQhqQRBqIgQgAkEoakEUaikCADcDACACQQhqQQhqIgUgAkEoakEMaikCADcDACACIAIpAiw3AwggAkEoaiABQfAAEJcBGiACQShqIAJBCGoQLgJAQSAQCSIGDQBBIEEBQQAoArynQCICQQIgAhsRBAAACyAGIAIpAwg3AAAgBkEYaiADKQMANwAAIAZBEGogBCkDADcAACAGQQhqIAUpAwA3AAAgARAPIABBIDYCBCAAIAY2AgAgAkHAAWokAAv7AgEFfyMAQaADayICJAAgAkH4AmpBHGpCADcCACACQfgCakEUakIANwIAIAJB+AJqQQxqQgA3AgAgAkIANwL8AiACQSA2AvgCIAJBIGpBIGogAkH4AmpBIGooAgA2AgAgAkEgakEYaiACQfgCakEYaikDADcDACACQSBqQRBqIAJB+AJqQRBqKQMANwMAIAJBIGpBCGogAkH4AmpBCGopAwA3AwAgAiACKQP4AjcDICACQRhqIgMgAkEgakEcaikCADcDACACQRBqIgQgAkEgakEUaikCADcDACACQQhqIgUgAkEgakEMaikCADcDACACIAIpAiQ3AwAgAkEgaiABQdgCEJcBGiACQSBqIAIQZQJAQSAQCSIGDQBBIEEBQQAoArynQCICQQIgAhsRBAAACyAGIAIpAwA3AAAgBkEYaiADKQMANwAAIAZBEGogBCkDADcAACAGQQhqIAUpAwA3AAAgARAPIABBIDYCBCAAIAY2AgAgAkGgA2okAAv7AgEFfyMAQaADayICJAAgAkH4AmpBHGpCADcCACACQfgCakEUakIANwIAIAJB+AJqQQxqQgA3AgAgAkIANwL8AiACQSA2AvgCIAJBIGpBIGogAkH4AmpBIGooAgA2AgAgAkEgakEYaiACQfgCakEYaikDADcDACACQSBqQRBqIAJB+AJqQRBqKQMANwMAIAJBIGpBCGogAkH4AmpBCGopAwA3AwAgAiACKQP4AjcDICACQRhqIgMgAkEgakEcaikCADcDACACQRBqIgQgAkEgakEUaikCADcDACACQQhqIgUgAkEgakEMaikCADcDACACIAIpAiQ3AwAgAkEgaiABQdgCEJcBGiACQSBqIAIQZgJAQSAQCSIGDQBBIEEBQQAoArynQCICQQIgAhsRBAAACyAGIAIpAwA3AAAgBkEYaiADKQMANwAAIAZBEGogBCkDADcAACAGQQhqIAUpAwA3AAAgARAPIABBIDYCBCAAIAY2AgAgAkGgA2okAAv7AgEFfyMAQcAPayICJAAgAkGYD2pBHGpCADcCACACQZgPakEUakIANwIAIAJBmA9qQQxqQgA3AgAgAkIANwKcDyACQSA2ApgPIAJBIGpBIGogAkGYD2pBIGooAgA2AgAgAkEgakEYaiACQZgPakEYaikDADcDACACQSBqQRBqIAJBmA9qQRBqKQMANwMAIAJBIGpBCGogAkGYD2pBCGopAwA3AwAgAiACKQOYDzcDICACQRhqIgMgAkEgakEcaikCADcDACACQRBqIgQgAkEgakEUaikCADcDACACQQhqIgUgAkEgakEMaikCADcDACACIAIpAiQ3AwAgAkEgaiABQfgOEJcBGiACIAJBIGoQEgJAQSAQCSIGDQBBIEEBQQAoArynQCICQQIgAhsRBAAACyAGIAIpAwA3AAAgBkEYaiADKQMANwAAIAZBEGogBCkDADcAACAGQQhqIAUpAwA3AAAgARAPIABBIDYCBCAAIAY2AgAgAkHAD2okAAv6AgEFfyMAQfAAayICJAAgAkEgakEcakIANwIAIAJBIGpBFGpCADcCACACQSBqQQxqQgA3AgAgAkIANwIkIAJBIDYCICACQcgAakEgaiACQSBqQSBqKAIANgIAIAJByABqQRhqIAJBIGpBGGopAwA3AwAgAkHIAGpBEGogAkEgakEQaikDADcDACACQcgAakEIaiACQSBqQQhqKQMANwMAIAIgAikDIDcDSCACQRhqIgMgAkHIAGpBHGopAgA3AwAgAkEQaiIEIAJByABqQRRqKQIANwMAIAJBCGoiBSACQcgAakEMaikCADcDACACIAIpAkw3AwAgASACEGUgAUEAQcwBEJ0BIQYCQEEgEAkiAQ0AQSBBAUEAKAK8p0AiAkECIAIbEQQAAAsgASACKQMANwAAIAFBGGogAykDADcAACABQRBqIAQpAwA3AAAgAUEIaiAFKQMANwAAIAZBAEHMARCdARogAEEgNgIEIAAgATYCACACQfAAaiQAC/oCAQV/IwBB8ABrIgIkACACQSBqQRxqQgA3AgAgAkEgakEUakIANwIAIAJBIGpBDGpCADcCACACQgA3AiQgAkEgNgIgIAJByABqQSBqIAJBIGpBIGooAgA2AgAgAkHIAGpBGGogAkEgakEYaikDADcDACACQcgAakEQaiACQSBqQRBqKQMANwMAIAJByABqQQhqIAJBIGpBCGopAwA3AwAgAiACKQMgNwNIIAJBGGoiAyACQcgAakEcaikCADcDACACQRBqIgQgAkHIAGpBFGopAgA3AwAgAkEIaiIFIAJByABqQQxqKQIANwMAIAIgAikCTDcDACABIAIQZiABQQBBzAEQnQEhBgJAQSAQCSIBDQBBIEEBQQAoArynQCICQQIgAhsRBAAACyABIAIpAwA3AAAgAUEYaiADKQMANwAAIAFBEGogBCkDADcAACABQQhqIAUpAwA3AAAgBkEAQcwBEJ0BGiAAQSA2AgQgACABNgIAIAJB8ABqJAALjAMBB38jAEGwAWsiAiQAIAJB2ABqQQRyIAFBBGoQYyACIAEoAgA2AlggAkGYAWoiAyABQTxqKQAANwMAIAJBkAFqIgQgAUE0aikAADcDACACQYgBaiIFIAFBLGopAAA3AwAgAkHwAGpBEGoiBiABQSRqKQAANwMAIAJB8ABqQQhqIgcgAUEcaikAADcDACACIAEpABQ3A3AgAkGgAWoiCCABQcQAahBjIAJBEGogAkHYAGpBEGooAgA2AgAgAkEIaiACQdgAakEIaikDADcDACACQRxqIAcpAwA3AgAgAkEkaiAGKQMANwIAIAJBLGogBSkDADcCACACQTRqIAQpAwA3AgAgAkE8aiADKQMANwIAIAJBxABqIAgpAwA3AgAgAkHMAGogAkGoAWopAwA3AgAgAiACKQNYNwMAIAIgAikDcDcCFAJAQdQAEAkiAQ0AQdQAQQRBACgCvKdAIgJBAiACGxEEAAALIAEgAkHUABCXASEBIABBlJXAADYCBCAAIAE2AgAgAkGwAWokAAvyAgEDfwJAAkACQAJAAkAgAC0AaCIDRQ0AIANBwQBPDQMgACADakEoaiABIAJBwAAgA2siAyADIAJLGyIDEJcBGiAAIAAtAGggA2oiBDoAaCABIANqIQECQCACIANrIgINAEEAIQIMAgsgAEEIaiAAQShqIgRBwAAgACkDACAALQBqIABB6QBqIgMtAABFchAKIARBAEHBABCdARogAyADLQAAQQFqOgAAC0EAIQMgAkHBAEkNASAAQQhqIQUgAEHpAGoiAy0AACEEA0AgBSABQcAAIAApAwAgAC0AaiAEQf8BcUVyEAogAyADLQAAQQFqIgQ6AAAgAUHAAGohASACQUBqIgJBwABLDQALIAAtAGghBAsgBEH/AXEiA0HBAE8NAiACQcAAIANrIgQgBCACSxshAgsgACADakEoaiABIAIQlwEaIAAgAC0AaCACajoAaCAADwsgA0HAAEGQiMAAEIQBAAsgA0HAAEGQiMAAEIQBAAvpAgEDfyMAQRBrIgIkACAAKAIAIQACQAJAAkACQAJAIAFBgAFJDQAgAkEANgIMIAFBgBBJDQEgAUGAgARPDQIgAiABQT9xQYABcjoADiACIAFBDHZB4AFyOgAMIAIgAUEGdkE/cUGAAXI6AA1BAyEBDAMLAkAgACgCCCIDIABBBGooAgBHDQAgACADQQEQbCAAKAIIIQMLIAAgA0EBajYCCCAAKAIAIANqIAE6AAAMAwsgAiABQT9xQYABcjoADSACIAFBBnZBwAFyOgAMQQIhAQwBCyACIAFBP3FBgAFyOgAPIAIgAUESdkHwAXI6AAwgAiABQQZ2QT9xQYABcjoADiACIAFBDHZBP3FBgAFyOgANQQQhAQsCQCAAQQRqKAIAIABBCGoiBCgCACIDayABTw0AIAAgAyABEGwgBCgCACEDCyAAKAIAIANqIAJBDGogARCXARogBCADIAFqNgIACyACQRBqJABBAAv4AgIFfwJ+IwBB0ABrIgIkACACQSBqQRRqQQA2AgAgAkEgakEMakIANwIAIAJCADcCJCACQRQ2AiAgAkE4akEQaiACQSBqQRBqKQMANwMAIAJBOGpBCGogAkEgakEIaikDADcDACACQQhqQQhqIgMgAkE4akEMaikCADcDACACQQhqQRBqIgQgAkE4akEUaigCADYCACACIAIpAyA3AzggAiACKQI8NwMIIAEgAkEIahAgIAFBADYCHCABQgA3AwAgAUEYakEAKALIm0AiBTYCACABQRBqQQApA8CbQCIHNwMAIAFBACkDuJtAIgg3AwgCQEEUEAkiBg0AQRRBAUEAKAK8p0AiAkECIAIbEQQAAAsgBiACKQMINwAAIAZBEGogBCgCADYAACAGQQhqIAMpAwA3AAAgAUEANgIcIAFCADcDACABQQhqIgFBEGogBTYCACABQQhqIAc3AwAgASAINwMAIABBFDYCBCAAIAY2AgAgAkHQAGokAAv4AgIFfwJ+IwBB0ABrIgIkACACQSBqQRRqQQA2AgAgAkEgakEMakIANwIAIAJCADcCJCACQRQ2AiAgAkE4akEQaiACQSBqQRBqKQMANwMAIAJBOGpBCGogAkEgakEIaikDADcDACACQQhqQQhqIgMgAkE4akEMaikCADcDACACQQhqQRBqIgQgAkE4akEUaigCADYCACACIAIpAyA3AzggAiACKQI8NwMIIAEgAkEIahBYIAFCADcDACABQQA2AhwgAUEAKQO4m0AiBzcDCCABQRBqQQApA8CbQCIINwMAIAFBGGpBACgCyJtAIgU2AgACQEEUEAkiBg0AQRRBAUEAKAK8p0AiAkECIAIbEQQAAAsgBiACKQMINwAAIAZBEGogBCgCADYAACAGQQhqIAMpAwA3AAAgAUIANwMAIAFBADYCHCABQQhqIgEgBzcDACABQQhqIAg3AwAgAUEQaiAFNgIAIABBFDYCBCAAIAY2AgAgAkHQAGokAAvUAgEBfyAAEEggASAAKAJMIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYAACABIABB0ABqKAIAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYABCABIABB1ABqKAIAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYACCABIABB2ABqKAIAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYADCABIABB3ABqKAIAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYAECABIABB4ABqKAIAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZycjYAFCABIABB5ABqKAIAIgBBGHQgAEEIdEGAgPwHcXIgAEEIdkGA/gNxIABBGHZycjYAGAvvAgEFfwJAAkACQAJAAkACQEHoACAAKALIASIDayIEIAJLDQAgAw0BIAEhBQwCCyADIAJqIgUgA0kNAiAFQegASw0DIABByAFqIANqQQRqIAEgAhCXARogACAAKALIASACajYCyAEPCyADQekATw0DIAIgBGshAiABIARqIQUgACADakHMAWogASAEEJcBGkEAIQMDQCAAIANqIgEgAS0AACABQcwBai0AAHM6AAAgA0EBaiIDQegARw0ACyAAEBMLIAUgAiACQegAcCIGayICaiEHAkAgAkHoAEkNAANAIAVB6ABqIQQgAkGYf2ohAkEAIQMDQCAAIANqIgEgAS0AACAFIANqLQAAczoAACADQQFqIgNB6ABHDQALIAAQEyAEIQUgAkHoAE8NAAsLIABBzAFqIAcgBhCXARogACAGNgLIAQ8LIAMgBUG8oMAAEIgBAAsgBUHoAEG8oMAAEIUBAAsgA0HoAEHMoMAAEIQBAAvvAgEFfwJAAkACQAJAAkACQEGQASAAKALIASIDayIEIAJLDQAgAw0BIAEhBQwCCyADIAJqIgUgA0kNAiAFQZABSw0DIABByAFqIANqQQRqIAEgAhCXARogACAAKALIASACajYCyAEPCyADQZEBTw0DIAIgBGshAiABIARqIQUgACADakHMAWogASAEEJcBGkEAIQMDQCAAIANqIgEgAS0AACABQcwBai0AAHM6AAAgA0EBaiIDQZABRw0ACyAAEBMLIAUgAiACQZABcCIGayICaiEHAkAgAkGQAUkNAANAIAVBkAFqIQQgAkHwfmohAkEAIQMDQCAAIANqIgEgAS0AACAFIANqLQAAczoAACADQQFqIgNBkAFHDQALIAAQEyAEIQUgAkGQAU8NAAsLIABBzAFqIAcgBhCXARogACAGNgLIAQ8LIAMgBUG8oMAAEIgBAAsgBUGQAUG8oMAAEIUBAAsgA0GQAUHMoMAAEIQBAAvvAgEFfwJAAkACQAJAAkACQEHIACAAKALIASIDayIEIAJLDQAgAw0BIAEhBQwCCyADIAJqIgUgA0kNAiAFQcgASw0DIABByAFqIANqQQRqIAEgAhCXARogACAAKALIASACajYCyAEPCyADQckATw0DIAIgBGshAiABIARqIQUgACADakHMAWogASAEEJcBGkEAIQMDQCAAIANqIgEgAS0AACABQcwBai0AAHM6AAAgA0EBaiIDQcgARw0ACyAAEBMLIAUgAiACQcgAcCIGayICaiEHAkAgAkHIAEkNAANAIAVByABqIQQgAkG4f2ohAkEAIQMDQCAAIANqIgEgAS0AACAFIANqLQAAczoAACADQQFqIgNByABHDQALIAAQEyAEIQUgAkHIAE8NAAsLIABBzAFqIAcgBhCXARogACAGNgLIAQ8LIAMgBUG8oMAAEIgBAAsgBUHIAEG8oMAAEIUBAAsgA0HIAEHMoMAAEIQBAAvvAgEFfwJAAkACQAJAAkACQEGIASAAKALIASIDayIEIAJLDQAgAw0BIAEhBQwCCyADIAJqIgUgA0kNAiAFQYgBSw0DIABByAFqIANqQQRqIAEgAhCXARogACAAKALIASACajYCyAEPCyADQYkBTw0DIAIgBGshAiABIARqIQUgACADakHMAWogASAEEJcBGkEAIQMDQCAAIANqIgEgAS0AACABQcwBai0AAHM6AAAgA0EBaiIDQYgBRw0ACyAAEBMLIAUgAiACQYgBcCIGayICaiEHAkAgAkGIAUkNAANAIAVBiAFqIQQgAkH4fmohAkEAIQMDQCAAIANqIgEgAS0AACAFIANqLQAAczoAACADQQFqIgNBiAFHDQALIAAQEyAEIQUgAkGIAU8NAAsLIABBzAFqIAcgBhCXARogACAGNgLIAQ8LIAMgBUG8oMAAEIgBAAsgBUGIAUG8oMAAEIUBAAsgA0GIAUHMoMAAEIQBAAvkAgEFfyMAQaADayICJAAgAkGAA2pBHGpBADYCACACQYADakEUakIANwIAIAJBgANqQQxqQgA3AgAgAkIANwKEAyACQRw2AoADIAJBIGpBEGogAkGAA2pBEGopAwA3AwAgAkEgakEIaiACQYADakEIaikDADcDACACQSBqQRhqIAJBgANqQRhqKQMANwMAIAJBCGoiAyACQSBqQQxqKQIANwMAIAJBEGoiBCACQSBqQRRqKQIANwMAIAJBGGoiBSACQSBqQRxqKAIANgIAIAIgAikDgAM3AyAgAiACKQIkNwMAIAJBIGogAUHgAhCXARogAkEgaiACEGcCQEEcEAkiBg0AQRxBAUEAKAK8p0AiAkECIAIbEQQAAAsgBiACKQMANwAAIAZBGGogBSgCADYAACAGQRBqIAQpAwA3AAAgBkEIaiADKQMANwAAIAEQDyAAQRw2AgQgACAGNgIAIAJBoANqJAAL5AIBBX8jAEGgA2siAiQAIAJBgANqQRxqQQA2AgAgAkGAA2pBFGpCADcCACACQYADakEMakIANwIAIAJCADcChAMgAkEcNgKAAyACQSBqQRBqIAJBgANqQRBqKQMANwMAIAJBIGpBCGogAkGAA2pBCGopAwA3AwAgAkEgakEYaiACQYADakEYaikDADcDACACQQhqIgMgAkEgakEMaikCADcDACACQRBqIgQgAkEgakEUaikCADcDACACQRhqIgUgAkEgakEcaigCADYCACACIAIpA4ADNwMgIAIgAikCJDcDACACQSBqIAFB4AIQlwEaIAJBIGogAhBkAkBBHBAJIgYNAEEcQQFBACgCvKdAIgJBAiACGxEEAAALIAYgAikDADcAACAGQRhqIAUoAgA2AAAgBkEQaiAEKQMANwAAIAZBCGogAykDADcAACABEA8gAEEcNgIEIAAgBjYCACACQaADaiQAC+QCAQV/IwBBsAFrIgIkACACQZABakEcakEANgIAIAJBkAFqQRRqQgA3AgAgAkGQAWpBDGpCADcCACACQgA3ApQBIAJBHDYCkAEgAkEgakEQaiACQZABakEQaikDADcDACACQSBqQQhqIAJBkAFqQQhqKQMANwMAIAJBIGpBGGogAkGQAWpBGGopAwA3AwAgAkEIaiIDIAJBIGpBDGopAgA3AwAgAkEQaiIEIAJBIGpBFGopAgA3AwAgAkEYaiIFIAJBIGpBHGooAgA2AgAgAiACKQOQATcDICACIAIpAiQ3AwAgAkEgaiABQfAAEJcBGiACQSBqIAIQPQJAQRwQCSIGDQBBHEEBQQAoArynQCICQQIgAhsRBAAACyAGIAIpAwA3AAAgBkEYaiAFKAIANgAAIAZBEGogBCkDADcAACAGQQhqIAMpAwA3AAAgARAPIABBHDYCBCAAIAY2AgAgAkGwAWokAAvjAgEFfyMAQeAAayICJAAgAkEgakEcakEANgIAIAJBIGpBFGpCADcCACACQSBqQQxqQgA3AgAgAkIANwIkIAJBHDYCICACQcAAakEQaiACQSBqQRBqKQMANwMAIAJBwABqQQhqIAJBIGpBCGopAwA3AwAgAkHAAGpBGGogAkEgakEYaikDADcDACACQQhqIgMgAkHAAGpBDGopAgA3AwAgAkEQaiIEIAJBwABqQRRqKQIANwMAIAJBGGoiBSACQcAAakEcaigCADYCACACIAIpAyA3A0AgAiACKQJENwMAIAEgAhBkIAFBAEHMARCdASEGAkBBHBAJIgENAEEcQQFBACgCvKdAIgJBAiACGxEEAAALIAEgAikDADcAACABQRhqIAUoAgA2AAAgAUEQaiAEKQMANwAAIAFBCGogAykDADcAACAGQQBBzAEQnQEaIABBHDYCBCAAIAE2AgAgAkHgAGokAAvjAgEFfyMAQeAAayICJAAgAkEgakEcakEANgIAIAJBIGpBFGpCADcCACACQSBqQQxqQgA3AgAgAkIANwIkIAJBHDYCICACQcAAakEQaiACQSBqQRBqKQMANwMAIAJBwABqQQhqIAJBIGpBCGopAwA3AwAgAkHAAGpBGGogAkEgakEYaikDADcDACACQQhqIgMgAkHAAGpBDGopAgA3AwAgAkEQaiIEIAJBwABqQRRqKQIANwMAIAJBGGoiBSACQcAAakEcaigCADYCACACIAIpAyA3A0AgAiACKQJENwMAIAEgAhBnIAFBAEHMARCdASEGAkBBHBAJIgENAEEcQQFBACgCvKdAIgJBAiACGxEEAAALIAEgAikDADcAACABQRhqIAUoAgA2AAAgAUEQaiAEKQMANwAAIAFBCGogAykDADcAACAGQQBBzAEQnQEaIABBHDYCBCAAIAE2AgAgAkHgAGokAAvQAgIFfwF+IwBBMGsiAiQAQSchAwJAAkAgAEKQzgBaDQAgACEHDAELQSchAwNAIAJBCWogA2oiBEF8aiAAQpDOAIAiB0LwsX9+IAB8pyIFQf//A3FB5ABuIgZBAXRB+ozAAGovAAA7AAAgBEF+aiAGQZx/bCAFakH//wNxQQF0QfqMwABqLwAAOwAAIANBfGohAyAAQv/B1y9WIQQgByEAIAQNAAsLAkAgB6ciBEHjAEwNACACQQlqIANBfmoiA2ogB6ciBUH//wNxQeQAbiIEQZx/bCAFakH//wNxQQF0QfqMwABqLwAAOwAACwJAAkAgBEEKSA0AIAJBCWogA0F+aiIDaiAEQQF0QfqMwABqLwAAOwAADAELIAJBCWogA0F/aiIDaiAEQTBqOgAACyABQZyiwABBACACQQlqIANqQScgA2sQHCEDIAJBMGokACADC98CAgR/AX4gAEHMAGohASAAKQMAIQUCQAJAAkACQCAAKAIIIgJBwABHDQAgASAAQQxqQQEQBEEAIQIgAEEANgIIDAELIAJBP0sNAQsgAEEMaiIDIAJqQYABOgAAIAAgACgCCCIEQQFqIgI2AggCQCACQcEATw0AIABBCGogAmpBBGpBAEE/IARrEJ0BGgJAQcAAIAAoAghrQQhPDQAgASADQQEQBCAAKAIIIgJBwQBPDQMgA0EAIAIQnQEaCyAAQcQAaiAFQjiGIAVCKIZCgICAgICAwP8Ag4QgBUIYhkKAgICAgOA/gyAFQgiGQoCAgIDwH4OEhCAFQgiIQoCAgPgPgyAFQhiIQoCA/AeDhCAFQiiIQoD+A4MgBUI4iISEhDcCACABIANBARAEIABBADYCCA8LIAJBwABB3J3AABCEAQALIAJBwABB7J3AABCHAQALIAJBwABB/J3AABCFAQALywICBH8BfiAAQQhqIQIgACkDACEGAkACQAJAAkAgACgCMCIDQcAARw0AIAIgAEE0ahAFQQAhAyAAQQA2AjAMAQsgA0E/Sw0BCyAAQTRqIgQgA2pBgAE6AAAgACAAKAIwIgVBAWoiAzYCMAJAIANBwQBPDQAgAEEwaiADakEEakEAQT8gBWsQnQEaAkBBwAAgACgCMGtBCE8NACACIAQQBSAAKAIwIgNBwQBPDQMgBEEAIAMQnQEaCyAAQewAaiAGQgOGNwIAIAIgBBAFIABBADYCMCABIAAoAgg2AAAgASAAQQxqKQIANwAEIAEgAEEUaikCADcADCABIABBHGopAgA3ABQgASAAQSRqKQIANwAcIAEgAEEsaigCADYAJA8LIANBwABB3J3AABCEAQALIANBwABB7J3AABCHAQALIANBwABB/J3AABCFAQALuQIBA38jAEEQayICJAACQCAAKALIASIDQccASw0AIAAgA2pBzAFqQQY6AAACQCADQQFqIgRByABGDQAgACAEakHMAWpBAEHHACADaxCdARoLQQAhAyAAQQA2AsgBIABBkwJqIgQgBC0AAEGAAXI6AAADQCAAIANqIgQgBC0AACAEQcwBai0AAHM6AAAgA0EBaiIDQcgARw0ACyAAEBMgASAAKQAANwAAIAFBOGogAEE4aikAADcAACABQTBqIABBMGopAAA3AAAgAUEoaiAAQShqKQAANwAAIAFBIGogAEEgaikAADcAACABQRhqIABBGGopAAA3AAAgAUEQaiAAQRBqKQAANwAAIAFBCGogAEEIaikAADcAACACQRBqJAAPC0G6n8AAQRcgAkEIakHUn8AAQYyiwAAQfwALuQIBA38jAEEQayICJAACQCAAKALIASIDQccASw0AIAAgA2pBzAFqQQE6AAACQCADQQFqIgRByABGDQAgACAEakHMAWpBAEHHACADaxCdARoLQQAhAyAAQQA2AsgBIABBkwJqIgQgBC0AAEGAAXI6AAADQCAAIANqIgQgBC0AACAEQcwBai0AAHM6AAAgA0EBaiIDQcgARw0ACyAAEBMgASAAKQAANwAAIAFBOGogAEE4aikAADcAACABQTBqIABBMGopAAA3AAAgAUEoaiAAQShqKQAANwAAIAFBIGogAEEgaikAADcAACABQRhqIABBGGopAAA3AAAgAUEQaiAAQRBqKQAANwAAIAFBCGogAEEIaikAADcAACACQRBqJAAPC0G6n8AAQRcgAkEIakHUn8AAQcyhwAAQfwALtQIBBX8jAEGgAWsiAiQAIAJBADYCECACQQhqIAJBEGpBBHIgAkHUAGoQqAEgAigCECEDAkAgAigCDCACKAIIIgRrIgVBwAAgBUHAAEkbIgZFDQAgBiEFA0AgBCABLQAAOgAAIARBAWohBCABQQFqIQEgBUF/aiIFDQALIAIgAyAGaiIDNgIQCwJAIANBP0sNACADQcAAEIkBAAsgAkHYAGogAkEQakHEABCXARogAEE4aiACQZQBaikCADcAACAAQTBqIAJBjAFqKQIANwAAIABBKGogAkGEAWopAgA3AAAgAEEgaiACQfwAaikCADcAACAAQRhqIAJB9ABqKQIANwAAIABBEGogAkHsAGopAgA3AAAgAEEIaiACQeQAaikCADcAACAAIAIpAlw3AAAgAkGgAWokAAu2AgEIfyMAQfAAayIBQShqIgJCADcDACABQSBqIgNCADcDACABQRhqIgRCADcDACABQRBqIgVCADcDACABQQhqIgZCADcDACABQgA3AwAgAUHAAGpBDGpCADcCACABQgA3AkQgAUEQNgJAIAFB2ABqQRBqIAFBwABqQRBqKAIANgIAIAFB2ABqQQhqIAFBwABqQQhqKQMANwMAIAEgASkDQDcDWCABQThqIgcgAUHYAGpBDGopAgA3AwAgAUEwaiIIIAEpAlw3AwAgAEHMAGogBykDADcAACAAQcQAaiAIKQMANwAAIABBPGogAikDADcAACAAQTRqIAMpAwA3AAAgAEEsaiAEKQMANwAAIABBJGogBSkDADcAACAAQRxqIAYpAwA3AAAgACABKQMANwAUIABBADYCAAu3AgIFfwF+IwBBwAFrIgIkACACQdAAakEIaiIDIAFBEGopAwA3AwAgAkHQAGpBEGoiBCABQRhqKQMANwMAIAJB0ABqQRhqIgUgAUEgaikDADcDACACQdAAakEgaiIGIAFBKGopAwA3AwAgAiABKQMINwNQIAEpAwAhByACQfgAakEEciABQTRqEEwgAiABKAIwNgJ4IAJBCGogAkH4AGpBxAAQlwEaAkBB+AAQCSIBDQBB+ABBCEEAKAK8p0AiAkECIAIbEQQAAAsgASAHNwMAIAEgAikDUDcDCCABQRBqIAMpAwA3AwAgAUEYaiAEKQMANwMAIAFBIGogBSkDADcDACABQShqIAYpAwA3AwAgAUEwaiACQQhqQcQAEJcBGiAAQfCUwAA2AgQgACABNgIAIAJBwAFqJAALowICBH8CfiAAIAApAwAiByACrUIDhnwiCDcDACAAQQhqIgMgAykDACAIIAdUrXw3AwACQAJAQYABIAAoAlAiA2siBCACSw0AIABBEGohBQJAIANFDQAgA0GBAU8NAiAAQdQAaiIGIANqIAEgBBCXARogAEEANgJQIAUgBkEBEAMgAiAEayECIAEgBGohAQsgBSABIAJBB3YQAyAAQdQAaiABIAJBgH9xaiACQf8AcSICEJcBGiAAIAI2AlAPCwJAAkAgAyACaiIEIANJDQAgBEGAAUsNASAAQdAAaiADakEEaiABIAIQlwEaIAAgACgCUCACajYCUA8LIAMgBEG8ncAAEIgBAAsgBEGAAUG8ncAAEIUBAAsgA0GAAUHMncAAEIQBAAueAgEEfyAAIAApAwAgAq18NwMAAkACQEHAACAAKAIIIgNrIgQgAksNACAAQcwAaiEFAkAgA0UNACADQcEATw0CIABBDGoiBiADaiABIAQQlwEaIAUgBhAMIAIgBGshAiABIARqIQELIAJBP3EhAyABIAJBQHEiAmohBAJAIAJFDQBBACACayECA0AgBSABEAwgAUHAAGohASACQcAAaiICDQALCyAAQQxqIAQgAxCXARogACADNgIIDwsCQAJAIAMgAmoiBSADSQ0AIAVBwABLDQEgAEEIaiADakEEaiABIAIQlwEaIAAgACgCCCACajYCCA8LIAMgBUG8oMAAEIgBAAsgBUHAAEG8oMAAEIUBAAsgA0HAAEHMoMAAEIQBAAueAgEEfyAAIAApAwAgAq18NwMAAkACQEHAACAAKAIIIgNrIgQgAksNACAAQcwAaiEFAkAgA0UNACADQcEATw0CIABBDGoiBiADaiABIAQQlwEaIAUgBhAQIAIgBGshAiABIARqIQELIAJBP3EhAyABIAJBQHEiAmohBAJAIAJFDQBBACACayECA0AgBSABEBAgAUHAAGohASACQcAAaiICDQALCyAAQQxqIAQgAxCXARogACADNgIIDwsCQAJAIAMgAmoiBSADSQ0AIAVBwABLDQEgAEEIaiADakEEaiABIAIQlwEaIAAgACgCCCACajYCCA8LIAMgBUG8oMAAEIgBAAsgBUHAAEG8oMAAEIUBAAsgA0HAAEHMoMAAEIQBAAudAgEEfyAAIAApAwAgAq18NwMAAkACQEHAACAAKAIcIgNrIgQgAksNACAAQQhqIQUCQCADRQ0AIANBwQBPDQIgAEEgaiIGIANqIAEgBBCXARogBSAGEAYgAiAEayECIAEgBGohAQsgAkE/cSEDIAEgAkFAcSICaiEEAkAgAkUNAEEAIAJrIQIDQCAFIAEQBiABQcAAaiEBIAJBwABqIgINAAsLIABBIGogBCADEJcBGiAAIAM2AhwPCwJAAkAgAyACaiIFIANJDQAgBUHAAEsNASAAQRxqIANqQQRqIAEgAhCXARogACAAKAIcIAJqNgIcDwsgAyAFQbygwAAQiAEACyAFQcAAQbygwAAQhQEACyADQcAAQcygwAAQhAEAC50CAQR/IAAgACkDACACrXw3AwACQAJAQcAAIAAoAjAiA2siBCACSw0AIABBCGohBQJAIANFDQAgA0HBAE8NAiAAQTRqIgYgA2ogASAEEJcBGiAFIAYQBSACIARrIQIgASAEaiEBCyACQT9xIQMgASACQUBxIgJqIQQCQCACRQ0AQQAgAmshAgNAIAUgARAFIAFBwABqIQEgAkHAAGoiAg0ACwsgAEE0aiAEIAMQlwEaIAAgAzYCMA8LAkACQCADIAJqIgUgA0kNACAFQcAASw0BIABBMGogA2pBBGogASACEJcBGiAAIAAoAjAgAmo2AjAPCyADIAVBvKDAABCIAQALIAVBwABBvKDAABCFAQALIANBwABBzKDAABCEAQALpwICA38CfiMAQcAAayICJAAgAkEQakEMakIANwIAIAJCADcCFCACQRA2AhAgAkEoakEQaiACQRBqQRBqKAIANgIAIAJBKGpBCGogAkEQakEIaikDADcDACACQQhqIgMgAkEoakEMaikCADcDACACIAIpAxA3AyggAiACKQIsNwMAIAEgAhBfIAFBADYCCCABQgA3AwAgAUHUAGpBACkCiJtAIgU3AgAgAUEAKQKAm0AiBjcCTAJAQRAQCSIEDQBBEEEBQQAoArynQCICQQIgAhsRBAAACyAEIAIpAwA3AAAgBEEIaiADKQMANwAAIAFBADYCCCABQgA3AwAgAUHMAGoiAUEIaiAFNwIAIAEgBjcCACAAQRA2AgQgACAENgIAIAJBwABqJAALpwICA38CfiMAQcAAayICJAAgAkEQakEMakIANwIAIAJCADcCFCACQRA2AhAgAkEoakEQaiACQRBqQRBqKAIANgIAIAJBKGpBCGogAkEQakEIaikDADcDACACQQhqIgMgAkEoakEMaikCADcDACACIAIpAxA3AyggAiACKQIsNwMAIAEgAhBgIAFBADYCCCABQgA3AwAgAUHUAGpBACkCiJtAIgU3AgAgAUEAKQKAm0AiBjcCTAJAQRAQCSIEDQBBEEEBQQAoArynQCICQQIgAhsRBAAACyAEIAIpAwA3AAAgBEEIaiADKQMANwAAIAFBADYCCCABQgA3AwAgAUHMAGoiAUEIaiAFNwIAIAEgBjcCACAAQRA2AgQgACAENgIAIAJBwABqJAALmgIBBH8jAEGQAWsiAiQAIAJB+ABqQRRqQQA2AgAgAkH4AGpBDGpCADcCACACQgA3AnwgAkEUNgJ4IAJBGGpBEGogAkH4AGpBEGopAwA3AwAgAkEYakEIaiACQfgAakEIaikDADcDACACQQhqIgMgAkEYakEMaikCADcDACACQRBqIgQgAkEYakEUaigCADYCACACIAIpA3g3AxggAiACKQIcNwMAIAJBGGogAUHgABCXARogAkEYaiACECACQEEUEAkiBQ0AQRRBAUEAKAK8p0AiAkECIAIbEQQAAAsgBSACKQMANwAAIAVBEGogBCgCADYAACAFQQhqIAMpAwA3AAAgARAPIABBFDYCBCAAIAU2AgAgAkGQAWokAAuaAgEEfyMAQZABayICJAAgAkH4AGpBFGpBADYCACACQfgAakEMakIANwIAIAJCADcCfCACQRQ2AnggAkEYakEQaiACQfgAakEQaikDADcDACACQRhqQQhqIAJB+ABqQQhqKQMANwMAIAJBCGoiAyACQRhqQQxqKQIANwMAIAJBEGoiBCACQRhqQRRqKAIANgIAIAIgAikDeDcDGCACIAIpAhw3AwAgAkEYaiABQeAAEJcBGiACQRhqIAIQWAJAQRQQCSIFDQBBFEEBQQAoArynQCICQQIgAhsRBAAACyAFIAIpAwA3AAAgBUEQaiAEKAIANgAAIAVBCGogAykDADcAACABEA8gAEEUNgIEIAAgBTYCACACQZABaiQAC6QCAgR/AX4gAEEIaiECIAApAwAhBgJAAkACQAJAIAAoAhwiA0HAAEcNACACIABBIGoQBkEAIQMgAEEANgIcDAELIANBP0sNAQsgAEEgaiIEIANqQYABOgAAIAAgACgCHCIFQQFqIgM2AhwCQCADQcEATw0AIABBHGogA2pBBGpBAEE/IAVrEJ0BGgJAQcAAIAAoAhxrQQhPDQAgAiAEEAYgACgCHCIDQcEATw0DIARBACADEJ0BGgsgAEHYAGogBkIDhjcDACACIAQQBiAAQQA2AhwgASAAKAIINgAAIAEgAEEMaikCADcABCABIABBFGopAgA3AAwPCyADQcAAQdydwAAQhAEACyADQcAAQeydwAAQhwEACyADQcAAQfydwAAQhQEAC5kCAQN/IwBBEGsiAiQAAkAgACgCyAEiA0HnAEsNACAAIANqQcwBakEBOgAAAkAgA0EBaiIEQegARg0AIAAgBGpBzAFqQQBB5wAgA2sQnQEaC0EAIQMgAEEANgLIASAAQbMCaiIEIAQtAABBgAFyOgAAA0AgACADaiIEIAQtAAAgBEHMAWotAABzOgAAIANBAWoiA0HoAEcNAAsgABATIAEgACkAADcAACABQShqIABBKGopAAA3AAAgAUEgaiAAQSBqKQAANwAAIAFBGGogAEEYaikAADcAACABQRBqIABBEGopAAA3AAAgAUEIaiAAQQhqKQAANwAAIAJBEGokAA8LQbqfwABBFyACQQhqQdSfwABBvKHAABB/AAuZAgEDfyMAQRBrIgIkAAJAIAAoAsgBIgNB5wBLDQAgACADakHMAWpBBjoAAAJAIANBAWoiBEHoAEYNACAAIARqQcwBakEAQecAIANrEJ0BGgtBACEDIABBADYCyAEgAEGzAmoiBCAELQAAQYABcjoAAANAIAAgA2oiBCAELQAAIARBzAFqLQAAczoAACADQQFqIgNB6ABHDQALIAAQEyABIAApAAA3AAAgAUEoaiAAQShqKQAANwAAIAFBIGogAEEgaikAADcAACABQRhqIABBGGopAAA3AAAgAUEQaiAAQRBqKQAANwAAIAFBCGogAEEIaikAADcAACACQRBqJAAPC0G6n8AAQRcgAkEIakHUn8AAQfyhwAAQfwALhQIBBH8CQAJAQRAgACgCACIDayIEIAJLDQAgAEEUaiEFAkAgA0UNACADQRFPDQIgAEEEaiIGIANqIAEgBBCXARogBSAGEA0gAiAEayECIAEgBGohAQsgAkEPcSEDIAEgAkFwcSICaiEEAkAgAkUNAEEAIAJrIQIDQCAFIAEQDSABQRBqIQEgAkEQaiICDQALCyAAQQRqIAQgAxCXARogACADNgIADwsCQAJAIAMgAmoiBSADSQ0AIAVBEEsNASAAIANqQQRqIAEgAhCXARogACAAKAIAIAJqNgIADwsgAyAFQbygwAAQiAEACyAFQRBBvKDAABCFAQALIANBEEHMoMAAEIQBAAukAgICfwJ+IwBBkAJrIgIkACABQQhqKQMAIQQgASkDACEFIAJBiAFqQQRyIAFB1ABqEG0gAiABKAJQNgKIASACIAJBiAFqQYQBEJcBIQMCQEHYARAJIgINAEHYAUEIQQAoArynQCIBQQIgARsRBAAACyACIAU3AwAgAiAENwMIIAIgASkDEDcDECACQRhqIAFBGGopAwA3AwAgAkEgaiABQSBqKQMANwMAIAJBKGogAUEoaikDADcDACACQTBqIAFBMGopAwA3AwAgAkE4aiABQThqKQMANwMAIAJBwABqIAFBwABqKQMANwMAIAJByABqIAFByABqKQMANwMAIAJB0ABqIANBhAEQlwEaIABBuJXAADYCBCAAIAI2AgAgA0GQAmokAAukAgICfwJ+IwBBkAJrIgIkACABQQhqKQMAIQQgASkDACEFIAJBiAFqQQRyIAFB1ABqEG0gAiABKAJQNgKIASACIAJBiAFqQYQBEJcBIQMCQEHYARAJIgINAEHYAUEIQQAoArynQCIBQQIgARsRBAAACyACIAU3AwAgAiAENwMIIAIgASkDEDcDECACQRhqIAFBGGopAwA3AwAgAkEgaiABQSBqKQMANwMAIAJBKGogAUEoaikDADcDACACQTBqIAFBMGopAwA3AwAgAkE4aiABQThqKQMANwMAIAJBwABqIAFBwABqKQMANwMAIAJByABqIAFByABqKQMANwMAIAJB0ABqIANBhAEQlwEaIABB3JXAADYCBCAAIAI2AgAgA0GQAmokAAuDAgEEfyAAIAApAwAgAq1CA4Z8NwMAAkACQEHAACAAKAIIIgNrIgQgAksNACAAQcwAaiEFAkAgA0UNACADQcEATw0CIABBDGoiBiADaiABIAQQlwEaIABBADYCCCAFIAZBARAEIAIgBGshAiABIARqIQELIAUgASACQQZ2EAQgAEEMaiABIAJBQHFqIAJBP3EiAhCXARogACACNgIIDwsCQAJAIAMgAmoiBCADSQ0AIARBwABLDQEgAEEIaiADakEEaiABIAIQlwEaIAAgACgCCCACajYCCA8LIAMgBEG8ncAAEIgBAAsgBEHAAEG8ncAAEIUBAAsgA0HAAEHMncAAEIQBAAuZAgIEfwF+IABBzABqIQIgACkDACEGAkACQAJAAkAgACgCCCIDQcAARw0AIAIgAEEMahAMQQAhAyAAQQA2AggMAQsgA0E/Sw0BCyAAQQxqIgQgA2pBgAE6AAAgACAAKAIIIgVBAWoiAzYCCAJAIANBwQBPDQAgAEEIaiADakEEakEAQT8gBWsQnQEaAkBBwAAgACgCCGtBCE8NACACIAQQDCAAKAIIIgNBwQBPDQMgBEEAIAMQnQEaCyAAQcQAaiAGQgOGNwIAIAIgBBAMIABBADYCCCABIAApAkw3AAAgASAAQdQAaikCADcACA8LIANBwABB3J3AABCEAQALIANBwABB7J3AABCHAQALIANBwABB/J3AABCFAQALmQICBH8BfiAAQcwAaiECIAApAwAhBgJAAkACQAJAIAAoAggiA0HAAEcNACACIABBDGoQEEEAIQMgAEEANgIIDAELIANBP0sNAQsgAEEMaiIEIANqQYABOgAAIAAgACgCCCIFQQFqIgM2AggCQCADQcEATw0AIABBCGogA2pBBGpBAEE/IAVrEJ0BGgJAQcAAIAAoAghrQQhPDQAgAiAEEBAgACgCCCIDQcEATw0DIARBACADEJ0BGgsgAEHEAGogBkIDhjcCACACIAQQECAAQQA2AgggASAAKQJMNwAAIAEgAEHUAGopAgA3AAgPCyADQcAAQdydwAAQhAEACyADQcAAQeydwAAQhwEACyADQcAAQfydwAAQhQEAC5ECAQN/IwBBgAFrIgIkACACQRhqIAFB1AAQlwEaAkACQCACKAIYIgNBEE8NACACQRhqQQRyIgQgA2pBECADayIDIAMQnQEaIAJBADYCGCACQSxqIgMgBBANIAJB8ABqQQhqIAJB5ABqKQIANwMAIAIgAkHcAGopAgA3A3AgAyACQfAAahANIAJBCGpBCGoiBCACQTRqKQIANwMAIAIgAikCLDcDCEEQEAkiA0UNASADIAIpAwg3AAAgA0EIaiAEKQMANwAAIAEQDyAAQRA2AgQgACADNgIAIAJBgAFqJAAPC0G6n8AAQRcgAkHwAGpB4JrAAEHwmsAAEH8AC0EQQQFBACgCvKdAIgJBAiACGxEEAAAL/wEBBH8gACAAKQMAIAKtfDcDAAJAAkBBwAAgACgCHCIDayIEIAJLDQAgAEEIaiEFAkAgA0UNACADQcEATw0CIABBIGoiBiADaiABIAQQlwEaIABBADYCHCAFIAZBARAIIAIgBGshAiABIARqIQELIAUgASACQQZ2EAggAEEgaiABIAJBQHFqIAJBP3EiAhCXARogACACNgIcDwsCQAJAIAMgAmoiBCADSQ0AIARBwABLDQEgAEEcaiADakEEaiABIAIQlwEaIAAgACgCHCACajYCHA8LIAMgBEG8ncAAEIgBAAsgBEHAAEG8ncAAEIUBAAsgA0HAAEHMncAAEIQBAAvuAQEFfyMAQcAAayICJAAgAkEANgIQIAJBCGogAkEQakEEciACQSRqEKgBIAIoAhAhAwJAIAIoAgwgAigCCCIEayIFQRAgBUEQSRsiBkUNACAGIQUDQCAEIAEtAAA6AAAgBEEBaiEEIAFBAWohASAFQX9qIgUNAAsgAiADIAZqIgM2AhALAkAgA0EPSw0AIANBEBCJAQALIAJBKGpBCGogAkEQakEIaikDADcDACACQShqQRBqIAJBEGpBEGooAgA2AgAgAiACKQMQNwMoIAAgAikCLDcAACAAQQhqIAJBNGopAgA3AAAgAkHAAGokAAv5AQEDfyMAQRBrIgIkAAJAIAAoAsgBIgNBjwFLDQAgACADakHMAWpBAToAAAJAIANBAWoiBEGQAUYNACAAIARqQcwBakEAQY8BIANrEJ0BGgtBACEDIABBADYCyAEgAEHbAmoiBCAELQAAQYABcjoAAANAIAAgA2oiBCAELQAAIARBzAFqLQAAczoAACADQQFqIgNBkAFHDQALIAAQEyABIAApAAA3AAAgAUEYaiAAQRhqKAAANgAAIAFBEGogAEEQaikAADcAACABQQhqIABBCGopAAA3AAAgAkEQaiQADwtBup/AAEEXIAJBCGpB1J/AAEHkn8AAEH8AC/kBAQN/IwBBEGsiAiQAAkAgACgCyAEiA0GHAUsNACAAIANqQcwBakEBOgAAAkAgA0EBaiIEQYgBRg0AIAAgBGpBzAFqQQBBhwEgA2sQnQEaC0EAIQMgAEEANgLIASAAQdMCaiIEIAQtAABBgAFyOgAAA0AgACADaiIEIAQtAAAgBEHMAWotAABzOgAAIANBAWoiA0GIAUcNAAsgABATIAEgACkAADcAACABQRhqIABBGGopAAA3AAAgAUEQaiAAQRBqKQAANwAAIAFBCGogAEEIaikAADcAACACQRBqJAAPC0G6n8AAQRcgAkEIakHUn8AAQayhwAAQfwAL+QEBA38jAEEQayICJAACQCAAKALIASIDQYcBSw0AIAAgA2pBzAFqQQY6AAACQCADQQFqIgRBiAFGDQAgACAEakHMAWpBAEGHASADaxCdARoLQQAhAyAAQQA2AsgBIABB0wJqIgQgBC0AAEGAAXI6AAADQCAAIANqIgQgBC0AACAEQcwBai0AAHM6AAAgA0EBaiIDQYgBRw0ACyAAEBMgASAAKQAANwAAIAFBGGogAEEYaikAADcAACABQRBqIABBEGopAAA3AAAgAUEIaiAAQQhqKQAANwAAIAJBEGokAA8LQbqfwABBFyACQQhqQdSfwABB7KHAABB/AAv5AQEDfyMAQRBrIgIkAAJAIAAoAsgBIgNBjwFLDQAgACADakHMAWpBBjoAAAJAIANBAWoiBEGQAUYNACAAIARqQcwBakEAQY8BIANrEJ0BGgtBACEDIABBADYCyAEgAEHbAmoiBCAELQAAQYABcjoAAANAIAAgA2oiBCAELQAAIARBzAFqLQAAczoAACADQQFqIgNBkAFHDQALIAAQEyABIAApAAA3AAAgAUEYaiAAQRhqKAAANgAAIAFBEGogAEEQaikAADcAACABQQhqIABBCGopAAA3AAAgAkEQaiQADwtBup/AAEEXIAJBCGpB1J/AAEHcocAAEH8A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IAIgBDcDACACQQhqIANBxAAQlwEaIAJB1ABqIAFB1ABqKQIANwIAIAIgASkCTDcCTCAAQbyTwAA2AgQgACACNgIAIANBkAFqJAALrgECAn8BfiMAQZABayICJAAgASkDACEEIAJByABqQQRyIAFBDGoQTCACIAEoAgg2AkggAiACQcgAakHEABCXASEDAkBB4AAQCSICDQBB4ABBCEEAKAK8p0AiAUECIAEbEQQAAAsgAiAENwMAIAJBCGogA0HEABCXARogAkHUAGogAUHUAGopAgA3AgAgAiABKQJMNwJMIABBhJTAADYCBCAAIAI2AgAgA0GQAWokAAuYAQEBf0EAIQMCQAJAIAFBAEgNAAJAAkACQAJAAkAgAigCACIDRQ0AAkAgAigCBA0AIAENAgwECyADIAEQFSECDAILIAFFDQILIAEQCSECCwJAIAJFDQAgASEDDAILIAAgATYCBEEBIQMMAgtBASECQQAhAwsgACACNgIEQQAhAQwBC0EBIQELIAAgATYCACAAQQhqIAM2AgALmgEBAX8jAEGwA2siAiQAIAJBCGogAUHIARCXARogAkHAAmpBBHIgAUHMAWoQcSACIAEoAsgBNgLAAiACQQhqQcgBaiACQcACakHsABCXARoCQEG4AhAJIgENAEG4AkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpBuAIQlwEhASAAQdSQwAA2AgQgACABNgIAIAJBsANqJAALmgEBAX8jAEHwA2siAiQAIAJBCGogAUHIARCXARogAkHgAmpBBHIgAUHMAWoQbyACIAEoAsgBNgLgAiACQQhqQcgBaiACQeACakGMARCXARoCQEHYAhAJIgENAEHYAkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpB2AIQlwEhASAAQfiQwAA2AgQgACABNgIAIAJB8ANqJAALmgEBAX8jAEHwAmsiAiQAIAJBCGogAUHIARCXARogAkGgAmpBBHIgAUHMAWoQbiACIAEoAsgBNgKgAiACQQhqQcgBaiACQaACakHMABCXARoCQEGYAhAJIgENAEGYAkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpBmAIQlwEhASAAQZyRwAA2AgQgACABNgIAIAJB8AJqJAALmgEBAX8jAEGABGsiAiQAIAJBCGogAUHIARCXARogAkHoAmpBBHIgAUHMAWoQcCACIAEoAsgBNgLoAiACQQhqQcgBaiACQegCakGUARCXARoCQEHgAhAJIgENAEHgAkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpB4AIQlwEhASAAQcCRwAA2AgQgACABNgIAIAJBgARqJAALmgEBAX8jAEGwA2siAiQAIAJBCGogAUHIARCXARogAkHAAmpBBHIgAUHMAWoQcSACIAEoAsgBNgLAAiACQQhqQcgBaiACQcACakHsABCXARoCQEG4AhAJIgENAEG4AkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpBuAIQlwEhASAAQeSRwAA2AgQgACABNgIAIAJBsANqJAALmgEBAX8jAEGABGsiAiQAIAJBCGogAUHIARCXARogAkHoAmpBBHIgAUHMAWoQcCACIAEoAsgBNgLoAiACQQhqQcgBaiACQegCakGUARCXARoCQEHgAhAJIgENAEHgAkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpB4AIQlwEhASAAQYiSwAA2AgQgACABNgIAIAJBgARqJAALmgEBAX8jAEHwA2siAiQAIAJBCGogAUHIARCXARogAkHgAmpBBHIgAUHMAWoQbyACIAEoAsgBNgLgAiACQQhqQcgBaiACQeACakGMARCXARoCQEHYAhAJIgENAEHYAkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpB2AIQlwEhASAAQaySwAA2AgQgACABNgIAIAJB8ANqJAALmgEBAX8jAEHwAmsiAiQAIAJBCGogAUHIARCXARogAkGgAmpBBHIgAUHMAWoQbiACIAEoAsgBNgKgAiACQQhqQcgBaiACQaACakHMABCXARoCQEGYAhAJIgENAEGYAkEIQQAoArynQCICQQIgAhsRBAAACyABIAJBCGpBmAIQlwEhASAAQdCSwAA2AgQgACABNgIAIAJB8AJqJAALfwEBfyMAQcAAayIFJAAgBSABNgIMIAUgADYCCCAFIAM2AhQgBSACNgIQIAVBLGpBAjYCACAFQTxqQQQ2AgAgBUICNwIcIAVB4I/AADYCGCAFQQE2AjQgBSAFQTBqNgIoIAUgBUEQajYCOCAFIAVBCGo2AjAgBUEYaiAEEJsBAAt+AQJ/IwBBMGsiAiQAIAJBFGpBATYCACACQfSLwAA2AhAgAkEBNgIMIAJB7IvAADYCCCABQRxqKAIAIQMgASgCGCEBIAJBLGpBAjYCACACQgI3AhwgAkHgj8AANgIYIAIgAkEIajYCKCABIAMgAkEYahAbIQEgAkEwaiQAIAELfgECfyMAQTBrIgIkACACQRRqQQE2AgAgAkH0i8AANgIQIAJBATYCDCACQeyLwAA2AgggAUEcaigCACEDIAEoAhghASACQSxqQQI2AgAgAkICNwIcIAJB4I/AADYCGCACIAJBCGo2AiggASADIAJBGGoQGyEBIAJBMGokACABC44BACAAQgA3AwggAEIANwMAIABBADYCUCAAQQApA9CcQDcDECAAQRhqQQApA9icQDcDACAAQSBqQQApA+CcQDcDACAAQShqQQApA+icQDcDACAAQTBqQQApA/CcQDcDACAAQThqQQApA/icQDcDACAAQcAAakEAKQOAnUA3AwAgAEHIAGpBACkDiJ1ANwMAC44BACAAQgA3AwggAEIANwMAIABBADYCUCAAQQApA5CcQDcDECAAQRhqQQApA5icQDcDACAAQSBqQQApA6CcQDcDACAAQShqQQApA6icQDcDACAAQTBqQQApA7CcQDcDACAAQThqQQApA7icQDcDACAAQcAAakEAKQPAnEA3AwAgAEHIAGpBACkDyJxANwMAC20BAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakEFNgIAIANCAjcCDCADQYiPwAA2AgggA0EFNgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhCbAQALbQEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQQU2AgAgA0ICNwIMIANBxI7AADYCCCADQQU2AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EIaiACEJsBAAttAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBBTYCACADQgM3AgwgA0H0j8AANgIIIANBBTYCJCADIANBIGo2AhggAyADNgIoIAMgA0EEajYCICADQQhqIAIQmwEAC20BAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakEFNgIAIANCAjcCDCADQaiMwAA2AgggA0EFNgIkIAMgA0EgajYCGCADIAM2AiggAyADQQRqNgIgIANBCGogAhCbAQALbQEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQQU2AgAgA0ICNwIMIANBrI/AADYCCCADQQU2AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EIaiACEJsBAAtwAQF/IwBBMGsiAiQAIAIgATYCBCACIAA2AgAgAkEcakECNgIAIAJBLGpBBTYCACACQgI3AgwgAkGAlsAANgIIIAJBBTYCJCACIAJBIGo2AhggAiACQQRqNgIoIAIgAjYCICACQQhqQZCWwAAQmwEAC2wAIABCADcDACAAIAApA3A3AwggAEEgaiAAQYgBaikDADcDACAAQRhqIABBgAFqKQMANwMAIABBEGogAEH4AGopAwA3AwAgAEEoakEAQcIAEJ0BGgJAIABB8A5qIgAtAABFDQAgAEEAOgAACwt2AQJ/QQEhAEEAQQAoAuijQCIBQQFqNgLoo0ACQAJAQQAoArCnQEEBRw0AQQAoArSnQEEBaiEADAELQQBBATYCsKdAC0EAIAA2ArSnQAJAIAFBAEgNACAAQQJLDQBBACgCuKdAQX9MDQAgAEEBSw0AEMQBAAsAC2MBAX8jAEEgayICJAAgAiAAKAIANgIEIAJBCGpBEGogAUEQaikCADcDACACQQhqQQhqIAFBCGopAgA3AwAgAiABKQIANwMIIAJBBGpBjIfAACACQQhqEBshASACQSBqJAAgAQtlAgF/AX4jAEEQayICJAACQAJAIAFFDQAgASgCAA0BIAFBfzYCACACQQhqIAEoAgQgAUEIaigCACgCEBEEACACKQMIIQMgAUEANgIAIAAgAzcDACACQRBqJAAPCxCxAQALELIBAAtRAQJ/AkAgACgCACIDQQRqKAIAIANBCGoiBCgCACIAayACTw0AIAMgACACEGwgBCgCACEACyADKAIAIABqIAEgAhCXARogBCAAIAJqNgIAQQALSgEDf0EAIQMCQCACRQ0AAkADQCAALQAAIgQgAS0AACIFRw0BIABBAWohACABQQFqIQEgAkF/aiICRQ0CDAALCyAEIAVrIQMLIAMLUQECfwJAAkAgAEUNACAAKAIADQEgAEEANgIAIAAoAgQhASAAKAIIIQIgABAPIAEgAigCABEBAAJAIAIoAgRFDQAgARAPCw8LELEBAAsQsgEAC04AAkACQCAARQ0AIAAoAgANASAAQX82AgAgACgCBCABIAIgAEEIaigCACgCDBEGAAJAIAJFDQAgARAPCyAAQQA2AgAPCxCxAQALELIBAAtUAQF/AkACQAJAIAFBgIDEAEYNAEEBIQQgACgCGCABIABBHGooAgAoAhARBQANAQsgAg0BQQAhBAsgBA8LIAAoAhggAiADIABBHGooAgAoAgwRBwALWAAgAEIANwMAIABBADYCMCAAQQApA5CbQDcDCCAAQRBqQQApA5ibQDcDACAAQRhqQQApA6CbQDcDACAAQSBqQQApA6ibQDcDACAAQShqQQApA7CbQDcDAAtIAQF/IwBBIGsiAyQAIANBFGpBADYCACADQZyiwAA2AhAgA0IBNwIEIAMgATYCHCADIAA2AhggAyADQRhqNgIAIAMgAhCbAQALTAAgAEEANgIIIABCADcDACAAQQApA/CbQDcCTCAAQdQAakEAKQP4m0A3AgAgAEHcAGpBACkDgJxANwIAIABB5ABqQQApA4icQDcCAAtMACAAQQA2AgggAEIANwMAIABBACkCzJtANwJMIABB1ABqQQApAtSbQDcCACAAQdwAakEAKQLcm0A3AgAgAEHkAGpBACkC5JtANwIACzYBAX8CQCACRQ0AIAAhAwNAIAMgAS0AADoAACABQQFqIQEgA0EBaiEDIAJBf2oiAg0ACwsgAAs5AQN/IwBBEGsiASQAIAAoAgwhAiAAKAIIEKUBIQMgASACNgIIIAEgADYCBCABIAM2AgAgARCcAQALOgAgAEEANgIcIABCADcDACAAQRhqQQAoAsibQDYCACAAQRBqQQApA8CbQDcDACAAQQApA7ibQDcDCAs6ACAAQgA3AwAgAEEANgIcIABBACkDuJtANwMIIABBEGpBACkDwJtANwMAIABBGGpBACgCyJtANgIACzUBAX8jAEEQayICJAAgAiABNgIMIAIgADYCCCACQbiMwAA2AgQgAkGcosAANgIAIAIQmAEACy0BAX8jAEEQayIBJAAgAUEIaiAAQQhqKAIANgIAIAEgACkCADcDACABEKABAAssAQF/AkAgAkUNACAAIQMDQCADIAE6AAAgA0EBaiEDIAJBf2oiAg0ACwsgAAsjAAJAIABBfEsNAAJAIAANAEEEDwsgABAJIgBFDQAgAA8LAAssACAAQQA2AgggAEIANwMAIABB1ABqQQApAoibQDcCACAAQQApAoCbQDcCTAshACAAKAIAIgBBFGooAgAaAkAgACgCBA4CAAAACxCLAQALHAACQAJAIAFBfEsNACAAIAIQFSIBDQELAAsgAQsaAAJAIABB8A5qIgAtAABFDQAgAEEAOgAACwscACABKAIYQZ6MwABBCCABQRxqKAIAKAIMEQcACxwAIAEoAhhBzJDAAEEFIAFBHGooAgAoAgwRBwALGwACQCAADQBBnKLAAEErQciiwAAQlAEACyAACxQAIAAoAgAgASAAKAIEKAIMEQUACxAAIAEgACgCACAAKAIEEBQLEAAgACACNgIEIAAgATYCAAsOAAJAIAFFDQAgABAPCwsSAEHMhsAAQRFB4IbAABCUAQALDQAgACgCABoDfwwACwsNACAAQQBBzAEQnQEaCw0AIABBAEHMARCdARoLDQAgAEEAQcwBEJ0BGgsNACAAQQBBzAEQnQEaCwsAIAAjAGokACMACw0AQfyiwABBGxC0AQALDgBBl6PAAEHPABC0AQALCwAgADUCACABEEcLCQAgACABEAEACwcAIAAQAgALDABCk72/j/7t1N8DCwQAQSALBABBHAsEAEEwCwUAQcAACwQAQSALBABBHAsEAEEQCwQAQSALBABBFAsEAEEoCwQAQRALBABBMAsFAEHAAAsDAAALAgALAgALC/CjgIAAAQBBgIDAAAvmI21kMgAGAAAAVAAAAAQAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAABtZDQABgAAAGAAAAAIAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAbWQ1AAYAAABgAAAACAAAABMAAAAUAAAAFQAAABAAAAARAAAAFgAAAHJpcGVtZDE2MAAAAAYAAABgAAAACAAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAHJpcGVtZDMyMAAAAAYAAAB4AAAACAAAAB0AAAAeAAAAHwAAACAAAAAhAAAAIgAAAAYAAABgAAAACAAAACMAAAAkAAAAJQAAACYAAAAbAAAAJwAAAHNoYTIyNAAABgAAAHAAAAAIAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAAc2hhMjU2AAAGAAAAcAAAAAgAAAAoAAAALgAAAC8AAAAwAAAAMQAAADIAAABzaGEzODQAAAYAAADYAAAACAAAADMAAAA0AAAANQAAADYAAAA3AAAAOAAAAHNoYTUxMgAABgAAANgAAAAIAAAAMwAAADkAAAA6AAAAOwAAADwAAAA9AAAABgAAAGABAAAIAAAAPgAAAD8AAABAAAAAQQAAAEIAAABDAAAABgAAAFgBAAAIAAAARAAAAEUAAABGAAAARwAAAEgAAABJAAAABgAAADgBAAAIAAAASgAAAEsAAABMAAAATQAAAE4AAABPAAAABgAAABgBAAAIAAAAUAAAAFEAAABSAAAAUwAAAFQAAABVAAAAa2VjY2FrMjI0AAAABgAAAGABAAAIAAAAPgAAAFYAAABXAAAAQQAAAEIAAABYAAAAa2VjY2FrMjU2AAAABgAAAFgBAAAIAAAARAAAAFkAAABaAAAARwAAAEgAAABbAAAAa2VjY2FrMzg0AAAABgAAADgBAAAIAAAASgAAAFwAAABdAAAATQAAAE4AAABeAAAAa2VjY2FrNTEyAAAABgAAABgBAAAIAAAAUAAAAF8AAABgAAAAUwAAAFQAAABhAAAAYmxha2UzAABiAAAAeAcAAAgAAABjAAAAZAAAAGUAAABmAAAAZwAAAGgAAAB1bnN1cHBvcnRlZCBoYXNoIGFsZ29yaXRobTogKAMQABwAAABjYXBhY2l0eSBvdmVyZmxvdwAAAHADEAAcAAAAMAIAAAUAAABsaWJyYXJ5L2FsbG9jL3NyYy9yYXdfdmVjLnJzBgAAAAQAAAAEAAAAaQAAAGoAAABrAAAAYSBmb3JtYXR0aW5nIHRyYWl0IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yAAYAAAAAAAAAAQAAAGwAAAD4AxAAGAAAAEcCAAAcAAAAbGlicmFyeS9hbGxvYy9zcmMvZm10LnJzIAQQAEkAAABlAQAACQAAAH4vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvYmxha2UzLTAuMy44L3NyYy9saWIucnMAAAAgBBAASQAAAAsCAAAKAAAAIAQQAEkAAAA5AgAACQAAACAEEABJAAAArgIAABkAAAAgBBAASQAAALACAAAJAAAAIAQQAEkAAACwAgAAOAAAAGFzc2VydGlvbiBmYWlsZWQ6IG1pZCA8PSBzZWxmLmxlbigpABwPEABNAAAA4wUAAAkAAAAgBBAASQAAAIMCAAAJAAAAIAQQAEkAAACKAgAACgAAACAEEABJAAAAmgMAADIAAAAgBBAASQAAAFUEAAAWAAAAIAQQAEkAAABnBAAAFgAAACAEEABJAAAAmAQAABIAAAAgBBAASQAAAKIEAAASAAAABgAAAAQAAAAEAAAAbQAAAIAFEABLAAAAzQAAACAAAAB+Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2FycmF5dmVjLTAuNS4yL3NyYy9saWIucnMABgAAACAAAAABAAAAbgAAAAYAAAAEAAAABAAAAG0AAAARBhAADQAAAPwFEAAVAAAAaW5zdWZmaWNpZW50IGNhcGFjaXR5Q2FwYWNpdHlFcnJvclBhZEVycm9yAABIBhAAIAAAAGgGEAASAAAABgAAAAAAAAABAAAAbwAAAGluZGV4IG91dCBvZiBib3VuZHM6IHRoZSBsZW4gaXMgIGJ1dCB0aGUgaW5kZXggaXMgMDAwMTAyMDMwNDA1MDYwNzA4MDkxMDExMTIxMzE0MTUxNjE3MTgxOTIwMjEyMjIzMjQyNTI2MjcyODI5MzAzMTMyMzMzNDM1MzYzNzM4Mzk0MDQxNDI0MzQ0NDU0NjQ3NDg0OTUwNTE1MjUzNTQ1NTU2NTc1ODU5NjA2MTYyNjM2NDY1NjY2NzY4Njk3MDcxNzI3Mzc0NzU3Njc3Nzg3OTgwODE4MjgzODQ4NTg2ODc4ODg5OTA5MTkyOTM5NDk1OTY5Nzk4OTkAAFQHEAAQAAAAZAcQACIAAAByYW5nZSBlbmQgaW5kZXggIG91dCBvZiByYW5nZSBmb3Igc2xpY2Ugb2YgbGVuZ3RoIAAAmAcQABIAAABkBxAAIgAAAHJhbmdlIHN0YXJ0IGluZGV4IAAAvAcQABYAAADSBxAADQAAAHNsaWNlIGluZGV4IHN0YXJ0cyBhdCAgYnV0IGVuZHMgYXQgABwREAAAAAAA8AcQAAIAAAA6ICkADAgQABUAAAAhCBAAKwAAAPIHEAABAAAAc291cmNlIHNsaWNlIGxlbmd0aCAoKSBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBzbGljZSBsZW5ndGggKEVycm9yAAAABgAAADgBAAAIAAAASgAAAEsAAABMAAAATQAAAE4AAABPAAAABgAAAFgBAAAIAAAARAAAAFkAAABaAAAARwAAAEgAAABbAAAABgAAABgBAAAIAAAAUAAAAFEAAABSAAAAUwAAAFQAAABVAAAABgAAAGABAAAIAAAAPgAAAD8AAABAAAAAQQAAAEIAAABDAAAABgAAADgBAAAIAAAASgAAAFwAAABdAAAATQAAAE4AAABeAAAABgAAAGABAAAIAAAAPgAAAFYAAABXAAAAQQAAAEIAAABYAAAABgAAAFgBAAAIAAAARAAAAEUAAABGAAAARwAAAEgAAABJAAAABgAAABgBAAAIAAAAUAAAAF8AAABgAAAAUwAAAFQAAABhAAAABgAAAHAAAAAIAAAAKAAAAC4AAAAvAAAAMAAAADEAAAAyAAAABgAAAHAAAAAIAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAABgAAAGAAAAAIAAAAEwAAABQAAAAVAAAAEAAAABEAAAAWAAAAYgAAAHgHAAAIAAAAYwAAAGQAAABlAAAAZgAAAGcAAABoAAAABgAAAGAAAAAIAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAABgAAAGAAAAAIAAAAIwAAACQAAAAlAAAAJgAAABsAAAAnAAAABgAAAGAAAAAIAAAAFwAAABgAAAAZAAAAGgAAABsAAAAcAAAABgAAAHgAAAAIAAAAHQAAAB4AAAAfAAAAIAAAACEAAAAiAAAABgAAAFQAAAAEAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAABgAAANgAAAAIAAAAMwAAADkAAAA6AAAAOwAAADwAAAA9AAAABgAAANgAAAAIAAAAMwAAADQAAAA1AAAANgAAADcAAAA4AAAAIAsQACEAAABBCxAAFwAAAGkPEABRAAAAZwEAAAUAAABHZW5lcmljQXJyYXk6OmZyb21faXRlciByZWNlaXZlZCAgZWxlbWVudHMgYnV0IGV4cGVjdGVkIAEAAAAAAAAAgoAAAAAAAACKgAAAAAAAgACAAIAAAACAi4AAAAAAAAABAACAAAAAAIGAAIAAAACACYAAAAAAAICKAAAAAAAAAIgAAAAAAAAACYAAgAAAAAAKAACAAAAAAIuAAIAAAAAAiwAAAAAAAICJgAAAAAAAgAOAAAAAAACAAoAAAAAAAICAAAAAAAAAgAqAAAAAAAAACgAAgAAAAICBgACAAAAAgICAAAAAAACAAQAAgAAAAAAIgACAAAAAgCkuQ8mi2HwBPTZUoezwBhNipwXzwMdzjJiTK9m8TILKHptXPP3U4BZnQm8YihflEr5OxNbant5JoPv1jrsv7nqpaHmRFbIHP5TCEIkLIl8hgH9dmlqQMic1Psznv/eXA/8ZMLNIpbXR116SKqxWqsZPuDjSlqR9tnb8a+KcdATxRZ1wWWRxhyCGW89l5i2oAhtgJa2usLn2HEZhaTRAfg9VR6Mj3VGvOsNc+c66xeomLFMNboUohAnT3830QYFNUmrcN8hswav6JOF7CAy9sUp4iJWL42PobenL1f47AB058u+3DmZY0OSmd3L463VLCjFEULSP7R8a25mNM58RgxR+Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL21kMi0wLjkuMC9zcmMvbGliLnJzAAAGAAAAAAAAAAEAAABwAAAAGA0QAEYAAABvAAAADgAAAAEjRWeJq83v/ty6mHZUMhABI0VniavN7/7cuph2VDIQ8OHSwxAyVHaYutz+782riWdFIwEPHi08ASNFZ4mrze/+3LqYdlQyEPDh0sPYngXBB9V8NhfdcDA5WQ73MQvA/xEVWGinj/lkpE/6vgAAAABn5glqha5nu3Lzbjw69U+lf1IOUYxoBZur2YMfGc3gW9ieBcFdnbvLB9V8NiopmmIX3XAwWgFZkTlZDvfY7C8VMQvA/2cmM2cRFVhoh0q0jqeP+WQNLgzbpE/6vh1ItUcIybzzZ+YJajunyoSFrme7K/iU/nLzbjzxNh1fOvVPpdGC5q1/Ug5RH2w+K4xoBZtrvUH7q9mDH3khfhMZzeBbY2FsbGVkIGBSZXN1bHQ6OnVud3JhcCgpYCBvbiBhbiBgRXJyYCB2YWx1ZQBcEBAATwAAADoAAAANAAAAXBAQAE8AAABBAAAADQAAAFwQEABPAAAAhwAAABcAAABcEBAATwAAAIQAAAAJAAAAXBAQAE8AAACLAAAAGwAAABwPEABNAAAA8gsAAA0AAAAvcnVzdGMvYTE3OGQwMzIyY2UyMGUzM2VhYzEyNDc1OGU4MzdjYmQ4MGE2ZjYzMy9saWJyYXJ5L2NvcmUvc3JjL3NsaWNlL21vZC5yc34vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvZ2VuZXJpYy1hcnJheS0wLjE0LjQvc3JjL2xpYi5yc3dlIG5ldmVyIHVzZSBpbnB1dF9sYXp5AAAABgAAAAAAAAABAAAAcAAAAPQPEABHAAAAQQAAAAEAAAB+Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL3NoYTMtMC45LjEvc3JjL2xpYi5ycwBcEBAATwAAABsAAAANAAAAXBAQAE8AAAAiAAAADQAAAH4vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvYmxvY2stYnVmZmVyLTAuOS4wL3NyYy9saWIucnMA9A8QAEcAAABIAAAAAQAAAPQPEABHAAAATwAAAAEAAAD0DxAARwAAAFYAAAABAAAA9A8QAEcAAABmAAAAAQAAAPQPEABHAAAAbQAAAAEAAAD0DxAARwAAAHQAAAABAAAA9A8QAEcAAAB7AAAAAQAAAGNhbGxlZCBgT3B0aW9uOjp1bndyYXAoKWAgb24gYSBgTm9uZWAgdmFsdWUAWBEQABwAAAACAgAAHgAAAGxpYnJhcnkvc3RkL3NyYy9wYW5pY2tpbmcucnMEAAAAAAAAAG51bGwgcG9pbnRlciBwYXNzZWQgdG8gcnVzdHJlY3Vyc2l2ZSB1c2Ugb2YgYW4gb2JqZWN0IGRldGVjdGVkIHdoaWNoIHdvdWxkIGxlYWQgdG8gdW5zYWZlIGFsaWFzaW5nIGluIHJ1c3QAp+WAgAAEbmFtZQGc5YCAAMcBADZ3YXNtX2JpbmRnZW46Ol9fd2JpbmRnZW5fc3RyaW5nX25ldzo6aDk1MTJkZTNiOWQ2NWIxNTgBMXdhc21fYmluZGdlbjo6X193YmluZGdlbl90aHJvdzo6aDFhNWVkZDZmZGYyMDYzNTkCM3dhc21fYmluZGdlbjo6X193YmluZGdlbl9yZXRocm93OjpoNTlmYWI0ZjY4MTEwNzZjMAMvc2hhMjo6c2hhNTEyOjpzb2Z0Ojpjb21wcmVzczo6aDUzOWRiOTRlNDcyMjc2NWMEL3NoYTI6OnNoYTI1Njo6c29mdDo6Y29tcHJlc3M6OmgwNWRhNDk4NTljYjY4Mzk4BTZyaXBlbWQzMjA6OmJsb2NrOjpwcm9jZXNzX21zZ19ibG9jazo6aGZmOWRjNjlmZmVmNzc0OGYGNnJpcGVtZDE2MDo6YmxvY2s6OnByb2Nlc3NfbXNnX2Jsb2NrOjpoZTc3ZDhjNTkzYWQ2YzBhNQcLY3JlYXRlX2hhc2gIK3NoYTE6OmNvbXByZXNzOjpjb21wcmVzczo6aGRhOWE5ZTQ5MzA4YzVhYzMJOmRsbWFsbG9jOjpkbG1hbGxvYzo6RGxtYWxsb2M8QT46Om1hbGxvYzo6aDQ3Nzk3YTUxNjJmOWYwNjcKNmJsYWtlMzo6cG9ydGFibGU6OmNvbXByZXNzX2luX3BsYWNlOjpoNjM1OTAzMGE5YjcxZGU0Ngs/PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojp1cGRhdGU6OmgyMGQ2ZGRkNjI1ZTU1OGM4DCdtZDU6OnV0aWxzOjpjb21wcmVzczo6aDhkMTI1ZDk1OWI3MTU5OTkNL21kMjo6TWQyU3RhdGU6OnByb2Nlc3NfYmxvY2s6OmhkODQxNTk3NWZjODg2MzNlDjBibGFrZTM6OmNvbXByZXNzX3N1YnRyZWVfd2lkZTo6aGJlMmRlNjg2ZmFhNWI2MDcPOGRsbWFsbG9jOjpkbG1hbGxvYzo6RGxtYWxsb2M8QT46OmZyZWU6OmhlMWIwZmJjYTNmZmQ0YjExEC9tZDQ6Ok1kNFN0YXRlOjpwcm9jZXNzX2Jsb2NrOjpoY2ViZGM4YjA0ODA0OGI3YhFBZGxtYWxsb2M6OmRsbWFsbG9jOjpEbG1hbGxvYzxBPjo6ZGlzcG9zZV9jaHVuazo6aGI0ODhiZGM5ZTE0MDNiNWQSK2JsYWtlMzo6SGFzaGVyOjpmaW5hbGl6ZTo6aDU2NGRjYTRkYmIzODkzNTETIGtlY2Nhazo6ZjE2MDA6Omg0NzcxYjVhZGMxODA0YmFkFCxjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6cGFkOjpoOTdkZjJiY2Y2YzIzNDBiMBUOX19ydXN0X3JlYWxsb2MWYTxzaGEyOjpzaGE1MTI6OlNoYTUxMiBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aGYwOTMwYzY2MDQ0NjFlZGMXMWJsYWtlMzo6SGFzaGVyOjptZXJnZV9jdl9zdGFjazo6aDU0YjNmZDJjNTcyZTdmN2MYRzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemVfcmVzZXQ6OmgwMTA1YzMyNjNkMDkyYWY3GUc8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplX3Jlc2V0OjpoZWUxMDdiMDYwZmVmZGE3MhpHPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZV9yZXNldDo6aDdhNTBiZDZhMzEzZWJmNDkbI2NvcmU6OmZtdDo6d3JpdGU6OmhlNGIyY2QxOWQxMjFhMzk5HDVjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6cGFkX2ludGVncmFsOjpoOTNkNDQxMTdlMGQwMzU3Mh1hPHNoYTI6OnNoYTUxMjo6U2hhMzg0IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoMTU0MjlmNDMwYzYwMmZlNx5CPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6OmhhZjU4YTZlZDY5ZjA5MmUwH0c8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplX3Jlc2V0OjpoY2VjYjI0YWIzMjUwYzU5MCBXPHNoYTE6OlNoYTEgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6OmhiOGU4NzczNjA0NjljMDQ3ITRibGFrZTM6OmNvbXByZXNzX3BhcmVudHNfcGFyYWxsZWw6Omg4NDQ3MzE4NWFkN2M4Zjk2Ikc8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplX3Jlc2V0OjpoYzhiNjVhZmRjOTE3ZWE2MCNBPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZTo6aGFmZWZiYTJmMjQzOWY5YjQkQTxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemU6OmhiOGI4ZDAwMjRiYzk1NzFmJUE8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplOjpoMWU4YzgwNTI5ZmQ3YzM1MiZHPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZV9yZXNldDo6aDU3MzYyZWEwODNkYTlkNjInRzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemVfcmVzZXQ6OmhmY2FlMzNmNWU3MWJhNGI2KEE8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplOjpoNjk0MDY5N2ViMWU4NWM0NSlBPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZTo6aGZiMWY1ZjIwMGE3YmEwOGUqQTxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemU6OmgyN2NhYWI3NGE2NzZlNzUzK0c8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplX3Jlc2V0OjpoMjc3ZWVlYmQ3OWQwMjkzZSxHPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZV9yZXNldDo6aGEwZmMwMWQ5Zjc0OTNkYjEtRzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemVfcmVzZXQ6OmgzM2Y3ODMxYjgzOTc4MTdkLmE8c2hhMjo6c2hhMjU2OjpTaGEyNTYgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6OmhkZDIxZjc3MjM0ODk1NmI4L0c8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplX3Jlc2V0OjpoMzhlM2Y5NzU3N2Q3NTQzZjBBPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZTo6aDc3MTE3ODRjNjNmODhlODUxMnNoYTI6OnNoYTUxMjo6RW5naW5lNTEyOjpmaW5pc2g6Omg3MWIwMTI3Y2NmYmJkMDY0MkE8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplOjpoYjkwZDlmYTgwZjBmMTkxMzNBPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZTo6aGI0N2FjMDIyNjRjNGU5MTQ0QTxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemU6OmhmZDZiNDRhZGRiN2VmMGE1NUE8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplOjpoNWFkOTUzYTFmOGFlMGNmNjZHPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZV9yZXNldDo6aGI0MTg5NmY5NzA5YTVmNGY3RzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemVfcmVzZXQ6OmhiNzgxOGI0NDM0OWJkNzRkOEI8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmJveF9jbG9uZTo6aGU4OGZiY2Q3MmU2YjZiY2Q5LWJsYWtlMzo6Q2h1bmtTdGF0ZTo6dXBkYXRlOjpoZmE4NjhkYjJhNzg0YmE1ZDo7PCZtdXQgVyBhcyBjb3JlOjpmbXQ6OldyaXRlPjo6d3JpdGVfY2hhcjo6aDE2NjQzMWY5ZGM3OTAzNDY7RzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemVfcmVzZXQ6OmhhM2M4MmVmMWRlNzlkOTIzPEc8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplX3Jlc2V0OjpoZGRjNjI1NzI2YzY0Nzg2OT1hPHNoYTI6OnNoYTI1Njo6U2hhMjI0IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoNDljYmQ1ODA2NDhjMGRiMT4/PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojp1cGRhdGU6OmgwMDMxNWM4OTE4OThmZTRlPz88RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnVwZGF0ZTo6aDA1ZmJkMzM0YTJlNzhmZTlAPzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6dXBkYXRlOjpoNTg0NDRkN2I5YzMzYjIzYkE/PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojp1cGRhdGU6Omg3Yzg4MmU2MzM2ZDc2OWUyQkE8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplOjpoYjVlN2MxODVhZTQ4NmM5MENBPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZTo6aGY2MTlhNzljODJkODAyMDREQTxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemU6Omg0OGRhMzkwMjY5ZWRmYWU4RUc8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplX3Jlc2V0OjpoNWFmZjIyMTc4MmU1NTY1NUZHPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZV9yZXNldDo6aGM5ZDhkZTc1MjVmODMyYmVHL2NvcmU6OmZtdDo6bnVtOjppbXA6OmZtdF91NjQ6Omg3MWU2MjRjMmQzOWI3NzFlSDJzaGEyOjpzaGEyNTY6OkVuZ2luZTI1Njo6ZmluaXNoOjpoZGI4ZGU2N2Q2MmExZmQzN0lhPHJpcGVtZDMyMDo6UmlwZW1kMzIwIGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoYWEzM2ZiNTE5NGIwNmJkNUpbPHNoYTM6OlNoYTNfNTEyIGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoMjEzODY2NmM4Y2UzZDIyZktcPHNoYTM6OktlY2NhazUxMiBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aGZmNDc3MWJhY2I4ZWRhNTJMbmdlbmVyaWNfYXJyYXk6OmltcGxzOjo8aW1wbCBjb3JlOjpjbG9uZTo6Q2xvbmUgZm9yIGdlbmVyaWNfYXJyYXk6OkdlbmVyaWNBcnJheTxULE4+Pjo6Y2xvbmU6OmhiY2MzNzAzOGUyMDU0ZTZjTT48RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnJlc2V0OjpoZjlmNWVkZGIyOTQzOGRiOU5CPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6Omg5ZDY5YzBkMTZhZjE2ODk0Tz88RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnVwZGF0ZTo6aDZjNzQ3MDQ3ZTBiOTlhZTRQPzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6dXBkYXRlOjpoYzc0NWM2OGZiMjUzZmM3NVE/PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojp1cGRhdGU6OmgwYWVmYjE2NGE0OGFhYjkzUj88RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnVwZGF0ZTo6aDhhNzU4MTA3YTE1YTY5ODhTPzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6dXBkYXRlOjpoZTZjYTA1YjBlMDIzMmFmMVRHPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZV9yZXNldDo6aGU0NDA4NTFjOThmY2M1MGVVRzxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemVfcmVzZXQ6Omg0YzM2MDA0ZmI2NmU0MDhiVkE8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplOjpoNDdiYzc5NzYwZDQxYTlhN1dBPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpmaW5hbGl6ZTo6aDRhOTAzNjYwYTliYWFjMzJYYTxyaXBlbWQxNjA6OlJpcGVtZDE2MCBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aDVjYzU1ZjUzZDJiMjEzZThZXDxzaGEzOjpLZWNjYWszODQgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6Omg4N2JkZWM5MTM2MmJhY2QxWls8c2hhMzo6U2hhM18zODQgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6Omg3ZDIxZjkwMzRlZmI5OGUwWz88RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnVwZGF0ZTo6aDhiM2RkYjAyYTI2ZjU0OTZcQjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6Ym94X2Nsb25lOjpoM2Q4Zjk4NjQ5MWE5MjM3Zl1CPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6OmhkZmQ4MDFlYTc1NzU5M2VlXj88RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnVwZGF0ZTo6aDE0YWFiMjYyYmU3NGM3ZTFfVTxtZDU6Ok1kNSBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aGY5MTE3ZDBmZDdmYTU4MGRgVTxtZDQ6Ok1kNCBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aGQ0YmE5ZDg3ZTU0NGIxZjFhQTxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemU6OmgzNGFiMTMzODRjNzExOTg1Yj88RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnVwZGF0ZTo6aDY0YTk2NWM0ODQ5NzJmODdjbmdlbmVyaWNfYXJyYXk6OmltcGxzOjo8aW1wbCBjb3JlOjpjbG9uZTo6Q2xvbmUgZm9yIGdlbmVyaWNfYXJyYXk6OkdlbmVyaWNBcnJheTxULE4+Pjo6Y2xvbmU6OmhlZDc4NGMxZGEyZDI3MmRkZFw8c2hhMzo6S2VjY2FrMjI0IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoZGVhNjQ2N2NhY2FlYTRhOGVcPHNoYTM6OktlY2NhazI1NiBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aDg0OGMwM2QxMTMwMzk5YTFmWzxzaGEzOjpTaGEzXzI1NiBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aGNjYTRlZWM0Y2ZhZjJjYzlnWzxzaGEzOjpTaGEzXzIyNCBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aDNmM2FkZGY5YWMzYjU5ZTVoQTxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6ZmluYWxpemU6OmhmZjE0ZDM4OThhYjY3NWUwaUE8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmZpbmFsaXplOjpoODM5YWQzNDA5YzMxNTM3N2pCPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6Omg2MjMyOTlhNjZmZDk5N2Ywa0I8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmJveF9jbG9uZTo6aDQ4ZDg3NWU4NTc4MTkzMmFsTmFsbG9jOjpyYXdfdmVjOjpSYXdWZWM8VCxBPjo6cmVzZXJ2ZTo6ZG9fcmVzZXJ2ZV9hbmRfaGFuZGxlOjpoOGUwMzQxOTEzOWYxOWFlY21uZ2VuZXJpY19hcnJheTo6aW1wbHM6OjxpbXBsIGNvcmU6OmNsb25lOjpDbG9uZSBmb3IgZ2VuZXJpY19hcnJheTo6R2VuZXJpY0FycmF5PFQsTj4+OjpjbG9uZTo6aDE2OGZhMDUxYWU1NzgyMWVubmdlbmVyaWNfYXJyYXk6OmltcGxzOjo8aW1wbCBjb3JlOjpjbG9uZTo6Q2xvbmUgZm9yIGdlbmVyaWNfYXJyYXk6OkdlbmVyaWNBcnJheTxULE4+Pjo6Y2xvbmU6Omg2MjUyYWFkYTRjZmZhNzRkb25nZW5lcmljX2FycmF5OjppbXBsczo6PGltcGwgY29yZTo6Y2xvbmU6OkNsb25lIGZvciBnZW5lcmljX2FycmF5OjpHZW5lcmljQXJyYXk8VCxOPj46OmNsb25lOjpoN2U1NDJiNDc1YWYwMTQxNXBuZ2VuZXJpY19hcnJheTo6aW1wbHM6OjxpbXBsIGNvcmU6OmNsb25lOjpDbG9uZSBmb3IgZ2VuZXJpY19hcnJheTo6R2VuZXJpY0FycmF5PFQsTj4+OjpjbG9uZTo6aGFhNDRjZDZiYTc1MmMyZmFxbmdlbmVyaWNfYXJyYXk6OmltcGxzOjo8aW1wbCBjb3JlOjpjbG9uZTo6Q2xvbmUgZm9yIGdlbmVyaWNfYXJyYXk6OkdlbmVyaWNBcnJheTxULE4+Pjo6Y2xvbmU6OmhkYzYzOGNkNDllYjFjNjQ5ckI8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmJveF9jbG9uZTo6aDRhMjcwZTFlODQxOTdiMjJzQjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6Ym94X2Nsb25lOjpoYjZjNjY3ZjVkZTc0YjllN3RCPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6OmhhMWFmYjAzNmMxOTllYTc1dUI8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmJveF9jbG9uZTo6aDRmZDk3ODU5MGViZmM1NjV2LmFsbG9jOjpyYXdfdmVjOjpmaW5pc2hfZ3Jvdzo6aDEzMTVlODYxMzZkOTc3Yjh3QjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6Ym94X2Nsb25lOjpoMWE3MTExMzkwMDg2OGNkMXhCPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6OmgyMTczMzdhYWE0MmFjZTk3eUI8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmJveF9jbG9uZTo6aDI3M2RjYWUwMjJhYzZhMTl6QjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6Ym94X2Nsb25lOjpoOWQ4OGQyODQyNWQyMWFiZXtCPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6OmhiZjc1ZTczNDUwZmNmMDNmfEI8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OmJveF9jbG9uZTo6aGMyY2NlMTRiODQ2MTRiYzh9QjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6Ym94X2Nsb25lOjpoYzU2Yjg3MWU5NzFiYmFkMH5CPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+Ojpib3hfY2xvbmU6OmhjNzRjMmFjNDhlMWE1OWFify5jb3JlOjpyZXN1bHQ6OnVud3JhcF9mYWlsZWQ6OmhlODdjNGRhNDg3NDZlODk2gAFQPGFycmF5dmVjOjplcnJvcnM6OkNhcGFjaXR5RXJyb3I8VD4gYXMgY29yZTo6Zm10OjpEZWJ1Zz46OmZtdDo6aDg2N2MxM2QzM2EzYzg5ZDOBAVA8YXJyYXl2ZWM6OmVycm9yczo6Q2FwYWNpdHlFcnJvcjxUPiBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoZmFkZjA2MzY2NDc1Y2Q3M4IBPjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6cmVzZXQ6OmgxYjdkMjMxNzFlYWM2YjE3gwE+PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpyZXNldDo6aDUzZGFjNDVkNTRlMWZhMGGEAUFjb3JlOjpzbGljZTo6aW5kZXg6OnNsaWNlX3N0YXJ0X2luZGV4X2xlbl9mYWlsOjpoNzA4NjA1YmI4ZmViZDJmNIUBP2NvcmU6OnNsaWNlOjppbmRleDo6c2xpY2VfZW5kX2luZGV4X2xlbl9mYWlsOjpoN2VmYjBmMDBmYmNjOTI4YoYBTmNvcmU6OnNsaWNlOjo8aW1wbCBbVF0+Ojpjb3B5X2Zyb21fc2xpY2U6Omxlbl9taXNtYXRjaF9mYWlsOjpoYzFkMThmZTFkNTg1YzNlMYcBNmNvcmU6OnBhbmlja2luZzo6cGFuaWNfYm91bmRzX2NoZWNrOjpoYWFlYzg4OWJhMThkZDY4NYgBPWNvcmU6OnNsaWNlOjppbmRleDo6c2xpY2VfaW5kZXhfb3JkZXJfZmFpbDo6aDk5OGU2MDViNGFmOTRiN2KJATdnZW5lcmljX2FycmF5Ojpmcm9tX2l0ZXJfbGVuZ3RoX2ZhaWw6Omg0MjliY2M1ZDVkZmFjNDhhigE+PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpyZXNldDo6aGJkZmZjNjJjMjcwNjhiZjWLATdzdGQ6OnBhbmlja2luZzo6cnVzdF9wYW5pY193aXRoX2hvb2s6OmgyZDkwNzk0MjdhMmQ5OTZhjAE6PCZtdXQgVyBhcyBjb3JlOjpmbXQ6OldyaXRlPjo6d3JpdGVfZm10OjpoMWE2YjAxMTg4NzJlMGRiYo0BC2RpZ2VzdF9oYXNojgE6PCZtdXQgVyBhcyBjb3JlOjpmbXQ6OldyaXRlPjo6d3JpdGVfc3RyOjpoZWEyOGQzYjg3Njk1ZDMwZo8BBm1lbWNtcJABE19fd2JnX2Rlbm9oYXNoX2ZyZWWRAQt1cGRhdGVfaGFzaJIBQ2NvcmU6OmZtdDo6Rm9ybWF0dGVyOjpwYWRfaW50ZWdyYWw6OndyaXRlX3ByZWZpeDo6aDQ3ZmE5MWE3YWZmOTRmNWKTAT48RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnJlc2V0OjpoMGFkOGM4NDA2Mzk4OGJiOZQBKWNvcmU6OnBhbmlja2luZzo6cGFuaWM6OmgzOGNhYzcxMGI1MDQ4Y2EwlQE+PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpyZXNldDo6aDNlMWUwYzRmNjQwNDc1OTGWAT48RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnJlc2V0OjpoYzMyYzYwNzZkOGZkMGQ2OZcBBm1lbWNweZgBEXJ1c3RfYmVnaW5fdW53aW5kmQE+PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpyZXNldDo6aDU3YWUyNmIwMzcxNzg1YzeaAT48RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnJlc2V0OjpoYjgxZmYyMzJhMDZjM2JjMZsBLWNvcmU6OnBhbmlja2luZzo6cGFuaWNfZm10OjpoMWZlYTYyMzc1NWZmZmVkN5wBSXN0ZDo6c3lzX2NvbW1vbjo6YmFja3RyYWNlOjpfX3J1c3RfZW5kX3Nob3J0X2JhY2t0cmFjZTo6aDkxZTcxMTYwN2Q5MWJlNTKdAQZtZW1zZXSeARFfX3diaW5kZ2VuX21hbGxvY58BPjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6cmVzZXQ6OmhhODA3YTcxYjdkMTY1MGQ0oAFDc3RkOjpwYW5pY2tpbmc6OmJlZ2luX3BhbmljX2hhbmRsZXI6Ont7Y2xvc3VyZX19OjpoNGU0OWYzNTBkOWY0ZGUzNqEBEl9fd2JpbmRnZW5fcmVhbGxvY6IBO2NvcmU6OnB0cjo6ZHJvcF9pbl9wbGFjZTxibGFrZTM6Okhhc2hlcj46OmhmY2Q1OGMwZDU3Mjc0YjBiowFFPGJsb2NrX3BhZGRpbmc6OlBhZEVycm9yIGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6Omg2MjE0NGM2NGE1Y2MzOThlpAE+PGNvcmU6OmZtdDo6RXJyb3IgYXMgY29yZTo6Zm10OjpEZWJ1Zz46OmZtdDo6aDliOTQ0ODY4ZWM2ZjFjNWOlATJjb3JlOjpvcHRpb246Ok9wdGlvbjxUPjo6dW53cmFwOjpoNTg4NDZlYTljYjc2NjZmMaYBMDwmVCBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoZDYwY2EzZmU0ODAwZTNjZacBMjwmVCBhcyBjb3JlOjpmbXQ6OkRpc3BsYXk+OjpmbXQ6OmhhYjhjZDIyOWI5ZTIwMmM4qAFOPEkgYXMgY29yZTo6aXRlcjo6dHJhaXRzOjpjb2xsZWN0OjpJbnRvSXRlcmF0b3I+OjppbnRvX2l0ZXI6Omg1Y2YxYjdmMDliYWExNzcxqQEPX193YmluZGdlbl9mcmVlqgE0YWxsb2M6OnJhd192ZWM6OmNhcGFjaXR5X292ZXJmbG93OjpoZDYxMmU3ZWZhMTJjMzdkZqsBOWNvcmU6Om9wczo6ZnVuY3Rpb246OkZuT25jZTo6Y2FsbF9vbmNlOjpoZGRlOTUzNDE1ODJlOGEyYawBPjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6cmVzZXQ6OmgwODNlNjNiYzBjNTQ3NTBhrQE+PEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpyZXNldDo6aDNjZjc1ZTA0MTNmZDBkMTOuAT48RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46OnJlc2V0OjpoNDI2NmVjMDdiNjkyMTUxMa8BPjxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6cmVzZXQ6OmhjODJjZGE3ZDVlNDZlNWM4sAEfX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcrEBMXdhc21fYmluZGdlbjo6X19ydDo6dGhyb3dfbnVsbDo6aDUwY2EyNjg0N2U4NGVlNmGyATJ3YXNtX2JpbmRnZW46Ol9fcnQ6OmJvcnJvd19mYWlsOjpoOGJhMWFmZDdlOTcyZGRkObMBTmNvcmU6OmZtdDo6bnVtOjppbXA6OjxpbXBsIGNvcmU6OmZtdDo6RGlzcGxheSBmb3IgdTMyPjo6Zm10OjpoZGM0MTczNmM1M2ZjNzk3NLQBKndhc21fYmluZGdlbjo6dGhyb3dfc3RyOjpoNzZiMTdjYTcxNDY1NjQ3OLUBKndhc21fYmluZGdlbjo6dGhyb3dfdmFsOjpoMmVkMWZiNGI0YTBhNzQ3ZrYBMTxUIGFzIGNvcmU6OmFueTo6QW55Pjo6dHlwZV9pZDo6aDJkNDcxYjk2YmM0Y2JjZmO3AUQ8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46Om91dHB1dF9zaXplOjpoMDU4Y2E3OTM1NWJlM2E5MbgBRDxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6b3V0cHV0X3NpemU6Omg0NDQzMjc2ZmU0ODk5ZTk4uQFEPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpvdXRwdXRfc2l6ZTo6aDUzZWQwMzk5YTIyOTNhYze6AUQ8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46Om91dHB1dF9zaXplOjpoOTAyNzVhZWVmMGQwZDAyZbsBRDxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6b3V0cHV0X3NpemU6OmhkZTBlZTFkNTZiYTM0NThmvAFEPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpvdXRwdXRfc2l6ZTo6aGYwMGZmN2RiODliNGFmMDK9AUQ8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46Om91dHB1dF9zaXplOjpoNTM5M2JmZDg1NDI4Nzk3NL4BRDxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6b3V0cHV0X3NpemU6Omg1NTU5MjkxNGRjNjE3M2VmvwFEPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpvdXRwdXRfc2l6ZTo6aDY4ZDhmMjBhNGExYTJmZGPAAUQ8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46Om91dHB1dF9zaXplOjpoMjRmNGQ1ZDg3ODY3OGViMMEBRDxEIGFzIGRpZ2VzdDo6ZHluX2RpZ2VzdDo6RHluRGlnZXN0Pjo6b3V0cHV0X3NpemU6OmhmYWIxZjQxMmNmODRmZjYzwgFEPEQgYXMgZGlnZXN0OjpkeW5fZGlnZXN0OjpEeW5EaWdlc3Q+OjpvdXRwdXRfc2l6ZTo6aDdjYjRmYzIwMDk2MjU1MjjDAUQ8RCBhcyBkaWdlc3Q6OmR5bl9kaWdlc3Q6OkR5bkRpZ2VzdD46Om91dHB1dF9zaXplOjpoOTFjYTk4NDFjYzMyZGU2NsQBCnJ1c3RfcGFuaWPFATdzdGQ6OmFsbG9jOjpkZWZhdWx0X2FsbG9jX2Vycm9yX2hvb2s6OmgwZWNjZGFjMjRmZGEzNzhmxgFvY29yZTo6cHRyOjpkcm9wX2luX3BsYWNlPCZjb3JlOjppdGVyOjphZGFwdGVyczo6Y29waWVkOjpDb3BpZWQ8Y29yZTo6c2xpY2U6Oml0ZXI6Okl0ZXI8dTg+Pj46OmhmN2JkMDQzN2MzZTg4NjM5AO+AgIAACXByb2R1Y2VycwIIbGFuZ3VhZ2UBBFJ1c3QADHByb2Nlc3NlZC1ieQMFcnVzdGMdMS41NC4wIChhMTc4ZDAzMjIgMjAyMS0wNy0yNikGd2FscnVzBjAuMTkuMAx3YXNtLWJpbmRnZW4GMC4yLjc0"));
var wasmInstance = new WebAssembly.Instance(wasmModule, imports);
var wasm = wasmInstance.exports;

// deno:https://deno.land/std@0.104.0/encoding/hex.ts
var hexTable = new TextEncoder().encode("0123456789abcdef");
function encode2(src) {
  const dst = new Uint8Array(src.length * 2);
  for (let i = 0; i < dst.length; i++) {
    const v = src[i];
    dst[i * 2] = hexTable[v >> 4];
    dst[i * 2 + 1] = hexTable[v & 15];
  }
  return dst;
}

// deno:https://deno.land/std@0.104.0/hash/_wasm/hash.ts
var Hash = class {
  #hash;
  #digested;
  constructor(algorithm) {
    this.#hash = create_hash(algorithm);
    this.#digested = false;
  }
  update(message) {
    let view;
    if (message instanceof Uint8Array) {
      view = message;
    } else if (typeof message === "string") {
      view = new TextEncoder().encode(message);
    } else if (ArrayBuffer.isView(message)) {
      view = new Uint8Array(message.buffer, message.byteOffset, message.byteLength);
    } else if (message instanceof ArrayBuffer) {
      view = new Uint8Array(message);
    } else {
      throw new Error("hash: `data` is invalid type");
    }
    const chunkSize = 65536;
    for (let offset = 0; offset < view.byteLength; offset += chunkSize) {
      update_hash(this.#hash, new Uint8Array(view.buffer, view.byteOffset + offset, Math.min(chunkSize, view.byteLength - offset)));
    }
    return this;
  }
  /** Returns final hash */
  digest() {
    if (this.#digested) throw new Error("hash: already digested");
    this.#digested = true;
    return digest_hash(this.#hash);
  }
  /**
   * Returns hash as a string of given format
   * @param format format of output string (hex or base64). Default is hex
   */
  toString(format2 = "hex") {
    const finalized = new Uint8Array(this.digest());
    switch (format2) {
      case "hex":
        return new TextDecoder().decode(encode2(finalized));
      case "base64":
        return encode(finalized);
      default:
        throw new Error("hash: invalid format");
    }
  }
};

// deno:https://deno.land/std@0.104.0/hash/mod.ts
function createHash(algorithm) {
  return new Hash(algorithm);
}

// deno:https://deno.land/x/sql_builder@v1.9.1/util.ts
function replaceParams(sql, params) {
  if (!params) return sql;
  let paramIndex = 0;
  sql = sql.replace(/('[^'\\]*(?:\\.[^'\\]*)*')|("[^"\\]*(?:\\.[^"\\]*)*")|(\?\?)|(\?)/g, (str) => {
    if (paramIndex >= params.length) return str;
    if (/".*"/g.test(str) || /'.*'/g.test(str)) {
      return str;
    }
    if (str === "??") {
      const val2 = params[paramIndex++];
      if (val2 instanceof Array) {
        return `(${val2.map((item) => replaceParams("??", [
          item
        ])).join(",")})`;
      } else if (val2 === "*") {
        return val2;
      } else if (typeof val2 === "string" && val2.includes(".")) {
        const _arr = val2.split(".");
        return replaceParams(_arr.map(() => "??").join("."), _arr);
      } else if (typeof val2 === "string" && (val2.includes(" as ") || val2.includes(" AS "))) {
        const newVal = val2.replace(" as ", " AS ");
        const _arr = newVal.split(" AS ");
        return replaceParams(_arr.map(() => "??").join(" AS "), _arr);
      } else {
        return [
          "`",
          val2,
          "`"
        ].join("");
      }
    }
    const val = params[paramIndex++];
    if (val === null) return "NULL";
    switch (typeof val) {
      case "object":
        if (val instanceof Date) return `"${formatDate(val)}"`;
        if (val instanceof Array) {
          return `(${val.map((item) => replaceParams("?", [
            item
          ])).join(",")})`;
        }
      case "string":
        return `"${escapeString(val)}"`;
      case "undefined":
        return "NULL";
      case "number":
      case "boolean":
      default:
        return val;
    }
  });
  return sql;
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const days = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${year}-${month}-${days} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
function escapeString(str) {
  return str.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

// deno:https://deno.land/std@0.104.0/log/mod.ts
var mod_exports = {};
__export(mod_exports, {
  LogLevels: () => LogLevels,
  Logger: () => Logger,
  LoggerConfig: () => LoggerConfig,
  critical: () => critical,
  debug: () => debug,
  error: () => error,
  getLogger: () => getLogger,
  handlers: () => handlers,
  info: () => info,
  setup: () => setup,
  warning: () => warning
});

// deno:https://deno.land/std@0.104.0/log/levels.ts
var LogLevels = /* @__PURE__ */ function(LogLevels2) {
  LogLevels2[LogLevels2["NOTSET"] = 0] = "NOTSET";
  LogLevels2[LogLevels2["DEBUG"] = 10] = "DEBUG";
  LogLevels2[LogLevels2["INFO"] = 20] = "INFO";
  LogLevels2[LogLevels2["WARNING"] = 30] = "WARNING";
  LogLevels2[LogLevels2["ERROR"] = 40] = "ERROR";
  LogLevels2[LogLevels2["CRITICAL"] = 50] = "CRITICAL";
  return LogLevels2;
}({});
var LogLevelNames = Object.keys(LogLevels).filter((key) => isNaN(Number(key)));
var byLevel = {
  [String(LogLevels.NOTSET)]: "NOTSET",
  [String(LogLevels.DEBUG)]: "DEBUG",
  [String(LogLevels.INFO)]: "INFO",
  [String(LogLevels.WARNING)]: "WARNING",
  [String(LogLevels.ERROR)]: "ERROR",
  [String(LogLevels.CRITICAL)]: "CRITICAL"
};
function getLevelByName(name) {
  switch (name) {
    case "NOTSET":
      return LogLevels.NOTSET;
    case "DEBUG":
      return LogLevels.DEBUG;
    case "INFO":
      return LogLevels.INFO;
    case "WARNING":
      return LogLevels.WARNING;
    case "ERROR":
      return LogLevels.ERROR;
    case "CRITICAL":
      return LogLevels.CRITICAL;
    default:
      throw new Error(`no log level found for "${name}"`);
  }
}
function getLevelName(level) {
  const levelName = byLevel[level];
  if (levelName) {
    return levelName;
  }
  throw new Error(`no level name found for level: ${level}`);
}

// deno:https://deno.land/std@0.104.0/log/logger.ts
var LogRecord = class {
  msg;
  #args;
  #datetime;
  level;
  levelName;
  loggerName;
  constructor(options) {
    this.msg = options.msg;
    this.#args = [
      ...options.args
    ];
    this.level = options.level;
    this.loggerName = options.loggerName;
    this.#datetime = /* @__PURE__ */ new Date();
    this.levelName = getLevelName(options.level);
  }
  get args() {
    return [
      ...this.#args
    ];
  }
  get datetime() {
    return new Date(this.#datetime.getTime());
  }
};
var Logger = class {
  #level;
  #handlers;
  #loggerName;
  constructor(loggerName, levelName, options = {}) {
    this.#loggerName = loggerName;
    this.#level = getLevelByName(levelName);
    this.#handlers = options.handlers || [];
  }
  get level() {
    return this.#level;
  }
  set level(level) {
    this.#level = level;
  }
  get levelName() {
    return getLevelName(this.#level);
  }
  set levelName(levelName) {
    this.#level = getLevelByName(levelName);
  }
  get loggerName() {
    return this.#loggerName;
  }
  set handlers(hndls) {
    this.#handlers = hndls;
  }
  get handlers() {
    return this.#handlers;
  }
  /** If the level of the logger is greater than the level to log, then nothing
   * is logged, otherwise a log record is passed to each log handler.  `msg` data
   * passed in is returned.  If a function is passed in, it is only evaluated
   * if the msg will be logged and the return value will be the result of the
   * function, not the function itself, unless the function isn't called, in which
   * case undefined is returned.  All types are coerced to strings for logging.
   */
  _log(level, msg, ...args) {
    if (this.level > level) {
      return msg instanceof Function ? void 0 : msg;
    }
    let fnResult;
    let logMessage;
    if (msg instanceof Function) {
      fnResult = msg();
      logMessage = this.asString(fnResult);
    } else {
      logMessage = this.asString(msg);
    }
    const record = new LogRecord({
      msg: logMessage,
      args,
      level,
      loggerName: this.loggerName
    });
    this.#handlers.forEach((handler) => {
      handler.handle(record);
    });
    return msg instanceof Function ? fnResult : msg;
  }
  asString(data) {
    if (typeof data === "string") {
      return data;
    } else if (data === null || typeof data === "number" || typeof data === "bigint" || typeof data === "boolean" || typeof data === "undefined" || typeof data === "symbol") {
      return String(data);
    } else if (data instanceof Error) {
      return data.stack;
    } else if (typeof data === "object") {
      return JSON.stringify(data);
    }
    return "undefined";
  }
  debug(msg, ...args) {
    return this._log(LogLevels.DEBUG, msg, ...args);
  }
  info(msg, ...args) {
    return this._log(LogLevels.INFO, msg, ...args);
  }
  warning(msg, ...args) {
    return this._log(LogLevels.WARNING, msg, ...args);
  }
  error(msg, ...args) {
    return this._log(LogLevels.ERROR, msg, ...args);
  }
  critical(msg, ...args) {
    return this._log(LogLevels.CRITICAL, msg, ...args);
  }
};

// deno:https://deno.land/std@0.104.0/fmt/colors.ts
var { Deno: Deno2 } = globalThis;
var noColor2 = typeof Deno2?.noColor === "boolean" ? Deno2.noColor : true;
var enabled2 = !noColor2;
function code2(open, close) {
  return {
    open: `\x1B[${open.join(";")}m`,
    close: `\x1B[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run2(str, code3) {
  return enabled2 ? `${code3.open}${str.replace(code3.regexp, code3.open)}${code3.close}` : str;
}
function bold(str) {
  return run2(str, code2([
    1
  ], 22));
}
function red(str) {
  return run2(str, code2([
    31
  ], 39));
}
function yellow(str) {
  return run2(str, code2([
    33
  ], 39));
}
function blue(str) {
  return run2(str, code2([
    34
  ], 39));
}
var ANSI_PATTERN2 = new RegExp([
  "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
  "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
].join("|"), "g");

// deno:https://deno.land/std@0.104.0/fs/exists.ts
async function exists(filePath) {
  try {
    await Deno.lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
function existsSync(filePath) {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

// deno:https://deno.land/std@0.104.0/bytes/mod.ts
function copy(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}

// deno:https://deno.land/std@0.104.0/_util/assert.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// deno:https://deno.land/std@0.104.0/io/buffer.ts
var MIN_READ = 32 * 1024;
var MAX_SIZE = 2 ** 32 - 2;

// deno:https://deno.land/std@0.104.0/io/util.ts
var DEFAULT_BUFFER_SIZE = 32 * 1024;
function writeAllSync(w, arr) {
  let nwritten = 0;
  while (nwritten < arr.length) {
    nwritten += w.writeSync(arr.subarray(nwritten));
  }
}

// deno:https://deno.land/std@0.104.0/io/bufio.ts
var DEFAULT_BUF_SIZE = 4096;
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);
var AbstractBufBase = class {
  buf;
  usedBufferBytes = 0;
  err = null;
  /** Size returns the size of the underlying buffer in bytes. */
  size() {
    return this.buf.byteLength;
  }
  /** Returns how many bytes are unused in the buffer. */
  available() {
    return this.buf.byteLength - this.usedBufferBytes;
  }
  /** buffered returns the number of bytes that have been written into the
   * current buffer.
   */
  buffered() {
    return this.usedBufferBytes;
  }
};
var BufWriterSync = class _BufWriterSync extends AbstractBufBase {
  writer;
  /** return new BufWriterSync unless writer is BufWriterSync */
  static create(writer, size = DEFAULT_BUF_SIZE) {
    return writer instanceof _BufWriterSync ? writer : new _BufWriterSync(writer, size);
  }
  constructor(writer, size = DEFAULT_BUF_SIZE) {
    super(), this.writer = writer;
    if (size <= 0) {
      size = DEFAULT_BUF_SIZE;
    }
    this.buf = new Uint8Array(size);
  }
  /** Discards any unflushed buffered data, clears any error, and
   * resets buffer to write its output to w.
   */
  reset(w) {
    this.err = null;
    this.usedBufferBytes = 0;
    this.writer = w;
  }
  /** Flush writes any buffered data to the underlying io.WriterSync. */
  flush() {
    if (this.err !== null) throw this.err;
    if (this.usedBufferBytes === 0) return;
    try {
      writeAllSync(this.writer, this.buf.subarray(0, this.usedBufferBytes));
    } catch (e) {
      this.err = e;
      throw e;
    }
    this.buf = new Uint8Array(this.buf.length);
    this.usedBufferBytes = 0;
  }
  /** Writes the contents of `data` into the buffer.  If the contents won't fully
   * fit into the buffer, those bytes that can are copied into the buffer, the
   * buffer is the flushed to the writer and the remaining bytes are copied into
   * the now empty buffer.
   *
   * @return the number of bytes written to the buffer.
   */
  writeSync(data) {
    if (this.err !== null) throw this.err;
    if (data.length === 0) return 0;
    let totalBytesWritten = 0;
    let numBytesWritten = 0;
    while (data.byteLength > this.available()) {
      if (this.buffered() === 0) {
        try {
          numBytesWritten = this.writer.writeSync(data);
        } catch (e) {
          this.err = e;
          throw e;
        }
      } else {
        numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        this.flush();
      }
      totalBytesWritten += numBytesWritten;
      data = data.subarray(numBytesWritten);
    }
    numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
    this.usedBufferBytes += numBytesWritten;
    totalBytesWritten += numBytesWritten;
    return totalBytesWritten;
  }
};

// deno:https://deno.land/std@0.104.0/log/handlers.ts
var DEFAULT_FORMATTER = "{levelName} {msg}";
var BaseHandler = class {
  level;
  levelName;
  formatter;
  constructor(levelName, options = {}) {
    this.level = getLevelByName(levelName);
    this.levelName = levelName;
    this.formatter = options.formatter || DEFAULT_FORMATTER;
  }
  handle(logRecord) {
    if (this.level > logRecord.level) return;
    const msg = this.format(logRecord);
    return this.log(msg);
  }
  format(logRecord) {
    if (this.formatter instanceof Function) {
      return this.formatter(logRecord);
    }
    return this.formatter.replace(/{(\S+)}/g, (match, p1) => {
      const value = logRecord[p1];
      if (value == null) {
        return match;
      }
      return String(value);
    });
  }
  log(_msg) {
  }
  async setup() {
  }
  async destroy() {
  }
};
var ConsoleHandler = class extends BaseHandler {
  format(logRecord) {
    let msg = super.format(logRecord);
    switch (logRecord.level) {
      case LogLevels.INFO:
        msg = blue(msg);
        break;
      case LogLevels.WARNING:
        msg = yellow(msg);
        break;
      case LogLevels.ERROR:
        msg = red(msg);
        break;
      case LogLevels.CRITICAL:
        msg = bold(red(msg));
        break;
      default:
        break;
    }
    return msg;
  }
  log(msg) {
    console.log(msg);
  }
};
var WriterHandler = class extends BaseHandler {
  _writer;
  #encoder = new TextEncoder();
};
var FileHandler = class extends WriterHandler {
  _file;
  _buf;
  _filename;
  _mode;
  _openOptions;
  _encoder = new TextEncoder();
  #unloadCallback() {
    this.destroy();
  }
  constructor(levelName, options) {
    super(levelName, options);
    this._filename = options.filename;
    this._mode = options.mode ? options.mode : "a";
    this._openOptions = {
      createNew: this._mode === "x",
      create: this._mode !== "x",
      append: this._mode === "a",
      truncate: this._mode !== "a",
      write: true
    };
  }
  async setup() {
    this._file = await Deno.open(this._filename, this._openOptions);
    this._writer = this._file;
    this._buf = new BufWriterSync(this._file);
    addEventListener("unload", this.#unloadCallback.bind(this));
  }
  handle(logRecord) {
    super.handle(logRecord);
    if (logRecord.level > LogLevels.ERROR) {
      this.flush();
    }
  }
  log(msg) {
    this._buf.writeSync(this._encoder.encode(msg + "\n"));
  }
  flush() {
    if (this._buf?.buffered() > 0) {
      this._buf.flush();
    }
  }
  destroy() {
    this.flush();
    this._file?.close();
    this._file = void 0;
    removeEventListener("unload", this.#unloadCallback);
    return Promise.resolve();
  }
};
var RotatingFileHandler = class extends FileHandler {
  #maxBytes;
  #maxBackupCount;
  #currentFileSize = 0;
  constructor(levelName, options) {
    super(levelName, options);
    this.#maxBytes = options.maxBytes;
    this.#maxBackupCount = options.maxBackupCount;
  }
  async setup() {
    if (this.#maxBytes < 1) {
      this.destroy();
      throw new Error("maxBytes cannot be less than 1");
    }
    if (this.#maxBackupCount < 1) {
      this.destroy();
      throw new Error("maxBackupCount cannot be less than 1");
    }
    await super.setup();
    if (this._mode === "w") {
      for (let i = 1; i <= this.#maxBackupCount; i++) {
        if (await exists(this._filename + "." + i)) {
          await Deno.remove(this._filename + "." + i);
        }
      }
    } else if (this._mode === "x") {
      for (let i = 1; i <= this.#maxBackupCount; i++) {
        if (await exists(this._filename + "." + i)) {
          this.destroy();
          throw new Deno.errors.AlreadyExists("Backup log file " + this._filename + "." + i + " already exists");
        }
      }
    } else {
      this.#currentFileSize = (await Deno.stat(this._filename)).size;
    }
  }
  log(msg) {
    const msgByteLength = this._encoder.encode(msg).byteLength + 1;
    if (this.#currentFileSize + msgByteLength > this.#maxBytes) {
      this.rotateLogFiles();
      this.#currentFileSize = 0;
    }
    this._buf.writeSync(this._encoder.encode(msg + "\n"));
    this.#currentFileSize += msgByteLength;
  }
  rotateLogFiles() {
    this._buf.flush();
    Deno.close(this._file.rid);
    for (let i = this.#maxBackupCount - 1; i >= 0; i--) {
      const source = this._filename + (i === 0 ? "" : "." + i);
      const dest = this._filename + "." + (i + 1);
      if (existsSync(source)) {
        Deno.renameSync(source, dest);
      }
    }
    this._file = Deno.openSync(this._filename, this._openOptions);
    this._writer = this._file;
    this._buf = new BufWriterSync(this._file);
  }
};

// deno:https://deno.land/std@0.104.0/log/mod.ts
var LoggerConfig = class {
  level;
  handlers;
};
var DEFAULT_LEVEL = "INFO";
var DEFAULT_CONFIG = {
  handlers: {
    default: new ConsoleHandler(DEFAULT_LEVEL)
  },
  loggers: {
    default: {
      level: DEFAULT_LEVEL,
      handlers: [
        "default"
      ]
    }
  }
};
var state = {
  handlers: /* @__PURE__ */ new Map(),
  loggers: /* @__PURE__ */ new Map(),
  config: DEFAULT_CONFIG
};
var handlers = {
  BaseHandler,
  ConsoleHandler,
  WriterHandler,
  FileHandler,
  RotatingFileHandler
};
function getLogger(name) {
  if (!name) {
    const d = state.loggers.get("default");
    assert(d != null, `"default" logger must be set for getting logger without name`);
    return d;
  }
  const result = state.loggers.get(name);
  if (!result) {
    const logger2 = new Logger(name, "NOTSET", {
      handlers: []
    });
    state.loggers.set(name, logger2);
    return logger2;
  }
  return result;
}
function debug(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").debug(msg, ...args);
  }
  return getLogger("default").debug(msg, ...args);
}
function info(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").info(msg, ...args);
  }
  return getLogger("default").info(msg, ...args);
}
function warning(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").warning(msg, ...args);
  }
  return getLogger("default").warning(msg, ...args);
}
function error(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").error(msg, ...args);
  }
  return getLogger("default").error(msg, ...args);
}
function critical(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").critical(msg, ...args);
  }
  return getLogger("default").critical(msg, ...args);
}
async function setup(config) {
  state.config = {
    handlers: {
      ...DEFAULT_CONFIG.handlers,
      ...config.handlers
    },
    loggers: {
      ...DEFAULT_CONFIG.loggers,
      ...config.loggers
    }
  };
  state.handlers.forEach((handler) => {
    handler.destroy();
  });
  state.handlers.clear();
  const handlers2 = state.config.handlers || {};
  for (const handlerName in handlers2) {
    const handler = handlers2[handlerName];
    await handler.setup();
    state.handlers.set(handlerName, handler);
  }
  state.loggers.clear();
  const loggers = state.config.loggers || {};
  for (const loggerName in loggers) {
    const loggerConfig = loggers[loggerName];
    const handlerNames = loggerConfig.handlers || [];
    const handlers3 = [];
    handlerNames.forEach((handlerName) => {
      const handler = state.handlers.get(handlerName);
      if (handler) {
        handlers3.push(handler);
      }
    });
    const levelName = loggerConfig.level || DEFAULT_LEVEL;
    const logger2 = new Logger(loggerName, levelName, {
      handlers: handlers3
    });
    state.loggers.set(loggerName, logger2);
  }
}
await setup(DEFAULT_CONFIG);

// deno:https://deno.land/x/mysql@v2.12.1/src/logger.ts
var logger = mod_exports.getLogger();
var isDebug = false;
function debug2(func) {
  if (isDebug) {
    func();
  }
}

// deno:https://deno.land/x/mysql@v2.12.1/src/util.ts
function xor(a, b) {
  return a.map((byte, index) => {
    return byte ^ b[index];
  });
}

// deno:https://deno.land/x/mysql@v2.12.1/src/buffer.ts
var encoder = new TextEncoder();
var decoder = new TextDecoder();
function encode3(input) {
  return encoder.encode(input);
}
function decode2(input) {
  return decoder.decode(input);
}
var BufferReader = class {
  buffer;
  pos;
  constructor(buffer) {
    this.buffer = buffer;
    this.pos = 0;
  }
  get finished() {
    return this.pos >= this.buffer.length;
  }
  skip(len) {
    this.pos += len;
    return this;
  }
  readBuffer(len) {
    const buffer = this.buffer.slice(this.pos, this.pos + len);
    this.pos += len;
    return buffer;
  }
  readUints(len) {
    let num = 0;
    for (let n = 0; n < len; n++) {
      num += this.buffer[this.pos++] << 8 * n;
    }
    return num;
  }
  readUint8() {
    return this.buffer[this.pos++];
  }
  readUint16() {
    return this.readUints(2);
  }
  readUint32() {
    return this.readUints(4);
  }
  readUint64() {
    return this.readUints(8);
  }
  readNullTerminatedString() {
    let end = this.buffer.indexOf(0, this.pos);
    if (end === -1) end = this.buffer.length;
    const buf = this.buffer.slice(this.pos, end);
    this.pos += buf.length + 1;
    return decode2(buf);
  }
  readRestOfPacketString() {
    return this.buffer.slice(this.pos);
  }
  readString(len) {
    const str = decode2(this.buffer.slice(this.pos, this.pos + len));
    this.pos += len;
    return str;
  }
  readEncodedLen() {
    const first = this.readUint8();
    if (first < 251) {
      return first;
    } else {
      if (first == 252) {
        return this.readUint16();
      } else if (first == 253) {
        return this.readUints(3);
      } else if (first == 254) {
        return this.readUints(8);
      }
    }
    return -1;
  }
  readLenCodeString() {
    const len = this.readEncodedLen();
    if (len == -1) return null;
    return this.readString(len);
  }
};
var BufferWriter = class {
  buffer;
  pos;
  constructor(buffer) {
    this.buffer = buffer;
    this.pos = 0;
  }
  get wroteData() {
    return this.buffer.slice(0, this.pos);
  }
  get length() {
    return this.pos;
  }
  get capacity() {
    return this.buffer.length - this.pos;
  }
  skip(len) {
    this.pos += len;
    return this;
  }
  writeBuffer(buffer) {
    if (buffer.length > this.capacity) {
      buffer = buffer.slice(0, this.capacity);
    }
    this.buffer.set(buffer, this.pos);
    this.pos += buffer.length;
    return this;
  }
  write(byte) {
    this.buffer[this.pos++] = byte;
    return this;
  }
  writeInt16LE(num) {
  }
  writeIntLE(num, len) {
    const int = new Int32Array(1);
    int[0] = 40;
    console.log(int);
  }
  writeUint16(num) {
    return this.writeUints(2, num);
  }
  writeUint32(num) {
    return this.writeUints(4, num);
  }
  writeUint64(num) {
    return this.writeUints(8, num);
  }
  writeUints(len, num) {
    for (let n = 0; n < len; n++) {
      this.buffer[this.pos++] = num >> n * 8 & 255;
    }
    return this;
  }
  writeNullTerminatedString(str) {
    return this.writeString(str).write(0);
  }
  writeString(str) {
    const buf = encode3(str);
    this.buffer.set(buf, this.pos);
    this.pos += buf.length;
    return this;
  }
};

// deno:https://deno.land/x/mysql@v2.12.1/src/auth.ts
function hash(algorithm, data) {
  return new Uint8Array(createHash(algorithm).update(data).digest());
}
function mysqlNativePassword(password2, seed) {
  const pwd1 = hash("sha1", encode3(password2));
  const pwd2 = hash("sha1", pwd1);
  let seedAndPwd2 = new Uint8Array(seed.length + pwd2.length);
  seedAndPwd2.set(seed);
  seedAndPwd2.set(pwd2, seed.length);
  seedAndPwd2 = hash("sha1", seedAndPwd2);
  return xor(seedAndPwd2, pwd1);
}
function cachingSha2Password(password2, seed) {
  const stage1 = hash("sha256", encode3(password2));
  const stage2 = hash("sha256", stage1);
  const stage3 = hash("sha256", Uint8Array.from([
    ...stage2,
    ...seed
  ]));
  return xor(stage1, stage3);
}
function auth(authPluginName, password2, seed) {
  switch (authPluginName) {
    case "mysql_native_password":
      return mysqlNativePassword(password2, seed.slice(0, 20));
    case "caching_sha2_password":
      return cachingSha2Password(password2, seed);
    default:
      throw new Error("Not supported");
  }
}

// deno:https://deno.land/x/mysql@v2.12.1/src/constant/capabilities.ts
var ServerCapabilities = /* @__PURE__ */ function(ServerCapabilities2) {
  ServerCapabilities2[ServerCapabilities2["CLIENT_LONG_PASSWORD"] = 1] = "CLIENT_LONG_PASSWORD";
  ServerCapabilities2[ServerCapabilities2["CLIENT_FOUND_ROWS"] = 2] = "CLIENT_FOUND_ROWS";
  ServerCapabilities2[ServerCapabilities2["CLIENT_LONG_FLAG"] = 4] = "CLIENT_LONG_FLAG";
  ServerCapabilities2[ServerCapabilities2["CLIENT_CONNECT_WITH_DB"] = 8] = "CLIENT_CONNECT_WITH_DB";
  ServerCapabilities2[ServerCapabilities2["CLIENT_NO_SCHEMA"] = 16] = "CLIENT_NO_SCHEMA";
  ServerCapabilities2[ServerCapabilities2["CLIENT_COMPRESS"] = 32] = "CLIENT_COMPRESS";
  ServerCapabilities2[ServerCapabilities2["CLIENT_ODBC"] = 64] = "CLIENT_ODBC";
  ServerCapabilities2[ServerCapabilities2["CLIENT_LOCAL_FILES"] = 128] = "CLIENT_LOCAL_FILES";
  ServerCapabilities2[ServerCapabilities2["CLIENT_IGNORE_SPACE"] = 256] = "CLIENT_IGNORE_SPACE";
  ServerCapabilities2[ServerCapabilities2["CLIENT_PROTOCOL_41"] = 512] = "CLIENT_PROTOCOL_41";
  ServerCapabilities2[ServerCapabilities2["CLIENT_INTERACTIVE"] = 1024] = "CLIENT_INTERACTIVE";
  ServerCapabilities2[ServerCapabilities2["CLIENT_SSL"] = 2048] = "CLIENT_SSL";
  ServerCapabilities2[ServerCapabilities2["CLIENT_IGNORE_SIGPIPE"] = 4096] = "CLIENT_IGNORE_SIGPIPE";
  ServerCapabilities2[ServerCapabilities2["CLIENT_TRANSACTIONS"] = 8192] = "CLIENT_TRANSACTIONS";
  ServerCapabilities2[ServerCapabilities2["CLIENT_RESERVED"] = 16384] = "CLIENT_RESERVED";
  ServerCapabilities2[ServerCapabilities2["CLIENT_SECURE_CONNECTION"] = 32768] = "CLIENT_SECURE_CONNECTION";
  ServerCapabilities2[ServerCapabilities2["CLIENT_MULTI_STATEMENTS"] = 65536] = "CLIENT_MULTI_STATEMENTS";
  ServerCapabilities2[ServerCapabilities2["CLIENT_MULTI_RESULTS"] = 131072] = "CLIENT_MULTI_RESULTS";
  ServerCapabilities2[ServerCapabilities2["CLIENT_PS_MULTI_RESULTS"] = 262144] = "CLIENT_PS_MULTI_RESULTS";
  ServerCapabilities2[ServerCapabilities2["CLIENT_PLUGIN_AUTH"] = 524288] = "CLIENT_PLUGIN_AUTH";
  ServerCapabilities2[ServerCapabilities2["CLIENT_CONNECT_ATTRS"] = 1048576] = "CLIENT_CONNECT_ATTRS";
  ServerCapabilities2[ServerCapabilities2["CLIENT_PLUGIN_AUTH_LENENC_CLIENT_DATA"] = 2097152] = "CLIENT_PLUGIN_AUTH_LENENC_CLIENT_DATA";
  ServerCapabilities2[ServerCapabilities2["CLIENT_DEPRECATE_EOF"] = 16777216] = "CLIENT_DEPRECATE_EOF";
  return ServerCapabilities2;
}(ServerCapabilities || {});
var capabilities_default = ServerCapabilities;

// deno:https://deno.land/x/mysql@v2.12.1/src/constant/charset.ts
var Charset = /* @__PURE__ */ function(Charset2) {
  Charset2[Charset2["BIG5_CHINESE_CI"] = 1] = "BIG5_CHINESE_CI";
  Charset2[Charset2["LATIN2_CZECH_CS"] = 2] = "LATIN2_CZECH_CS";
  Charset2[Charset2["DEC8_SWEDISH_CI"] = 3] = "DEC8_SWEDISH_CI";
  Charset2[Charset2["CP850_GENERAL_CI"] = 4] = "CP850_GENERAL_CI";
  Charset2[Charset2["LATIN1_GERMAN1_CI"] = 5] = "LATIN1_GERMAN1_CI";
  Charset2[Charset2["HP8_ENGLISH_CI"] = 6] = "HP8_ENGLISH_CI";
  Charset2[Charset2["KOI8R_GENERAL_CI"] = 7] = "KOI8R_GENERAL_CI";
  Charset2[Charset2["LATIN1_SWEDISH_CI"] = 8] = "LATIN1_SWEDISH_CI";
  Charset2[Charset2["LATIN2_GENERAL_CI"] = 9] = "LATIN2_GENERAL_CI";
  Charset2[Charset2["SWE7_SWEDISH_CI"] = 10] = "SWE7_SWEDISH_CI";
  Charset2[Charset2["ASCII_GENERAL_CI"] = 11] = "ASCII_GENERAL_CI";
  Charset2[Charset2["UJIS_JAPANESE_CI"] = 12] = "UJIS_JAPANESE_CI";
  Charset2[Charset2["SJIS_JAPANESE_CI"] = 13] = "SJIS_JAPANESE_CI";
  Charset2[Charset2["CP1251_BULGARIAN_CI"] = 14] = "CP1251_BULGARIAN_CI";
  Charset2[Charset2["LATIN1_DANISH_CI"] = 15] = "LATIN1_DANISH_CI";
  Charset2[Charset2["HEBREW_GENERAL_CI"] = 16] = "HEBREW_GENERAL_CI";
  Charset2[Charset2["TIS620_THAI_CI"] = 18] = "TIS620_THAI_CI";
  Charset2[Charset2["EUCKR_KOREAN_CI"] = 19] = "EUCKR_KOREAN_CI";
  Charset2[Charset2["LATIN7_ESTONIAN_CS"] = 20] = "LATIN7_ESTONIAN_CS";
  Charset2[Charset2["LATIN2_HUNGARIAN_CI"] = 21] = "LATIN2_HUNGARIAN_CI";
  Charset2[Charset2["KOI8U_GENERAL_CI"] = 22] = "KOI8U_GENERAL_CI";
  Charset2[Charset2["CP1251_UKRAINIAN_CI"] = 23] = "CP1251_UKRAINIAN_CI";
  Charset2[Charset2["GB2312_CHINESE_CI"] = 24] = "GB2312_CHINESE_CI";
  Charset2[Charset2["GREEK_GENERAL_CI"] = 25] = "GREEK_GENERAL_CI";
  Charset2[Charset2["CP1250_GENERAL_CI"] = 26] = "CP1250_GENERAL_CI";
  Charset2[Charset2["LATIN2_CROATIAN_CI"] = 27] = "LATIN2_CROATIAN_CI";
  Charset2[Charset2["GBK_CHINESE_CI"] = 28] = "GBK_CHINESE_CI";
  Charset2[Charset2["CP1257_LITHUANIAN_CI"] = 29] = "CP1257_LITHUANIAN_CI";
  Charset2[Charset2["LATIN5_TURKISH_CI"] = 30] = "LATIN5_TURKISH_CI";
  Charset2[Charset2["LATIN1_GERMAN2_CI"] = 31] = "LATIN1_GERMAN2_CI";
  Charset2[Charset2["ARMSCII8_GENERAL_CI"] = 32] = "ARMSCII8_GENERAL_CI";
  Charset2[Charset2["UTF8_GENERAL_CI"] = 33] = "UTF8_GENERAL_CI";
  Charset2[Charset2["CP1250_CZECH_CS"] = 34] = "CP1250_CZECH_CS";
  Charset2[Charset2["UCS2_GENERAL_CI"] = 35] = "UCS2_GENERAL_CI";
  Charset2[Charset2["CP866_GENERAL_CI"] = 36] = "CP866_GENERAL_CI";
  Charset2[Charset2["KEYBCS2_GENERAL_CI"] = 37] = "KEYBCS2_GENERAL_CI";
  Charset2[Charset2["MACCE_GENERAL_CI"] = 38] = "MACCE_GENERAL_CI";
  Charset2[Charset2["MACROMAN_GENERAL_CI"] = 39] = "MACROMAN_GENERAL_CI";
  Charset2[Charset2["CP852_GENERAL_CI"] = 40] = "CP852_GENERAL_CI";
  Charset2[Charset2["LATIN7_GENERAL_CI"] = 41] = "LATIN7_GENERAL_CI";
  Charset2[Charset2["LATIN7_GENERAL_CS"] = 42] = "LATIN7_GENERAL_CS";
  Charset2[Charset2["MACCE_BIN"] = 43] = "MACCE_BIN";
  Charset2[Charset2["CP1250_CROATIAN_CI"] = 44] = "CP1250_CROATIAN_CI";
  Charset2[Charset2["UTF8MB4_GENERAL_CI"] = 45] = "UTF8MB4_GENERAL_CI";
  Charset2[Charset2["UTF8MB4_BIN"] = 46] = "UTF8MB4_BIN";
  Charset2[Charset2["LATIN1_BIN"] = 47] = "LATIN1_BIN";
  Charset2[Charset2["LATIN1_GENERAL_CI"] = 48] = "LATIN1_GENERAL_CI";
  Charset2[Charset2["LATIN1_GENERAL_CS"] = 49] = "LATIN1_GENERAL_CS";
  Charset2[Charset2["CP1251_BIN"] = 50] = "CP1251_BIN";
  Charset2[Charset2["CP1251_GENERAL_CI"] = 51] = "CP1251_GENERAL_CI";
  Charset2[Charset2["CP1251_GENERAL_CS"] = 52] = "CP1251_GENERAL_CS";
  Charset2[Charset2["MACROMAN_BIN"] = 53] = "MACROMAN_BIN";
  Charset2[Charset2["UTF16_GENERAL_CI"] = 54] = "UTF16_GENERAL_CI";
  Charset2[Charset2["UTF16_BIN"] = 55] = "UTF16_BIN";
  Charset2[Charset2["UTF16LE_GENERAL_CI"] = 56] = "UTF16LE_GENERAL_CI";
  Charset2[Charset2["CP1256_GENERAL_CI"] = 57] = "CP1256_GENERAL_CI";
  Charset2[Charset2["CP1257_BIN"] = 58] = "CP1257_BIN";
  Charset2[Charset2["CP1257_GENERAL_CI"] = 59] = "CP1257_GENERAL_CI";
  Charset2[Charset2["UTF32_GENERAL_CI"] = 60] = "UTF32_GENERAL_CI";
  Charset2[Charset2["UTF32_BIN"] = 61] = "UTF32_BIN";
  Charset2[Charset2["UTF16LE_BIN"] = 62] = "UTF16LE_BIN";
  Charset2[Charset2["BINARY"] = 63] = "BINARY";
  Charset2[Charset2["ARMSCII8_BIN"] = 64] = "ARMSCII8_BIN";
  Charset2[Charset2["ASCII_BIN"] = 65] = "ASCII_BIN";
  Charset2[Charset2["CP1250_BIN"] = 66] = "CP1250_BIN";
  Charset2[Charset2["CP1256_BIN"] = 67] = "CP1256_BIN";
  Charset2[Charset2["CP866_BIN"] = 68] = "CP866_BIN";
  Charset2[Charset2["DEC8_BIN"] = 69] = "DEC8_BIN";
  Charset2[Charset2["GREEK_BIN"] = 70] = "GREEK_BIN";
  Charset2[Charset2["HEBREW_BIN"] = 71] = "HEBREW_BIN";
  Charset2[Charset2["HP8_BIN"] = 72] = "HP8_BIN";
  Charset2[Charset2["KEYBCS2_BIN"] = 73] = "KEYBCS2_BIN";
  Charset2[Charset2["KOI8R_BIN"] = 74] = "KOI8R_BIN";
  Charset2[Charset2["KOI8U_BIN"] = 75] = "KOI8U_BIN";
  Charset2[Charset2["LATIN2_BIN"] = 77] = "LATIN2_BIN";
  Charset2[Charset2["LATIN5_BIN"] = 78] = "LATIN5_BIN";
  Charset2[Charset2["LATIN7_BIN"] = 79] = "LATIN7_BIN";
  Charset2[Charset2["CP850_BIN"] = 80] = "CP850_BIN";
  Charset2[Charset2["CP852_BIN"] = 81] = "CP852_BIN";
  Charset2[Charset2["SWE7_BIN"] = 82] = "SWE7_BIN";
  Charset2[Charset2["UTF8_BIN"] = 83] = "UTF8_BIN";
  Charset2[Charset2["BIG5_BIN"] = 84] = "BIG5_BIN";
  Charset2[Charset2["EUCKR_BIN"] = 85] = "EUCKR_BIN";
  Charset2[Charset2["GB2312_BIN"] = 86] = "GB2312_BIN";
  Charset2[Charset2["GBK_BIN"] = 87] = "GBK_BIN";
  Charset2[Charset2["SJIS_BIN"] = 88] = "SJIS_BIN";
  Charset2[Charset2["TIS620_BIN"] = 89] = "TIS620_BIN";
  Charset2[Charset2["UCS2_BIN"] = 90] = "UCS2_BIN";
  Charset2[Charset2["UJIS_BIN"] = 91] = "UJIS_BIN";
  Charset2[Charset2["GEOSTD8_GENERAL_CI"] = 92] = "GEOSTD8_GENERAL_CI";
  Charset2[Charset2["GEOSTD8_BIN"] = 93] = "GEOSTD8_BIN";
  Charset2[Charset2["LATIN1_SPANISH_CI"] = 94] = "LATIN1_SPANISH_CI";
  Charset2[Charset2["CP932_JAPANESE_CI"] = 95] = "CP932_JAPANESE_CI";
  Charset2[Charset2["CP932_BIN"] = 96] = "CP932_BIN";
  Charset2[Charset2["EUCJPMS_JAPANESE_CI"] = 97] = "EUCJPMS_JAPANESE_CI";
  Charset2[Charset2["EUCJPMS_BIN"] = 98] = "EUCJPMS_BIN";
  Charset2[Charset2["CP1250_POLISH_CI"] = 99] = "CP1250_POLISH_CI";
  Charset2[Charset2["UTF16_UNICODE_CI"] = 101] = "UTF16_UNICODE_CI";
  Charset2[Charset2["UTF16_ICELANDIC_CI"] = 102] = "UTF16_ICELANDIC_CI";
  Charset2[Charset2["UTF16_LATVIAN_CI"] = 103] = "UTF16_LATVIAN_CI";
  Charset2[Charset2["UTF16_ROMANIAN_CI"] = 104] = "UTF16_ROMANIAN_CI";
  Charset2[Charset2["UTF16_SLOVENIAN_CI"] = 105] = "UTF16_SLOVENIAN_CI";
  Charset2[Charset2["UTF16_POLISH_CI"] = 106] = "UTF16_POLISH_CI";
  Charset2[Charset2["UTF16_ESTONIAN_CI"] = 107] = "UTF16_ESTONIAN_CI";
  Charset2[Charset2["UTF16_SPANISH_CI"] = 108] = "UTF16_SPANISH_CI";
  Charset2[Charset2["UTF16_SWEDISH_CI"] = 109] = "UTF16_SWEDISH_CI";
  Charset2[Charset2["UTF16_TURKISH_CI"] = 110] = "UTF16_TURKISH_CI";
  Charset2[Charset2["UTF16_CZECH_CI"] = 111] = "UTF16_CZECH_CI";
  Charset2[Charset2["UTF16_DANISH_CI"] = 112] = "UTF16_DANISH_CI";
  Charset2[Charset2["UTF16_LITHUANIAN_CI"] = 113] = "UTF16_LITHUANIAN_CI";
  Charset2[Charset2["UTF16_SLOVAK_CI"] = 114] = "UTF16_SLOVAK_CI";
  Charset2[Charset2["UTF16_SPANISH2_CI"] = 115] = "UTF16_SPANISH2_CI";
  Charset2[Charset2["UTF16_ROMAN_CI"] = 116] = "UTF16_ROMAN_CI";
  Charset2[Charset2["UTF16_PERSIAN_CI"] = 117] = "UTF16_PERSIAN_CI";
  Charset2[Charset2["UTF16_ESPERANTO_CI"] = 118] = "UTF16_ESPERANTO_CI";
  Charset2[Charset2["UTF16_HUNGARIAN_CI"] = 119] = "UTF16_HUNGARIAN_CI";
  Charset2[Charset2["UTF16_SINHALA_CI"] = 120] = "UTF16_SINHALA_CI";
  Charset2[Charset2["UTF16_GERMAN2_CI"] = 121] = "UTF16_GERMAN2_CI";
  Charset2[Charset2["UTF16_CROATIAN_MYSQL561_CI"] = 122] = "UTF16_CROATIAN_MYSQL561_CI";
  Charset2[Charset2["UTF16_UNICODE_520_CI"] = 123] = "UTF16_UNICODE_520_CI";
  Charset2[Charset2["UTF16_VIETNAMESE_CI"] = 124] = "UTF16_VIETNAMESE_CI";
  Charset2[Charset2["UCS2_UNICODE_CI"] = 128] = "UCS2_UNICODE_CI";
  Charset2[Charset2["UCS2_ICELANDIC_CI"] = 129] = "UCS2_ICELANDIC_CI";
  Charset2[Charset2["UCS2_LATVIAN_CI"] = 130] = "UCS2_LATVIAN_CI";
  Charset2[Charset2["UCS2_ROMANIAN_CI"] = 131] = "UCS2_ROMANIAN_CI";
  Charset2[Charset2["UCS2_SLOVENIAN_CI"] = 132] = "UCS2_SLOVENIAN_CI";
  Charset2[Charset2["UCS2_POLISH_CI"] = 133] = "UCS2_POLISH_CI";
  Charset2[Charset2["UCS2_ESTONIAN_CI"] = 134] = "UCS2_ESTONIAN_CI";
  Charset2[Charset2["UCS2_SPANISH_CI"] = 135] = "UCS2_SPANISH_CI";
  Charset2[Charset2["UCS2_SWEDISH_CI"] = 136] = "UCS2_SWEDISH_CI";
  Charset2[Charset2["UCS2_TURKISH_CI"] = 137] = "UCS2_TURKISH_CI";
  Charset2[Charset2["UCS2_CZECH_CI"] = 138] = "UCS2_CZECH_CI";
  Charset2[Charset2["UCS2_DANISH_CI"] = 139] = "UCS2_DANISH_CI";
  Charset2[Charset2["UCS2_LITHUANIAN_CI"] = 140] = "UCS2_LITHUANIAN_CI";
  Charset2[Charset2["UCS2_SLOVAK_CI"] = 141] = "UCS2_SLOVAK_CI";
  Charset2[Charset2["UCS2_SPANISH2_CI"] = 142] = "UCS2_SPANISH2_CI";
  Charset2[Charset2["UCS2_ROMAN_CI"] = 143] = "UCS2_ROMAN_CI";
  Charset2[Charset2["UCS2_PERSIAN_CI"] = 144] = "UCS2_PERSIAN_CI";
  Charset2[Charset2["UCS2_ESPERANTO_CI"] = 145] = "UCS2_ESPERANTO_CI";
  Charset2[Charset2["UCS2_HUNGARIAN_CI"] = 146] = "UCS2_HUNGARIAN_CI";
  Charset2[Charset2["UCS2_SINHALA_CI"] = 147] = "UCS2_SINHALA_CI";
  Charset2[Charset2["UCS2_GERMAN2_CI"] = 148] = "UCS2_GERMAN2_CI";
  Charset2[Charset2["UCS2_CROATIAN_MYSQL561_CI"] = 149] = "UCS2_CROATIAN_MYSQL561_CI";
  Charset2[Charset2["UCS2_UNICODE_520_CI"] = 150] = "UCS2_UNICODE_520_CI";
  Charset2[Charset2["UCS2_VIETNAMESE_CI"] = 151] = "UCS2_VIETNAMESE_CI";
  Charset2[Charset2["UCS2_GENERAL_MYSQL500_CI"] = 159] = "UCS2_GENERAL_MYSQL500_CI";
  Charset2[Charset2["UTF32_UNICODE_CI"] = 160] = "UTF32_UNICODE_CI";
  Charset2[Charset2["UTF32_ICELANDIC_CI"] = 161] = "UTF32_ICELANDIC_CI";
  Charset2[Charset2["UTF32_LATVIAN_CI"] = 162] = "UTF32_LATVIAN_CI";
  Charset2[Charset2["UTF32_ROMANIAN_CI"] = 163] = "UTF32_ROMANIAN_CI";
  Charset2[Charset2["UTF32_SLOVENIAN_CI"] = 164] = "UTF32_SLOVENIAN_CI";
  Charset2[Charset2["UTF32_POLISH_CI"] = 165] = "UTF32_POLISH_CI";
  Charset2[Charset2["UTF32_ESTONIAN_CI"] = 166] = "UTF32_ESTONIAN_CI";
  Charset2[Charset2["UTF32_SPANISH_CI"] = 167] = "UTF32_SPANISH_CI";
  Charset2[Charset2["UTF32_SWEDISH_CI"] = 168] = "UTF32_SWEDISH_CI";
  Charset2[Charset2["UTF32_TURKISH_CI"] = 169] = "UTF32_TURKISH_CI";
  Charset2[Charset2["UTF32_CZECH_CI"] = 170] = "UTF32_CZECH_CI";
  Charset2[Charset2["UTF32_DANISH_CI"] = 171] = "UTF32_DANISH_CI";
  Charset2[Charset2["UTF32_LITHUANIAN_CI"] = 172] = "UTF32_LITHUANIAN_CI";
  Charset2[Charset2["UTF32_SLOVAK_CI"] = 173] = "UTF32_SLOVAK_CI";
  Charset2[Charset2["UTF32_SPANISH2_CI"] = 174] = "UTF32_SPANISH2_CI";
  Charset2[Charset2["UTF32_ROMAN_CI"] = 175] = "UTF32_ROMAN_CI";
  Charset2[Charset2["UTF32_PERSIAN_CI"] = 176] = "UTF32_PERSIAN_CI";
  Charset2[Charset2["UTF32_ESPERANTO_CI"] = 177] = "UTF32_ESPERANTO_CI";
  Charset2[Charset2["UTF32_HUNGARIAN_CI"] = 178] = "UTF32_HUNGARIAN_CI";
  Charset2[Charset2["UTF32_SINHALA_CI"] = 179] = "UTF32_SINHALA_CI";
  Charset2[Charset2["UTF32_GERMAN2_CI"] = 180] = "UTF32_GERMAN2_CI";
  Charset2[Charset2["UTF32_CROATIAN_MYSQL561_CI"] = 181] = "UTF32_CROATIAN_MYSQL561_CI";
  Charset2[Charset2["UTF32_UNICODE_520_CI"] = 182] = "UTF32_UNICODE_520_CI";
  Charset2[Charset2["UTF32_VIETNAMESE_CI"] = 183] = "UTF32_VIETNAMESE_CI";
  Charset2[Charset2["UTF8_UNICODE_CI"] = 192] = "UTF8_UNICODE_CI";
  Charset2[Charset2["UTF8_ICELANDIC_CI"] = 193] = "UTF8_ICELANDIC_CI";
  Charset2[Charset2["UTF8_LATVIAN_CI"] = 194] = "UTF8_LATVIAN_CI";
  Charset2[Charset2["UTF8_ROMANIAN_CI"] = 195] = "UTF8_ROMANIAN_CI";
  Charset2[Charset2["UTF8_SLOVENIAN_CI"] = 196] = "UTF8_SLOVENIAN_CI";
  Charset2[Charset2["UTF8_POLISH_CI"] = 197] = "UTF8_POLISH_CI";
  Charset2[Charset2["UTF8_ESTONIAN_CI"] = 198] = "UTF8_ESTONIAN_CI";
  Charset2[Charset2["UTF8_SPANISH_CI"] = 199] = "UTF8_SPANISH_CI";
  Charset2[Charset2["UTF8_SWEDISH_CI"] = 200] = "UTF8_SWEDISH_CI";
  Charset2[Charset2["UTF8_TURKISH_CI"] = 201] = "UTF8_TURKISH_CI";
  Charset2[Charset2["UTF8_CZECH_CI"] = 202] = "UTF8_CZECH_CI";
  Charset2[Charset2["UTF8_DANISH_CI"] = 203] = "UTF8_DANISH_CI";
  Charset2[Charset2["UTF8_LITHUANIAN_CI"] = 204] = "UTF8_LITHUANIAN_CI";
  Charset2[Charset2["UTF8_SLOVAK_CI"] = 205] = "UTF8_SLOVAK_CI";
  Charset2[Charset2["UTF8_SPANISH2_CI"] = 206] = "UTF8_SPANISH2_CI";
  Charset2[Charset2["UTF8_ROMAN_CI"] = 207] = "UTF8_ROMAN_CI";
  Charset2[Charset2["UTF8_PERSIAN_CI"] = 208] = "UTF8_PERSIAN_CI";
  Charset2[Charset2["UTF8_ESPERANTO_CI"] = 209] = "UTF8_ESPERANTO_CI";
  Charset2[Charset2["UTF8_HUNGARIAN_CI"] = 210] = "UTF8_HUNGARIAN_CI";
  Charset2[Charset2["UTF8_SINHALA_CI"] = 211] = "UTF8_SINHALA_CI";
  Charset2[Charset2["UTF8_GERMAN2_CI"] = 212] = "UTF8_GERMAN2_CI";
  Charset2[Charset2["UTF8_CROATIAN_MYSQL561_CI"] = 213] = "UTF8_CROATIAN_MYSQL561_CI";
  Charset2[Charset2["UTF8_UNICODE_520_CI"] = 214] = "UTF8_UNICODE_520_CI";
  Charset2[Charset2["UTF8_VIETNAMESE_CI"] = 215] = "UTF8_VIETNAMESE_CI";
  Charset2[Charset2["UTF8_GENERAL_MYSQL500_CI"] = 223] = "UTF8_GENERAL_MYSQL500_CI";
  Charset2[Charset2["UTF8MB4_UNICODE_CI"] = 224] = "UTF8MB4_UNICODE_CI";
  Charset2[Charset2["UTF8MB4_ICELANDIC_CI"] = 225] = "UTF8MB4_ICELANDIC_CI";
  Charset2[Charset2["UTF8MB4_LATVIAN_CI"] = 226] = "UTF8MB4_LATVIAN_CI";
  Charset2[Charset2["UTF8MB4_ROMANIAN_CI"] = 227] = "UTF8MB4_ROMANIAN_CI";
  Charset2[Charset2["UTF8MB4_SLOVENIAN_CI"] = 228] = "UTF8MB4_SLOVENIAN_CI";
  Charset2[Charset2["UTF8MB4_POLISH_CI"] = 229] = "UTF8MB4_POLISH_CI";
  Charset2[Charset2["UTF8MB4_ESTONIAN_CI"] = 230] = "UTF8MB4_ESTONIAN_CI";
  Charset2[Charset2["UTF8MB4_SPANISH_CI"] = 231] = "UTF8MB4_SPANISH_CI";
  Charset2[Charset2["UTF8MB4_SWEDISH_CI"] = 232] = "UTF8MB4_SWEDISH_CI";
  Charset2[Charset2["UTF8MB4_TURKISH_CI"] = 233] = "UTF8MB4_TURKISH_CI";
  Charset2[Charset2["UTF8MB4_CZECH_CI"] = 234] = "UTF8MB4_CZECH_CI";
  Charset2[Charset2["UTF8MB4_DANISH_CI"] = 235] = "UTF8MB4_DANISH_CI";
  Charset2[Charset2["UTF8MB4_LITHUANIAN_CI"] = 236] = "UTF8MB4_LITHUANIAN_CI";
  Charset2[Charset2["UTF8MB4_SLOVAK_CI"] = 237] = "UTF8MB4_SLOVAK_CI";
  Charset2[Charset2["UTF8MB4_SPANISH2_CI"] = 238] = "UTF8MB4_SPANISH2_CI";
  Charset2[Charset2["UTF8MB4_ROMAN_CI"] = 239] = "UTF8MB4_ROMAN_CI";
  Charset2[Charset2["UTF8MB4_PERSIAN_CI"] = 240] = "UTF8MB4_PERSIAN_CI";
  Charset2[Charset2["UTF8MB4_ESPERANTO_CI"] = 241] = "UTF8MB4_ESPERANTO_CI";
  Charset2[Charset2["UTF8MB4_HUNGARIAN_CI"] = 242] = "UTF8MB4_HUNGARIAN_CI";
  Charset2[Charset2["UTF8MB4_SINHALA_CI"] = 243] = "UTF8MB4_SINHALA_CI";
  Charset2[Charset2["UTF8MB4_GERMAN2_CI"] = 244] = "UTF8MB4_GERMAN2_CI";
  Charset2[Charset2["UTF8MB4_CROATIAN_MYSQL561_CI"] = 245] = "UTF8MB4_CROATIAN_MYSQL561_CI";
  Charset2[Charset2["UTF8MB4_UNICODE_520_CI"] = 246] = "UTF8MB4_UNICODE_520_CI";
  Charset2[Charset2["UTF8MB4_VIETNAMESE_CI"] = 247] = "UTF8MB4_VIETNAMESE_CI";
  Charset2[Charset2["UTF8_GENERAL50_CI"] = 253] = "UTF8_GENERAL50_CI";
  Charset2[Charset2["ARMSCII8"] = 32] = "ARMSCII8";
  Charset2[Charset2["ASCII"] = 11] = "ASCII";
  Charset2[Charset2["BIG5"] = 1] = "BIG5";
  Charset2[Charset2["CP1250"] = 26] = "CP1250";
  Charset2[Charset2["CP1251"] = 51] = "CP1251";
  Charset2[Charset2["CP1256"] = 57] = "CP1256";
  Charset2[Charset2["CP1257"] = 59] = "CP1257";
  Charset2[Charset2["CP866"] = 36] = "CP866";
  Charset2[Charset2["CP850"] = 4] = "CP850";
  Charset2[Charset2["CP852"] = 40] = "CP852";
  Charset2[Charset2["CP932"] = 95] = "CP932";
  Charset2[Charset2["DEC8"] = 3] = "DEC8";
  Charset2[Charset2["EUCJPMS"] = 97] = "EUCJPMS";
  Charset2[Charset2["EUCKR"] = 19] = "EUCKR";
  Charset2[Charset2["GB2312"] = 24] = "GB2312";
  Charset2[Charset2["GBK"] = 28] = "GBK";
  Charset2[Charset2["GEOSTD8"] = 92] = "GEOSTD8";
  Charset2[Charset2["GREEK"] = 25] = "GREEK";
  Charset2[Charset2["HEBREW"] = 16] = "HEBREW";
  Charset2[Charset2["HP8"] = 6] = "HP8";
  Charset2[Charset2["KEYBCS2"] = 37] = "KEYBCS2";
  Charset2[Charset2["KOI8R"] = 7] = "KOI8R";
  Charset2[Charset2["KOI8U"] = 22] = "KOI8U";
  Charset2[Charset2["LATIN1"] = 8] = "LATIN1";
  Charset2[Charset2["LATIN2"] = 9] = "LATIN2";
  Charset2[Charset2["LATIN5"] = 30] = "LATIN5";
  Charset2[Charset2["LATIN7"] = 41] = "LATIN7";
  Charset2[Charset2["MACCE"] = 38] = "MACCE";
  Charset2[Charset2["MACROMAN"] = 39] = "MACROMAN";
  Charset2[Charset2["SJIS"] = 13] = "SJIS";
  Charset2[Charset2["SWE7"] = 10] = "SWE7";
  Charset2[Charset2["TIS620"] = 18] = "TIS620";
  Charset2[Charset2["UCS2"] = 35] = "UCS2";
  Charset2[Charset2["UJIS"] = 12] = "UJIS";
  Charset2[Charset2["UTF16"] = 54] = "UTF16";
  Charset2[Charset2["UTF16LE"] = 56] = "UTF16LE";
  Charset2[Charset2["UTF8"] = 33] = "UTF8";
  Charset2[Charset2["UTF8MB4"] = 45] = "UTF8MB4";
  Charset2[Charset2["UTF32"] = 60] = "UTF32";
  return Charset2;
}({});

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/builders/client_capabilities.ts
function clientCapabilities(packet, params) {
  return (params.db ? capabilities_default.CLIENT_CONNECT_WITH_DB : 0) | capabilities_default.CLIENT_PLUGIN_AUTH | capabilities_default.CLIENT_LONG_PASSWORD | capabilities_default.CLIENT_PROTOCOL_41 | capabilities_default.CLIENT_TRANSACTIONS | capabilities_default.CLIENT_MULTI_RESULTS | capabilities_default.CLIENT_SECURE_CONNECTION | capabilities_default.CLIENT_LONG_FLAG & packet.serverCapabilities | capabilities_default.CLIENT_PLUGIN_AUTH_LENENC_CLIENT_DATA & packet.serverCapabilities | capabilities_default.CLIENT_DEPRECATE_EOF & packet.serverCapabilities | (params.ssl ? capabilities_default.CLIENT_SSL : 0);
}

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/builders/auth.ts
function buildAuth(packet, params) {
  const clientParam = clientCapabilities(packet, params);
  if (packet.serverCapabilities & capabilities_default.CLIENT_PLUGIN_AUTH) {
    const writer = new BufferWriter(new Uint8Array(1e3));
    writer.writeUint32(clientParam).writeUint32(2 ** 24 - 1).write(Charset.UTF8_GENERAL_CI).skip(23).writeNullTerminatedString(params.username);
    if (params.password) {
      const authData = auth(packet.authPluginName, params.password, packet.seed);
      if (clientParam & capabilities_default.CLIENT_PLUGIN_AUTH_LENENC_CLIENT_DATA || clientParam & capabilities_default.CLIENT_SECURE_CONNECTION) {
        writer.write(authData.length);
        writer.writeBuffer(authData);
      } else {
        writer.writeBuffer(authData);
        writer.write(0);
      }
    } else {
      writer.write(0);
    }
    if (clientParam & capabilities_default.CLIENT_CONNECT_WITH_DB && params.db) {
      writer.writeNullTerminatedString(params.db);
    }
    if (clientParam & capabilities_default.CLIENT_PLUGIN_AUTH) {
      writer.writeNullTerminatedString(packet.authPluginName);
    }
    return writer.wroteData;
  }
  return Uint8Array.from([]);
}

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/builders/query.ts
function buildQuery(sql, params = []) {
  const data = encode3(replaceParams(sql, params));
  const writer = new BufferWriter(new Uint8Array(data.length + 1));
  writer.write(3);
  writer.writeBuffer(data);
  return writer.buffer;
}

// deno:https://deno.land/x/mysql@v2.12.1/src/constant/packet.ts
var PacketType = /* @__PURE__ */ function(PacketType2) {
  PacketType2[PacketType2["OK_Packet"] = 0] = "OK_Packet";
  PacketType2[PacketType2["EOF_Packet"] = 254] = "EOF_Packet";
  PacketType2[PacketType2["ERR_Packet"] = 255] = "ERR_Packet";
  PacketType2[PacketType2["Result"] = 256] = "Result";
  return PacketType2;
}({});

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/packet.ts
var SendPacket = class {
  body;
  header;
  constructor(body, no) {
    this.body = body;
    this.header = {
      size: body.length,
      no
    };
  }
  async send(conn) {
    const body = this.body;
    const data = new BufferWriter(new Uint8Array(4 + body.length));
    data.writeUints(3, this.header.size);
    data.write(this.header.no);
    data.writeBuffer(body);
    logger.debug(`send: ${data.length}B 
${format(data.buffer)}
`);
    try {
      let wrote = 0;
      do {
        wrote += await conn.write(data.buffer.subarray(wrote));
      } while (wrote < data.length);
    } catch (error2) {
      throw new WriteError(error2.message);
    }
  }
};
var ReceivePacket = class {
  header;
  body;
  type;
  async parse(reader) {
    const header = new BufferReader(new Uint8Array(4));
    let readCount = 0;
    let nread = await this.read(reader, header.buffer);
    if (nread === null) return null;
    readCount = nread;
    const bodySize = header.readUints(3);
    this.header = {
      size: bodySize,
      no: header.readUint8()
    };
    this.body = new BufferReader(new Uint8Array(bodySize));
    nread = await this.read(reader, this.body.buffer);
    if (nread === null) return null;
    readCount += nread;
    const { OK_Packet, ERR_Packet, EOF_Packet, Result } = PacketType;
    switch (this.body.buffer[0]) {
      case OK_Packet:
        this.type = OK_Packet;
        break;
      case 255:
        this.type = ERR_Packet;
        break;
      case 254:
        this.type = EOF_Packet;
        break;
      default:
        this.type = Result;
        break;
    }
    debug2(() => {
      const data = new Uint8Array(readCount);
      data.set(header.buffer);
      data.set(this.body.buffer, 4);
      logger.debug(`receive: ${readCount}B, size = ${this.header.size}, no = ${this.header.no} 
${format(data)}
`);
    });
    return this;
  }
  async read(reader, buffer) {
    const size = buffer.length;
    let haveRead = 0;
    while (haveRead < size) {
      const nread = await reader.read(buffer.subarray(haveRead));
      if (nread === null) return null;
      haveRead += nread;
    }
    return haveRead;
  }
};

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/parsers/err.ts
function parseError(reader, conn) {
  const code3 = reader.readUint16();
  const packet = {
    code: code3,
    message: ""
  };
  if (conn.capabilities & capabilities_default.CLIENT_PROTOCOL_41) {
    packet.sqlStateMarker = reader.readUint8();
    packet.sqlState = reader.readUints(5);
  }
  packet.message = reader.readNullTerminatedString();
  return packet;
}

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/parsers/handshake.ts
function parseHandshake(reader) {
  const protocolVersion = reader.readUint8();
  const serverVersion = reader.readNullTerminatedString();
  const threadId = reader.readUint32();
  const seedWriter = new BufferWriter(new Uint8Array(20));
  seedWriter.writeBuffer(reader.readBuffer(8));
  reader.skip(1);
  let serverCapabilities = reader.readUint16();
  let characterSet = 0, statusFlags = 0, authPluginDataLength = 0, authPluginName = "";
  if (!reader.finished) {
    characterSet = reader.readUint8();
    statusFlags = reader.readUint16();
    serverCapabilities |= reader.readUint16() << 16;
    if ((serverCapabilities & capabilities_default.CLIENT_PLUGIN_AUTH) != 0) {
      authPluginDataLength = reader.readUint8();
    } else {
      reader.skip(1);
    }
    reader.skip(10);
    if ((serverCapabilities & capabilities_default.CLIENT_SECURE_CONNECTION) != 0) {
      seedWriter.writeBuffer(reader.readBuffer(Math.max(13, authPluginDataLength - 8)));
    }
    if ((serverCapabilities & capabilities_default.CLIENT_PLUGIN_AUTH) != 0) {
      authPluginName = reader.readNullTerminatedString();
    }
  }
  return {
    protocolVersion,
    serverVersion,
    threadId,
    seed: seedWriter.buffer,
    serverCapabilities,
    characterSet,
    statusFlags,
    authPluginName
  };
}
var AuthResult = /* @__PURE__ */ function(AuthResult2) {
  AuthResult2[AuthResult2["AuthPassed"] = 0] = "AuthPassed";
  AuthResult2[AuthResult2["MethodMismatch"] = 1] = "MethodMismatch";
  AuthResult2[AuthResult2["AuthMoreRequired"] = 2] = "AuthMoreRequired";
  return AuthResult2;
}({});
function parseAuth(packet) {
  switch (packet.type) {
    case PacketType.EOF_Packet:
      return AuthResult.MethodMismatch;
    case PacketType.Result:
      return AuthResult.AuthMoreRequired;
    case PacketType.OK_Packet:
      return AuthResult.AuthPassed;
    default:
      return AuthResult.AuthPassed;
  }
}

// deno:https://deno.land/x/mysql@v2.12.1/src/constant/mysql_types.ts
var MYSQL_TYPE_DECIMAL = 0;
var MYSQL_TYPE_TINY = 1;
var MYSQL_TYPE_SHORT = 2;
var MYSQL_TYPE_LONG = 3;
var MYSQL_TYPE_FLOAT = 4;
var MYSQL_TYPE_DOUBLE = 5;
var MYSQL_TYPE_TIMESTAMP = 7;
var MYSQL_TYPE_LONGLONG = 8;
var MYSQL_TYPE_INT24 = 9;
var MYSQL_TYPE_DATE = 10;
var MYSQL_TYPE_TIME = 11;
var MYSQL_TYPE_DATETIME = 12;
var MYSQL_TYPE_NEWDATE = 14;
var MYSQL_TYPE_VARCHAR = 15;
var MYSQL_TYPE_TIMESTAMP2 = 17;
var MYSQL_TYPE_DATETIME2 = 18;
var MYSQL_TYPE_TIME2 = 19;
var MYSQL_TYPE_NEWDECIMAL = 246;
var MYSQL_TYPE_VAR_STRING = 253;
var MYSQL_TYPE_STRING = 254;

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/parsers/result.ts
function parseField(reader) {
  const catalog = reader.readLenCodeString();
  const schema = reader.readLenCodeString();
  const table = reader.readLenCodeString();
  const originTable = reader.readLenCodeString();
  const name = reader.readLenCodeString();
  const originName = reader.readLenCodeString();
  reader.skip(1);
  const encoding = reader.readUint16();
  const fieldLen = reader.readUint32();
  const fieldType = reader.readUint8();
  const fieldFlag = reader.readUint16();
  const decimals = reader.readUint8();
  reader.skip(1);
  const defaultVal = reader.readLenCodeString();
  return {
    catalog,
    schema,
    table,
    originName,
    fieldFlag,
    originTable,
    fieldLen,
    name,
    fieldType,
    encoding,
    decimals,
    defaultVal
  };
}
function parseRow(reader, fields) {
  const row = {};
  for (const field of fields) {
    const name = field.name;
    const val = reader.readLenCodeString();
    row[name] = val === null ? null : convertType(field, val);
  }
  return row;
}
function convertType(field, val) {
  const { fieldType, fieldLen } = field;
  switch (fieldType) {
    case MYSQL_TYPE_DECIMAL:
    case MYSQL_TYPE_DOUBLE:
    case MYSQL_TYPE_FLOAT:
    case MYSQL_TYPE_DATETIME2:
      return parseFloat(val);
    case MYSQL_TYPE_NEWDECIMAL:
      return val;
    // #42 MySQL's decimal type cannot be accurately represented by the Number.
    case MYSQL_TYPE_TINY:
    case MYSQL_TYPE_SHORT:
    case MYSQL_TYPE_LONG:
    case MYSQL_TYPE_INT24:
      return parseInt(val);
    case MYSQL_TYPE_LONGLONG:
      if (Number(val) < Number.MIN_SAFE_INTEGER || Number(val) > Number.MAX_SAFE_INTEGER) {
        return BigInt(val);
      } else {
        return parseInt(val);
      }
    case MYSQL_TYPE_VARCHAR:
    case MYSQL_TYPE_VAR_STRING:
    case MYSQL_TYPE_STRING:
    case MYSQL_TYPE_TIME:
    case MYSQL_TYPE_TIME2:
      return val;
    case MYSQL_TYPE_DATE:
    case MYSQL_TYPE_TIMESTAMP:
    case MYSQL_TYPE_DATETIME:
    case MYSQL_TYPE_NEWDATE:
    case MYSQL_TYPE_TIMESTAMP2:
    case MYSQL_TYPE_DATETIME2:
      return new Date(val);
    default:
      return val;
  }
}

// deno:https://deno.land/x/mysql@v2.12.1/src/auth_plugin/caching_sha2_password.ts
var caching_sha2_password_exports = {};
__export(caching_sha2_password_exports, {
  start: () => start
});

// deno:https://deno.land/x/mysql@v2.12.1/src/auth_plugin/crypt.ts
async function encryptWithPublicKey(key, data) {
  const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
  const pemFooter = "\n-----END PUBLIC KEY-----";
  key = key.trim();
  key = key.substring(pemHeader.length, key.length - pemFooter.length);
  const importedKey = await crypto.subtle.importKey("spki", decode(key), {
    name: "RSA-OAEP",
    hash: "SHA-256"
  }, false, [
    "encrypt"
  ]);
  return await crypto.subtle.encrypt({
    name: "RSA-OAEP"
  }, importedKey, data);
}

// deno:https://deno.land/x/mysql@v2.12.1/src/auth_plugin/caching_sha2_password.ts
var scramble;
var password;
async function start(scramble_, password_) {
  scramble = scramble_;
  password = password_;
  return {
    done: false,
    next: authMoreResponse
  };
}
async function authMoreResponse(packet) {
  const REQUEST_PUBLIC_KEY = 2;
  const statusFlag = packet.body.skip(1).readUint8();
  let authMoreData, done = true, next, quickRead = false;
  if (statusFlag === 4) {
    authMoreData = new Uint8Array([
      REQUEST_PUBLIC_KEY
    ]);
    done = false;
    next = encryptWithKey;
  }
  if (statusFlag === 3) {
    done = false;
    quickRead = true;
    next = terminate;
  }
  return {
    done,
    next,
    quickRead,
    data: authMoreData
  };
}
async function encryptWithKey(packet) {
  const publicKey = parsePublicKey(packet);
  const len = password.length;
  const passwordBuffer = new Uint8Array(len + 1);
  for (let n = 0; n < len; n++) {
    passwordBuffer[n] = password.charCodeAt(n);
  }
  passwordBuffer[len] = 0;
  const encryptedPassword = await encrypt(passwordBuffer, scramble, publicKey);
  return {
    done: false,
    next: terminate,
    data: new Uint8Array(encryptedPassword)
  };
}
function parsePublicKey(packet) {
  return packet.body.skip(1).readNullTerminatedString();
}
async function encrypt(password2, scramble2, key) {
  const stage1 = xor(password2, scramble2);
  return await encryptWithPublicKey(key, stage1);
}
function terminate() {
  return {
    done: true
  };
}

// deno:https://deno.land/x/mysql@v2.12.1/src/auth_plugin/index.ts
var auth_plugin_default = {
  caching_sha2_password: caching_sha2_password_exports
};

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/parsers/authswitch.ts
function parseAuthSwitch(reader) {
  const status = reader.readUint8();
  const authPluginName = reader.readNullTerminatedString();
  const authPluginData = reader.readRestOfPacketString();
  return {
    status,
    authPluginName,
    authPluginData
  };
}

// deno:https://deno.land/x/mysql@v2.12.1/src/packets/builders/tls.ts
function buildSSLRequest(packet, params) {
  const clientParam = clientCapabilities(packet, {
    db: params.db,
    ssl: true
  });
  const writer = new BufferWriter(new Uint8Array(32));
  writer.writeUint32(clientParam).writeUint32(2 ** 24 - 1).write(Charset.UTF8_GENERAL_CI).skip(23);
  return writer.wroteData;
}

// deno:https://deno.land/x/mysql@v2.12.1/src/connection.ts
var ConnectionState = /* @__PURE__ */ function(ConnectionState2) {
  ConnectionState2[ConnectionState2["CONNECTING"] = 0] = "CONNECTING";
  ConnectionState2[ConnectionState2["CONNECTED"] = 1] = "CONNECTED";
  ConnectionState2[ConnectionState2["CLOSING"] = 2] = "CLOSING";
  ConnectionState2[ConnectionState2["CLOSED"] = 3] = "CLOSED";
  return ConnectionState2;
}({});
var Connection = class {
  config;
  state;
  capabilities;
  serverVersion;
  conn;
  _timedOut;
  get remoteAddr() {
    return this.config.socketPath ? `unix:${this.config.socketPath}` : `${this.config.hostname}:${this.config.port}`;
  }
  constructor(config) {
    this.config = config;
    this.state = ConnectionState.CONNECTING;
    this.capabilities = 0;
    this.serverVersion = "";
    this.conn = void 0;
    this._timedOut = false;
    this._timeoutCallback = () => {
      logger.info("connection read timed out");
      this._timedOut = true;
      this.close();
    };
  }
  async _connect() {
    if (this.config.tls?.mode && this.config.tls.mode !== TLSMode.DISABLED && this.config.tls.mode !== TLSMode.VERIFY_IDENTITY) {
      throw new Error("unsupported tls mode");
    }
    const { hostname, port = 3306, socketPath, username = "", password: password2 } = this.config;
    logger.info(`connecting ${this.remoteAddr}`);
    this.conn = !socketPath ? await Deno.connect({
      transport: "tcp",
      hostname,
      port
    }) : await Deno.connect({
      transport: "unix",
      path: socketPath
    });
    try {
      let receive = await this.nextPacket();
      const handshakePacket = parseHandshake(receive.body);
      let handshakeSequenceNumber = receive.header.no;
      let isSSL = false;
      if (this.config.tls?.mode === TLSMode.VERIFY_IDENTITY) {
        if ((handshakePacket.serverCapabilities & capabilities_default.CLIENT_SSL) === 0) {
          throw new Error("Server does not support TLS");
        }
        if ((handshakePacket.serverCapabilities & capabilities_default.CLIENT_SSL) !== 0) {
          const tlsData = buildSSLRequest(handshakePacket, {
            db: this.config.db
          });
          await new SendPacket(tlsData, ++handshakeSequenceNumber).send(this.conn);
          this.conn = await Deno.startTls(this.conn, {
            hostname,
            caCerts: this.config.tls?.caCerts
          });
        }
        isSSL = true;
      }
      const data = buildAuth(handshakePacket, {
        username,
        password: password2,
        db: this.config.db,
        ssl: isSSL
      });
      await new SendPacket(data, ++handshakeSequenceNumber).send(this.conn);
      this.state = ConnectionState.CONNECTING;
      this.serverVersion = handshakePacket.serverVersion;
      this.capabilities = handshakePacket.serverCapabilities;
      receive = await this.nextPacket();
      const authResult = parseAuth(receive);
      let handler;
      switch (authResult) {
        case AuthResult.AuthMoreRequired:
          const adaptedPlugin = auth_plugin_default[handshakePacket.authPluginName];
          handler = adaptedPlugin;
          break;
        case AuthResult.MethodMismatch:
          const authSwitch = parseAuthSwitch(receive.body);
          if (authSwitch.authPluginData === void 0 || authSwitch.authPluginData.length === 0) {
            authSwitch.authPluginData = handshakePacket.seed;
          }
          let authData;
          if (password2) {
            authData = auth(authSwitch.authPluginName, password2, authSwitch.authPluginData);
          } else {
            authData = Uint8Array.from([]);
          }
          await new SendPacket(authData, receive.header.no + 1).send(this.conn);
          receive = await this.nextPacket();
          const authSwitch2 = parseAuthSwitch(receive.body);
          if (authSwitch2.authPluginName !== "") {
            throw new Error("Do not allow to change the auth plugin more than once!");
          }
      }
      let result;
      if (handler) {
        result = await handler.start(handshakePacket.seed, password2);
        while (!result.done) {
          if (result.data) {
            const sequenceNumber = receive.header.no + 1;
            await new SendPacket(result.data, sequenceNumber).send(this.conn);
            receive = await this.nextPacket();
          }
          if (result.quickRead) {
            await this.nextPacket();
          }
          if (result.next) {
            result = await result.next(receive);
          }
        }
      }
      const header = receive.body.readUint8();
      if (header === 255) {
        const error2 = parseError(receive.body, this);
        logger.error(`connect error(${error2.code}): ${error2.message}`);
        this.close();
        throw new Error(error2.message);
      } else {
        logger.info(`connected to ${this.remoteAddr}`);
        this.state = ConnectionState.CONNECTED;
      }
      if (this.config.charset) {
        await this.execute(`SET NAMES ${this.config.charset}`);
      }
    } catch (error2) {
      this.close();
      throw error2;
    }
  }
  /** Connect to database */
  async connect() {
    await this._connect();
  }
  async nextPacket() {
    if (!this.conn) {
      throw new ConnnectionError("Not connected");
    }
    const timeoutTimer = this.config.timeout ? setTimeout(this._timeoutCallback, this.config.timeout) : null;
    let packet;
    try {
      packet = await new ReceivePacket().parse(this.conn);
    } catch (error2) {
      if (this._timedOut) {
        throw new ResponseTimeoutError("Connection read timed out");
      }
      timeoutTimer && clearTimeout(timeoutTimer);
      this.close();
      throw error2;
    }
    timeoutTimer && clearTimeout(timeoutTimer);
    if (!packet) {
      this.close();
      throw new ReadError("Connection closed unexpectedly");
    }
    if (packet.type === PacketType.ERR_Packet) {
      packet.body.skip(1);
      const error2 = parseError(packet.body, this);
      throw new Error(error2.message);
    }
    return packet;
  }
  _timeoutCallback;
  /** Close database connection */
  close() {
    if (this.state != ConnectionState.CLOSED) {
      logger.info("close connection");
      this.conn?.close();
      this.state = ConnectionState.CLOSED;
    }
  }
  /**
   * excute query sql
   * @param sql query sql string
   * @param params query params
   */
  async query(sql, params) {
    const result = await this.execute(sql, params);
    if (result && result.rows) {
      return result.rows;
    } else {
      return result;
    }
  }
  /**
   * execute sql
   * @param sql sql string
   * @param params query params
   * @param iterator whether to return an ExecuteIteratorResult or ExecuteResult
   */
  async execute(sql, params, iterator = false) {
    if (this.state != ConnectionState.CONNECTED) {
      if (this.state == ConnectionState.CLOSED) {
        throw new ConnnectionError("Connection is closed");
      } else {
        throw new ConnnectionError("Must be connected first");
      }
    }
    const data = buildQuery(sql, params);
    try {
      await new SendPacket(data, 0).send(this.conn);
      let receive = await this.nextPacket();
      if (receive.type === PacketType.OK_Packet) {
        receive.body.skip(1);
        return {
          affectedRows: receive.body.readEncodedLen(),
          lastInsertId: receive.body.readEncodedLen()
        };
      } else if (receive.type !== PacketType.Result) {
        throw new ProtocolError();
      }
      let fieldCount = receive.body.readEncodedLen();
      const fields = [];
      while (fieldCount--) {
        const packet = await this.nextPacket();
        if (packet) {
          const field = parseField(packet.body);
          fields.push(field);
        }
      }
      const rows = [];
      if (!(this.capabilities & capabilities_default.CLIENT_DEPRECATE_EOF)) {
        receive = await this.nextPacket();
        if (receive.type !== PacketType.EOF_Packet) {
          throw new ProtocolError();
        }
      }
      if (!iterator) {
        while (true) {
          receive = await this.nextPacket();
          if (receive.type === PacketType.EOF_Packet) {
            break;
          } else {
            const row = parseRow(receive.body, fields);
            rows.push(row);
          }
        }
        return {
          rows,
          fields
        };
      }
      return {
        fields,
        iterator: this.buildIterator(fields)
      };
    } catch (error2) {
      this.close();
      throw error2;
    }
  }
  buildIterator(fields) {
    const next = async () => {
      const receive = await this.nextPacket();
      if (receive.type === PacketType.EOF_Packet) {
        return {
          done: true
        };
      }
      const value = parseRow(receive.body, fields);
      return {
        done: false,
        value
      };
    };
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next
        };
      }
    };
  }
};

// deno:https://deno.land/x/mysql@v2.12.1/src/deferred.ts
var DeferredStack = class {
  _maxSize;
  _array;
  creator;
  _queue;
  _size;
  constructor(_maxSize, _array = [], creator) {
    this._maxSize = _maxSize;
    this._array = _array;
    this.creator = creator;
    this._queue = [];
    this._size = 0;
    this._size = _array.length;
  }
  get size() {
    return this._size;
  }
  get maxSize() {
    return this._maxSize;
  }
  get available() {
    return this._array.length;
  }
  async pop() {
    if (this._array.length) {
      return this._array.pop();
    } else if (this._size < this._maxSize) {
      this._size++;
      let item;
      try {
        item = await this.creator();
      } catch (err) {
        this._size--;
        throw err;
      }
      return item;
    }
    const defer = deferred();
    this._queue.push(defer);
    return await defer;
  }
  /** Returns false if the item is consumed by a deferred pop */
  push(item) {
    if (this._queue.length) {
      this._queue.shift().resolve(item);
      return false;
    } else {
      this._array.push(item);
      return true;
    }
  }
  tryPopAvailable() {
    return this._array.pop();
  }
  remove(item) {
    const index = this._array.indexOf(item);
    if (index < 0) return false;
    this._array.splice(index, 1);
    this._size--;
    return true;
  }
  reduceSize() {
    this._size--;
  }
};

// deno:https://deno.land/x/mysql@v2.12.1/src/pool.ts
var PoolConnection = class extends Connection {
  _pool = void 0;
  _idleTimer = void 0;
  _idle = false;
  /**
   * Should be called by the pool.
   */
  enterIdle() {
    this._idle = true;
    if (this.config.idleTimeout) {
      this._idleTimer = setTimeout(() => {
        logger.info("connection idle timeout");
        this._pool.remove(this);
        try {
          this.close();
        } catch (error2) {
          logger.warning(`error closing idle connection`, error2);
        }
      }, this.config.idleTimeout);
      try {
        Deno.unrefTimer(this._idleTimer);
      } catch (_error) {
      }
    }
  }
  /**
   * Should be called by the pool.
   */
  exitIdle() {
    this._idle = false;
    if (this._idleTimer !== void 0) {
      clearTimeout(this._idleTimer);
    }
  }
  /**
   * Remove the connection from the pool permanently, when the connection is not usable.
   */
  removeFromPool() {
    this._pool.reduceSize();
    this._pool = void 0;
  }
  returnToPool() {
    this._pool?.push(this);
  }
};
var ConnectionPool = class {
  _deferred;
  _connections = [];
  _closed = false;
  constructor(maxSize, creator) {
    this._deferred = new DeferredStack(maxSize, this._connections, async () => {
      const conn = await creator();
      conn._pool = this;
      return conn;
    });
  }
  get info() {
    return {
      size: this._deferred.size,
      maxSize: this._deferred.maxSize,
      available: this._deferred.available
    };
  }
  push(conn) {
    if (this._closed) {
      conn.close();
      this.reduceSize();
    }
    if (this._deferred.push(conn)) {
      conn.enterIdle();
    }
  }
  async pop() {
    if (this._closed) {
      throw new Error("Connection pool is closed");
    }
    let conn = this._deferred.tryPopAvailable();
    if (conn) {
      conn.exitIdle();
    } else {
      conn = await this._deferred.pop();
    }
    return conn;
  }
  remove(conn) {
    return this._deferred.remove(conn);
  }
  /**
   * Close the pool and all connections in the pool.
   *
   * After closing, pop() will throw an error,
   * push() will close the connection immediately.
   */
  close() {
    this._closed = true;
    let conn;
    while (conn = this._deferred.tryPopAvailable()) {
      conn.exitIdle();
      conn.close();
      this.reduceSize();
    }
  }
  reduceSize() {
    this._deferred.reduceSize();
  }
};

// deno:https://deno.land/x/mysql@v2.12.1/src/client.ts
var TLSMode = /* @__PURE__ */ function(TLSMode2) {
  TLSMode2["DISABLED"] = "disabled";
  TLSMode2["VERIFY_IDENTITY"] = "verify_identity";
  return TLSMode2;
}({});
var Client = class {
  config = {};
  _pool;
  async createConnection() {
    let connection = new PoolConnection(this.config);
    await connection.connect();
    return connection;
  }
  /** get pool info */
  get pool() {
    return this._pool?.info;
  }
  /**
   * connect to database
   * @param config config for client
   * @returns Client instance
   */
  async connect(config) {
    this.config = {
      hostname: "127.0.0.1",
      username: "root",
      port: 3306,
      poolSize: 1,
      timeout: 30 * 1e3,
      idleTimeout: 4 * 3600 * 1e3,
      ...config
    };
    Object.freeze(this.config);
    this._pool = new ConnectionPool(this.config.poolSize || 10, this.createConnection.bind(this));
    return this;
  }
  /**
   * execute query sql
   * @param sql query sql string
   * @param params query params
   */
  async query(sql, params) {
    return await this.useConnection(async (connection) => {
      return await connection.query(sql, params);
    });
  }
  /**
   * execute sql
   * @param sql sql string
   * @param params query params
   */
  async execute(sql, params) {
    return await this.useConnection(async (connection) => {
      return await connection.execute(sql, params);
    });
  }
  async useConnection(fn) {
    if (!this._pool) {
      throw new Error("Unconnected");
    }
    const connection = await this._pool.pop();
    try {
      return await fn(connection);
    } finally {
      if (connection.state == ConnectionState.CLOSED) {
        connection.removeFromPool();
      } else {
        connection.returnToPool();
      }
    }
  }
  /**
   * Execute a transaction process, and the transaction successfully
   * returns the return value of the transaction process
   * @param processor transation processor
   */
  async transaction(processor) {
    return await this.useConnection(async (connection) => {
      try {
        await connection.execute("BEGIN");
        const result = await processor(connection);
        await connection.execute("COMMIT");
        return result;
      } catch (error2) {
        if (connection.state == ConnectionState.CONNECTED) {
          logger.info(`ROLLBACK: ${error2.message}`);
          await connection.execute("ROLLBACK");
        }
        throw error2;
      }
    });
  }
  /**
   * close connection
   */
  async close() {
    if (this._pool) {
      this._pool.close();
      this._pool = void 0;
    }
  }
};
export {
  Client,
  TLSMode
};
