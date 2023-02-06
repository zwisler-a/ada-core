(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // openapi-typescript-codegen/core/ApiError.ts
  var ApiError = class extends Error {
    constructor(request2, response, message) {
      super(message);
      this.name = "ApiError";
      this.url = response.url;
      this.status = response.status;
      this.statusText = response.statusText;
      this.body = response.body;
      this.request = request2;
    }
  };

  // openapi-typescript-codegen/core/CancelablePromise.ts
  var CancelError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "CancelError";
    }
    get isCancelled() {
      return true;
    }
  };
  var CancelablePromise = class {
    constructor(executor) {
      this._isResolved = false;
      this._isRejected = false;
      this._isCancelled = false;
      this._cancelHandlers = [];
      this._promise = new Promise((resolve2, reject) => {
        this._resolve = resolve2;
        this._reject = reject;
        const onResolve = (value) => {
          var _a;
          if (this._isResolved || this._isRejected || this._isCancelled) {
            return;
          }
          this._isResolved = true;
          (_a = this._resolve) == null ? void 0 : _a.call(this, value);
        };
        const onReject = (reason) => {
          var _a;
          if (this._isResolved || this._isRejected || this._isCancelled) {
            return;
          }
          this._isRejected = true;
          (_a = this._reject) == null ? void 0 : _a.call(this, reason);
        };
        const onCancel = (cancelHandler) => {
          if (this._isResolved || this._isRejected || this._isCancelled) {
            return;
          }
          this._cancelHandlers.push(cancelHandler);
        };
        Object.defineProperty(onCancel, "isResolved", {
          get: () => this._isResolved
        });
        Object.defineProperty(onCancel, "isRejected", {
          get: () => this._isRejected
        });
        Object.defineProperty(onCancel, "isCancelled", {
          get: () => this._isCancelled
        });
        return executor(onResolve, onReject, onCancel);
      });
    }
    then(onFulfilled, onRejected) {
      return this._promise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
      return this._promise.catch(onRejected);
    }
    finally(onFinally) {
      return this._promise.finally(onFinally);
    }
    cancel() {
      var _a;
      if (this._isResolved || this._isRejected || this._isCancelled) {
        return;
      }
      this._isCancelled = true;
      if (this._cancelHandlers.length) {
        try {
          for (const cancelHandler of this._cancelHandlers) {
            cancelHandler();
          }
        } catch (error) {
          console.warn("Cancellation threw an error", error);
          return;
        }
      }
      this._cancelHandlers.length = 0;
      (_a = this._reject) == null ? void 0 : _a.call(this, new CancelError("Request aborted"));
    }
    get isCancelled() {
      return this._isCancelled;
    }
  };
  Symbol.toStringTag;

  // openapi-typescript-codegen/core/OpenAPI.ts
  var OpenAPI = {
    BASE: "",
    VERSION: "1.0.0",
    WITH_CREDENTIALS: false,
    CREDENTIALS: "include",
    TOKEN: void 0,
    USERNAME: void 0,
    PASSWORD: void 0,
    HEADERS: void 0,
    ENCODE_PATH: void 0
  };

  // openapi-typescript-codegen/core/request.ts
  var isDefined = (value) => {
    return value !== void 0 && value !== null;
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isStringWithValue = (value) => {
    return isString(value) && value !== "";
  };
  var isBlob = (value) => {
    return typeof value === "object" && typeof value.type === "string" && typeof value.stream === "function" && typeof value.arrayBuffer === "function" && typeof value.constructor === "function" && typeof value.constructor.name === "string" && /^(Blob|File)$/.test(value.constructor.name) && /^(Blob|File)$/.test(value[Symbol.toStringTag]);
  };
  var isFormData = (value) => {
    return value instanceof FormData;
  };
  var base64 = (str) => {
    try {
      return btoa(str);
    } catch (err) {
      return Buffer.from(str).toString("base64");
    }
  };
  var getQueryString = (params) => {
    const qs = [];
    const append = (key, value) => {
      qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };
    const process2 = (key, value) => {
      if (isDefined(value)) {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            process2(key, v);
          });
        } else if (typeof value === "object") {
          Object.entries(value).forEach(([k, v]) => {
            process2(`${key}[${k}]`, v);
          });
        } else {
          append(key, value);
        }
      }
    };
    Object.entries(params).forEach(([key, value]) => {
      process2(key, value);
    });
    if (qs.length > 0) {
      return `?${qs.join("&")}`;
    }
    return "";
  };
  var getUrl = (config2, options) => {
    const encoder = config2.ENCODE_PATH || encodeURI;
    const path = options.url.replace("{api-version}", config2.VERSION).replace(/{(.*?)}/g, (substring, group) => {
      var _a;
      if ((_a = options.path) == null ? void 0 : _a.hasOwnProperty(group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    });
    const url = `${config2.BASE}${path}`;
    if (options.query) {
      return `${url}${getQueryString(options.query)}`;
    }
    return url;
  };
  var getFormData = (options) => {
    if (options.formData) {
      const formData = new FormData();
      const process2 = (key, value) => {
        if (isString(value) || isBlob(value)) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      };
      Object.entries(options.formData).filter(([_, value]) => isDefined(value)).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => process2(key, v));
        } else {
          process2(key, value);
        }
      });
      return formData;
    }
    return void 0;
  };
  var resolve = async (options, resolver) => {
    if (typeof resolver === "function") {
      return resolver(options);
    }
    return resolver;
  };
  var getHeaders = async (config2, options) => {
    const token = await resolve(options, config2.TOKEN);
    const username = await resolve(options, config2.USERNAME);
    const password = await resolve(options, config2.PASSWORD);
    const additionalHeaders = await resolve(options, config2.HEADERS);
    const headers = Object.entries(__spreadValues(__spreadValues({
      Accept: "application/json"
    }, additionalHeaders), options.headers)).filter(([_, value]) => isDefined(value)).reduce((headers2, [key, value]) => __spreadProps(__spreadValues({}, headers2), {
      [key]: String(value)
    }), {});
    if (isStringWithValue(token)) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (isStringWithValue(username) && isStringWithValue(password)) {
      const credentials = base64(`${username}:${password}`);
      headers["Authorization"] = `Basic ${credentials}`;
    }
    if (options.body) {
      if (options.mediaType) {
        headers["Content-Type"] = options.mediaType;
      } else if (isBlob(options.body)) {
        headers["Content-Type"] = options.body.type || "application/octet-stream";
      } else if (isString(options.body)) {
        headers["Content-Type"] = "text/plain";
      } else if (!isFormData(options.body)) {
        headers["Content-Type"] = "application/json";
      }
    }
    return new Headers(headers);
  };
  var getRequestBody = (options) => {
    var _a;
    if (options.body) {
      if ((_a = options.mediaType) == null ? void 0 : _a.includes("/json")) {
        return JSON.stringify(options.body);
      } else if (isString(options.body) || isBlob(options.body) || isFormData(options.body)) {
        return options.body;
      } else {
        return JSON.stringify(options.body);
      }
    }
    return void 0;
  };
  var sendRequest = async (config2, options, url, body, formData, headers, onCancel) => {
    const controller = new AbortController();
    const request2 = {
      headers,
      body: body != null ? body : formData,
      method: options.method,
      signal: controller.signal
    };
    if (config2.WITH_CREDENTIALS) {
      request2.credentials = config2.CREDENTIALS;
    }
    onCancel(() => controller.abort());
    return await fetch(url, request2);
  };
  var getResponseHeader = (response, responseHeader) => {
    if (responseHeader) {
      const content = response.headers.get(responseHeader);
      if (isString(content)) {
        return content;
      }
    }
    return void 0;
  };
  var getResponseBody = async (response) => {
    if (response.status !== 204) {
      try {
        const contentType = response.headers.get("Content-Type");
        if (contentType) {
          const isJSON = contentType.toLowerCase().startsWith("application/json");
          if (isJSON) {
            return await response.json();
          } else {
            return await response.text();
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return void 0;
  };
  var catchErrorCodes = (options, result) => {
    const errors = __spreadValues({
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable"
    }, options.errors);
    const error = errors[result.status];
    if (error) {
      throw new ApiError(options, result, error);
    }
    if (!result.ok) {
      throw new ApiError(options, result, "Generic Error");
    }
  };
  var request = (config2, options) => {
    return new CancelablePromise(async (resolve2, reject, onCancel) => {
      try {
        const url = getUrl(config2, options);
        const formData = getFormData(options);
        const body = getRequestBody(options);
        const headers = await getHeaders(config2, options);
        if (!onCancel.isCancelled) {
          const response = await sendRequest(config2, options, url, body, formData, headers, onCancel);
          const responseBody = await getResponseBody(response);
          const responseHeader = getResponseHeader(response, options.responseHeader);
          const result = {
            url,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            body: responseHeader != null ? responseHeader : responseBody
          };
          catchErrorCodes(options, result);
          resolve2(result.body);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  // openapi-typescript-codegen/services/CoreService.ts
  var CoreService = class {
    /**
     * @returns NodeDefinitionDto
     * @throws ApiError
     */
    static getAvailableNodes() {
      return request(OpenAPI, {
        method: "GET",
        url: "/core/node/available"
      });
    }
    /**
     * @returns NetworkDto
     * @throws ApiError
     */
    static getAllNetworks() {
      return request(OpenAPI, {
        method: "GET",
        url: "/core/network"
      });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static saveNetwork(requestBody) {
      return request(OpenAPI, {
        method: "POST",
        url: "/core/network",
        body: requestBody,
        mediaType: "application/json"
      });
    }
    /**
     * @param identifier
     * @returns any
     * @throws ApiError
     */
    static deleteNetwork(identifier) {
      return request(OpenAPI, {
        method: "DELETE",
        url: "/core/network/{identifier}",
        path: {
          "identifier": identifier
        }
      });
    }
    /**
     * @param networkId
     * @returns any
     * @throws ApiError
     */
    static startNetwork(networkId) {
      return request(OpenAPI, {
        method: "POST",
        url: "/core/network/start/{networkId}",
        path: {
          "networkId": networkId
        }
      });
    }
    /**
     * @param networkId
     * @returns any
     * @throws ApiError
     */
    static stopNetwork(networkId) {
      return request(OpenAPI, {
        method: "POST",
        url: "/core/network/stop/{networkId}",
        path: {
          "networkId": networkId
        }
      });
    }
  };

  // src/util/component.decorator.ts
  function Component(config2) {
    return (constructor) => {
      window.customElements.define(config2.selector, constructor);
    };
  }
  var StatefulComponent = class extends HTMLElement {
    constructor(initialState7) {
      super();
      this.state = initialState7;
    }
    setState(state) {
      this.state = state;
      this.triggerRender();
    }
    updateState(state) {
      this.state = Object.assign({}, this.state, state);
      this.triggerRender();
    }
    connectedCallback() {
      this.triggerRender();
    }
    static get observedAttributes() {
      return [];
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
    getState() {
      return this.state;
    }
    useStore(stateKey, store) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = store.subscribe((data) => {
        this.setState(__spreadProps(__spreadValues({}, this.getState()), { [stateKey]: data }));
      });
    }
    disconnectedCallback() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
    triggerRender() {
      const html = this.render(this.state);
      if (!html)
        return;
      this.innerHTML = html;
      this.addClickHandlers();
    }
    addClickHandlers() {
      const clickElements = this.querySelectorAll("[js-click]");
      clickElements.forEach((el) => {
        el.addEventListener("click", (ev) => {
          const clickHandler = el.getAttribute("js-click");
          if (clickHandler && this[clickHandler]) {
            this[clickHandler](ev);
          }
        });
      });
    }
  };

  // node_modules/tslib/tslib.es6.js
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from2, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from2.length, ar; i < l; i++) {
        if (ar || !(i in from2)) {
          if (!ar)
            ar = Array.prototype.slice.call(from2, 0, i);
          ar[i] = from2[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from2));
  }
  function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      if (g[n])
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length)
        resume(q[0][0], q[0][1]);
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve2, reject) {
          v = o[n](v), settle(resolve2, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve2, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve2({ value: v2, done: d });
      }, reject);
    }
  }

  // node_modules/rxjs/dist/esm5/internal/util/isFunction.js
  function isFunction(value) {
    return typeof value === "function";
  }

  // node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
  function createErrorClass(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }

  // node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
  var UnsubscriptionError = createErrorClass(function(_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
        return i + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
    };
  });

  // node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscription.js
  var Subscription = function() {
    function Subscription4(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription4.prototype.unsubscribe = function() {
      var e_1, _a, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                  _a.call(_parentage_1);
              } finally {
                if (e_1)
                  throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e) {
            errors = e instanceof UnsubscriptionError ? e.errors : [e];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return))
                _b.call(_finalizers_1);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError(errors);
        }
      }
    };
    Subscription4.prototype.add = function(teardown) {
      var _a;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription4) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
        }
      }
    };
    Subscription4.prototype._hasParent = function(parent) {
      var _parentage = this._parentage;
      return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
    };
    Subscription4.prototype._addParent = function(parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription4.prototype._removeParent = function(parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove(_parentage, parent);
      }
    };
    Subscription4.prototype.remove = function(teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription4) {
        teardown._removeParent(this);
      }
    };
    Subscription4.EMPTY = function() {
      var empty = new Subscription4();
      empty.closed = true;
      return empty;
    }();
    return Subscription4;
  }();
  var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
  function isSubscription(value) {
    return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }

  // node_modules/rxjs/dist/esm5/internal/config.js
  var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false
  };

  // node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
  var timeoutProvider = {
    setTimeout: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      var delegate = timeoutProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
        return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
      }
      return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function(handle) {
      var delegate = timeoutProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function() {
      var onUnhandledError = config.onUnhandledError;
      if (onUnhandledError) {
        onUnhandledError(err);
      } else {
        throw err;
      }
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/noop.js
  function noop() {
  }

  // node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
  var COMPLETE_NOTIFICATION = function() {
    return createNotification("C", void 0, void 0);
  }();
  function errorNotification(error) {
    return createNotification("E", void 0, error);
  }
  function nextNotification(value) {
    return createNotification("N", value, void 0);
  }
  function createNotification(kind, value, error) {
    return {
      kind,
      value,
      error
    };
  }

  // node_modules/rxjs/dist/esm5/internal/util/errorContext.js
  var context = null;
  function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      var isRoot = !context;
      if (isRoot) {
        context = { errorThrown: false, error: null };
      }
      cb();
      if (isRoot) {
        var _a = context, errorThrown = _a.errorThrown, error = _a.error;
        context = null;
        if (errorThrown) {
          throw error;
        }
      }
    } else {
      cb();
    }
  }
  function captureError(err) {
    if (config.useDeprecatedSynchronousErrorHandling && context) {
      context.errorThrown = true;
      context.error = err;
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscriber.js
  var Subscriber = function(_super) {
    __extends(Subscriber2, _super);
    function Subscriber2(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber2.create = function(next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber2.prototype.next = function(value) {
      if (this.isStopped) {
        handleStoppedNotification(nextNotification(value), this);
      } else {
        this._next(value);
      }
    };
    Subscriber2.prototype.error = function(err) {
      if (this.isStopped) {
        handleStoppedNotification(errorNotification(err), this);
      } else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber2.prototype.complete = function() {
      if (this.isStopped) {
        handleStoppedNotification(COMPLETE_NOTIFICATION, this);
      } else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber2.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber2.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber2.prototype._error = function(err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber2.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber2;
  }(Subscription);
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = function() {
    function ConsumerObserver2(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver2.prototype.next = function(value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver2.prototype.error = function(err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver2.prototype.complete = function() {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver2;
  }();
  var SafeSubscriber = function(_super) {
    __extends(SafeSubscriber2, _super);
    function SafeSubscriber2(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
          error: error !== null && error !== void 0 ? error : void 0,
          complete: complete !== null && complete !== void 0 ? complete : void 0
        };
      } else {
        var context_1;
        if (_this && config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function() {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber2;
  }(Subscriber);
  function handleUnhandledError(error) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      captureError(error);
    } else {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = config.onStoppedNotification;
    onStoppedNotification && timeoutProvider.setTimeout(function() {
      return onStoppedNotification(notification, subscriber);
    });
  }
  var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop
  };

  // node_modules/rxjs/dist/esm5/internal/symbol/observable.js
  var observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();

  // node_modules/rxjs/dist/esm5/internal/util/identity.js
  function identity(x) {
    return x;
  }

  // node_modules/rxjs/dist/esm5/internal/util/pipe.js
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }

  // node_modules/rxjs/dist/esm5/internal/Observable.js
  var Observable = function() {
    function Observable4(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable4.prototype.lift = function(operator) {
      var observable2 = new Observable4();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    };
    Observable4.prototype.subscribe = function(observerOrNext, error, complete) {
      var _this = this;
      var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(function() {
        var _a = _this, operator = _a.operator, source = _a.source;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
      });
      return subscriber;
    };
    Observable4.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    };
    Observable4.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve2, reject) {
        var subscriber = new SafeSubscriber({
          next: function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve2
        });
        _this.subscribe(subscriber);
      });
    };
    Observable4.prototype._subscribe = function(subscriber) {
      var _a;
      return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable4.prototype[observable] = function() {
      return this;
    };
    Observable4.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      return pipeFromArray(operations)(this);
    };
    Observable4.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve2, reject) {
        var value;
        _this.subscribe(function(x) {
          return value = x;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve2(value);
        });
      });
    };
    Observable4.create = function(subscribe) {
      return new Observable4(subscribe);
    };
    return Observable4;
  }();
  function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
  }
  function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
  }

  // node_modules/rxjs/dist/esm5/internal/util/lift.js
  function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
    return function(source) {
      if (hasLift(source)) {
        return source.lift(function(liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber = function(_super) {
    __extends(OperatorSubscriber2, _super);
    function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
      var _this = _super.call(this, destination) || this;
      _this.onFinalize = onFinalize;
      _this.shouldUnsubscribe = shouldUnsubscribe;
      _this._next = onNext ? function(value) {
        try {
          onNext(value);
        } catch (err) {
          destination.error(err);
        }
      } : _super.prototype._next;
      _this._error = onError ? function(err) {
        try {
          onError(err);
        } catch (err2) {
          destination.error(err2);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._error;
      _this._complete = onComplete ? function() {
        try {
          onComplete();
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._complete;
      return _this;
    }
    OperatorSubscriber2.prototype.unsubscribe = function() {
      var _a;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var closed_1 = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
      }
    };
    return OperatorSubscriber2;
  }(Subscriber);

  // node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
  var ObjectUnsubscribedError = createErrorClass(function(_super) {
    return function ObjectUnsubscribedErrorImpl() {
      _super(this);
      this.name = "ObjectUnsubscribedError";
      this.message = "object unsubscribed";
    };
  });

  // node_modules/rxjs/dist/esm5/internal/Subject.js
  var Subject = function(_super) {
    __extends(Subject3, _super);
    function Subject3() {
      var _this = _super.call(this) || this;
      _this.closed = false;
      _this.currentObservers = null;
      _this.observers = [];
      _this.isStopped = false;
      _this.hasError = false;
      _this.thrownError = null;
      return _this;
    }
    Subject3.prototype.lift = function(operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };
    Subject3.prototype._throwIfClosed = function() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
    };
    Subject3.prototype.next = function(value) {
      var _this = this;
      errorContext(function() {
        var e_1, _a;
        _this._throwIfClosed();
        if (!_this.isStopped) {
          if (!_this.currentObservers) {
            _this.currentObservers = Array.from(_this.observers);
          }
          try {
            for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
              var observer = _c.value;
              observer.next(value);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return))
                _a.call(_b);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
        }
      });
    };
    Subject3.prototype.error = function(err) {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.hasError = _this.isStopped = true;
          _this.thrownError = err;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().error(err);
          }
        }
      });
    };
    Subject3.prototype.complete = function() {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.isStopped = true;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().complete();
          }
        }
      });
    };
    Subject3.prototype.unsubscribe = function() {
      this.isStopped = this.closed = true;
      this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject3.prototype, "observed", {
      get: function() {
        var _a;
        return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
      },
      enumerable: false,
      configurable: true
    });
    Subject3.prototype._trySubscribe = function(subscriber) {
      this._throwIfClosed();
      return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject3.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._checkFinalizedStatuses(subscriber);
      return this._innerSubscribe(subscriber);
    };
    Subject3.prototype._innerSubscribe = function(subscriber) {
      var _this = this;
      var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
      if (hasError || isStopped) {
        return EMPTY_SUBSCRIPTION;
      }
      this.currentObservers = null;
      observers.push(subscriber);
      return new Subscription(function() {
        _this.currentObservers = null;
        arrRemove(observers, subscriber);
      });
    };
    Subject3.prototype._checkFinalizedStatuses = function(subscriber) {
      var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped) {
        subscriber.complete();
      }
    };
    Subject3.prototype.asObservable = function() {
      var observable2 = new Observable();
      observable2.source = this;
      return observable2;
    };
    Subject3.create = function(destination, source) {
      return new AnonymousSubject(destination, source);
    };
    return Subject3;
  }(Observable);
  var AnonymousSubject = function(_super) {
    __extends(AnonymousSubject2, _super);
    function AnonymousSubject2(destination, source) {
      var _this = _super.call(this) || this;
      _this.destination = destination;
      _this.source = source;
      return _this;
    }
    AnonymousSubject2.prototype.next = function(value) {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject2.prototype.error = function(err) {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject2.prototype.complete = function() {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject2.prototype._subscribe = function(subscriber) {
      var _a, _b;
      return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject2;
  }(Subject);

  // node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
  var BehaviorSubject = function(_super) {
    __extends(BehaviorSubject2, _super);
    function BehaviorSubject2(_value) {
      var _this = _super.call(this) || this;
      _this._value = _value;
      return _this;
    }
    Object.defineProperty(BehaviorSubject2.prototype, "value", {
      get: function() {
        return this.getValue();
      },
      enumerable: false,
      configurable: true
    });
    BehaviorSubject2.prototype._subscribe = function(subscriber) {
      var subscription = _super.prototype._subscribe.call(this, subscriber);
      !subscription.closed && subscriber.next(this._value);
      return subscription;
    };
    BehaviorSubject2.prototype.getValue = function() {
      var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
      if (hasError) {
        throw thrownError;
      }
      this._throwIfClosed();
      return _value;
    };
    BehaviorSubject2.prototype.next = function(value) {
      _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject2;
  }(Subject);

  // node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
  function isScheduler(value) {
    return value && isFunction(value.schedule);
  }

  // node_modules/rxjs/dist/esm5/internal/util/args.js
  function last(arr) {
    return arr[arr.length - 1];
  }
  function popScheduler(args) {
    return isScheduler(last(args)) ? args.pop() : void 0;
  }

  // node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
  var isArrayLike = function(x) {
    return x && typeof x.length === "number" && typeof x !== "function";
  };

  // node_modules/rxjs/dist/esm5/internal/util/isPromise.js
  function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
  function isInteropObservable(input) {
    return isFunction(input[observable]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
  function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
  function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }

  // node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
  function getSymbolIterator() {
    if (typeof Symbol !== "function" || !Symbol.iterator) {
      return "@@iterator";
    }
    return Symbol.iterator;
  }
  var iterator = getSymbolIterator();

  // node_modules/rxjs/dist/esm5/internal/util/isIterable.js
  function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
  function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
      var reader, _a, value, done;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            reader = readableStream.getReader();
            _b.label = 1;
          case 1:
            _b.trys.push([1, , 9, 10]);
            _b.label = 2;
          case 2:
            if (false)
              return [3, 8];
            return [4, __await(reader.read())];
          case 3:
            _a = _b.sent(), value = _a.value, done = _a.done;
            if (!done)
              return [3, 5];
            return [4, __await(void 0)];
          case 4:
            return [2, _b.sent()];
          case 5:
            return [4, __await(value)];
          case 6:
            return [4, _b.sent()];
          case 7:
            _b.sent();
            return [3, 2];
          case 8:
            return [3, 10];
          case 9:
            reader.releaseLock();
            return [7];
          case 10:
            return [2];
        }
      });
    });
  }
  function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
  function innerFrom(input) {
    if (input instanceof Observable) {
      return input;
    }
    if (input != null) {
      if (isInteropObservable(input)) {
        return fromInteropObservable(input);
      }
      if (isArrayLike(input)) {
        return fromArrayLike(input);
      }
      if (isPromise(input)) {
        return fromPromise(input);
      }
      if (isAsyncIterable(input)) {
        return fromAsyncIterable(input);
      }
      if (isIterable(input)) {
        return fromIterable(input);
      }
      if (isReadableStreamLike(input)) {
        return fromReadableStreamLike(input);
      }
    }
    throw createInvalidObservableTypeError(input);
  }
  function fromInteropObservable(obj) {
    return new Observable(function(subscriber) {
      var obs = obj[observable]();
      if (isFunction(obs.subscribe)) {
        return obs.subscribe(subscriber);
      }
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function fromArrayLike(array) {
    return new Observable(function(subscriber) {
      for (var i = 0; i < array.length && !subscriber.closed; i++) {
        subscriber.next(array[i]);
      }
      subscriber.complete();
    });
  }
  function fromPromise(promise) {
    return new Observable(function(subscriber) {
      promise.then(function(value) {
        if (!subscriber.closed) {
          subscriber.next(value);
          subscriber.complete();
        }
      }, function(err) {
        return subscriber.error(err);
      }).then(null, reportUnhandledError);
    });
  }
  function fromIterable(iterable) {
    return new Observable(function(subscriber) {
      var e_1, _a;
      try {
        for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
          var value = iterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return;
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return))
            _a.call(iterable_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      subscriber.complete();
    });
  }
  function fromAsyncIterable(asyncIterable) {
    return new Observable(function(subscriber) {
      process(asyncIterable, subscriber).catch(function(err) {
        return subscriber.error(err);
      });
    });
  }
  function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
  }
  function process(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function() {
      var value, e_2_1;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 5, 6, 11]);
            asyncIterable_1 = __asyncValues(asyncIterable);
            _b.label = 1;
          case 1:
            return [4, asyncIterable_1.next()];
          case 2:
            if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done))
              return [3, 4];
            value = asyncIterable_1_1.value;
            subscriber.next(value);
            if (subscriber.closed) {
              return [2];
            }
            _b.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            e_2_1 = _b.sent();
            e_2 = { error: e_2_1 };
            return [3, 11];
          case 6:
            _b.trys.push([6, , 9, 10]);
            if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)))
              return [3, 8];
            return [4, _a.call(asyncIterable_1)];
          case 7:
            _b.sent();
            _b.label = 8;
          case 8:
            return [3, 10];
          case 9:
            if (e_2)
              throw e_2.error;
            return [7];
          case 10:
            return [7];
          case 11:
            subscriber.complete();
            return [2];
        }
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
  function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
    if (delay === void 0) {
      delay = 0;
    }
    if (repeat === void 0) {
      repeat = false;
    }
    var scheduleSubscription = scheduler.schedule(function() {
      work();
      if (repeat) {
        parentSubscription.add(this.schedule(null, delay));
      } else {
        this.unsubscribe();
      }
    }, delay);
    parentSubscription.add(scheduleSubscription);
    if (!repeat) {
      return scheduleSubscription;
    }
  }

  // node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
  function observeOn(scheduler, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return operate(function(source, subscriber) {
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.next(value);
        }, delay);
      }, function() {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.complete();
        }, delay);
      }, function(err) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.error(err);
        }, delay);
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
  function subscribeOn(scheduler, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return operate(function(source, subscriber) {
      subscriber.add(scheduler.schedule(function() {
        return source.subscribe(subscriber);
      }, delay));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
  function scheduleObservable(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
  function schedulePromise(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
  function scheduleArray(input, scheduler) {
    return new Observable(function(subscriber) {
      var i = 0;
      return scheduler.schedule(function() {
        if (i === input.length) {
          subscriber.complete();
        } else {
          subscriber.next(input[i++]);
          if (!subscriber.closed) {
            this.schedule();
          }
        }
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
  function scheduleIterable(input, scheduler) {
    return new Observable(function(subscriber) {
      var iterator2;
      executeSchedule(subscriber, scheduler, function() {
        iterator2 = input[iterator]();
        executeSchedule(subscriber, scheduler, function() {
          var _a;
          var value;
          var done;
          try {
            _a = iterator2.next(), value = _a.value, done = _a.done;
          } catch (err) {
            subscriber.error(err);
            return;
          }
          if (done) {
            subscriber.complete();
          } else {
            subscriber.next(value);
          }
        }, 0, true);
      });
      return function() {
        return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
      };
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
  function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
      throw new Error("Iterable cannot be null");
    }
    return new Observable(function(subscriber) {
      executeSchedule(subscriber, scheduler, function() {
        var iterator2 = input[Symbol.asyncIterator]();
        executeSchedule(subscriber, scheduler, function() {
          iterator2.next().then(function(result) {
            if (result.done) {
              subscriber.complete();
            } else {
              subscriber.next(result.value);
            }
          });
        }, 0, true);
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
  function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
  function scheduled(input, scheduler) {
    if (input != null) {
      if (isInteropObservable(input)) {
        return scheduleObservable(input, scheduler);
      }
      if (isArrayLike(input)) {
        return scheduleArray(input, scheduler);
      }
      if (isPromise(input)) {
        return schedulePromise(input, scheduler);
      }
      if (isAsyncIterable(input)) {
        return scheduleAsyncIterable(input, scheduler);
      }
      if (isIterable(input)) {
        return scheduleIterable(input, scheduler);
      }
      if (isReadableStreamLike(input)) {
        return scheduleReadableStreamLike(input, scheduler);
      }
    }
    throw createInvalidObservableTypeError(input);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/from.js
  function from(input, scheduler) {
    return scheduler ? scheduled(input, scheduler) : innerFrom(input);
  }

  // node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
  var EmptyError = createErrorClass(function(_super) {
    return function EmptyErrorImpl() {
      _super(this);
      this.name = "EmptyError";
      this.message = "no elements in sequence";
    };
  });

  // node_modules/rxjs/dist/esm5/internal/firstValueFrom.js
  function firstValueFrom(source, config2) {
    var hasConfig = typeof config2 === "object";
    return new Promise(function(resolve2, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          resolve2(value);
          subscriber.unsubscribe();
        },
        error: reject,
        complete: function() {
          if (hasConfig) {
            resolve2(config2.defaultValue);
          } else {
            reject(new EmptyError());
          }
        }
      });
      source.subscribe(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/map.js
  function map(project, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        subscriber.next(project.call(thisArg, value, index++));
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
  function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
    var buffer = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      if (isComplete && !buffer.length && !active) {
        subscriber.complete();
      }
    };
    var outerNext = function(value) {
      return active < concurrent ? doInnerSub(value) : buffer.push(value);
    };
    var doInnerSub = function(value) {
      expand && subscriber.next(value);
      active++;
      var innerComplete = false;
      innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
        onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
        if (expand) {
          outerNext(innerValue);
        } else {
          subscriber.next(innerValue);
        }
      }, function() {
        innerComplete = true;
      }, void 0, function() {
        if (innerComplete) {
          try {
            active--;
            var _loop_1 = function() {
              var bufferedValue = buffer.shift();
              if (innerSubScheduler) {
                executeSchedule(subscriber, innerSubScheduler, function() {
                  return doInnerSub(bufferedValue);
                });
              } else {
                doInnerSub(bufferedValue);
              }
            };
            while (buffer.length && active < concurrent) {
              _loop_1();
            }
            checkComplete();
          } catch (err) {
            subscriber.error(err);
          }
        }
      }));
    };
    source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
      isComplete = true;
      checkComplete();
    }));
    return function() {
      additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
  function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    if (isFunction(resultSelector)) {
      return mergeMap(function(a, i) {
        return map(function(b, ii) {
          return resultSelector(a, b, i, ii);
        })(innerFrom(project(a, i)));
      }, concurrent);
    } else if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }
    return operate(function(source, subscriber) {
      return mergeInternals(source, subscriber, project, concurrent);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
  function mergeAll(concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    return mergeMap(identity, concurrent);
  }

  // node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
  function concatAll() {
    return mergeAll(1);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/concat.js
  function concat() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return concatAll()(from(args, popScheduler(args)));
  }

  // node_modules/rxjs/dist/esm5/internal/operators/filter.js
  function filter(predicate, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return predicate.call(thisArg, value, index++) && subscriber.next(value);
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/startWith.js
  function startWith() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    var scheduler = popScheduler(values);
    return operate(function(source, subscriber) {
      (scheduler ? concat(values, source, scheduler) : concat(values, source)).subscribe(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
  function switchMap(project, resultSelector) {
    return operate(function(source, subscriber) {
      var innerSubscriber = null;
      var index = 0;
      var isComplete = false;
      var checkComplete = function() {
        return isComplete && !innerSubscriber && subscriber.complete();
      };
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
        var innerIndex = 0;
        var outerIndex = index++;
        innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
          return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
        }, function() {
          innerSubscriber = null;
          checkComplete();
        }));
      }, function() {
        isComplete = true;
        checkComplete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/tap.js
  function tap(observerOrNext, error, complete) {
    var tapObserver = isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
    return tapObserver ? operate(function(source, subscriber) {
      var _a;
      (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
      var isUnsub = true;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var _a2;
        (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
        subscriber.next(value);
      }, function() {
        var _a2;
        isUnsub = false;
        (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
        subscriber.complete();
      }, function(err) {
        var _a2;
        isUnsub = false;
        (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
        subscriber.error(err);
      }, function() {
        var _a2, _b;
        if (isUnsub) {
          (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
        }
        (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
      }));
    }) : identity;
  }

  // src/store/store.ts
  var Store = class extends BehaviorSubject {
    constructor(fetchFunction) {
      super({ loading: true });
      this.fetchFunction = fetchFunction;
      this.fetchData();
    }
    fetchData() {
      this.next({ loading: true, data: null });
      this.fetchFunction().then((data) => {
        this.next({ loading: false, data });
      });
    }
    refresh() {
      return this.fetchFunction().then((data) => {
        this.next({ loading: false, data });
      });
    }
    select(selector) {
      return this.pipe(map((d) => d.data), filter((d) => !!d), selector);
    }
  };

  // src/store/available-nodes.store.ts
  var availableNodesStore = new Store(CoreService.getAvailableNodes);

  // src/store/network.store.ts
  var networksStore = new Store(CoreService.getAllNetworks);
  var networkSelector = (id) => map(
    (networks) => networks.find((network) => network.identifier === id)
  );
  var nodeSelector = (networkId, nodeId) => (source$) => source$.pipe(
    networkSelector(networkId),
    tap(console.log),
    filter((network) => !!network),
    map(
      (network) => network.nodes.find((node) => node.identifier === nodeId)
    )
  );

  // src/util/util.ts
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
      /[018]/g,
      (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  function getClickedNode(nodes, x, y) {
    return nodes.find((node) => {
      return x > node.pos.x && node.x + node.pos.width > x && y > node.pos.y && y < node.y + node.pos.height;
    });
  }
  function getClickedElement(nodes, x, y) {
    const isInside = (pos) => x > pos.x && x < pos.x + pos.width && y > pos.y && y < pos.y + pos.height;
    const nodeHits = nodes.map((node) => {
      var _a, _b, _c, _d, _e, _f;
      const attributes = (_b = (_a = node.attributes) == null ? void 0 : _a.filter((att) => isInside(att.pos))) != null ? _b : [];
      const input = (_d = (_c = node.inputs) == null ? void 0 : _c.filter((att) => isInside(att.pos))) != null ? _d : [];
      const output = (_f = (_e = node.outputs) == null ? void 0 : _e.filter((att) => isInside(att.pos))) != null ? _f : [];
      return { attributes, input, output, node };
    }).filter(
      (res) => res.attributes.length || res.input.length || res.output.length
    );
    if (nodeHits.length > 0) {
      if (nodeHits[0].output.length) {
        return {
          type: "output",
          element: nodeHits[0].output[0],
          node: nodeHits[0].node
        };
      }
      if (nodeHits[0].input.length) {
        return {
          type: "input",
          element: nodeHits[0].input[0],
          node: nodeHits[0].node
        };
      }
      if (nodeHits[0].attributes.length) {
        return {
          type: "attribute",
          element: nodeHits[0].attributes[0],
          node: nodeHits[0].node
        };
      }
    }
    return null;
  }

  // src/store/network-manipulation.store.ts
  var NetworkManipulationStore = class extends Subject {
    subscribe(next) {
      if (this.network && next instanceof Function)
        next(this.network);
      return super.subscribe(next);
    }
    next(value) {
      super.next(value);
      this.network = value;
    }
    async loadNetwork(networkId) {
      const network = await firstValueFrom(
        networksStore.select(networkSelector(networkId))
      );
      this.next(network);
    }
    createNetwork() {
      const id = uuidv4();
      this.next({
        edges: [],
        nodes: [],
        name: "New Network",
        description: "",
        identifier: id,
        active: false
      });
      return id;
    }
    getNumberOfNodes() {
      return this.network.nodes.length;
    }
    setName(name) {
      this.network.name = name;
      this.next(this.network);
      return this;
    }
    setDescription(description) {
      this.network.description = description;
      this.next(this.network);
      return this;
    }
    addNode(nodeDefinitionId) {
      console.log("Adding node " + nodeDefinitionId);
      const nodeDefinition$ = availableNodesStore.select(
        map(
          (nodes) => nodes.find((node) => node.identifier === nodeDefinitionId)
        )
      );
      nodeDefinition$.subscribe((definition) => {
        this.network.nodes.push(__spreadProps(__spreadValues({}, definition), {
          x: 0,
          y: 0,
          definitionId: definition.identifier,
          identifier: uuidv4(),
          attributes: definition.attributes.map((att) => __spreadProps(__spreadValues({}, att), {
            definitionId: att.identifier,
            value: "",
            identifier: uuidv4()
          })),
          inputs: definition.inputs.map((input) => __spreadProps(__spreadValues({}, input), {
            definition: input
          })),
          outputs: definition.outputs.map((output) => __spreadProps(__spreadValues({}, output), {
            definition: output
          }))
        }));
        this.next(this.network);
      });
    }
    addEdge(output, input, outputNode, inputNode) {
      this.network.edges.push({
        identifier: uuidv4(),
        description: "",
        name: "",
        inputNodeIdentifier: inputNode.identifier,
        outputNodeIdentifier: outputNode.identifier,
        inputIdentifier: input.identifier,
        outputIdentifier: output.identifier
      });
      this.next(this.network);
    }
    removeNode(identifier) {
    }
    removeEdge(node, element) {
      this.network.edges = this.network.edges.filter(
        (edge) => !((node.identifier === edge.inputNodeIdentifier || node.identifier === edge.outputNodeIdentifier) && (edge.inputIdentifier === element.identifier || edge.outputIdentifier === element.identifier))
      );
      this.next(this.network);
    }
    async save() {
      this.next(await CoreService.saveNetwork(this.network));
      return this;
    }
    getNetwork() {
      return this.network;
    }
    updateNodePosition(node, offsetX, offsetY) {
      node.x = offsetX;
      node.y = offsetY;
      this.next(this.network);
    }
    deleteNode(del) {
      this.network.nodes = this.network.nodes.filter(
        (node) => node.identifier !== del.identifier
      );
      [...del.outputs, ...del.inputs].forEach((e) => this.removeEdge(del, e));
      this.next(this.network);
    }
    updateNode(node) {
      this.network.nodes = this.network.nodes.map(
        (n) => n.identifier === node.identifier ? node : n
      );
      this.next(this.network);
    }
    async refresh() {
      await networksStore.refresh();
      return this.loadNetwork(this.getNetwork().identifier).then();
    }
  };
  var networkManipulationStore = new NetworkManipulationStore();

  // src/component/available-nodes.component.ts
  var initialState = {
    nodes: { loading: true },
    isOpen: false
  };
  var AvailableNodesComponent = class extends StatefulComponent {
    constructor() {
      super(initialState);
      this.useStore("nodes", availableNodesStore);
    }
    toggleDisplay() {
      this.updateState({ isOpen: !this.getState().isOpen });
    }
    addNode(ev) {
      const element = ev.target.closest("[js-node-def-id]");
      const defId = element.getAttribute("js-node-def-id");
      networkManipulationStore.addNode(defId);
    }
    render(state) {
      if (!state.isOpen) {
        return `<button js-click="toggleDisplay">AvailableNodes</button>`;
      }
      if (state.nodes.loading)
        return "...";
      const nodeHtml = state.nodes.data.map(
        (node) => `
                    <div class="node-card" js-click="addNode" js-node-def-id="${node.identifier}" >
                        <h1>${node.name} <button>Add</button></h1>
                        <p>${node.description}</p>
                    </div>
                `
      ).join("");
      return `<div>
            <button js-click="toggleDisplay">Close</button>
            <div class="node-container">
                ${nodeHtml}
            </div>
        </div>`;
    }
  };
  AvailableNodesComponent = __decorateClass([
    Component({
      selector: "app-available-nodes"
    })
  ], AvailableNodesComponent);

  // src/store/notification.store.ts
  var NotificationStore = class extends BehaviorSubject {
    constructor() {
      super([]);
    }
    display(notification, duration = 2e3) {
      notification.id = uuidv4();
      this.next(this.getValue().concat(notification));
      setTimeout(() => {
        this.next(
          this.getValue().filter((notify) => notify.id !== notification.id)
        );
      }, duration);
      return notification.id;
    }
  };
  var notificationStore = new NotificationStore();

  // src/component/toolbar.component.ts
  var initialState2 = {
    network: null
  };
  var ToolbarComponent = class extends StatefulComponent {
    constructor() {
      super(initialState2);
    }
    connectedCallback() {
      this.useStore("network", networkManipulationStore);
    }
    runNetwork() {
      CoreService.startNetwork(this.getAttribute("networkId")).then(() => {
        notificationStore.display({
          content: "Network started",
          type: "success"
        });
        networkManipulationStore.refresh();
      }).catch((err) => {
        notificationStore.display({
          content: "Failed to start network ...",
          type: "error"
        });
      });
    }
    stopNetwork() {
      CoreService.stopNetwork(this.getAttribute("networkId")).then(() => {
        notificationStore.display({
          content: "Network stopped",
          type: "success"
        });
        networkManipulationStore.refresh();
      }).catch((err) => {
        notificationStore.display({
          content: "Failed to stop network ...",
          type: "error"
        });
      });
    }
    saveNetwork() {
      var _a;
      const nameInput = this.querySelector("[js-network-name]");
      if (nameInput) {
        networkManipulationStore.setName((_a = nameInput.value) != null ? _a : "Network");
      }
      networkManipulationStore.save().then(() => {
        notificationStore.display({
          content: "Network saved",
          type: "success"
        });
      }).catch((err) => {
        notificationStore.display({
          content: "Failed to save network ...",
          type: "error"
        });
      });
    }
    render(state) {
      var _a, _b;
      if (!state.network)
        return "";
      return `<div class="toolbar">
            <a href="/"><button>Close</button></a>
            <b>${((_a = state.network) == null ? void 0 : _a.active) ? "Running" : "Stopped"}</b>
            <span>${state.network ? `<input js-network-name value="${state.network.name}" />` : ""}</span>
            <span class="flex-fill"></span>
            ${((_b = state.network) == null ? void 0 : _b.active) ? `<button js-click="stopNetwork">Stop Network</button>` : `<button js-click="runNetwork">Run Network</button>`}
            <button js-click="saveNetwork">Save Network</button>
            
            <app-available-nodes></app-available-nodes>
        </div>`;
    }
  };
  ToolbarComponent = __decorateClass([
    Component({
      selector: "app-toolbar"
    })
  ], ToolbarComponent);

  // src/renderer/constants.ts
  var nodePaddingVertical = 8;
  var nodePadding = 16;
  var linePadding = 12;
  var headerTextSize = 21;
  var descriptionTextSize = 12;
  var rowTextSize = 12;

  // src/renderer/node-renderer.ts
  var NodeRenderer = class {
    constructor(ctx) {
      this.ctx = ctx;
    }
    render(nodes, camera) {
      nodes.forEach((node) => this.renderNode(node, camera));
    }
    renderNode(node, cam) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      this.ctx.strokeStyle = "black";
      this.ctx.font = `${headerTextSize}px Arial`;
      const titleMetrics = this.ctx.measureText(node.name);
      this.ctx.font = `${descriptionTextSize}px Arial`;
      const descriptionMetrics = this.ctx.measureText(
        node.description
      );
      this.ctx.font = `${rowTextSize}px Arial`;
      const attributeMetrics = (_b = (_a = node.attributes) == null ? void 0 : _a.map((o) => this.ctx.measureText(o.name))) != null ? _b : [];
      const inputMetrics = (_d = (_c = node.inputs) == null ? void 0 : _c.map((o) => this.ctx.measureText(o.name))) != null ? _d : [];
      const outputMetrics = (_f = (_e = node.outputs) == null ? void 0 : _e.map((o) => this.ctx.measureText(o.name))) != null ? _f : [];
      const minWidth = Math.max(
        titleMetrics.width,
        descriptionMetrics.width,
        ...attributeMetrics.map((m) => m.width),
        ...inputMetrics.map((m) => m.width),
        ...outputMetrics.map((m) => m.width)
      );
      const dynamicRows = attributeMetrics.length + inputMetrics.length + outputMetrics.length;
      const dynamicHeight = dynamicRows * rowTextSize + (dynamicRows + 1) * linePadding;
      const headerHeight = headerTextSize + descriptionTextSize + linePadding * 2 + nodePaddingVertical;
      const width = minWidth + nodePadding * 2;
      const height = headerHeight + dynamicHeight + nodePaddingVertical;
      this.ctx.clearRect(cam.transX(node.x), cam.transY(node.y), width, height);
      let currentRowY = node.y + nodePaddingVertical;
      this.ctx.fillStyle = "black";
      this.ctx.font = `${headerTextSize}px Arial`;
      currentRowY += headerTextSize;
      this.ctx.fillText(
        node.name,
        cam.transX(node.x + nodePadding),
        cam.transY(currentRowY)
      );
      this.ctx.fillStyle = "black";
      this.ctx.font = `${descriptionTextSize}px Arial`;
      currentRowY += descriptionTextSize + linePadding;
      this.ctx.fillText(
        node.description,
        cam.transX(node.x + nodePadding),
        cam.transY(currentRowY)
      );
      this.drawLine(
        cam.transX(node.x),
        cam.transY(node.y + headerHeight),
        cam.transX(node.x + width),
        cam.transY(node.y + headerHeight)
      );
      this.ctx.fillStyle = "black";
      this.ctx.font = `${rowTextSize}px Arial`;
      currentRowY += linePadding;
      const identifiable = [
        ...(_g = node == null ? void 0 : node.attributes) != null ? _g : [],
        ...(_h = node == null ? void 0 : node.inputs) != null ? _h : [],
        ...(_i = node == null ? void 0 : node.outputs) != null ? _i : []
      ];
      identifiable.forEach((element) => {
        element.pos = {
          x: node.x,
          y: currentRowY + linePadding / 2,
          width,
          height: linePadding + rowTextSize
        };
        if (node.attributes.includes(element)) {
          this.ctx.fillStyle = "rgba(0,0,0,0.00)";
        }
        if (node.outputs.includes(element)) {
          this.ctx.fillStyle = "rgba(0,82,255,0.06)";
        }
        if (node.inputs.includes(element)) {
          this.ctx.fillStyle = "rgba(85,255,0,0.06)";
        }
        this.ctx.fillRect(
          cam.transX(node.x),
          cam.transY(currentRowY + linePadding / 2),
          width,
          linePadding + rowTextSize
        );
        this.ctx.fillStyle = "black";
        currentRowY += rowTextSize + linePadding;
        this.ctx.fillText(
          element.name,
          cam.transX(node.x + nodePadding),
          cam.transY(currentRowY)
        );
      });
      node.pos = {
        x: node.x,
        y: node.y,
        width,
        height
      };
      this.ctx.beginPath();
      this.ctx.roundRect(
        cam.transX(node.x),
        cam.transY(node.y),
        width,
        height,
        4
      );
      this.ctx.stroke();
    }
    drawLine(x, y, x2, y2) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
  };

  // src/util/drawing-utility.ts
  function connect(ctx, start, end) {
    const distanceX = end.x - start.x;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + distanceX / 2, start.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(start.x + distanceX / 2, start.y);
    ctx.lineTo(start.x + distanceX / 2, end.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(start.x + distanceX / 2, end.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // src/renderer/edge-renderer.ts
  var EdgeRenderer = class {
    constructor(ctx) {
      this.ctx = ctx;
    }
    render(edges, nodes, camera) {
      edges.forEach((edge) => this._renderEdge(edge, nodes, camera));
    }
    _renderEdge(edge, nodes, cam) {
      var _a, _b, _c, _d;
      const startElement = (_b = (_a = nodes.find((node) => node.identifier === edge.inputNodeIdentifier)) == null ? void 0 : _a.inputs) == null ? void 0 : _b.find((input) => input.identifier === edge.inputIdentifier);
      const endElement = (_d = (_c = nodes.find((node) => node.identifier === edge.outputNodeIdentifier)) == null ? void 0 : _c.outputs) == null ? void 0 : _d.find((input) => input.identifier === edge.outputIdentifier);
      if (!startElement)
        return console.log("missing start", edge, nodes);
      if (!endElement)
        return console.log("missing end", edge);
      this.ctx.strokeStyle = "black";
      const start = {
        x: cam.transX(
          startElement.pos.x > endElement.pos.x ? startElement.pos.x : startElement.pos.x + startElement.pos.width
        ),
        y: cam.transY(startElement.pos.y + linePadding / 2 + rowTextSize / 2)
      };
      const end = {
        x: cam.transX(
          endElement.pos.x > startElement.pos.x ? endElement.pos.x : endElement.pos.x + endElement.pos.width
        ),
        y: cam.transY(endElement.pos.y + linePadding / 2 + rowTextSize / 2)
      };
      this.ctx.lineWidth = 2;
      connect(this.ctx, start, end);
      this.ctx.lineWidth = 1;
    }
  };

  // src/renderer/raster-renderer.ts
  var RasterRenderer = class {
    constructor(ctx) {
      this.ctx = ctx;
    }
    render(camera) {
      const rectWidth = 30;
      const rectHeight = 30;
      const frameWidth = window.innerWidth * 20;
      const frameHeight = window.innerHeight * 20;
      this.ctx.strokeStyle = "rgba(0,0,0,0.08)";
      this.ctx.lineWidth = 1;
      for (let x = -(window.innerHeight * 10); x <= frameWidth; x += rectWidth) {
        this.ctx.beginPath();
        this.ctx.moveTo(camera.transX(x), camera.transY(-(window.innerHeight * 10)));
        this.ctx.lineTo(camera.transX(x), camera.transY(frameHeight));
        this.ctx.stroke();
      }
      for (let y = -(window.innerWidth * 10); y <= frameHeight; y += rectHeight) {
        this.ctx.beginPath();
        this.ctx.moveTo(camera.transX(-(window.innerWidth * 10)), camera.transY(y));
        this.ctx.lineTo(camera.transX(frameWidth), camera.transY(y));
        this.ctx.stroke();
      }
    }
  };

  // src/renderer/master-rederer.ts
  var MasterRenderer = class {
    constructor(canvas) {
      this.postProcessManipulations = new Subject();
      this.canvas = canvas;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx = canvas.getContext("2d");
      this.nodeRenderer = new NodeRenderer(this.ctx);
      this.edgeRenderer = new EdgeRenderer(this.ctx);
      this.rasterRenderer = new RasterRenderer(this.ctx);
    }
    render(network, camera) {
      window.requestAnimationFrame(() => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rasterRenderer.render(camera);
        this.nodeRenderer.render([...network.nodes].reverse(), camera);
        this.edgeRenderer.render(network.edges, network.nodes, camera);
        this.postProcessManipulations.next(this.ctx);
      });
    }
  };

  // src/renderer/camera.ts
  var Camera = class {
    constructor() {
      this.x = 100;
      this.y = 100;
    }
    transX(x) {
      return x - this.x;
    }
    transY(y) {
      return y - this.y;
    }
    reverseX(x) {
      return x + this.x;
    }
    reverseY(y) {
      return y + this.y;
    }
  };

  // src/store/camera.store.ts
  var CameraStore = class extends BehaviorSubject {
    constructor() {
      super(new Camera());
    }
    updatePositionByDelta(x, y) {
      this.value.x = this.value.x + x;
      this.value.y = this.value.y + y;
      this.next(this.value);
    }
  };
  var cameraStore = new CameraStore();

  // src/tool/cursor.tool.ts
  var CursorTool = class {
    constructor(canvas, container, masterRenderer) {
      this.canvas = canvas;
      this.container = container;
      this.masterRenderer = masterRenderer;
      this.active = false;
      this.draggingViewport = false;
      this.draggingNode = null;
      this.draggingOffset = { x: 0, y: 0 };
      this.connectionCurrent = { x: 0, y: 0 };
      this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.canvas.addEventListener("contextmenu", this.onContextMenu.bind(this));
    }
    onMouseDown(ev) {
      const clickedNode = this.getNode(ev);
      const selection = this.getElement(ev);
      if (!clickedNode) {
        return this.draggingViewport = true;
      } else {
        if (this.connectionStart) {
          this.connectionSub.unsubscribe();
          if (selection && selection.type === "input") {
            networkManipulationStore.addEdge(
              this.connectionStart.element,
              selection.element,
              this.connectionStart.node,
              selection.node
            );
          } else {
            networkManipulationStore.next(networkManipulationStore.getNetwork());
          }
          this.connectionStart = null;
        }
        this.draggingNode = clickedNode;
        this.container.classList.add("cursor-dragging");
        this.draggingOffset = {
          x: ev.offsetX - clickedNode.x,
          y: ev.offsetY - clickedNode.y
        };
      }
    }
    onMouseMove(ev) {
      if (this.draggingViewport) {
        cameraStore.updatePositionByDelta(-ev.movementX, -ev.movementY);
      }
      if (this.draggingNode) {
        networkManipulationStore.updateNodePosition(
          this.draggingNode,
          ev.offsetX - this.draggingOffset.x,
          ev.offsetY - this.draggingOffset.y
        );
      }
      if (this.connectionStart) {
        const el = this.getElement(ev);
        if (el && el.type === "input") {
          const cam = cameraStore.getValue();
          this.connectionCurrent = {
            x: cam.transX(
              this.connectionStart.element.pos.x > el.element.x ? el.element.pos.x + el.element.pos.width : el.element.pos.x
            ),
            y: cam.transY(el.element.pos.y + linePadding / 2 + rowTextSize / 2)
          };
        } else {
          this.connectionCurrent = { x: ev.offsetX, y: ev.offsetY };
        }
        networkManipulationStore.next(networkManipulationStore.getNetwork());
      }
    }
    onMouseUp(ev) {
      this.draggingNode = null;
      this.container.classList.remove("cursor-dragging");
      this.draggingViewport = false;
    }
    onContextMenu(ev) {
      const node = this.getNode(ev);
      const el = this.getElement(ev);
      if (node && !el) {
        this.openContextMenuNode(node);
      }
      if (el) {
        this.openContextMenuElement(node, el);
      }
      ev.preventDefault();
    }
    openContextMenuNode(node) {
      if (this.menu) {
        document.body.removeChild(this.menu);
      }
      this.menu = document.createElement(
        "app-editor-context-menu"
      );
      this.updateElementPosition(node, this.menu);
      this.menu.setState({
        options: [
          {
            label: "inspect",
            callback: () => {
              this.openDetails(node);
              this.closeContextMenu();
            }
          },
          {
            label: "delete",
            callback: () => {
              this.deleteNode(node);
              this.closeContextMenu();
            }
          }
        ]
      });
      document.body.appendChild(this.menu);
    }
    closeContextMenu() {
      if (this.menu) {
        this.stopElementPosition(this.menu);
        document.body.removeChild(this.menu);
        this.menu = null;
      }
    }
    deleteNode(node) {
      networkManipulationStore.deleteNode(node);
    }
    openDetails(node) {
      if (this.details) {
        document.body.removeChild(this.details);
      }
      this.details = document.createElement(
        "app-node-details"
      );
      this.details.close = () => this.closeDetail();
      this.updateElementPosition(node, this.details);
      this.details.setAttribute(
        "networkId",
        networkManipulationStore.getNetwork().identifier
      );
      this.details.setAttribute("nodeId", node.identifier);
      document.body.appendChild(this.details);
    }
    closeDetail() {
      if (this.details) {
        this.stopElementPosition(this.details);
        document.body.removeChild(this.details);
        this.details = null;
      }
    }
    getNode(ev) {
      return getClickedNode(
        networkManipulationStore.getNetwork().nodes,
        cameraStore.getValue().reverseX(ev.offsetX),
        cameraStore.getValue().reverseY(ev.offsetY)
      );
    }
    getElement(ev) {
      return getClickedElement(
        networkManipulationStore.getNetwork().nodes,
        cameraStore.getValue().reverseX(ev.offsetX),
        cameraStore.getValue().reverseY(ev.offsetY)
      );
    }
    updateElementPosition(node, el) {
      el._positionUpdateSubscription = networkManipulationStore.pipe(
        startWith(""),
        mergeMap(() => cameraStore)
      ).subscribe((cam) => {
        console.log("a");
        const canvasPos = this.canvas.getBoundingClientRect();
        el.style.position = `fixed`;
        el.style.left = `${cam.transX(
          node.pos.x + canvasPos.left + node.pos.width + 10
        )}px`;
        el.style.top = `${cam.transY(node.pos.y + canvasPos.top)}px`;
      });
    }
    stopElementPosition(el) {
      if (el._positionUpdateSubscription) {
        el._positionUpdateSubscription.unsubscribe();
      }
    }
    openContextMenuElement(node, selection) {
      if (this.menu) {
        document.body.removeChild(this.menu);
      }
      if (selection.type !== "output")
        return;
      this.menu = document.createElement(
        "app-editor-context-menu"
      );
      this.updateElementPosition(node, this.menu);
      this.menu.setState({
        options: [
          {
            label: "connect",
            callback: () => {
              this.closeContextMenu();
              this.connectionStart = selection;
              this.connectionSub = this.masterRenderer.postProcessManipulations.pipe(
                switchMap(
                  (ctx) => cameraStore.pipe(
                    map((camera) => ({
                      camera,
                      ctx
                    }))
                  )
                )
              ).subscribe(({ ctx, camera }) => {
                ctx.lineWidth = 2;
                connect(
                  ctx,
                  {
                    x: camera.transX(
                      this.connectionStart.element.pos.x < this.connectionCurrent.x ? this.connectionStart.element.pos.x + this.connectionStart.element.pos.width : this.connectionStart.element.pos.x
                    ),
                    y: camera.transY(
                      this.connectionStart.element.pos.y + linePadding / 2 + rowTextSize / 2
                    )
                  },
                  this.connectionCurrent
                );
                ctx.lineWidth = 1;
              });
            }
          },
          {
            label: "clear",
            callback: () => {
              this.closeContextMenu();
              networkManipulationStore.removeEdge(
                selection.node,
                selection.element
              );
            }
          }
        ]
      });
      document.body.appendChild(this.menu);
    }
  };

  // src/component/editor.component.ts
  var initialState3 = {
    networkId: null
  };
  var EditorComponent = class extends StatefulComponent {
    constructor() {
      super(initialState3);
      this.tools = {};
    }
    async connectedCallback() {
      networkManipulationStore.pipe(
        switchMap(
          (network) => cameraStore.pipe(map((camera) => ({ camera, network })))
        )
      ).subscribe(({ network, camera }) => {
        if (this.masterRenderer)
          this.masterRenderer.render(network, camera);
        console.log("render");
      });
      if (this.hasAttribute("networkId")) {
        this.updateState({ networkId: this.getAttribute("networkId") });
        this.initializeWith(this.getAttribute("networkId"));
      } else {
        this.updateState({ networkId: networkManipulationStore.createNetwork() });
      }
    }
    static get observedAttributes() {
      return ["networkId"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (this.hasAttribute("networkId")) {
        this.initializeWith(this.getAttribute("networkId"));
      }
    }
    async initializeWith(networkId) {
      await networkManipulationStore.loadNetwork(networkId);
    }
    render(state) {
      this.innerHTML = `
            <app-toolbar networkId="${state.networkId}"></app-toolbar>
            <canvas data-js-id="canvas"></canvas>
            <app-notifications></app-notifications>
        `;
      const canvas = document.querySelector(
        '[data-js-id="canvas"]'
      );
      this.masterRenderer = new MasterRenderer(canvas);
      this.tools[0 /* CURSOR */] = new CursorTool(
        canvas,
        this,
        this.masterRenderer
      );
      return false;
    }
  };
  EditorComponent = __decorateClass([
    Component({
      selector: "app-editor"
    })
  ], EditorComponent);

  // src/component/cursor-context-menu.component.ts
  var initialState4 = {
    options: []
  };
  var ContextmenuComponent = class extends StatefulComponent {
    constructor() {
      super(initialState4);
    }
    static get observedAttributes() {
      return ["networkId"];
    }
    handleOption(ev) {
      const option = ev.target.closest("[js-option]");
      const optionIdx = Number.parseInt(option.getAttribute("js-option"));
      this.getState().options[optionIdx].callback();
    }
    render(state) {
      return `<div class="context-menu">
            ${state.options.map((option, idx) => {
        return `<button js-click="handleOption" js-option="${idx}">${option.label}</button>`;
      }).join("")}
        </div>`;
    }
  };
  ContextmenuComponent = __decorateClass([
    Component({
      selector: "app-editor-context-menu"
    })
  ], ContextmenuComponent);

  // src/component/node-details.component.ts
  var initialState5 = {
    node: null
  };
  var NodeDetailsComponent = class extends StatefulComponent {
    constructor() {
      super(initialState5);
    }
    connectedCallback() {
      super.connectedCallback();
      this.useStore("node", networksStore.select(nodeSelector(
        this.getAttribute("networkId"),
        this.getAttribute("nodeId")
      )));
    }
    static get observedAttributes() {
      return ["networkId", "nodeId"];
    }
    attributeChangedCallback() {
      this.useStore("node", networksStore.select(nodeSelector(
        this.getAttribute("networkId"),
        this.getAttribute("nodeId")
      )));
    }
    close() {
    }
    apply() {
      const node = this.getState().node;
      const name = this.querySelector("[js-input-name]").value;
      node.name = name;
      this.querySelectorAll("[js-input]").forEach((element) => {
        const input = element.getAttribute("js-input");
        const att = node.attributes.find((attribute) => attribute.identifier === input);
        att.value = element.value;
      });
      networkManipulationStore.updateNode(node);
      this.close();
    }
    render(state) {
      if (!state.node)
        return "";
      return `
            <div class="node-card details">
                
                <input js-input-name placeholder="Name" value="${state.node.name}" />
                <table>
                ${state.node.attributes.map((attribute) => `
                     <td class="label">${attribute.name}</td><td><input js-input="${attribute.identifier}" placeholder="${attribute.name}" value="${attribute.value}" /></td>
                 `).join("<tr></tr>")}
                </table>
                <div>
                    <button js-click="close">Close</button>
                    <button js-click="apply">Apply</button>
                </div>    
            </div>
        `;
    }
  };
  NodeDetailsComponent = __decorateClass([
    Component({
      selector: "app-node-details"
    })
  ], NodeDetailsComponent);

  // src/component/notification.component.ts
  var initialState6 = {
    notifications: []
  };
  var NotificationComponent = class extends StatefulComponent {
    constructor() {
      super(initialState6);
    }
    connectedCallback() {
      this.useStore("notifications", notificationStore);
    }
    render(state) {
      var _a;
      if (!((_a = state.notifications) == null ? void 0 : _a.length))
        return "Nope";
      return `
      <div class="notification-container">
        ${state.notifications.map(
        (notification) => `<div class="notification ${notification.type}">${notification.content}</div>`
      ).join("")}
      </div>
    `;
    }
  };
  NotificationComponent = __decorateClass([
    Component({
      selector: "app-notifications"
    })
  ], NotificationComponent);

  // src/main.ts
  OpenAPI.BASE = "http://localhost:3000";
})();
