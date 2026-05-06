var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// functions/node_modules/@vercel/functions/headers.js
var require_headers = __commonJS({
  "functions/node_modules/@vercel/functions/headers.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var headers_exports = {};
    __export2(headers_exports, {
      CITY_HEADER_NAME: () => CITY_HEADER_NAME,
      COUNTRY_HEADER_NAME: () => COUNTRY_HEADER_NAME,
      EMOJI_FLAG_UNICODE_STARTING_POSITION: () => EMOJI_FLAG_UNICODE_STARTING_POSITION,
      IP_HEADER_NAME: () => IP_HEADER_NAME,
      LATITUDE_HEADER_NAME: () => LATITUDE_HEADER_NAME,
      LONGITUDE_HEADER_NAME: () => LONGITUDE_HEADER_NAME,
      POSTAL_CODE_HEADER_NAME: () => POSTAL_CODE_HEADER_NAME,
      REGION_HEADER_NAME: () => REGION_HEADER_NAME,
      REQUEST_ID_HEADER_NAME: () => REQUEST_ID_HEADER_NAME,
      geolocation: () => geolocation2,
      ipAddress: () => ipAddress2
    });
    module2.exports = __toCommonJS2(headers_exports);
    var CITY_HEADER_NAME = "x-vercel-ip-city";
    var COUNTRY_HEADER_NAME = "x-vercel-ip-country";
    var IP_HEADER_NAME = "x-real-ip";
    var LATITUDE_HEADER_NAME = "x-vercel-ip-latitude";
    var LONGITUDE_HEADER_NAME = "x-vercel-ip-longitude";
    var REGION_HEADER_NAME = "x-vercel-ip-country-region";
    var POSTAL_CODE_HEADER_NAME = "x-vercel-ip-postal-code";
    var REQUEST_ID_HEADER_NAME = "x-vercel-id";
    var EMOJI_FLAG_UNICODE_STARTING_POSITION = 127397;
    function getHeader(headers, key) {
      return headers.get(key) ?? void 0;
    }
    function getHeaderWithDecode(request, key) {
      const header = getHeader(request.headers, key);
      return header ? decodeURIComponent(header) : void 0;
    }
    function getFlag(countryCode) {
      const regex = new RegExp("^[A-Z]{2}$").test(countryCode);
      if (!countryCode || !regex)
        return void 0;
      return String.fromCodePoint(
        ...countryCode.split("").map((char) => EMOJI_FLAG_UNICODE_STARTING_POSITION + char.charCodeAt(0))
      );
    }
    function ipAddress2(input) {
      const headers = "headers" in input ? input.headers : input;
      return getHeader(headers, IP_HEADER_NAME);
    }
    function getRegionFromRequestId(requestId) {
      if (!requestId) {
        return "dev1";
      }
      return requestId.split(":")[0];
    }
    function geolocation2(request) {
      return {
        // city name may be encoded to support multi-byte characters
        city: getHeaderWithDecode(request, CITY_HEADER_NAME),
        country: getHeader(request.headers, COUNTRY_HEADER_NAME),
        flag: getFlag(getHeader(request.headers, COUNTRY_HEADER_NAME)),
        countryRegion: getHeader(request.headers, REGION_HEADER_NAME),
        region: getRegionFromRequestId(
          getHeader(request.headers, REQUEST_ID_HEADER_NAME)
        ),
        latitude: getHeader(request.headers, LATITUDE_HEADER_NAME),
        longitude: getHeader(request.headers, LONGITUDE_HEADER_NAME),
        postalCode: getHeader(request.headers, POSTAL_CODE_HEADER_NAME)
      };
    }
  }
});

// functions/node_modules/@vercel/functions/get-env.js
var require_get_env = __commonJS({
  "functions/node_modules/@vercel/functions/get-env.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var get_env_exports = {};
    __export2(get_env_exports, {
      getEnv: () => getEnv3
    });
    module2.exports = __toCommonJS2(get_env_exports);
    var getEnv3 = (env = process.env) => ({
      /**
       * An indicator to show that System Environment Variables have been exposed to your project's Deployments.
       * @example "1"
       */
      VERCEL: get(env, "VERCEL"),
      /**
       * An indicator that the code is running in a Continuous Integration environment.
       * @example "1"
       */
      CI: get(env, "CI"),
      /**
       * The Environment that the app is deployed and running on.
       * @example "production"
       */
      VERCEL_ENV: get(env, "VERCEL_ENV"),
      /**
       * The domain name of the generated deployment URL. The value does not include the protocol scheme https://.
       * NOTE: This Variable cannot be used in conjunction with Standard Deployment Protection.
       * @example "*.vercel.app"
       */
      VERCEL_URL: get(env, "VERCEL_URL"),
      /**
       * The domain name of the generated Git branch URL. The value does not include the protocol scheme https://.
       * @example "*-git-*.vercel.app"
       */
      VERCEL_BRANCH_URL: get(env, "VERCEL_BRANCH_URL"),
      /**
       * A production domain name of the project. This is useful to reliably generate links that point to production such as OG-image URLs.
       * The value does not include the protocol scheme https://.
       * @example "myproject.vercel.app"
       */
      VERCEL_PROJECT_PRODUCTION_URL: get(env, "VERCEL_PROJECT_PRODUCTION_URL"),
      /**
       * The ID of the Region where the app is running.
       *
       * Possible values:
       * - arn1 (Stockholm, Sweden)
       * - bom1 (Mumbai, India)
       * - cdg1 (Paris, France)
       * - cle1 (Cleveland, USA)
       * - cpt1 (Cape Town, South Africa)
       * - dub1 (Dublin, Ireland)
       * - fra1 (Frankfurt, Germany)
       * - gru1 (São Paulo, Brazil)
       * - hkg1 (Hong Kong)
       * - hnd1 (Tokyo, Japan)
       * - iad1 (Washington, D.C., USA)
       * - icn1 (Seoul, South Korea)
       * - kix1 (Osaka, Japan)
       * - lhr1 (London, United Kingdom)
       * - pdx1 (Portland, USA)
       * - sfo1 (San Francisco, USA)
       * - sin1 (Singapore)
       * - syd1 (Sydney, Australia)
       * - dev1 (Development Region)
       *
       * @example "iad1"
       */
      VERCEL_REGION: get(env, "VERCEL_REGION"),
      /**
       * The unique identifier for the deployment, which can be used to implement Skew Protection.
       * @example "dpl_7Gw5ZMBpQA8h9GF832KGp7nwbuh3"
       */
      VERCEL_DEPLOYMENT_ID: get(env, "VERCEL_DEPLOYMENT_ID"),
      /**
       * When Skew Protection is enabled in Project Settings, this value is set to 1.
       * @example "1"
       */
      VERCEL_SKEW_PROTECTION_ENABLED: get(env, "VERCEL_SKEW_PROTECTION_ENABLED"),
      /**
       * The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
       */
      VERCEL_AUTOMATION_BYPASS_SECRET: get(env, "VERCEL_AUTOMATION_BYPASS_SECRET"),
      /**
       * The Git Provider the deployment is triggered from.
       * @example "github"
       */
      VERCEL_GIT_PROVIDER: get(env, "VERCEL_GIT_PROVIDER"),
      /**
       * The origin repository the deployment is triggered from.
       * @example "my-site"
       */
      VERCEL_GIT_REPO_SLUG: get(env, "VERCEL_GIT_REPO_SLUG"),
      /**
       * The account that owns the repository the deployment is triggered from.
       * @example "acme"
       */
      VERCEL_GIT_REPO_OWNER: get(env, "VERCEL_GIT_REPO_OWNER"),
      /**
       * The ID of the repository the deployment is triggered from.
       * @example "117716146"
       */
      VERCEL_GIT_REPO_ID: get(env, "VERCEL_GIT_REPO_ID"),
      /**
       * The git branch of the commit the deployment was triggered by.
       * @example "improve-about-page"
       */
      VERCEL_GIT_COMMIT_REF: get(env, "VERCEL_GIT_COMMIT_REF"),
      /**
       * The git SHA of the commit the deployment was triggered by.
       * @example "fa1eade47b73733d6312d5abfad33ce9e4068081"
       */
      VERCEL_GIT_COMMIT_SHA: get(env, "VERCEL_GIT_COMMIT_SHA"),
      /**
       * The message attached to the commit the deployment was triggered by.
       * @example "Update about page"
       */
      VERCEL_GIT_COMMIT_MESSAGE: get(env, "VERCEL_GIT_COMMIT_MESSAGE"),
      /**
       * The username attached to the author of the commit that the project was deployed by.
       * @example "johndoe"
       */
      VERCEL_GIT_COMMIT_AUTHOR_LOGIN: get(env, "VERCEL_GIT_COMMIT_AUTHOR_LOGIN"),
      /**
       * The name attached to the author of the commit that the project was deployed by.
       * @example "John Doe"
       */
      VERCEL_GIT_COMMIT_AUTHOR_NAME: get(env, "VERCEL_GIT_COMMIT_AUTHOR_NAME"),
      /**
       * The git SHA of the last successful deployment for the project and branch.
       * NOTE: This Variable is only exposed when an Ignored Build Step is provided.
       * @example "fa1eade47b73733d6312d5abfad33ce9e4068080"
       */
      VERCEL_GIT_PREVIOUS_SHA: get(env, "VERCEL_GIT_PREVIOUS_SHA"),
      /**
       * The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string.
       * @example "23"
       */
      VERCEL_GIT_PULL_REQUEST_ID: get(env, "VERCEL_GIT_PULL_REQUEST_ID")
    });
    var get = (env, key) => {
      const value = env[key];
      return value === "" ? void 0 : value;
    };
  }
});

// functions/node_modules/@vercel/functions/get-context.js
var require_get_context = __commonJS({
  "functions/node_modules/@vercel/functions/get-context.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var get_context_exports = {};
    __export2(get_context_exports, {
      SYMBOL_FOR_REQ_CONTEXT: () => SYMBOL_FOR_REQ_CONTEXT,
      getContext: () => getContext
    });
    module2.exports = __toCommonJS2(get_context_exports);
    var SYMBOL_FOR_REQ_CONTEXT = Symbol.for("@vercel/request-context");
    function getContext() {
      const fromSymbol = globalThis;
      return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
    }
  }
});

// functions/node_modules/@vercel/functions/wait-until.js
var require_wait_until = __commonJS({
  "functions/node_modules/@vercel/functions/wait-until.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var wait_until_exports = {};
    __export2(wait_until_exports, {
      waitUntil: () => waitUntil2
    });
    module2.exports = __toCommonJS2(wait_until_exports);
    var import_get_context = require_get_context();
    var waitUntil2 = (promise) => {
      if (promise === null || typeof promise !== "object" || typeof promise.then !== "function") {
        throw new TypeError(
          `waitUntil can only be called with a Promise, got ${typeof promise}`
        );
      }
      return (0, import_get_context.getContext)().waitUntil?.(promise);
    };
  }
});

// functions/node_modules/@vercel/functions/middleware.js
var require_middleware = __commonJS({
  "functions/node_modules/@vercel/functions/middleware.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var middleware_exports = {};
    __export2(middleware_exports, {
      next: () => next2,
      rewrite: () => rewrite2
    });
    module2.exports = __toCommonJS2(middleware_exports);
    function handleMiddlewareField(init, headers) {
      if (init?.request?.headers) {
        if (!(init.request.headers instanceof Headers)) {
          throw new Error("request.headers must be an instance of Headers");
        }
        const keys = [];
        for (const [key, value] of init.request.headers) {
          headers.set("x-middleware-request-" + key, value);
          keys.push(key);
        }
        headers.set("x-middleware-override-headers", keys.join(","));
      }
    }
    function rewrite2(destination, init) {
      const headers = new Headers(init?.headers ?? {});
      headers.set("x-middleware-rewrite", String(destination));
      handleMiddlewareField(init, headers);
      return new Response(null, {
        ...init,
        headers
      });
    }
    function next2(init) {
      const headers = new Headers(init?.headers ?? {});
      headers.set("x-middleware-next", "1");
      handleMiddlewareField(init, headers);
      return new Response(null, {
        ...init,
        headers
      });
    }
  }
});

// functions/node_modules/@vercel/functions/cache/in-memory-cache.js
var require_in_memory_cache = __commonJS({
  "functions/node_modules/@vercel/functions/cache/in-memory-cache.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var in_memory_cache_exports = {};
    __export2(in_memory_cache_exports, {
      InMemoryCache: () => InMemoryCache
    });
    module2.exports = __toCommonJS2(in_memory_cache_exports);
    var InMemoryCache = class {
      constructor() {
        this.cache = {};
      }
      async get(key) {
        const entry = this.cache[key];
        if (entry) {
          if (entry.ttl && entry.lastModified + entry.ttl * 1e3 < Date.now()) {
            await this.delete(key);
            return null;
          }
          return JSON.parse(entry.value);
        }
        return null;
      }
      async set(key, value, options) {
        const serialized = JSON.stringify(value ?? null);
        this.cache[key] = {
          value: serialized,
          lastModified: Date.now(),
          ttl: options?.ttl,
          tags: new Set(options?.tags || [])
        };
      }
      async delete(key) {
        delete this.cache[key];
      }
      async expireTag(tag) {
        const tags = Array.isArray(tag) ? tag : [tag];
        for (const key in this.cache) {
          if (Object.prototype.hasOwnProperty.call(this.cache, key)) {
            const entry = this.cache[key];
            if (tags.some((t) => entry.tags.has(t))) {
              delete this.cache[key];
            }
          }
        }
      }
    };
  }
});

// functions/node_modules/@vercel/functions/cache/build-client.js
var require_build_client = __commonJS({
  "functions/node_modules/@vercel/functions/cache/build-client.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var build_client_exports = {};
    __export2(build_client_exports, {
      BuildCache: () => BuildCache
    });
    module2.exports = __toCommonJS2(build_client_exports);
    var import_index = require_cache();
    var BuildCache = class {
      constructor({
        endpoint,
        headers,
        onError,
        timeout = 500
      }) {
        this.get = async (key) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            const res = await fetch(`${this.endpoint}${key}`, {
              headers: this.headers,
              method: "GET",
              signal: controller.signal
            });
            if (res.status === 404) {
              clearTimeout(timeoutId);
              return null;
            }
            if (res.status === 200) {
              const cacheState = res.headers.get(
                import_index.HEADERS_VERCEL_CACHE_STATE
              );
              if (cacheState !== import_index.PkgCacheState.Fresh) {
                res.body?.cancel?.();
                clearTimeout(timeoutId);
                return null;
              }
              const result = await res.json();
              clearTimeout(timeoutId);
              return result;
            } else {
              clearTimeout(timeoutId);
              throw new Error(`Failed to get cache: ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(
                `Cache request timed out after ${this.timeout}ms`
              );
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
            return null;
          }
        };
        this.set = async (key, value, options) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            const optionalHeaders = {};
            if (options?.ttl) {
              optionalHeaders[import_index.HEADERS_VERCEL_REVALIDATE] = options.ttl.toString();
            }
            if (options?.tags && options.tags.length > 0) {
              optionalHeaders[import_index.HEADERS_VERCEL_CACHE_TAGS] = options.tags.join(",");
            }
            if (options?.name) {
              optionalHeaders[import_index.HEADERS_VERCEL_CACHE_ITEM_NAME] = options.name;
            }
            const res = await fetch(`${this.endpoint}${key}`, {
              method: "POST",
              headers: {
                ...this.headers,
                ...optionalHeaders
              },
              body: JSON.stringify(value),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.status !== 200) {
              throw new Error(`Failed to set cache: ${res.status} ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(
                `Cache request timed out after ${this.timeout}ms`
              );
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
          }
        };
        this.delete = async (key) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            const res = await fetch(`${this.endpoint}${key}`, {
              method: "DELETE",
              headers: this.headers,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.status !== 200) {
              throw new Error(`Failed to delete cache: ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(
                `Cache request timed out after ${this.timeout}ms`
              );
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
          }
        };
        this.expireTag = async (tag) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            if (Array.isArray(tag)) {
              tag = tag.join(",");
            }
            const res = await fetch(`${this.endpoint}revalidate?tags=${tag}`, {
              method: "POST",
              headers: this.headers,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.status !== 200) {
              throw new Error(`Failed to revalidate tag: ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(
                `Cache request timed out after ${this.timeout}ms`
              );
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
          }
        };
        this.endpoint = endpoint;
        this.headers = headers;
        this.onError = onError;
        this.timeout = timeout;
      }
    };
  }
});

// functions/node_modules/@vercel/functions/cache/index.js
var require_cache = __commonJS({
  "functions/node_modules/@vercel/functions/cache/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var cache_exports = {};
    __export2(cache_exports, {
      HEADERS_VERCEL_CACHE_ITEM_NAME: () => HEADERS_VERCEL_CACHE_ITEM_NAME,
      HEADERS_VERCEL_CACHE_STATE: () => HEADERS_VERCEL_CACHE_STATE,
      HEADERS_VERCEL_CACHE_TAGS: () => HEADERS_VERCEL_CACHE_TAGS,
      HEADERS_VERCEL_REVALIDATE: () => HEADERS_VERCEL_REVALIDATE,
      PkgCacheState: () => PkgCacheState,
      getCache: () => getCache3
    });
    module2.exports = __toCommonJS2(cache_exports);
    var import_get_context = require_get_context();
    var import_in_memory_cache = require_in_memory_cache();
    var import_build_client = require_build_client();
    var defaultKeyHashFunction = (key) => {
      let hash = 5381;
      for (let i = 0; i < key.length; i++) {
        hash = hash * 33 ^ key.charCodeAt(i);
      }
      return (hash >>> 0).toString(16);
    };
    var defaultNamespaceSeparator = "$";
    var inMemoryCacheInstance = null;
    var buildCacheInstance = null;
    var getCache3 = (cacheOptions) => {
      const resolveCache = () => {
        let cache;
        if ((0, import_get_context.getContext)().cache) {
          cache = (0, import_get_context.getContext)().cache;
        } else {
          cache = getCacheImplementation(
            process.env.SUSPENSE_CACHE_DEBUG === "true"
          );
        }
        return cache;
      };
      return wrapWithKeyTransformation(
        resolveCache,
        createKeyTransformer(cacheOptions)
      );
    };
    function createKeyTransformer(cacheOptions) {
      const hashFunction = cacheOptions?.keyHashFunction || defaultKeyHashFunction;
      return (key) => {
        if (!cacheOptions?.namespace)
          return hashFunction(key);
        const separator = cacheOptions.namespaceSeparator || defaultNamespaceSeparator;
        return `${cacheOptions.namespace}${separator}${hashFunction(key)}`;
      };
    }
    function wrapWithKeyTransformation(resolveCache, makeKey) {
      return {
        get: (key) => {
          return resolveCache().get(makeKey(key));
        },
        set: (key, value, options) => {
          return resolveCache().set(makeKey(key), value, options);
        },
        delete: (key) => {
          return resolveCache().delete(makeKey(key));
        },
        expireTag: (tag) => {
          return resolveCache().expireTag(tag);
        }
      };
    }
    var warnedCacheUnavailable = false;
    function getCacheImplementation(debug) {
      if (!inMemoryCacheInstance) {
        inMemoryCacheInstance = new import_in_memory_cache.InMemoryCache();
      }
      if (process.env.RUNTIME_CACHE_DISABLE_BUILD_CACHE === "true") {
        debug && console.log("Using InMemoryCache as build cache is disabled");
        return inMemoryCacheInstance;
      }
      const { RUNTIME_CACHE_ENDPOINT, RUNTIME_CACHE_HEADERS } = process.env;
      if (debug) {
        console.log("Runtime cache environment variables:", {
          RUNTIME_CACHE_ENDPOINT,
          RUNTIME_CACHE_HEADERS
        });
      }
      if (!RUNTIME_CACHE_ENDPOINT || !RUNTIME_CACHE_HEADERS) {
        if (!warnedCacheUnavailable) {
          console.warn(
            "Runtime Cache unavailable in this environment. Falling back to in-memory cache."
          );
          warnedCacheUnavailable = true;
        }
        return inMemoryCacheInstance;
      }
      if (!buildCacheInstance) {
        let parsedHeaders = {};
        try {
          parsedHeaders = JSON.parse(RUNTIME_CACHE_HEADERS);
        } catch (e) {
          console.error("Failed to parse RUNTIME_CACHE_HEADERS:", e);
          return inMemoryCacheInstance;
        }
        let timeout = 500;
        if (process.env.RUNTIME_CACHE_TIMEOUT) {
          const parsed = parseInt(process.env.RUNTIME_CACHE_TIMEOUT, 10);
          if (!isNaN(parsed) && parsed > 0) {
            timeout = parsed;
          } else {
            console.warn(
              `Invalid RUNTIME_CACHE_TIMEOUT value: "${process.env.RUNTIME_CACHE_TIMEOUT}". Using default: ${timeout}ms`
            );
          }
        }
        buildCacheInstance = new import_build_client.BuildCache({
          endpoint: RUNTIME_CACHE_ENDPOINT,
          headers: parsedHeaders,
          onError: (error) => console.error(error),
          timeout
        });
      }
      return buildCacheInstance;
    }
    var PkgCacheState = /* @__PURE__ */ ((PkgCacheState2) => {
      PkgCacheState2["Fresh"] = "fresh";
      PkgCacheState2["Stale"] = "stale";
      PkgCacheState2["Expired"] = "expired";
      PkgCacheState2["NotFound"] = "notFound";
      PkgCacheState2["Error"] = "error";
      return PkgCacheState2;
    })(PkgCacheState || {});
    var HEADERS_VERCEL_CACHE_STATE = "x-vercel-cache-state";
    var HEADERS_VERCEL_REVALIDATE = "x-vercel-revalidate";
    var HEADERS_VERCEL_CACHE_TAGS = "x-vercel-cache-tags";
    var HEADERS_VERCEL_CACHE_ITEM_NAME = "x-vercel-cache-item-name";
  }
});

// functions/node_modules/@vercel/functions/db-connections/index.js
var require_db_connections = __commonJS({
  "functions/node_modules/@vercel/functions/db-connections/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var db_connections_exports = {};
    __export2(db_connections_exports, {
      attachDatabasePool: () => attachDatabasePool2,
      experimental_attachDatabasePool: () => experimental_attachDatabasePool2
    });
    module2.exports = __toCommonJS2(db_connections_exports);
    var import_get_context = require_get_context();
    var DEBUG = !!process.env.DEBUG;
    function getIdleTimeout(dbPool) {
      if ("options" in dbPool && dbPool.options) {
        if ("idleTimeoutMillis" in dbPool.options) {
          return typeof dbPool.options.idleTimeoutMillis === "number" ? dbPool.options.idleTimeoutMillis : 1e4;
        }
        if ("maxIdleTimeMS" in dbPool.options) {
          return typeof dbPool.options.maxIdleTimeMS === "number" ? dbPool.options.maxIdleTimeMS : 0;
        }
        if ("status" in dbPool) {
          return 5e3;
        }
        if ("connect" in dbPool && "execute" in dbPool) {
          return 3e4;
        }
      }
      if ("config" in dbPool && dbPool.config) {
        if ("connectionConfig" in dbPool.config && dbPool.config.connectionConfig) {
          return dbPool.config.connectionConfig.idleTimeout || 6e4;
        }
        if ("idleTimeout" in dbPool.config) {
          return typeof dbPool.config.idleTimeout === "number" ? dbPool.config.idleTimeout : 6e4;
        }
      }
      if ("poolTimeout" in dbPool) {
        return typeof dbPool.poolTimeout === "number" ? dbPool.poolTimeout : 6e4;
      }
      if ("idleTimeout" in dbPool) {
        return typeof dbPool.idleTimeout === "number" ? dbPool.idleTimeout : 0;
      }
      return 1e4;
    }
    var idleTimeout = null;
    var idleTimeoutResolve = () => {
    };
    var bootTime = Date.now();
    var maximumDuration = 15 * 60 * 1e3 - 1e3;
    function waitUntilIdleTimeout(dbPool) {
      if (!process.env.VERCEL_URL || // This is not set during builds where we don't need to wait for idle connections using the mechanism
      !process.env.VERCEL_REGION) {
        return;
      }
      if (idleTimeout) {
        clearTimeout(idleTimeout);
        idleTimeoutResolve();
      }
      const promise = new Promise((resolve) => {
        idleTimeoutResolve = resolve;
      });
      const waitTime = Math.min(
        getIdleTimeout(dbPool) + 100,
        Math.max(100, maximumDuration - (Date.now() - bootTime))
      );
      idleTimeout = setTimeout(() => {
        idleTimeoutResolve?.();
        if (DEBUG) {
          console.log("Database pool idle timeout reached. Releasing connections.");
        }
      }, waitTime);
      const requestContext = (0, import_get_context.getContext)();
      if (requestContext?.waitUntil) {
        requestContext.waitUntil(promise);
      } else {
        console.warn("Pool release event triggered outside of request scope.");
      }
    }
    function attachDatabasePool2(dbPool) {
      if (idleTimeout) {
        idleTimeoutResolve?.();
        clearTimeout(idleTimeout);
      }
      if ("on" in dbPool && dbPool.on && "options" in dbPool && "idleTimeoutMillis" in dbPool.options) {
        const pgPool = dbPool;
        pgPool.on("release", () => {
          if (DEBUG) {
            console.log("Client released from pool");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      } else if ("on" in dbPool && dbPool.on && "config" in dbPool && dbPool.config && "connectionConfig" in dbPool.config) {
        const mysqlPool = dbPool;
        mysqlPool.on("release", () => {
          if (DEBUG) {
            console.log("MySQL client released from pool");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      } else if ("on" in dbPool && dbPool.on && "config" in dbPool && dbPool.config && "idleTimeout" in dbPool.config) {
        const mysql2Pool = dbPool;
        mysql2Pool.on("release", () => {
          if (DEBUG) {
            console.log("MySQL2/MariaDB client released from pool");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      }
      if ("on" in dbPool && dbPool.on && "options" in dbPool && dbPool.options && "maxIdleTimeMS" in dbPool.options) {
        const mongoPool = dbPool;
        mongoPool.on("connectionCheckedOut", () => {
          if (DEBUG) {
            console.log("MongoDB connection checked out");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      }
      if ("on" in dbPool && dbPool.on && "options" in dbPool && dbPool.options && "socket" in dbPool.options) {
        const redisPool = dbPool;
        redisPool.on("end", () => {
          if (DEBUG) {
            console.log("Redis connection ended");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      }
      throw new Error("Unsupported database pool type");
    }
    var experimental_attachDatabasePool2 = attachDatabasePool2;
  }
});

// functions/node_modules/@vercel/functions/purge/index.js
var require_purge = __commonJS({
  "functions/node_modules/@vercel/functions/purge/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var purge_exports = {};
    __export2(purge_exports, {
      dangerouslyDeleteBySrcImage: () => dangerouslyDeleteBySrcImage2,
      dangerouslyDeleteByTag: () => dangerouslyDeleteByTag2,
      invalidateBySrcImage: () => invalidateBySrcImage2,
      invalidateByTag: () => invalidateByTag2
    });
    module2.exports = __toCommonJS2(purge_exports);
    var import_get_context = require_get_context();
    var invalidateByTag2 = (tag) => {
      const api = (0, import_get_context.getContext)().purge;
      if (api) {
        return api.invalidateByTag(tag);
      }
      return Promise.resolve();
    };
    var dangerouslyDeleteByTag2 = (tag, options) => {
      const api = (0, import_get_context.getContext)().purge;
      if (api) {
        return api.dangerouslyDeleteByTag(tag, options);
      }
      return Promise.resolve();
    };
    var invalidateBySrcImage2 = (src) => {
      const api = (0, import_get_context.getContext)().purge;
      return api ? api.invalidateBySrcImage(src) : Promise.resolve();
    };
    var dangerouslyDeleteBySrcImage2 = (src, options) => {
      const api = (0, import_get_context.getContext)().purge;
      return api ? api.dangerouslyDeleteBySrcImage(src, options) : Promise.resolve();
    };
  }
});

// functions/node_modules/@vercel/functions/addcachetag/index.js
var require_addcachetag = __commonJS({
  "functions/node_modules/@vercel/functions/addcachetag/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var addcachetag_exports = {};
    __export2(addcachetag_exports, {
      addCacheTag: () => addCacheTag2
    });
    module2.exports = __toCommonJS2(addcachetag_exports);
    var import_get_context = require_get_context();
    var addCacheTag2 = (tag) => {
      const addCacheTag22 = (0, import_get_context.getContext)().addCacheTag;
      if (addCacheTag22) {
        return addCacheTag22(tag);
      }
      return Promise.resolve();
    };
  }
});

// functions/node_modules/@vercel/functions/index.js
var require_functions = __commonJS({
  "functions/node_modules/@vercel/functions/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export2(src_exports, {
      addCacheTag: () => import_addcachetag.addCacheTag,
      attachDatabasePool: () => import_db_connections.attachDatabasePool,
      dangerouslyDeleteBySrcImage: () => import_purge.dangerouslyDeleteBySrcImage,
      dangerouslyDeleteByTag: () => import_purge.dangerouslyDeleteByTag,
      experimental_attachDatabasePool: () => import_db_connections.experimental_attachDatabasePool,
      geolocation: () => import_headers.geolocation,
      getCache: () => import_cache.getCache,
      getEnv: () => import_get_env.getEnv,
      invalidateBySrcImage: () => import_purge.invalidateBySrcImage,
      invalidateByTag: () => import_purge.invalidateByTag,
      ipAddress: () => import_headers.ipAddress,
      next: () => import_middleware.next,
      rewrite: () => import_middleware.rewrite,
      waitUntil: () => import_wait_until.waitUntil
    });
    module2.exports = __toCommonJS2(src_exports);
    var import_headers = require_headers();
    var import_get_env = require_get_env();
    var import_wait_until = require_wait_until();
    var import_middleware = require_middleware();
    var import_cache = require_cache();
    var import_db_connections = require_db_connections();
    var import_purge = require_purge();
    var import_addcachetag = require_addcachetag();
  }
});

// functions/pls-script.ts
var pls_script_exports = {};
__export(pls_script_exports, {
  default: () => pls_script_default
});
module.exports = __toCommonJS(pls_script_exports);
var import_functions = __toESM(require_functions());
var runtimeCacheDuration = 86400 * 7;
var clientCacheDuration = 32400;
var pls_script_default = {
  async fetch(request) {
    const upstreamUrl = process.env.PLAUSIBLE_SCRIPT;
    if (!upstreamUrl) {
      return new Response("", {
        status: 204,
        headers: {
          "cache-control": "no-cache"
        }
      });
    }
    let scriptContent;
    let headers;
    let cache;
    const { VERCEL, VERCEL_DEPLOYMENT_ID } = (0, import_functions.getEnv)();
    if (VERCEL == "1") {
      cache = (0, import_functions.getCache)({
        namespace: VERCEL_DEPLOYMENT_ID
      });
      const cached = await cache.get(upstreamUrl);
      if (cached) {
        scriptContent = cached.content;
        headers = new Headers(cached.headers);
      }
    }
    if (!scriptContent || !headers) {
      try {
        const requestHeaders = new Headers();
        const oidcToken = request.headers.get("x-vercel-oidc-token");
        if (oidcToken) {
          requestHeaders.set("authorization", "Bearer " + oidcToken);
        }
        const upstreamResponse = await fetch(upstreamUrl, {
          headers: requestHeaders
        });
        if (!upstreamResponse.ok) {
          const text = await upstreamResponse.text();
          throw new Error(`Failed to fetch script with status code ${upstreamResponse.status}: ${text}`);
        }
        scriptContent = await upstreamResponse.text();
        const preserveHeaders = [
          "access-control-allow-origin",
          "content-type",
          "cross-origin-resource-policy",
          "last-modified"
        ];
        const responseHeaders = {};
        for (const key of upstreamResponse.headers.keys()) {
          if (preserveHeaders.includes(key)) {
            responseHeaders[key] = upstreamResponse.headers.get(key);
          }
        }
        headers = new Headers(responseHeaders);
        if (cache) {
          cache.set(upstreamUrl, { content: scriptContent, headers: responseHeaders }, {
            ttl: runtimeCacheDuration,
            tags: ["plausible"]
          });
        }
      } catch (error) {
        console.error("Error proxying script: " + error);
        return new Response("Error proxying script", { status: 500 });
      }
    }
    const num = Math.floor(Math.random() * 1e5);
    if (Math.random() < 0.5) {
      scriptContent += `
;'` + num + `'`;
    } else {
      scriptContent = `'` + num + `';
` + scriptContent;
    }
    headers.set("Cache-Control", `public, max-age=${clientCacheDuration}`);
    return new Response(scriptContent, {
      status: 200,
      headers
    });
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL0B2ZXJjZWwvZnVuY3Rpb25zL2hlYWRlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0B2ZXJjZWwvZnVuY3Rpb25zL2dldC1lbnYuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0B2ZXJjZWwvZnVuY3Rpb25zL2dldC1jb250ZXh0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AdmVyY2VsL2Z1bmN0aW9ucy93YWl0LXVudGlsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AdmVyY2VsL2Z1bmN0aW9ucy9taWRkbGV3YXJlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AdmVyY2VsL2Z1bmN0aW9ucy9jYWNoZS9pbi1tZW1vcnktY2FjaGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0B2ZXJjZWwvZnVuY3Rpb25zL2NhY2hlL2J1aWxkLWNsaWVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHZlcmNlbC9mdW5jdGlvbnMvY2FjaGUvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL0B2ZXJjZWwvZnVuY3Rpb25zL2RiLWNvbm5lY3Rpb25zL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AdmVyY2VsL2Z1bmN0aW9ucy9wdXJnZS9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvQHZlcmNlbC9mdW5jdGlvbnMvYWRkY2FjaGV0YWcvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL0B2ZXJjZWwvZnVuY3Rpb25zL2luZGV4LmpzIiwgIi4uL3Bscy1zY3JpcHQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19leHBvcnQgPSAodGFyZ2V0LCBhbGwpID0+IHtcbiAgZm9yICh2YXIgbmFtZSBpbiBhbGwpXG4gICAgX19kZWZQcm9wKHRhcmdldCwgbmFtZSwgeyBnZXQ6IGFsbFtuYW1lXSwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbn07XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX190b0NvbW1vbkpTID0gKG1vZCkgPT4gX19jb3B5UHJvcHMoX19kZWZQcm9wKHt9LCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KSwgbW9kKTtcbnZhciBoZWFkZXJzX2V4cG9ydHMgPSB7fTtcbl9fZXhwb3J0KGhlYWRlcnNfZXhwb3J0cywge1xuICBDSVRZX0hFQURFUl9OQU1FOiAoKSA9PiBDSVRZX0hFQURFUl9OQU1FLFxuICBDT1VOVFJZX0hFQURFUl9OQU1FOiAoKSA9PiBDT1VOVFJZX0hFQURFUl9OQU1FLFxuICBFTU9KSV9GTEFHX1VOSUNPREVfU1RBUlRJTkdfUE9TSVRJT046ICgpID0+IEVNT0pJX0ZMQUdfVU5JQ09ERV9TVEFSVElOR19QT1NJVElPTixcbiAgSVBfSEVBREVSX05BTUU6ICgpID0+IElQX0hFQURFUl9OQU1FLFxuICBMQVRJVFVERV9IRUFERVJfTkFNRTogKCkgPT4gTEFUSVRVREVfSEVBREVSX05BTUUsXG4gIExPTkdJVFVERV9IRUFERVJfTkFNRTogKCkgPT4gTE9OR0lUVURFX0hFQURFUl9OQU1FLFxuICBQT1NUQUxfQ09ERV9IRUFERVJfTkFNRTogKCkgPT4gUE9TVEFMX0NPREVfSEVBREVSX05BTUUsXG4gIFJFR0lPTl9IRUFERVJfTkFNRTogKCkgPT4gUkVHSU9OX0hFQURFUl9OQU1FLFxuICBSRVFVRVNUX0lEX0hFQURFUl9OQU1FOiAoKSA9PiBSRVFVRVNUX0lEX0hFQURFUl9OQU1FLFxuICBnZW9sb2NhdGlvbjogKCkgPT4gZ2VvbG9jYXRpb24sXG4gIGlwQWRkcmVzczogKCkgPT4gaXBBZGRyZXNzXG59KTtcbm1vZHVsZS5leHBvcnRzID0gX190b0NvbW1vbkpTKGhlYWRlcnNfZXhwb3J0cyk7XG5jb25zdCBDSVRZX0hFQURFUl9OQU1FID0gXCJ4LXZlcmNlbC1pcC1jaXR5XCI7XG5jb25zdCBDT1VOVFJZX0hFQURFUl9OQU1FID0gXCJ4LXZlcmNlbC1pcC1jb3VudHJ5XCI7XG5jb25zdCBJUF9IRUFERVJfTkFNRSA9IFwieC1yZWFsLWlwXCI7XG5jb25zdCBMQVRJVFVERV9IRUFERVJfTkFNRSA9IFwieC12ZXJjZWwtaXAtbGF0aXR1ZGVcIjtcbmNvbnN0IExPTkdJVFVERV9IRUFERVJfTkFNRSA9IFwieC12ZXJjZWwtaXAtbG9uZ2l0dWRlXCI7XG5jb25zdCBSRUdJT05fSEVBREVSX05BTUUgPSBcIngtdmVyY2VsLWlwLWNvdW50cnktcmVnaW9uXCI7XG5jb25zdCBQT1NUQUxfQ09ERV9IRUFERVJfTkFNRSA9IFwieC12ZXJjZWwtaXAtcG9zdGFsLWNvZGVcIjtcbmNvbnN0IFJFUVVFU1RfSURfSEVBREVSX05BTUUgPSBcIngtdmVyY2VsLWlkXCI7XG5jb25zdCBFTU9KSV9GTEFHX1VOSUNPREVfU1RBUlRJTkdfUE9TSVRJT04gPSAxMjczOTc7XG5mdW5jdGlvbiBnZXRIZWFkZXIoaGVhZGVycywga2V5KSB7XG4gIHJldHVybiBoZWFkZXJzLmdldChrZXkpID8/IHZvaWQgMDtcbn1cbmZ1bmN0aW9uIGdldEhlYWRlcldpdGhEZWNvZGUocmVxdWVzdCwga2V5KSB7XG4gIGNvbnN0IGhlYWRlciA9IGdldEhlYWRlcihyZXF1ZXN0LmhlYWRlcnMsIGtleSk7XG4gIHJldHVybiBoZWFkZXIgPyBkZWNvZGVVUklDb21wb25lbnQoaGVhZGVyKSA6IHZvaWQgMDtcbn1cbmZ1bmN0aW9uIGdldEZsYWcoY291bnRyeUNvZGUpIHtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFwiXltBLVpdezJ9JFwiKS50ZXN0KGNvdW50cnlDb2RlKTtcbiAgaWYgKCFjb3VudHJ5Q29kZSB8fCAhcmVnZXgpXG4gICAgcmV0dXJuIHZvaWQgMDtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KFxuICAgIC4uLmNvdW50cnlDb2RlLnNwbGl0KFwiXCIpLm1hcCgoY2hhcikgPT4gRU1PSklfRkxBR19VTklDT0RFX1NUQVJUSU5HX1BPU0lUSU9OICsgY2hhci5jaGFyQ29kZUF0KDApKVxuICApO1xufVxuZnVuY3Rpb24gaXBBZGRyZXNzKGlucHV0KSB7XG4gIGNvbnN0IGhlYWRlcnMgPSBcImhlYWRlcnNcIiBpbiBpbnB1dCA/IGlucHV0LmhlYWRlcnMgOiBpbnB1dDtcbiAgcmV0dXJuIGdldEhlYWRlcihoZWFkZXJzLCBJUF9IRUFERVJfTkFNRSk7XG59XG5mdW5jdGlvbiBnZXRSZWdpb25Gcm9tUmVxdWVzdElkKHJlcXVlc3RJZCkge1xuICBpZiAoIXJlcXVlc3RJZCkge1xuICAgIHJldHVybiBcImRldjFcIjtcbiAgfVxuICByZXR1cm4gcmVxdWVzdElkLnNwbGl0KFwiOlwiKVswXTtcbn1cbmZ1bmN0aW9uIGdlb2xvY2F0aW9uKHJlcXVlc3QpIHtcbiAgcmV0dXJuIHtcbiAgICAvLyBjaXR5IG5hbWUgbWF5IGJlIGVuY29kZWQgdG8gc3VwcG9ydCBtdWx0aS1ieXRlIGNoYXJhY3RlcnNcbiAgICBjaXR5OiBnZXRIZWFkZXJXaXRoRGVjb2RlKHJlcXVlc3QsIENJVFlfSEVBREVSX05BTUUpLFxuICAgIGNvdW50cnk6IGdldEhlYWRlcihyZXF1ZXN0LmhlYWRlcnMsIENPVU5UUllfSEVBREVSX05BTUUpLFxuICAgIGZsYWc6IGdldEZsYWcoZ2V0SGVhZGVyKHJlcXVlc3QuaGVhZGVycywgQ09VTlRSWV9IRUFERVJfTkFNRSkpLFxuICAgIGNvdW50cnlSZWdpb246IGdldEhlYWRlcihyZXF1ZXN0LmhlYWRlcnMsIFJFR0lPTl9IRUFERVJfTkFNRSksXG4gICAgcmVnaW9uOiBnZXRSZWdpb25Gcm9tUmVxdWVzdElkKFxuICAgICAgZ2V0SGVhZGVyKHJlcXVlc3QuaGVhZGVycywgUkVRVUVTVF9JRF9IRUFERVJfTkFNRSlcbiAgICApLFxuICAgIGxhdGl0dWRlOiBnZXRIZWFkZXIocmVxdWVzdC5oZWFkZXJzLCBMQVRJVFVERV9IRUFERVJfTkFNRSksXG4gICAgbG9uZ2l0dWRlOiBnZXRIZWFkZXIocmVxdWVzdC5oZWFkZXJzLCBMT05HSVRVREVfSEVBREVSX05BTUUpLFxuICAgIHBvc3RhbENvZGU6IGdldEhlYWRlcihyZXF1ZXN0LmhlYWRlcnMsIFBPU1RBTF9DT0RFX0hFQURFUl9OQU1FKVxuICB9O1xufVxuLy8gQW5ub3RhdGUgdGhlIENvbW1vbkpTIGV4cG9ydCBuYW1lcyBmb3IgRVNNIGltcG9ydCBpbiBub2RlOlxuMCAmJiAobW9kdWxlLmV4cG9ydHMgPSB7XG4gIENJVFlfSEVBREVSX05BTUUsXG4gIENPVU5UUllfSEVBREVSX05BTUUsXG4gIEVNT0pJX0ZMQUdfVU5JQ09ERV9TVEFSVElOR19QT1NJVElPTixcbiAgSVBfSEVBREVSX05BTUUsXG4gIExBVElUVURFX0hFQURFUl9OQU1FLFxuICBMT05HSVRVREVfSEVBREVSX05BTUUsXG4gIFBPU1RBTF9DT0RFX0hFQURFUl9OQU1FLFxuICBSRUdJT05fSEVBREVSX05BTUUsXG4gIFJFUVVFU1RfSURfSEVBREVSX05BTUUsXG4gIGdlb2xvY2F0aW9uLFxuICBpcEFkZHJlc3Ncbn0pO1xuIiwgIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19leHBvcnQgPSAodGFyZ2V0LCBhbGwpID0+IHtcbiAgZm9yICh2YXIgbmFtZSBpbiBhbGwpXG4gICAgX19kZWZQcm9wKHRhcmdldCwgbmFtZSwgeyBnZXQ6IGFsbFtuYW1lXSwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbn07XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX190b0NvbW1vbkpTID0gKG1vZCkgPT4gX19jb3B5UHJvcHMoX19kZWZQcm9wKHt9LCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KSwgbW9kKTtcbnZhciBnZXRfZW52X2V4cG9ydHMgPSB7fTtcbl9fZXhwb3J0KGdldF9lbnZfZXhwb3J0cywge1xuICBnZXRFbnY6ICgpID0+IGdldEVudlxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IF9fdG9Db21tb25KUyhnZXRfZW52X2V4cG9ydHMpO1xuY29uc3QgZ2V0RW52ID0gKGVudiA9IHByb2Nlc3MuZW52KSA9PiAoe1xuICAvKipcbiAgICogQW4gaW5kaWNhdG9yIHRvIHNob3cgdGhhdCBTeXN0ZW0gRW52aXJvbm1lbnQgVmFyaWFibGVzIGhhdmUgYmVlbiBleHBvc2VkIHRvIHlvdXIgcHJvamVjdCdzIERlcGxveW1lbnRzLlxuICAgKiBAZXhhbXBsZSBcIjFcIlxuICAgKi9cbiAgVkVSQ0VMOiBnZXQoZW52LCBcIlZFUkNFTFwiKSxcbiAgLyoqXG4gICAqIEFuIGluZGljYXRvciB0aGF0IHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBDb250aW51b3VzIEludGVncmF0aW9uIGVudmlyb25tZW50LlxuICAgKiBAZXhhbXBsZSBcIjFcIlxuICAgKi9cbiAgQ0k6IGdldChlbnYsIFwiQ0lcIiksXG4gIC8qKlxuICAgKiBUaGUgRW52aXJvbm1lbnQgdGhhdCB0aGUgYXBwIGlzIGRlcGxveWVkIGFuZCBydW5uaW5nIG9uLlxuICAgKiBAZXhhbXBsZSBcInByb2R1Y3Rpb25cIlxuICAgKi9cbiAgVkVSQ0VMX0VOVjogZ2V0KGVudiwgXCJWRVJDRUxfRU5WXCIpLFxuICAvKipcbiAgICogVGhlIGRvbWFpbiBuYW1lIG9mIHRoZSBnZW5lcmF0ZWQgZGVwbG95bWVudCBVUkwuIFRoZSB2YWx1ZSBkb2VzIG5vdCBpbmNsdWRlIHRoZSBwcm90b2NvbCBzY2hlbWUgaHR0cHM6Ly8uXG4gICAqIE5PVEU6IFRoaXMgVmFyaWFibGUgY2Fubm90IGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBTdGFuZGFyZCBEZXBsb3ltZW50IFByb3RlY3Rpb24uXG4gICAqIEBleGFtcGxlIFwiKi52ZXJjZWwuYXBwXCJcbiAgICovXG4gIFZFUkNFTF9VUkw6IGdldChlbnYsIFwiVkVSQ0VMX1VSTFwiKSxcbiAgLyoqXG4gICAqIFRoZSBkb21haW4gbmFtZSBvZiB0aGUgZ2VuZXJhdGVkIEdpdCBicmFuY2ggVVJMLiBUaGUgdmFsdWUgZG9lcyBub3QgaW5jbHVkZSB0aGUgcHJvdG9jb2wgc2NoZW1lIGh0dHBzOi8vLlxuICAgKiBAZXhhbXBsZSBcIiotZ2l0LSoudmVyY2VsLmFwcFwiXG4gICAqL1xuICBWRVJDRUxfQlJBTkNIX1VSTDogZ2V0KGVudiwgXCJWRVJDRUxfQlJBTkNIX1VSTFwiKSxcbiAgLyoqXG4gICAqIEEgcHJvZHVjdGlvbiBkb21haW4gbmFtZSBvZiB0aGUgcHJvamVjdC4gVGhpcyBpcyB1c2VmdWwgdG8gcmVsaWFibHkgZ2VuZXJhdGUgbGlua3MgdGhhdCBwb2ludCB0byBwcm9kdWN0aW9uIHN1Y2ggYXMgT0ctaW1hZ2UgVVJMcy5cbiAgICogVGhlIHZhbHVlIGRvZXMgbm90IGluY2x1ZGUgdGhlIHByb3RvY29sIHNjaGVtZSBodHRwczovLy5cbiAgICogQGV4YW1wbGUgXCJteXByb2plY3QudmVyY2VsLmFwcFwiXG4gICAqL1xuICBWRVJDRUxfUFJPSkVDVF9QUk9EVUNUSU9OX1VSTDogZ2V0KGVudiwgXCJWRVJDRUxfUFJPSkVDVF9QUk9EVUNUSU9OX1VSTFwiKSxcbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgUmVnaW9uIHdoZXJlIHRoZSBhcHAgaXMgcnVubmluZy5cbiAgICpcbiAgICogUG9zc2libGUgdmFsdWVzOlxuICAgKiAtIGFybjEgKFN0b2NraG9sbSwgU3dlZGVuKVxuICAgKiAtIGJvbTEgKE11bWJhaSwgSW5kaWEpXG4gICAqIC0gY2RnMSAoUGFyaXMsIEZyYW5jZSlcbiAgICogLSBjbGUxIChDbGV2ZWxhbmQsIFVTQSlcbiAgICogLSBjcHQxIChDYXBlIFRvd24sIFNvdXRoIEFmcmljYSlcbiAgICogLSBkdWIxIChEdWJsaW4sIElyZWxhbmQpXG4gICAqIC0gZnJhMSAoRnJhbmtmdXJ0LCBHZXJtYW55KVxuICAgKiAtIGdydTEgKFNcdTAwRTNvIFBhdWxvLCBCcmF6aWwpXG4gICAqIC0gaGtnMSAoSG9uZyBLb25nKVxuICAgKiAtIGhuZDEgKFRva3lvLCBKYXBhbilcbiAgICogLSBpYWQxIChXYXNoaW5ndG9uLCBELkMuLCBVU0EpXG4gICAqIC0gaWNuMSAoU2VvdWwsIFNvdXRoIEtvcmVhKVxuICAgKiAtIGtpeDEgKE9zYWthLCBKYXBhbilcbiAgICogLSBsaHIxIChMb25kb24sIFVuaXRlZCBLaW5nZG9tKVxuICAgKiAtIHBkeDEgKFBvcnRsYW5kLCBVU0EpXG4gICAqIC0gc2ZvMSAoU2FuIEZyYW5jaXNjbywgVVNBKVxuICAgKiAtIHNpbjEgKFNpbmdhcG9yZSlcbiAgICogLSBzeWQxIChTeWRuZXksIEF1c3RyYWxpYSlcbiAgICogLSBkZXYxIChEZXZlbG9wbWVudCBSZWdpb24pXG4gICAqXG4gICAqIEBleGFtcGxlIFwiaWFkMVwiXG4gICAqL1xuICBWRVJDRUxfUkVHSU9OOiBnZXQoZW52LCBcIlZFUkNFTF9SRUdJT05cIiksXG4gIC8qKlxuICAgKiBUaGUgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBkZXBsb3ltZW50LCB3aGljaCBjYW4gYmUgdXNlZCB0byBpbXBsZW1lbnQgU2tldyBQcm90ZWN0aW9uLlxuICAgKiBAZXhhbXBsZSBcImRwbF83R3c1Wk1CcFFBOGg5R0Y4MzJLR3A3bndidWgzXCJcbiAgICovXG4gIFZFUkNFTF9ERVBMT1lNRU5UX0lEOiBnZXQoZW52LCBcIlZFUkNFTF9ERVBMT1lNRU5UX0lEXCIpLFxuICAvKipcbiAgICogV2hlbiBTa2V3IFByb3RlY3Rpb24gaXMgZW5hYmxlZCBpbiBQcm9qZWN0IFNldHRpbmdzLCB0aGlzIHZhbHVlIGlzIHNldCB0byAxLlxuICAgKiBAZXhhbXBsZSBcIjFcIlxuICAgKi9cbiAgVkVSQ0VMX1NLRVdfUFJPVEVDVElPTl9FTkFCTEVEOiBnZXQoZW52LCBcIlZFUkNFTF9TS0VXX1BST1RFQ1RJT05fRU5BQkxFRFwiKSxcbiAgLyoqXG4gICAqIFRoZSBQcm90ZWN0aW9uIEJ5cGFzcyBmb3IgQXV0b21hdGlvbiB2YWx1ZSwgaWYgdGhlIHNlY3JldCBoYXMgYmVlbiBnZW5lcmF0ZWQgaW4gdGhlIHByb2plY3QncyBEZXBsb3ltZW50IFByb3RlY3Rpb24gc2V0dGluZ3MuXG4gICAqL1xuICBWRVJDRUxfQVVUT01BVElPTl9CWVBBU1NfU0VDUkVUOiBnZXQoZW52LCBcIlZFUkNFTF9BVVRPTUFUSU9OX0JZUEFTU19TRUNSRVRcIiksXG4gIC8qKlxuICAgKiBUaGUgR2l0IFByb3ZpZGVyIHRoZSBkZXBsb3ltZW50IGlzIHRyaWdnZXJlZCBmcm9tLlxuICAgKiBAZXhhbXBsZSBcImdpdGh1YlwiXG4gICAqL1xuICBWRVJDRUxfR0lUX1BST1ZJREVSOiBnZXQoZW52LCBcIlZFUkNFTF9HSVRfUFJPVklERVJcIiksXG4gIC8qKlxuICAgKiBUaGUgb3JpZ2luIHJlcG9zaXRvcnkgdGhlIGRlcGxveW1lbnQgaXMgdHJpZ2dlcmVkIGZyb20uXG4gICAqIEBleGFtcGxlIFwibXktc2l0ZVwiXG4gICAqL1xuICBWRVJDRUxfR0lUX1JFUE9fU0xVRzogZ2V0KGVudiwgXCJWRVJDRUxfR0lUX1JFUE9fU0xVR1wiKSxcbiAgLyoqXG4gICAqIFRoZSBhY2NvdW50IHRoYXQgb3ducyB0aGUgcmVwb3NpdG9yeSB0aGUgZGVwbG95bWVudCBpcyB0cmlnZ2VyZWQgZnJvbS5cbiAgICogQGV4YW1wbGUgXCJhY21lXCJcbiAgICovXG4gIFZFUkNFTF9HSVRfUkVQT19PV05FUjogZ2V0KGVudiwgXCJWRVJDRUxfR0lUX1JFUE9fT1dORVJcIiksXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIHJlcG9zaXRvcnkgdGhlIGRlcGxveW1lbnQgaXMgdHJpZ2dlcmVkIGZyb20uXG4gICAqIEBleGFtcGxlIFwiMTE3NzE2MTQ2XCJcbiAgICovXG4gIFZFUkNFTF9HSVRfUkVQT19JRDogZ2V0KGVudiwgXCJWRVJDRUxfR0lUX1JFUE9fSURcIiksXG4gIC8qKlxuICAgKiBUaGUgZ2l0IGJyYW5jaCBvZiB0aGUgY29tbWl0IHRoZSBkZXBsb3ltZW50IHdhcyB0cmlnZ2VyZWQgYnkuXG4gICAqIEBleGFtcGxlIFwiaW1wcm92ZS1hYm91dC1wYWdlXCJcbiAgICovXG4gIFZFUkNFTF9HSVRfQ09NTUlUX1JFRjogZ2V0KGVudiwgXCJWRVJDRUxfR0lUX0NPTU1JVF9SRUZcIiksXG4gIC8qKlxuICAgKiBUaGUgZ2l0IFNIQSBvZiB0aGUgY29tbWl0IHRoZSBkZXBsb3ltZW50IHdhcyB0cmlnZ2VyZWQgYnkuXG4gICAqIEBleGFtcGxlIFwiZmExZWFkZTQ3YjczNzMzZDYzMTJkNWFiZmFkMzNjZTllNDA2ODA4MVwiXG4gICAqL1xuICBWRVJDRUxfR0lUX0NPTU1JVF9TSEE6IGdldChlbnYsIFwiVkVSQ0VMX0dJVF9DT01NSVRfU0hBXCIpLFxuICAvKipcbiAgICogVGhlIG1lc3NhZ2UgYXR0YWNoZWQgdG8gdGhlIGNvbW1pdCB0aGUgZGVwbG95bWVudCB3YXMgdHJpZ2dlcmVkIGJ5LlxuICAgKiBAZXhhbXBsZSBcIlVwZGF0ZSBhYm91dCBwYWdlXCJcbiAgICovXG4gIFZFUkNFTF9HSVRfQ09NTUlUX01FU1NBR0U6IGdldChlbnYsIFwiVkVSQ0VMX0dJVF9DT01NSVRfTUVTU0FHRVwiKSxcbiAgLyoqXG4gICAqIFRoZSB1c2VybmFtZSBhdHRhY2hlZCB0byB0aGUgYXV0aG9yIG9mIHRoZSBjb21taXQgdGhhdCB0aGUgcHJvamVjdCB3YXMgZGVwbG95ZWQgYnkuXG4gICAqIEBleGFtcGxlIFwiam9obmRvZVwiXG4gICAqL1xuICBWRVJDRUxfR0lUX0NPTU1JVF9BVVRIT1JfTE9HSU46IGdldChlbnYsIFwiVkVSQ0VMX0dJVF9DT01NSVRfQVVUSE9SX0xPR0lOXCIpLFxuICAvKipcbiAgICogVGhlIG5hbWUgYXR0YWNoZWQgdG8gdGhlIGF1dGhvciBvZiB0aGUgY29tbWl0IHRoYXQgdGhlIHByb2plY3Qgd2FzIGRlcGxveWVkIGJ5LlxuICAgKiBAZXhhbXBsZSBcIkpvaG4gRG9lXCJcbiAgICovXG4gIFZFUkNFTF9HSVRfQ09NTUlUX0FVVEhPUl9OQU1FOiBnZXQoZW52LCBcIlZFUkNFTF9HSVRfQ09NTUlUX0FVVEhPUl9OQU1FXCIpLFxuICAvKipcbiAgICogVGhlIGdpdCBTSEEgb2YgdGhlIGxhc3Qgc3VjY2Vzc2Z1bCBkZXBsb3ltZW50IGZvciB0aGUgcHJvamVjdCBhbmQgYnJhbmNoLlxuICAgKiBOT1RFOiBUaGlzIFZhcmlhYmxlIGlzIG9ubHkgZXhwb3NlZCB3aGVuIGFuIElnbm9yZWQgQnVpbGQgU3RlcCBpcyBwcm92aWRlZC5cbiAgICogQGV4YW1wbGUgXCJmYTFlYWRlNDdiNzM3MzNkNjMxMmQ1YWJmYWQzM2NlOWU0MDY4MDgwXCJcbiAgICovXG4gIFZFUkNFTF9HSVRfUFJFVklPVVNfU0hBOiBnZXQoZW52LCBcIlZFUkNFTF9HSVRfUFJFVklPVVNfU0hBXCIpLFxuICAvKipcbiAgICogVGhlIHB1bGwgcmVxdWVzdCBpZCB0aGUgZGVwbG95bWVudCB3YXMgdHJpZ2dlcmVkIGJ5LiBJZiBhIGRlcGxveW1lbnQgaXMgY3JlYXRlZCBvbiBhIGJyYW5jaCBiZWZvcmUgYSBwdWxsIHJlcXVlc3QgaXMgbWFkZSwgdGhpcyB2YWx1ZSB3aWxsIGJlIGFuIGVtcHR5IHN0cmluZy5cbiAgICogQGV4YW1wbGUgXCIyM1wiXG4gICAqL1xuICBWRVJDRUxfR0lUX1BVTExfUkVRVUVTVF9JRDogZ2V0KGVudiwgXCJWRVJDRUxfR0lUX1BVTExfUkVRVUVTVF9JRFwiKVxufSk7XG5jb25zdCBnZXQgPSAoZW52LCBrZXkpID0+IHtcbiAgY29uc3QgdmFsdWUgPSBlbnZba2V5XTtcbiAgcmV0dXJuIHZhbHVlID09PSBcIlwiID8gdm9pZCAwIDogdmFsdWU7XG59O1xuLy8gQW5ub3RhdGUgdGhlIENvbW1vbkpTIGV4cG9ydCBuYW1lcyBmb3IgRVNNIGltcG9ydCBpbiBub2RlOlxuMCAmJiAobW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEVudlxufSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xudmFyIGdldF9jb250ZXh0X2V4cG9ydHMgPSB7fTtcbl9fZXhwb3J0KGdldF9jb250ZXh0X2V4cG9ydHMsIHtcbiAgU1lNQk9MX0ZPUl9SRVFfQ09OVEVYVDogKCkgPT4gU1lNQk9MX0ZPUl9SRVFfQ09OVEVYVCxcbiAgZ2V0Q29udGV4dDogKCkgPT4gZ2V0Q29udGV4dFxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IF9fdG9Db21tb25KUyhnZXRfY29udGV4dF9leHBvcnRzKTtcbmNvbnN0IFNZTUJPTF9GT1JfUkVRX0NPTlRFWFQgPSBTeW1ib2wuZm9yKFwiQHZlcmNlbC9yZXF1ZXN0LWNvbnRleHRcIik7XG5mdW5jdGlvbiBnZXRDb250ZXh0KCkge1xuICBjb25zdCBmcm9tU3ltYm9sID0gZ2xvYmFsVGhpcztcbiAgcmV0dXJuIGZyb21TeW1ib2xbU1lNQk9MX0ZPUl9SRVFfQ09OVEVYVF0/LmdldD8uKCkgPz8ge307XG59XG4vLyBBbm5vdGF0ZSB0aGUgQ29tbW9uSlMgZXhwb3J0IG5hbWVzIGZvciBFU00gaW1wb3J0IGluIG5vZGU6XG4wICYmIChtb2R1bGUuZXhwb3J0cyA9IHtcbiAgU1lNQk9MX0ZPUl9SRVFfQ09OVEVYVCxcbiAgZ2V0Q29udGV4dFxufSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xudmFyIHdhaXRfdW50aWxfZXhwb3J0cyA9IHt9O1xuX19leHBvcnQod2FpdF91bnRpbF9leHBvcnRzLCB7XG4gIHdhaXRVbnRpbDogKCkgPT4gd2FpdFVudGlsXG59KTtcbm1vZHVsZS5leHBvcnRzID0gX190b0NvbW1vbkpTKHdhaXRfdW50aWxfZXhwb3J0cyk7XG52YXIgaW1wb3J0X2dldF9jb250ZXh0ID0gcmVxdWlyZShcIi4vZ2V0LWNvbnRleHRcIik7XG5jb25zdCB3YWl0VW50aWwgPSAocHJvbWlzZSkgPT4ge1xuICBpZiAocHJvbWlzZSA9PT0gbnVsbCB8fCB0eXBlb2YgcHJvbWlzZSAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgcHJvbWlzZS50aGVuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgYHdhaXRVbnRpbCBjYW4gb25seSBiZSBjYWxsZWQgd2l0aCBhIFByb21pc2UsIGdvdCAke3R5cGVvZiBwcm9taXNlfWBcbiAgICApO1xuICB9XG4gIHJldHVybiAoMCwgaW1wb3J0X2dldF9jb250ZXh0LmdldENvbnRleHQpKCkud2FpdFVudGlsPy4ocHJvbWlzZSk7XG59O1xuLy8gQW5ub3RhdGUgdGhlIENvbW1vbkpTIGV4cG9ydCBuYW1lcyBmb3IgRVNNIGltcG9ydCBpbiBub2RlOlxuMCAmJiAobW9kdWxlLmV4cG9ydHMgPSB7XG4gIHdhaXRVbnRpbFxufSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xudmFyIG1pZGRsZXdhcmVfZXhwb3J0cyA9IHt9O1xuX19leHBvcnQobWlkZGxld2FyZV9leHBvcnRzLCB7XG4gIG5leHQ6ICgpID0+IG5leHQsXG4gIHJld3JpdGU6ICgpID0+IHJld3JpdGVcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBfX3RvQ29tbW9uSlMobWlkZGxld2FyZV9leHBvcnRzKTtcbmZ1bmN0aW9uIGhhbmRsZU1pZGRsZXdhcmVGaWVsZChpbml0LCBoZWFkZXJzKSB7XG4gIGlmIChpbml0Py5yZXF1ZXN0Py5oZWFkZXJzKSB7XG4gICAgaWYgKCEoaW5pdC5yZXF1ZXN0LmhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVxdWVzdC5oZWFkZXJzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgSGVhZGVyc1wiKTtcbiAgICB9XG4gICAgY29uc3Qga2V5cyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGluaXQucmVxdWVzdC5oZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLnNldChcIngtbWlkZGxld2FyZS1yZXF1ZXN0LVwiICsga2V5LCB2YWx1ZSk7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgaGVhZGVycy5zZXQoXCJ4LW1pZGRsZXdhcmUtb3ZlcnJpZGUtaGVhZGVyc1wiLCBrZXlzLmpvaW4oXCIsXCIpKTtcbiAgfVxufVxuZnVuY3Rpb24gcmV3cml0ZShkZXN0aW5hdGlvbiwgaW5pdCkge1xuICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5pdD8uaGVhZGVycyA/PyB7fSk7XG4gIGhlYWRlcnMuc2V0KFwieC1taWRkbGV3YXJlLXJld3JpdGVcIiwgU3RyaW5nKGRlc3RpbmF0aW9uKSk7XG4gIGhhbmRsZU1pZGRsZXdhcmVGaWVsZChpbml0LCBoZWFkZXJzKTtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7XG4gICAgLi4uaW5pdCxcbiAgICBoZWFkZXJzXG4gIH0pO1xufVxuZnVuY3Rpb24gbmV4dChpbml0KSB7XG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbml0Py5oZWFkZXJzID8/IHt9KTtcbiAgaGVhZGVycy5zZXQoXCJ4LW1pZGRsZXdhcmUtbmV4dFwiLCBcIjFcIik7XG4gIGhhbmRsZU1pZGRsZXdhcmVGaWVsZChpbml0LCBoZWFkZXJzKTtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7XG4gICAgLi4uaW5pdCxcbiAgICBoZWFkZXJzXG4gIH0pO1xufVxuLy8gQW5ub3RhdGUgdGhlIENvbW1vbkpTIGV4cG9ydCBuYW1lcyBmb3IgRVNNIGltcG9ydCBpbiBub2RlOlxuMCAmJiAobW9kdWxlLmV4cG9ydHMgPSB7XG4gIG5leHQsXG4gIHJld3JpdGVcbn0pO1xuIiwgIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19leHBvcnQgPSAodGFyZ2V0LCBhbGwpID0+IHtcbiAgZm9yICh2YXIgbmFtZSBpbiBhbGwpXG4gICAgX19kZWZQcm9wKHRhcmdldCwgbmFtZSwgeyBnZXQ6IGFsbFtuYW1lXSwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbn07XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX190b0NvbW1vbkpTID0gKG1vZCkgPT4gX19jb3B5UHJvcHMoX19kZWZQcm9wKHt9LCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KSwgbW9kKTtcbnZhciBpbl9tZW1vcnlfY2FjaGVfZXhwb3J0cyA9IHt9O1xuX19leHBvcnQoaW5fbWVtb3J5X2NhY2hlX2V4cG9ydHMsIHtcbiAgSW5NZW1vcnlDYWNoZTogKCkgPT4gSW5NZW1vcnlDYWNoZVxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IF9fdG9Db21tb25KUyhpbl9tZW1vcnlfY2FjaGVfZXhwb3J0cyk7XG5jbGFzcyBJbk1lbW9yeUNhY2hlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jYWNoZSA9IHt9O1xuICB9XG4gIGFzeW5jIGdldChrZXkpIHtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuY2FjaGVba2V5XTtcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIGlmIChlbnRyeS50dGwgJiYgZW50cnkubGFzdE1vZGlmaWVkICsgZW50cnkudHRsICogMWUzIDwgRGF0ZS5ub3coKSkge1xuICAgICAgICBhd2FpdCB0aGlzLmRlbGV0ZShrZXkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgYXN5bmMgc2V0KGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBzZXJpYWxpemVkID0gSlNPTi5zdHJpbmdpZnkodmFsdWUgPz8gbnVsbCk7XG4gICAgdGhpcy5jYWNoZVtrZXldID0ge1xuICAgICAgdmFsdWU6IHNlcmlhbGl6ZWQsXG4gICAgICBsYXN0TW9kaWZpZWQ6IERhdGUubm93KCksXG4gICAgICB0dGw6IG9wdGlvbnM/LnR0bCxcbiAgICAgIHRhZ3M6IG5ldyBTZXQob3B0aW9ucz8udGFncyB8fCBbXSlcbiAgICB9O1xuICB9XG4gIGFzeW5jIGRlbGV0ZShrZXkpIHtcbiAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xuICB9XG4gIGFzeW5jIGV4cGlyZVRhZyh0YWcpIHtcbiAgICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheSh0YWcpID8gdGFnIDogW3RhZ107XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5jYWNoZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmNhY2hlLCBrZXkpKSB7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5jYWNoZVtrZXldO1xuICAgICAgICBpZiAodGFncy5zb21lKCh0KSA9PiBlbnRyeS50YWdzLmhhcyh0KSkpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vLyBBbm5vdGF0ZSB0aGUgQ29tbW9uSlMgZXhwb3J0IG5hbWVzIGZvciBFU00gaW1wb3J0IGluIG5vZGU6XG4wICYmIChtb2R1bGUuZXhwb3J0cyA9IHtcbiAgSW5NZW1vcnlDYWNoZVxufSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xudmFyIGJ1aWxkX2NsaWVudF9leHBvcnRzID0ge307XG5fX2V4cG9ydChidWlsZF9jbGllbnRfZXhwb3J0cywge1xuICBCdWlsZENhY2hlOiAoKSA9PiBCdWlsZENhY2hlXG59KTtcbm1vZHVsZS5leHBvcnRzID0gX190b0NvbW1vbkpTKGJ1aWxkX2NsaWVudF9leHBvcnRzKTtcbnZhciBpbXBvcnRfaW5kZXggPSByZXF1aXJlKFwiLi9pbmRleFwiKTtcbmNsYXNzIEJ1aWxkQ2FjaGUge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgZW5kcG9pbnQsXG4gICAgaGVhZGVycyxcbiAgICBvbkVycm9yLFxuICAgIHRpbWVvdXQgPSA1MDBcbiAgfSkge1xuICAgIHRoaXMuZ2V0ID0gYXN5bmMgKGtleSkgPT4ge1xuICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gY29udHJvbGxlci5hYm9ydCgpLCB0aGlzLnRpbWVvdXQpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dGhpcy5lbmRwb2ludH0ke2tleX1gLCB7XG4gICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICBzaWduYWw6IGNvbnRyb2xsZXIuc2lnbmFsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnN0IGNhY2hlU3RhdGUgPSByZXMuaGVhZGVycy5nZXQoXG4gICAgICAgICAgICBpbXBvcnRfaW5kZXguSEVBREVSU19WRVJDRUxfQ0FDSEVfU1RBVEVcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChjYWNoZVN0YXRlICE9PSBpbXBvcnRfaW5kZXguUGtnQ2FjaGVTdGF0ZS5GcmVzaCkge1xuICAgICAgICAgICAgcmVzLmJvZHk/LmNhbmNlbD8uKCk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXMuanNvbigpO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZ2V0IGNhY2hlOiAke3Jlcy5zdGF0dXNUZXh0fWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgaWYgKGVycm9yLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSB7XG4gICAgICAgICAgY29uc3QgdGltZW91dEVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAgICAgYENhY2hlIHJlcXVlc3QgdGltZWQgb3V0IGFmdGVyICR7dGhpcy50aW1lb3V0fW1zYFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGltZW91dEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgdGhpcy5vbkVycm9yPy4odGltZW91dEVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uRXJyb3I/LihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLnNldCA9IGFzeW5jIChrZXksIHZhbHVlLCBvcHRpb25zKSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgY29uc3QgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIHRoaXMudGltZW91dCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBvcHRpb25hbEhlYWRlcnMgPSB7fTtcbiAgICAgICAgaWYgKG9wdGlvbnM/LnR0bCkge1xuICAgICAgICAgIG9wdGlvbmFsSGVhZGVyc1tpbXBvcnRfaW5kZXguSEVBREVSU19WRVJDRUxfUkVWQUxJREFURV0gPSBvcHRpb25zLnR0bC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zPy50YWdzICYmIG9wdGlvbnMudGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgb3B0aW9uYWxIZWFkZXJzW2ltcG9ydF9pbmRleC5IRUFERVJTX1ZFUkNFTF9DQUNIRV9UQUdTXSA9IG9wdGlvbnMudGFncy5qb2luKFwiLFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucz8ubmFtZSkge1xuICAgICAgICAgIG9wdGlvbmFsSGVhZGVyc1tpbXBvcnRfaW5kZXguSEVBREVSU19WRVJDRUxfQ0FDSEVfSVRFTV9OQU1FXSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLmVuZHBvaW50fSR7a2V5fWAsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIC4uLnRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgIC4uLm9wdGlvbmFsSGVhZGVyc1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkodmFsdWUpLFxuICAgICAgICAgIHNpZ25hbDogY29udHJvbGxlci5zaWduYWxcbiAgICAgICAgfSk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gc2V0IGNhY2hlOiAke3Jlcy5zdGF0dXN9ICR7cmVzLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICBpZiAoZXJyb3IubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIpIHtcbiAgICAgICAgICBjb25zdCB0aW1lb3V0RXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgQ2FjaGUgcmVxdWVzdCB0aW1lZCBvdXQgYWZ0ZXIgJHt0aGlzLnRpbWVvdXR9bXNgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aW1lb3V0RXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjaztcbiAgICAgICAgICB0aGlzLm9uRXJyb3I/Lih0aW1lb3V0RXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub25FcnJvcj8uKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5kZWxldGUgPSBhc3luYyAoa2V5KSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgY29uc3QgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIHRoaXMudGltZW91dCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLmVuZHBvaW50fSR7a2V5fWAsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgIHNpZ25hbDogY29udHJvbGxlci5zaWduYWxcbiAgICAgICAgfSk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICBpZiAocmVzLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZGVsZXRlIGNhY2hlOiAke3Jlcy5zdGF0dXNUZXh0fWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgaWYgKGVycm9yLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSB7XG4gICAgICAgICAgY29uc3QgdGltZW91dEVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAgICAgYENhY2hlIHJlcXVlc3QgdGltZWQgb3V0IGFmdGVyICR7dGhpcy50aW1lb3V0fW1zYFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGltZW91dEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgdGhpcy5vbkVycm9yPy4odGltZW91dEVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uRXJyb3I/LihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuZXhwaXJlVGFnID0gYXN5bmMgKHRhZykgPT4ge1xuICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gY29udHJvbGxlci5hYm9ydCgpLCB0aGlzLnRpbWVvdXQpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFnKSkge1xuICAgICAgICAgIHRhZyA9IHRhZy5qb2luKFwiLFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLmVuZHBvaW50fXJldmFsaWRhdGU/dGFncz0ke3RhZ31gLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgc2lnbmFsOiBjb250cm9sbGVyLnNpZ25hbFxuICAgICAgICB9KTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIGlmIChyZXMuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byByZXZhbGlkYXRlIHRhZzogJHtyZXMuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIGlmIChlcnJvci5uYW1lID09PSBcIkFib3J0RXJyb3JcIikge1xuICAgICAgICAgIGNvbnN0IHRpbWVvdXRFcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBDYWNoZSByZXF1ZXN0IHRpbWVkIG91dCBhZnRlciAke3RoaXMudGltZW91dH1tc2BcbiAgICAgICAgICApO1xuICAgICAgICAgIHRpbWVvdXRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrO1xuICAgICAgICAgIHRoaXMub25FcnJvcj8uKHRpbWVvdXRFcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yPy4oZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG4gICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcbiAgICB0aGlzLm9uRXJyb3IgPSBvbkVycm9yO1xuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXQ7XG4gIH1cbn1cbi8vIEFubm90YXRlIHRoZSBDb21tb25KUyBleHBvcnQgbmFtZXMgZm9yIEVTTSBpbXBvcnQgaW4gbm9kZTpcbjAgJiYgKG1vZHVsZS5leHBvcnRzID0ge1xuICBCdWlsZENhY2hlXG59KTtcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2RlZlByb3AgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgX19nZXRPd25Qcm9wRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgX19nZXRPd25Qcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbnZhciBfX2hhc093blByb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIF9fZXhwb3J0ID0gKHRhcmdldCwgYWxsKSA9PiB7XG4gIGZvciAodmFyIG5hbWUgaW4gYWxsKVxuICAgIF9fZGVmUHJvcCh0YXJnZXQsIG5hbWUsIHsgZ2V0OiBhbGxbbmFtZV0sIGVudW1lcmFibGU6IHRydWUgfSk7XG59O1xudmFyIF9fY29weVByb3BzID0gKHRvLCBmcm9tLCBleGNlcHQsIGRlc2MpID0+IHtcbiAgaWYgKGZyb20gJiYgdHlwZW9mIGZyb20gPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGZyb20gPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGZvciAobGV0IGtleSBvZiBfX2dldE93blByb3BOYW1lcyhmcm9tKSlcbiAgICAgIGlmICghX19oYXNPd25Qcm9wLmNhbGwodG8sIGtleSkgJiYga2V5ICE9PSBleGNlcHQpXG4gICAgICAgIF9fZGVmUHJvcCh0bywga2V5LCB7IGdldDogKCkgPT4gZnJvbVtrZXldLCBlbnVtZXJhYmxlOiAhKGRlc2MgPSBfX2dldE93blByb3BEZXNjKGZyb20sIGtleSkpIHx8IGRlc2MuZW51bWVyYWJsZSB9KTtcbiAgfVxuICByZXR1cm4gdG87XG59O1xudmFyIF9fdG9Db21tb25KUyA9IChtb2QpID0+IF9fY29weVByb3BzKF9fZGVmUHJvcCh7fSwgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSksIG1vZCk7XG52YXIgY2FjaGVfZXhwb3J0cyA9IHt9O1xuX19leHBvcnQoY2FjaGVfZXhwb3J0cywge1xuICBIRUFERVJTX1ZFUkNFTF9DQUNIRV9JVEVNX05BTUU6ICgpID0+IEhFQURFUlNfVkVSQ0VMX0NBQ0hFX0lURU1fTkFNRSxcbiAgSEVBREVSU19WRVJDRUxfQ0FDSEVfU1RBVEU6ICgpID0+IEhFQURFUlNfVkVSQ0VMX0NBQ0hFX1NUQVRFLFxuICBIRUFERVJTX1ZFUkNFTF9DQUNIRV9UQUdTOiAoKSA9PiBIRUFERVJTX1ZFUkNFTF9DQUNIRV9UQUdTLFxuICBIRUFERVJTX1ZFUkNFTF9SRVZBTElEQVRFOiAoKSA9PiBIRUFERVJTX1ZFUkNFTF9SRVZBTElEQVRFLFxuICBQa2dDYWNoZVN0YXRlOiAoKSA9PiBQa2dDYWNoZVN0YXRlLFxuICBnZXRDYWNoZTogKCkgPT4gZ2V0Q2FjaGVcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBfX3RvQ29tbW9uSlMoY2FjaGVfZXhwb3J0cyk7XG52YXIgaW1wb3J0X2dldF9jb250ZXh0ID0gcmVxdWlyZShcIi4uL2dldC1jb250ZXh0XCIpO1xudmFyIGltcG9ydF9pbl9tZW1vcnlfY2FjaGUgPSByZXF1aXJlKFwiLi9pbi1tZW1vcnktY2FjaGVcIik7XG52YXIgaW1wb3J0X2J1aWxkX2NsaWVudCA9IHJlcXVpcmUoXCIuL2J1aWxkLWNsaWVudFwiKTtcbmNvbnN0IGRlZmF1bHRLZXlIYXNoRnVuY3Rpb24gPSAoa2V5KSA9PiB7XG4gIGxldCBoYXNoID0gNTM4MTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcbiAgICBoYXNoID0gaGFzaCAqIDMzIF4ga2V5LmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgcmV0dXJuIChoYXNoID4+PiAwKS50b1N0cmluZygxNik7XG59O1xuY29uc3QgZGVmYXVsdE5hbWVzcGFjZVNlcGFyYXRvciA9IFwiJFwiO1xubGV0IGluTWVtb3J5Q2FjaGVJbnN0YW5jZSA9IG51bGw7XG5sZXQgYnVpbGRDYWNoZUluc3RhbmNlID0gbnVsbDtcbmNvbnN0IGdldENhY2hlID0gKGNhY2hlT3B0aW9ucykgPT4ge1xuICBjb25zdCByZXNvbHZlQ2FjaGUgPSAoKSA9PiB7XG4gICAgbGV0IGNhY2hlO1xuICAgIGlmICgoMCwgaW1wb3J0X2dldF9jb250ZXh0LmdldENvbnRleHQpKCkuY2FjaGUpIHtcbiAgICAgIGNhY2hlID0gKDAsIGltcG9ydF9nZXRfY29udGV4dC5nZXRDb250ZXh0KSgpLmNhY2hlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWNoZSA9IGdldENhY2hlSW1wbGVtZW50YXRpb24oXG4gICAgICAgIHByb2Nlc3MuZW52LlNVU1BFTlNFX0NBQ0hFX0RFQlVHID09PSBcInRydWVcIlxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlO1xuICB9O1xuICByZXR1cm4gd3JhcFdpdGhLZXlUcmFuc2Zvcm1hdGlvbihcbiAgICByZXNvbHZlQ2FjaGUsXG4gICAgY3JlYXRlS2V5VHJhbnNmb3JtZXIoY2FjaGVPcHRpb25zKVxuICApO1xufTtcbmZ1bmN0aW9uIGNyZWF0ZUtleVRyYW5zZm9ybWVyKGNhY2hlT3B0aW9ucykge1xuICBjb25zdCBoYXNoRnVuY3Rpb24gPSBjYWNoZU9wdGlvbnM/LmtleUhhc2hGdW5jdGlvbiB8fCBkZWZhdWx0S2V5SGFzaEZ1bmN0aW9uO1xuICByZXR1cm4gKGtleSkgPT4ge1xuICAgIGlmICghY2FjaGVPcHRpb25zPy5uYW1lc3BhY2UpXG4gICAgICByZXR1cm4gaGFzaEZ1bmN0aW9uKGtleSk7XG4gICAgY29uc3Qgc2VwYXJhdG9yID0gY2FjaGVPcHRpb25zLm5hbWVzcGFjZVNlcGFyYXRvciB8fCBkZWZhdWx0TmFtZXNwYWNlU2VwYXJhdG9yO1xuICAgIHJldHVybiBgJHtjYWNoZU9wdGlvbnMubmFtZXNwYWNlfSR7c2VwYXJhdG9yfSR7aGFzaEZ1bmN0aW9uKGtleSl9YDtcbiAgfTtcbn1cbmZ1bmN0aW9uIHdyYXBXaXRoS2V5VHJhbnNmb3JtYXRpb24ocmVzb2x2ZUNhY2hlLCBtYWtlS2V5KSB7XG4gIHJldHVybiB7XG4gICAgZ2V0OiAoa2V5KSA9PiB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUNhY2hlKCkuZ2V0KG1ha2VLZXkoa2V5KSk7XG4gICAgfSxcbiAgICBzZXQ6IChrZXksIHZhbHVlLCBvcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUNhY2hlKCkuc2V0KG1ha2VLZXkoa2V5KSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZGVsZXRlOiAoa2V5KSA9PiB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUNhY2hlKCkuZGVsZXRlKG1ha2VLZXkoa2V5KSk7XG4gICAgfSxcbiAgICBleHBpcmVUYWc6ICh0YWcpID0+IHtcbiAgICAgIHJldHVybiByZXNvbHZlQ2FjaGUoKS5leHBpcmVUYWcodGFnKTtcbiAgICB9XG4gIH07XG59XG5sZXQgd2FybmVkQ2FjaGVVbmF2YWlsYWJsZSA9IGZhbHNlO1xuZnVuY3Rpb24gZ2V0Q2FjaGVJbXBsZW1lbnRhdGlvbihkZWJ1Zykge1xuICBpZiAoIWluTWVtb3J5Q2FjaGVJbnN0YW5jZSkge1xuICAgIGluTWVtb3J5Q2FjaGVJbnN0YW5jZSA9IG5ldyBpbXBvcnRfaW5fbWVtb3J5X2NhY2hlLkluTWVtb3J5Q2FjaGUoKTtcbiAgfVxuICBpZiAocHJvY2Vzcy5lbnYuUlVOVElNRV9DQUNIRV9ESVNBQkxFX0JVSUxEX0NBQ0hFID09PSBcInRydWVcIikge1xuICAgIGRlYnVnICYmIGNvbnNvbGUubG9nKFwiVXNpbmcgSW5NZW1vcnlDYWNoZSBhcyBidWlsZCBjYWNoZSBpcyBkaXNhYmxlZFwiKTtcbiAgICByZXR1cm4gaW5NZW1vcnlDYWNoZUluc3RhbmNlO1xuICB9XG4gIGNvbnN0IHsgUlVOVElNRV9DQUNIRV9FTkRQT0lOVCwgUlVOVElNRV9DQUNIRV9IRUFERVJTIH0gPSBwcm9jZXNzLmVudjtcbiAgaWYgKGRlYnVnKSB7XG4gICAgY29uc29sZS5sb2coXCJSdW50aW1lIGNhY2hlIGVudmlyb25tZW50IHZhcmlhYmxlczpcIiwge1xuICAgICAgUlVOVElNRV9DQUNIRV9FTkRQT0lOVCxcbiAgICAgIFJVTlRJTUVfQ0FDSEVfSEVBREVSU1xuICAgIH0pO1xuICB9XG4gIGlmICghUlVOVElNRV9DQUNIRV9FTkRQT0lOVCB8fCAhUlVOVElNRV9DQUNIRV9IRUFERVJTKSB7XG4gICAgaWYgKCF3YXJuZWRDYWNoZVVuYXZhaWxhYmxlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiUnVudGltZSBDYWNoZSB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50LiBGYWxsaW5nIGJhY2sgdG8gaW4tbWVtb3J5IGNhY2hlLlwiXG4gICAgICApO1xuICAgICAgd2FybmVkQ2FjaGVVbmF2YWlsYWJsZSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpbk1lbW9yeUNhY2hlSW5zdGFuY2U7XG4gIH1cbiAgaWYgKCFidWlsZENhY2hlSW5zdGFuY2UpIHtcbiAgICBsZXQgcGFyc2VkSGVhZGVycyA9IHt9O1xuICAgIHRyeSB7XG4gICAgICBwYXJzZWRIZWFkZXJzID0gSlNPTi5wYXJzZShSVU5USU1FX0NBQ0hFX0hFQURFUlMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcGFyc2UgUlVOVElNRV9DQUNIRV9IRUFERVJTOlwiLCBlKTtcbiAgICAgIHJldHVybiBpbk1lbW9yeUNhY2hlSW5zdGFuY2U7XG4gICAgfVxuICAgIGxldCB0aW1lb3V0ID0gNTAwO1xuICAgIGlmIChwcm9jZXNzLmVudi5SVU5USU1FX0NBQ0hFX1RJTUVPVVQpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHByb2Nlc3MuZW52LlJVTlRJTUVfQ0FDSEVfVElNRU9VVCwgMTApO1xuICAgICAgaWYgKCFpc05hTihwYXJzZWQpICYmIHBhcnNlZCA+IDApIHtcbiAgICAgICAgdGltZW91dCA9IHBhcnNlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgSW52YWxpZCBSVU5USU1FX0NBQ0hFX1RJTUVPVVQgdmFsdWU6IFwiJHtwcm9jZXNzLmVudi5SVU5USU1FX0NBQ0hFX1RJTUVPVVR9XCIuIFVzaW5nIGRlZmF1bHQ6ICR7dGltZW91dH1tc2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYnVpbGRDYWNoZUluc3RhbmNlID0gbmV3IGltcG9ydF9idWlsZF9jbGllbnQuQnVpbGRDYWNoZSh7XG4gICAgICBlbmRwb2ludDogUlVOVElNRV9DQUNIRV9FTkRQT0lOVCxcbiAgICAgIGhlYWRlcnM6IHBhcnNlZEhlYWRlcnMsXG4gICAgICBvbkVycm9yOiAoZXJyb3IpID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpLFxuICAgICAgdGltZW91dFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBidWlsZENhY2hlSW5zdGFuY2U7XG59XG52YXIgUGtnQ2FjaGVTdGF0ZSA9IC8qIEBfX1BVUkVfXyAqLyAoKFBrZ0NhY2hlU3RhdGUyKSA9PiB7XG4gIFBrZ0NhY2hlU3RhdGUyW1wiRnJlc2hcIl0gPSBcImZyZXNoXCI7XG4gIFBrZ0NhY2hlU3RhdGUyW1wiU3RhbGVcIl0gPSBcInN0YWxlXCI7XG4gIFBrZ0NhY2hlU3RhdGUyW1wiRXhwaXJlZFwiXSA9IFwiZXhwaXJlZFwiO1xuICBQa2dDYWNoZVN0YXRlMltcIk5vdEZvdW5kXCJdID0gXCJub3RGb3VuZFwiO1xuICBQa2dDYWNoZVN0YXRlMltcIkVycm9yXCJdID0gXCJlcnJvclwiO1xuICByZXR1cm4gUGtnQ2FjaGVTdGF0ZTI7XG59KShQa2dDYWNoZVN0YXRlIHx8IHt9KTtcbmNvbnN0IEhFQURFUlNfVkVSQ0VMX0NBQ0hFX1NUQVRFID0gXCJ4LXZlcmNlbC1jYWNoZS1zdGF0ZVwiO1xuY29uc3QgSEVBREVSU19WRVJDRUxfUkVWQUxJREFURSA9IFwieC12ZXJjZWwtcmV2YWxpZGF0ZVwiO1xuY29uc3QgSEVBREVSU19WRVJDRUxfQ0FDSEVfVEFHUyA9IFwieC12ZXJjZWwtY2FjaGUtdGFnc1wiO1xuY29uc3QgSEVBREVSU19WRVJDRUxfQ0FDSEVfSVRFTV9OQU1FID0gXCJ4LXZlcmNlbC1jYWNoZS1pdGVtLW5hbWVcIjtcbi8vIEFubm90YXRlIHRoZSBDb21tb25KUyBleHBvcnQgbmFtZXMgZm9yIEVTTSBpbXBvcnQgaW4gbm9kZTpcbjAgJiYgKG1vZHVsZS5leHBvcnRzID0ge1xuICBIRUFERVJTX1ZFUkNFTF9DQUNIRV9JVEVNX05BTUUsXG4gIEhFQURFUlNfVkVSQ0VMX0NBQ0hFX1NUQVRFLFxuICBIRUFERVJTX1ZFUkNFTF9DQUNIRV9UQUdTLFxuICBIRUFERVJTX1ZFUkNFTF9SRVZBTElEQVRFLFxuICBQa2dDYWNoZVN0YXRlLFxuICBnZXRDYWNoZVxufSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xudmFyIGRiX2Nvbm5lY3Rpb25zX2V4cG9ydHMgPSB7fTtcbl9fZXhwb3J0KGRiX2Nvbm5lY3Rpb25zX2V4cG9ydHMsIHtcbiAgYXR0YWNoRGF0YWJhc2VQb29sOiAoKSA9PiBhdHRhY2hEYXRhYmFzZVBvb2wsXG4gIGV4cGVyaW1lbnRhbF9hdHRhY2hEYXRhYmFzZVBvb2w6ICgpID0+IGV4cGVyaW1lbnRhbF9hdHRhY2hEYXRhYmFzZVBvb2xcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBfX3RvQ29tbW9uSlMoZGJfY29ubmVjdGlvbnNfZXhwb3J0cyk7XG52YXIgaW1wb3J0X2dldF9jb250ZXh0ID0gcmVxdWlyZShcIi4uL2dldC1jb250ZXh0XCIpO1xuY29uc3QgREVCVUcgPSAhIXByb2Nlc3MuZW52LkRFQlVHO1xuZnVuY3Rpb24gZ2V0SWRsZVRpbWVvdXQoZGJQb29sKSB7XG4gIGlmIChcIm9wdGlvbnNcIiBpbiBkYlBvb2wgJiYgZGJQb29sLm9wdGlvbnMpIHtcbiAgICBpZiAoXCJpZGxlVGltZW91dE1pbGxpc1wiIGluIGRiUG9vbC5vcHRpb25zKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGRiUG9vbC5vcHRpb25zLmlkbGVUaW1lb3V0TWlsbGlzID09PSBcIm51bWJlclwiID8gZGJQb29sLm9wdGlvbnMuaWRsZVRpbWVvdXRNaWxsaXMgOiAxZTQ7XG4gICAgfVxuICAgIGlmIChcIm1heElkbGVUaW1lTVNcIiBpbiBkYlBvb2wub3B0aW9ucykge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkYlBvb2wub3B0aW9ucy5tYXhJZGxlVGltZU1TID09PSBcIm51bWJlclwiID8gZGJQb29sLm9wdGlvbnMubWF4SWRsZVRpbWVNUyA6IDA7XG4gICAgfVxuICAgIGlmIChcInN0YXR1c1wiIGluIGRiUG9vbCkge1xuICAgICAgcmV0dXJuIDVlMztcbiAgICB9XG4gICAgaWYgKFwiY29ubmVjdFwiIGluIGRiUG9vbCAmJiBcImV4ZWN1dGVcIiBpbiBkYlBvb2wpIHtcbiAgICAgIHJldHVybiAzZTQ7XG4gICAgfVxuICB9XG4gIGlmIChcImNvbmZpZ1wiIGluIGRiUG9vbCAmJiBkYlBvb2wuY29uZmlnKSB7XG4gICAgaWYgKFwiY29ubmVjdGlvbkNvbmZpZ1wiIGluIGRiUG9vbC5jb25maWcgJiYgZGJQb29sLmNvbmZpZy5jb25uZWN0aW9uQ29uZmlnKSB7XG4gICAgICByZXR1cm4gZGJQb29sLmNvbmZpZy5jb25uZWN0aW9uQ29uZmlnLmlkbGVUaW1lb3V0IHx8IDZlNDtcbiAgICB9XG4gICAgaWYgKFwiaWRsZVRpbWVvdXRcIiBpbiBkYlBvb2wuY29uZmlnKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGRiUG9vbC5jb25maWcuaWRsZVRpbWVvdXQgPT09IFwibnVtYmVyXCIgPyBkYlBvb2wuY29uZmlnLmlkbGVUaW1lb3V0IDogNmU0O1xuICAgIH1cbiAgfVxuICBpZiAoXCJwb29sVGltZW91dFwiIGluIGRiUG9vbCkge1xuICAgIHJldHVybiB0eXBlb2YgZGJQb29sLnBvb2xUaW1lb3V0ID09PSBcIm51bWJlclwiID8gZGJQb29sLnBvb2xUaW1lb3V0IDogNmU0O1xuICB9XG4gIGlmIChcImlkbGVUaW1lb3V0XCIgaW4gZGJQb29sKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBkYlBvb2wuaWRsZVRpbWVvdXQgPT09IFwibnVtYmVyXCIgPyBkYlBvb2wuaWRsZVRpbWVvdXQgOiAwO1xuICB9XG4gIHJldHVybiAxZTQ7XG59XG5sZXQgaWRsZVRpbWVvdXQgPSBudWxsO1xubGV0IGlkbGVUaW1lb3V0UmVzb2x2ZSA9ICgpID0+IHtcbn07XG5jb25zdCBib290VGltZSA9IERhdGUubm93KCk7XG5jb25zdCBtYXhpbXVtRHVyYXRpb24gPSAxNSAqIDYwICogMWUzIC0gMWUzO1xuZnVuY3Rpb24gd2FpdFVudGlsSWRsZVRpbWVvdXQoZGJQb29sKSB7XG4gIGlmICghcHJvY2Vzcy5lbnYuVkVSQ0VMX1VSTCB8fCAvLyBUaGlzIGlzIG5vdCBzZXQgZHVyaW5nIGJ1aWxkcyB3aGVyZSB3ZSBkb24ndCBuZWVkIHRvIHdhaXQgZm9yIGlkbGUgY29ubmVjdGlvbnMgdXNpbmcgdGhlIG1lY2hhbmlzbVxuICAhcHJvY2Vzcy5lbnYuVkVSQ0VMX1JFR0lPTikge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoaWRsZVRpbWVvdXQpIHtcbiAgICBjbGVhclRpbWVvdXQoaWRsZVRpbWVvdXQpO1xuICAgIGlkbGVUaW1lb3V0UmVzb2x2ZSgpO1xuICB9XG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlkbGVUaW1lb3V0UmVzb2x2ZSA9IHJlc29sdmU7XG4gIH0pO1xuICBjb25zdCB3YWl0VGltZSA9IE1hdGgubWluKFxuICAgIGdldElkbGVUaW1lb3V0KGRiUG9vbCkgKyAxMDAsXG4gICAgTWF0aC5tYXgoMTAwLCBtYXhpbXVtRHVyYXRpb24gLSAoRGF0ZS5ub3coKSAtIGJvb3RUaW1lKSlcbiAgKTtcbiAgaWRsZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZGxlVGltZW91dFJlc29sdmU/LigpO1xuICAgIGlmIChERUJVRykge1xuICAgICAgY29uc29sZS5sb2coXCJEYXRhYmFzZSBwb29sIGlkbGUgdGltZW91dCByZWFjaGVkLiBSZWxlYXNpbmcgY29ubmVjdGlvbnMuXCIpO1xuICAgIH1cbiAgfSwgd2FpdFRpbWUpO1xuICBjb25zdCByZXF1ZXN0Q29udGV4dCA9ICgwLCBpbXBvcnRfZ2V0X2NvbnRleHQuZ2V0Q29udGV4dCkoKTtcbiAgaWYgKHJlcXVlc3RDb250ZXh0Py53YWl0VW50aWwpIHtcbiAgICByZXF1ZXN0Q29udGV4dC53YWl0VW50aWwocHJvbWlzZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKFwiUG9vbCByZWxlYXNlIGV2ZW50IHRyaWdnZXJlZCBvdXRzaWRlIG9mIHJlcXVlc3Qgc2NvcGUuXCIpO1xuICB9XG59XG5mdW5jdGlvbiBhdHRhY2hEYXRhYmFzZVBvb2woZGJQb29sKSB7XG4gIGlmIChpZGxlVGltZW91dCkge1xuICAgIGlkbGVUaW1lb3V0UmVzb2x2ZT8uKCk7XG4gICAgY2xlYXJUaW1lb3V0KGlkbGVUaW1lb3V0KTtcbiAgfVxuICBpZiAoXCJvblwiIGluIGRiUG9vbCAmJiBkYlBvb2wub24gJiYgXCJvcHRpb25zXCIgaW4gZGJQb29sICYmIFwiaWRsZVRpbWVvdXRNaWxsaXNcIiBpbiBkYlBvb2wub3B0aW9ucykge1xuICAgIGNvbnN0IHBnUG9vbCA9IGRiUG9vbDtcbiAgICBwZ1Bvb2wub24oXCJyZWxlYXNlXCIsICgpID0+IHtcbiAgICAgIGlmIChERUJVRykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNsaWVudCByZWxlYXNlZCBmcm9tIHBvb2xcIik7XG4gICAgICB9XG4gICAgICB3YWl0VW50aWxJZGxlVGltZW91dChkYlBvb2wpO1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmIChcIm9uXCIgaW4gZGJQb29sICYmIGRiUG9vbC5vbiAmJiBcImNvbmZpZ1wiIGluIGRiUG9vbCAmJiBkYlBvb2wuY29uZmlnICYmIFwiY29ubmVjdGlvbkNvbmZpZ1wiIGluIGRiUG9vbC5jb25maWcpIHtcbiAgICBjb25zdCBteXNxbFBvb2wgPSBkYlBvb2w7XG4gICAgbXlzcWxQb29sLm9uKFwicmVsZWFzZVwiLCAoKSA9PiB7XG4gICAgICBpZiAoREVCVUcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJNeVNRTCBjbGllbnQgcmVsZWFzZWQgZnJvbSBwb29sXCIpO1xuICAgICAgfVxuICAgICAgd2FpdFVudGlsSWRsZVRpbWVvdXQoZGJQb29sKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoXCJvblwiIGluIGRiUG9vbCAmJiBkYlBvb2wub24gJiYgXCJjb25maWdcIiBpbiBkYlBvb2wgJiYgZGJQb29sLmNvbmZpZyAmJiBcImlkbGVUaW1lb3V0XCIgaW4gZGJQb29sLmNvbmZpZykge1xuICAgIGNvbnN0IG15c3FsMlBvb2wgPSBkYlBvb2w7XG4gICAgbXlzcWwyUG9vbC5vbihcInJlbGVhc2VcIiwgKCkgPT4ge1xuICAgICAgaWYgKERFQlVHKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTXlTUUwyL01hcmlhREIgY2xpZW50IHJlbGVhc2VkIGZyb20gcG9vbFwiKTtcbiAgICAgIH1cbiAgICAgIHdhaXRVbnRpbElkbGVUaW1lb3V0KGRiUG9vbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChcIm9uXCIgaW4gZGJQb29sICYmIGRiUG9vbC5vbiAmJiBcIm9wdGlvbnNcIiBpbiBkYlBvb2wgJiYgZGJQb29sLm9wdGlvbnMgJiYgXCJtYXhJZGxlVGltZU1TXCIgaW4gZGJQb29sLm9wdGlvbnMpIHtcbiAgICBjb25zdCBtb25nb1Bvb2wgPSBkYlBvb2w7XG4gICAgbW9uZ29Qb29sLm9uKFwiY29ubmVjdGlvbkNoZWNrZWRPdXRcIiwgKCkgPT4ge1xuICAgICAgaWYgKERFQlVHKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTW9uZ29EQiBjb25uZWN0aW9uIGNoZWNrZWQgb3V0XCIpO1xuICAgICAgfVxuICAgICAgd2FpdFVudGlsSWRsZVRpbWVvdXQoZGJQb29sKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKFwib25cIiBpbiBkYlBvb2wgJiYgZGJQb29sLm9uICYmIFwib3B0aW9uc1wiIGluIGRiUG9vbCAmJiBkYlBvb2wub3B0aW9ucyAmJiBcInNvY2tldFwiIGluIGRiUG9vbC5vcHRpb25zKSB7XG4gICAgY29uc3QgcmVkaXNQb29sID0gZGJQb29sO1xuICAgIHJlZGlzUG9vbC5vbihcImVuZFwiLCAoKSA9PiB7XG4gICAgICBpZiAoREVCVUcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWRpcyBjb25uZWN0aW9uIGVuZGVkXCIpO1xuICAgICAgfVxuICAgICAgd2FpdFVudGlsSWRsZVRpbWVvdXQoZGJQb29sKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgZGF0YWJhc2UgcG9vbCB0eXBlXCIpO1xufVxuY29uc3QgZXhwZXJpbWVudGFsX2F0dGFjaERhdGFiYXNlUG9vbCA9IGF0dGFjaERhdGFiYXNlUG9vbDtcbi8vIEFubm90YXRlIHRoZSBDb21tb25KUyBleHBvcnQgbmFtZXMgZm9yIEVTTSBpbXBvcnQgaW4gbm9kZTpcbjAgJiYgKG1vZHVsZS5leHBvcnRzID0ge1xuICBhdHRhY2hEYXRhYmFzZVBvb2wsXG4gIGV4cGVyaW1lbnRhbF9hdHRhY2hEYXRhYmFzZVBvb2xcbn0pO1xuIiwgIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19leHBvcnQgPSAodGFyZ2V0LCBhbGwpID0+IHtcbiAgZm9yICh2YXIgbmFtZSBpbiBhbGwpXG4gICAgX19kZWZQcm9wKHRhcmdldCwgbmFtZSwgeyBnZXQ6IGFsbFtuYW1lXSwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbn07XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX190b0NvbW1vbkpTID0gKG1vZCkgPT4gX19jb3B5UHJvcHMoX19kZWZQcm9wKHt9LCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KSwgbW9kKTtcbnZhciBwdXJnZV9leHBvcnRzID0ge307XG5fX2V4cG9ydChwdXJnZV9leHBvcnRzLCB7XG4gIGRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZTogKCkgPT4gZGFuZ2Vyb3VzbHlEZWxldGVCeVNyY0ltYWdlLFxuICBkYW5nZXJvdXNseURlbGV0ZUJ5VGFnOiAoKSA9PiBkYW5nZXJvdXNseURlbGV0ZUJ5VGFnLFxuICBpbnZhbGlkYXRlQnlTcmNJbWFnZTogKCkgPT4gaW52YWxpZGF0ZUJ5U3JjSW1hZ2UsXG4gIGludmFsaWRhdGVCeVRhZzogKCkgPT4gaW52YWxpZGF0ZUJ5VGFnXG59KTtcbm1vZHVsZS5leHBvcnRzID0gX190b0NvbW1vbkpTKHB1cmdlX2V4cG9ydHMpO1xudmFyIGltcG9ydF9nZXRfY29udGV4dCA9IHJlcXVpcmUoXCIuLi9nZXQtY29udGV4dFwiKTtcbmNvbnN0IGludmFsaWRhdGVCeVRhZyA9ICh0YWcpID0+IHtcbiAgY29uc3QgYXBpID0gKDAsIGltcG9ydF9nZXRfY29udGV4dC5nZXRDb250ZXh0KSgpLnB1cmdlO1xuICBpZiAoYXBpKSB7XG4gICAgcmV0dXJuIGFwaS5pbnZhbGlkYXRlQnlUYWcodGFnKTtcbiAgfVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59O1xuY29uc3QgZGFuZ2Vyb3VzbHlEZWxldGVCeVRhZyA9ICh0YWcsIG9wdGlvbnMpID0+IHtcbiAgY29uc3QgYXBpID0gKDAsIGltcG9ydF9nZXRfY29udGV4dC5nZXRDb250ZXh0KSgpLnB1cmdlO1xuICBpZiAoYXBpKSB7XG4gICAgcmV0dXJuIGFwaS5kYW5nZXJvdXNseURlbGV0ZUJ5VGFnKHRhZywgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufTtcbmNvbnN0IGludmFsaWRhdGVCeVNyY0ltYWdlID0gKHNyYykgPT4ge1xuICBjb25zdCBhcGkgPSAoMCwgaW1wb3J0X2dldF9jb250ZXh0LmdldENvbnRleHQpKCkucHVyZ2U7XG4gIHJldHVybiBhcGkgPyBhcGkuaW52YWxpZGF0ZUJ5U3JjSW1hZ2Uoc3JjKSA6IFByb21pc2UucmVzb2x2ZSgpO1xufTtcbmNvbnN0IGRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZSA9IChzcmMsIG9wdGlvbnMpID0+IHtcbiAgY29uc3QgYXBpID0gKDAsIGltcG9ydF9nZXRfY29udGV4dC5nZXRDb250ZXh0KSgpLnB1cmdlO1xuICByZXR1cm4gYXBpID8gYXBpLmRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZShzcmMsIG9wdGlvbnMpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG59O1xuLy8gQW5ub3RhdGUgdGhlIENvbW1vbkpTIGV4cG9ydCBuYW1lcyBmb3IgRVNNIGltcG9ydCBpbiBub2RlOlxuMCAmJiAobW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZSxcbiAgZGFuZ2Vyb3VzbHlEZWxldGVCeVRhZyxcbiAgaW52YWxpZGF0ZUJ5U3JjSW1hZ2UsXG4gIGludmFsaWRhdGVCeVRhZ1xufSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xudmFyIGFkZGNhY2hldGFnX2V4cG9ydHMgPSB7fTtcbl9fZXhwb3J0KGFkZGNhY2hldGFnX2V4cG9ydHMsIHtcbiAgYWRkQ2FjaGVUYWc6ICgpID0+IGFkZENhY2hlVGFnXG59KTtcbm1vZHVsZS5leHBvcnRzID0gX190b0NvbW1vbkpTKGFkZGNhY2hldGFnX2V4cG9ydHMpO1xudmFyIGltcG9ydF9nZXRfY29udGV4dCA9IHJlcXVpcmUoXCIuLi9nZXQtY29udGV4dFwiKTtcbmNvbnN0IGFkZENhY2hlVGFnID0gKHRhZykgPT4ge1xuICBjb25zdCBhZGRDYWNoZVRhZzIgPSAoMCwgaW1wb3J0X2dldF9jb250ZXh0LmdldENvbnRleHQpKCkuYWRkQ2FjaGVUYWc7XG4gIGlmIChhZGRDYWNoZVRhZzIpIHtcbiAgICByZXR1cm4gYWRkQ2FjaGVUYWcyKHRhZyk7XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufTtcbi8vIEFubm90YXRlIHRoZSBDb21tb25KUyBleHBvcnQgbmFtZXMgZm9yIEVTTSBpbXBvcnQgaW4gbm9kZTpcbjAgJiYgKG1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRDYWNoZVRhZ1xufSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4cG9ydCA9ICh0YXJnZXQsIGFsbCkgPT4ge1xuICBmb3IgKHZhciBuYW1lIGluIGFsbClcbiAgICBfX2RlZlByb3AodGFyZ2V0LCBuYW1lLCB7IGdldDogYWxsW25hbWVdLCBlbnVtZXJhYmxlOiB0cnVlIH0pO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xudmFyIHNyY19leHBvcnRzID0ge307XG5fX2V4cG9ydChzcmNfZXhwb3J0cywge1xuICBhZGRDYWNoZVRhZzogKCkgPT4gaW1wb3J0X2FkZGNhY2hldGFnLmFkZENhY2hlVGFnLFxuICBhdHRhY2hEYXRhYmFzZVBvb2w6ICgpID0+IGltcG9ydF9kYl9jb25uZWN0aW9ucy5hdHRhY2hEYXRhYmFzZVBvb2wsXG4gIGRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZTogKCkgPT4gaW1wb3J0X3B1cmdlLmRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZSxcbiAgZGFuZ2Vyb3VzbHlEZWxldGVCeVRhZzogKCkgPT4gaW1wb3J0X3B1cmdlLmRhbmdlcm91c2x5RGVsZXRlQnlUYWcsXG4gIGV4cGVyaW1lbnRhbF9hdHRhY2hEYXRhYmFzZVBvb2w6ICgpID0+IGltcG9ydF9kYl9jb25uZWN0aW9ucy5leHBlcmltZW50YWxfYXR0YWNoRGF0YWJhc2VQb29sLFxuICBnZW9sb2NhdGlvbjogKCkgPT4gaW1wb3J0X2hlYWRlcnMuZ2VvbG9jYXRpb24sXG4gIGdldENhY2hlOiAoKSA9PiBpbXBvcnRfY2FjaGUuZ2V0Q2FjaGUsXG4gIGdldEVudjogKCkgPT4gaW1wb3J0X2dldF9lbnYuZ2V0RW52LFxuICBpbnZhbGlkYXRlQnlTcmNJbWFnZTogKCkgPT4gaW1wb3J0X3B1cmdlLmludmFsaWRhdGVCeVNyY0ltYWdlLFxuICBpbnZhbGlkYXRlQnlUYWc6ICgpID0+IGltcG9ydF9wdXJnZS5pbnZhbGlkYXRlQnlUYWcsXG4gIGlwQWRkcmVzczogKCkgPT4gaW1wb3J0X2hlYWRlcnMuaXBBZGRyZXNzLFxuICBuZXh0OiAoKSA9PiBpbXBvcnRfbWlkZGxld2FyZS5uZXh0LFxuICByZXdyaXRlOiAoKSA9PiBpbXBvcnRfbWlkZGxld2FyZS5yZXdyaXRlLFxuICB3YWl0VW50aWw6ICgpID0+IGltcG9ydF93YWl0X3VudGlsLndhaXRVbnRpbFxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IF9fdG9Db21tb25KUyhzcmNfZXhwb3J0cyk7XG52YXIgaW1wb3J0X2hlYWRlcnMgPSByZXF1aXJlKFwiLi9oZWFkZXJzXCIpO1xudmFyIGltcG9ydF9nZXRfZW52ID0gcmVxdWlyZShcIi4vZ2V0LWVudlwiKTtcbnZhciBpbXBvcnRfd2FpdF91bnRpbCA9IHJlcXVpcmUoXCIuL3dhaXQtdW50aWxcIik7XG52YXIgaW1wb3J0X21pZGRsZXdhcmUgPSByZXF1aXJlKFwiLi9taWRkbGV3YXJlXCIpO1xudmFyIGltcG9ydF9jYWNoZSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIGltcG9ydF9kYl9jb25uZWN0aW9ucyA9IHJlcXVpcmUoXCIuL2RiLWNvbm5lY3Rpb25zXCIpO1xudmFyIGltcG9ydF9wdXJnZSA9IHJlcXVpcmUoXCIuL3B1cmdlXCIpO1xudmFyIGltcG9ydF9hZGRjYWNoZXRhZyA9IHJlcXVpcmUoXCIuL2FkZGNhY2hldGFnXCIpO1xuLy8gQW5ub3RhdGUgdGhlIENvbW1vbkpTIGV4cG9ydCBuYW1lcyBmb3IgRVNNIGltcG9ydCBpbiBub2RlOlxuMCAmJiAobW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZENhY2hlVGFnLFxuICBhdHRhY2hEYXRhYmFzZVBvb2wsXG4gIGRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZSxcbiAgZGFuZ2Vyb3VzbHlEZWxldGVCeVRhZyxcbiAgZXhwZXJpbWVudGFsX2F0dGFjaERhdGFiYXNlUG9vbCxcbiAgZ2VvbG9jYXRpb24sXG4gIGdldENhY2hlLFxuICBnZXRFbnYsXG4gIGludmFsaWRhdGVCeVNyY0ltYWdlLFxuICBpbnZhbGlkYXRlQnlUYWcsXG4gIGlwQWRkcmVzcyxcbiAgbmV4dCxcbiAgcmV3cml0ZSxcbiAgd2FpdFVudGlsXG59KTtcbiIsICJpbXBvcnQgeyBnZXRDYWNoZSwgZ2V0RW52LCB0eXBlIFJ1bnRpbWVDYWNoZSB9IGZyb20gJ0B2ZXJjZWwvZnVuY3Rpb25zJ1xuXG4vLyBDYWNoZSB0aGUgcHJveGllZCBzY3JpcHQgZm9yIDcgZGF5cyBpbiB0aGUgcnVudGltZSBjYWNoZVxuY29uc3QgcnVudGltZUNhY2hlRHVyYXRpb24gPSA4NjQwMCAqIDdcbi8vIENhY2hlIHRoZSBwcm94aWVkIHNjcmlwdCBmb3IgMTIgaG91cnMgaW4gdGhlIGJyb3dzZXIgYW5kIGVkZ2UgY2FjaGVcbmNvbnN0IGNsaWVudENhY2hlRHVyYXRpb24gPSAzMjQwMFxuXG50eXBlIENhY2hlZFNjcmlwdCA9IHtcbiAgY29udGVudDogc3RyaW5nXG4gIGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbn1cblxuLy8gSGFuZGxlIHByb3h5IGZvciBQbGF1c2libGUgaWYgZW5hYmxlZCAoaWYgdGhlIFBMQVVTSUJMRV9TQ1JJUFQgZW52IHZhciBjb250YWlucyB0aGUgVVJMIG9mIHRoZSBQbGF1c2libGUgc2VydmVyLCB3aXRoIGh0dHBzIHByZWZpeClcbi8vIFByb3h5IGFuZCBjYWNoZSB0aGUgc2NyaXB0IChmcm9tIC9wbHMvaW5kZXguanMgYW5kIC9wbHMvaW5kZXguW3JhbmRvbV0uanMgdG8gJHtQTEFVU0lCTEVfU0NSSVBUfSwgd2hpY2ggc2hvdWxkIGJlIHRoZSBwcm9wZXJ0eS1zcGVjaWZpYyBVUkwpXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFzeW5jIGZldGNoKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgICBjb25zdCB1cHN0cmVhbVVybCA9IHByb2Nlc3MuZW52LlBMQVVTSUJMRV9TQ1JJUFRcblxuICAgIGlmICghdXBzdHJlYW1VcmwpIHtcbiAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoJycsIHtcbiAgICAgICAgc3RhdHVzOiAyMDQsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnY2FjaGUtY29udHJvbCc6ICduby1jYWNoZScsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IHNjcmlwdENvbnRlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuICAgIGxldCBoZWFkZXJzOiBIZWFkZXJzIHwgdW5kZWZpbmVkXG4gICAgbGV0IGNhY2hlOiBSdW50aW1lQ2FjaGUgfCB1bmRlZmluZWRcblxuICAgIC8vIENoZWNrIGlmIHdlIGhhdmUgdGhlIHNjcmlwdCBpbiB0aGUgVmVyY2VsIHJ1bnRpbWUgY2FjaGVcbiAgICBjb25zdCB7IFZFUkNFTCwgVkVSQ0VMX0RFUExPWU1FTlRfSUQgfSA9IGdldEVudigpXG4gICAgaWYgKFZFUkNFTCA9PSAnMScpIHtcbiAgICAgIGNhY2hlID0gZ2V0Q2FjaGUoe1xuICAgICAgICBuYW1lc3BhY2U6IFZFUkNFTF9ERVBMT1lNRU5UX0lELFxuICAgICAgfSlcbiAgICAgIGNvbnN0IGNhY2hlZCA9IChhd2FpdCBjYWNoZS5nZXQodXBzdHJlYW1VcmwpKSBhcyBDYWNoZWRTY3JpcHQgfCBudWxsXG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIHNjcmlwdENvbnRlbnQgPSBjYWNoZWQuY29udGVudFxuICAgICAgICBoZWFkZXJzID0gbmV3IEhlYWRlcnMoY2FjaGVkLmhlYWRlcnMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUncyBubyBjYWNoZWQgdmFsdWUsIGZldGNoIGZyb20gdGhlIHVwc3RyZWFtIFBsYXVzaWJsZSBzZXJ2ZXJcbiAgICBpZiAoIXNjcmlwdENvbnRlbnQgfHwgIWhlYWRlcnMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIEZldGNoIGZyb20gdGhlIHVwc3RyZWFtIFBsYXVzaWJsZSBzZXJ2ZXJcbiAgICAgICAgY29uc3QgcmVxdWVzdEhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gICAgICAgIGNvbnN0IG9pZGNUb2tlbiA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ3gtdmVyY2VsLW9pZGMtdG9rZW4nKVxuICAgICAgICBpZiAob2lkY1Rva2VuKSB7XG4gICAgICAgICAgLy8gQWRkIHRoZSBWZXJjZWwgT0lEQyB0b2tlbiB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3RIZWFkZXJzLnNldCgnYXV0aG9yaXphdGlvbicsICdCZWFyZXIgJytvaWRjVG9rZW4pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXBzdHJlYW1SZXNwb25zZSA9IGF3YWl0IGZldGNoKHVwc3RyZWFtVXJsLCB7XG4gICAgICAgICAgaGVhZGVyczogcmVxdWVzdEhlYWRlcnMsXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCF1cHN0cmVhbVJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHVwc3RyZWFtUmVzcG9uc2UudGV4dCgpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmV0Y2ggc2NyaXB0IHdpdGggc3RhdHVzIGNvZGUgJHt1cHN0cmVhbVJlc3BvbnNlLnN0YXR1c306ICR7dGV4dH1gKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IHRoZSByZXNwb25zZSB0ZXh0IGFzIHNjcmlwdCBjb250ZW50XG4gICAgICAgIHNjcmlwdENvbnRlbnQgPSBhd2FpdCB1cHN0cmVhbVJlc3BvbnNlLnRleHQoKVxuXG4gICAgICAgIC8vIFNhdmUgc3BlY2lmaWMgaGVhZGVyc1xuICAgICAgICBjb25zdCBwcmVzZXJ2ZUhlYWRlcnMgPSBbXG4gICAgICAgICAgJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbicsXG4gICAgICAgICAgJ2NvbnRlbnQtdHlwZScsXG4gICAgICAgICAgJ2Nyb3NzLW9yaWdpbi1yZXNvdXJjZS1wb2xpY3knLFxuICAgICAgICAgICdsYXN0LW1vZGlmaWVkJyxcbiAgICAgICAgXVxuICAgICAgICBjb25zdCByZXNwb25zZUhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB1cHN0cmVhbVJlc3BvbnNlLmhlYWRlcnMua2V5cygpKSB7XG4gICAgICAgICAgaWYgKHByZXNlcnZlSGVhZGVycy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICByZXNwb25zZUhlYWRlcnNba2V5XSA9IHVwc3RyZWFtUmVzcG9uc2UuaGVhZGVycy5nZXQoa2V5KSFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHJlc3BvbnNlSGVhZGVycylcblxuICAgICAgICAvLyBTdG9yZSB0aGUgc2NyaXB0IGluIHRoZSBjYWNoZVxuICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICBjYWNoZS5zZXQodXBzdHJlYW1VcmwsIHsgY29udGVudDogc2NyaXB0Q29udGVudCwgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzIH0gYXMgQ2FjaGVkU2NyaXB0LCB7XG4gICAgICAgICAgICB0dGw6IHJ1bnRpbWVDYWNoZUR1cmF0aW9uLFxuICAgICAgICAgICAgdGFnczogWydwbGF1c2libGUnXSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm94eWluZyBzY3JpcHQ6ICcgKyBlcnJvcilcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZSgnRXJyb3IgcHJveHlpbmcgc2NyaXB0JywgeyBzdGF0dXM6IDUwMCB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBwYWRkaW5nXG4gICAgY29uc3QgbnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwKVxuICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XG4gICAgICBzY3JpcHRDb250ZW50ICs9IGBcXG47J2AgKyBudW0gKyBgJ2BcbiAgICB9IGVsc2Uge1xuICAgICAgc2NyaXB0Q29udGVudCA9IGAnYCArIG51bSArIGAnO1xcbmAgKyBzY3JpcHRDb250ZW50XG4gICAgfVxuXG4gICAgLy8gU2V0IGNhY2hlIGhlYWRlcnNcbiAgICBoZWFkZXJzLnNldCgnQ2FjaGUtQ29udHJvbCcsIGBwdWJsaWMsIG1heC1hZ2U9JHtjbGllbnRDYWNoZUR1cmF0aW9ufWApXG5cbiAgICAvLyBDcmVhdGUgcmVzcG9uc2Ugd2l0aCBjYWNoaW5nIGhlYWRlcnNcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHNjcmlwdENvbnRlbnQsIHtcbiAgICAgIHN0YXR1czogMjAwLFxuICAgICAgaGVhZGVycyxcbiAgICB9KVxuICB9LFxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7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UUFDSDtBQUFBLE1BQ0YsU0FBUyxPQUFPO0FBQ2QsZ0JBQVEsTUFBTSw0QkFBNEIsS0FBSztBQUMvQyxlQUFPLElBQUksU0FBUyx5QkFBeUIsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLE1BQzlEO0FBQUEsSUFDRjtBQUdBLFVBQU0sTUFBTSxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBTTtBQUM3QyxRQUFJLEtBQUssT0FBTyxJQUFJLEtBQUs7QUFDdkIsdUJBQWlCO0FBQUEsTUFBUyxNQUFNO0FBQUEsSUFDbEMsT0FBTztBQUNMLHNCQUFnQixNQUFNLE1BQU07QUFBQSxJQUFTO0FBQUEsSUFDdkM7QUFHQSxZQUFRLElBQUksaUJBQWlCLG1CQUFtQixtQkFBbUIsRUFBRTtBQUdyRSxXQUFPLElBQUksU0FBUyxlQUFlO0FBQUEsTUFDakMsUUFBUTtBQUFBLE1BQ1I7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0Y7IiwKICAibmFtZXMiOiBbImV4cG9ydHMiLCAibW9kdWxlIiwgIl9fZGVmUHJvcCIsICJfX2dldE93blByb3BEZXNjIiwgIl9fZ2V0T3duUHJvcE5hbWVzIiwgIl9faGFzT3duUHJvcCIsICJfX2V4cG9ydCIsICJfX2NvcHlQcm9wcyIsICJfX3RvQ29tbW9uSlMiLCAiZ2VvbG9jYXRpb24iLCAiaXBBZGRyZXNzIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgIl9fZGVmUHJvcCIsICJfX2dldE93blByb3BEZXNjIiwgIl9fZ2V0T3duUHJvcE5hbWVzIiwgIl9faGFzT3duUHJvcCIsICJfX2V4cG9ydCIsICJfX2NvcHlQcm9wcyIsICJfX3RvQ29tbW9uSlMiLCAiZ2V0RW52IiwgImV4cG9ydHMiLCAibW9kdWxlIiwgIl9fZGVmUHJvcCIsICJfX2dldE93blByb3BEZXNjIiwgIl9fZ2V0T3duUHJvcE5hbWVzIiwgIl9faGFzT3duUHJvcCIsICJfX2V4cG9ydCIsICJfX2NvcHlQcm9wcyIsICJfX3RvQ29tbW9uSlMiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiX19kZWZQcm9wIiwgIl9fZ2V0T3duUHJvcERlc2MiLCAiX19nZXRPd25Qcm9wTmFtZXMiLCAiX19oYXNPd25Qcm9wIiwgIl9fZXhwb3J0IiwgIl9fY29weVByb3BzIiwgIl9fdG9Db21tb25KUyIsICJ3YWl0VW50aWwiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiX19kZWZQcm9wIiwgIl9fZ2V0T3duUHJvcERlc2MiLCAiX19nZXRPd25Qcm9wTmFtZXMiLCAiX19oYXNPd25Qcm9wIiwgIl9fZXhwb3J0IiwgIl9fY29weVByb3BzIiwgIl9fdG9Db21tb25KUyIsICJuZXh0IiwgInJld3JpdGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiX19kZWZQcm9wIiwgIl9fZ2V0T3duUHJvcERlc2MiLCAiX19nZXRPd25Qcm9wTmFtZXMiLCAiX19oYXNPd25Qcm9wIiwgIl9fZXhwb3J0IiwgIl9fY29weVByb3BzIiwgIl9fdG9Db21tb25KUyIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJfX2RlZlByb3AiLCAiX19nZXRPd25Qcm9wRGVzYyIsICJfX2dldE93blByb3BOYW1lcyIsICJfX2hhc093blByb3AiLCAiX19leHBvcnQiLCAiX19jb3B5UHJvcHMiLCAiX190b0NvbW1vbkpTIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgIl9fZGVmUHJvcCIsICJfX2dldE93blByb3BEZXNjIiwgIl9fZ2V0T3duUHJvcE5hbWVzIiwgIl9faGFzT3duUHJvcCIsICJfX2V4cG9ydCIsICJfX2NvcHlQcm9wcyIsICJfX3RvQ29tbW9uSlMiLCAiZ2V0Q2FjaGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiX19kZWZQcm9wIiwgIl9fZ2V0T3duUHJvcERlc2MiLCAiX19nZXRPd25Qcm9wTmFtZXMiLCAiX19oYXNPd25Qcm9wIiwgIl9fZXhwb3J0IiwgIl9fY29weVByb3BzIiwgIl9fdG9Db21tb25KUyIsICJhdHRhY2hEYXRhYmFzZVBvb2wiLCAiZXhwZXJpbWVudGFsX2F0dGFjaERhdGFiYXNlUG9vbCIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJfX2RlZlByb3AiLCAiX19nZXRPd25Qcm9wRGVzYyIsICJfX2dldE93blByb3BOYW1lcyIsICJfX2hhc093blByb3AiLCAiX19leHBvcnQiLCAiX19jb3B5UHJvcHMiLCAiX190b0NvbW1vbkpTIiwgImRhbmdlcm91c2x5RGVsZXRlQnlTcmNJbWFnZSIsICJkYW5nZXJvdXNseURlbGV0ZUJ5VGFnIiwgImludmFsaWRhdGVCeVNyY0ltYWdlIiwgImludmFsaWRhdGVCeVRhZyIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJfX2RlZlByb3AiLCAiX19nZXRPd25Qcm9wRGVzYyIsICJfX2dldE93blByb3BOYW1lcyIsICJfX2hhc093blByb3AiLCAiX19leHBvcnQiLCAiX19jb3B5UHJvcHMiLCAiX190b0NvbW1vbkpTIiwgImFkZENhY2hlVGFnIiwgImFkZENhY2hlVGFnMiIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJfX2RlZlByb3AiLCAiX19nZXRPd25Qcm9wRGVzYyIsICJfX2dldE93blByb3BOYW1lcyIsICJfX2hhc093blByb3AiLCAiX19leHBvcnQiLCAiX19jb3B5UHJvcHMiLCAiX190b0NvbW1vbkpTIl0KfQo=
