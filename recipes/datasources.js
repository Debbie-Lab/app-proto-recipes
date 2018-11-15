"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = datasourcesRecipe;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _hjson = _interopRequireDefault(require("hjson"));

var _mockjs = _interopRequireDefault(require("mockjs"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

var _objectHash = _interopRequireDefault(require("object-hash"));

var _camelcase = _interopRequireDefault(require("camelcase"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("hjson/lib/require-config");

const join = _path.default.join;
const mock = _mockjs.default.mock;
const parse = _hjson.default.parse;

function fnGetMockData(file) {
  const fileName = file.substr(0, /\.js$/.exec(file).index);
  const fileJson = `${fileName}.json`;

  if ((0, _utils.accessible)(fileJson)) {
    return mock(require(fileJson));
  }

  const fileHjson = `${fileName}.hjson`;

  if ((0, _utils.accessible)(fileHjson)) {
    return require(fileHjson);
  }

  return {};
} // lru-caches options


const opts = {
  max: 800,
  maxAge: 1000 * 60 * 30
};

function datasourcesRecipe(app, drPath) {
  app.context['$caches'] = (0, _lruCache.default)(opts);

  if (!(0, _utils.dirExists)(drPath)) {
    throw new Error(`Wrong path: ${drPath}`);
  }

  const ds = {};

  const dsFunc = dsFile => {
    const func = require(dsFile).default;

    if (!app.context.$config.mock) {
      return func;
    }

    const mockData = fnGetMockData(dsFile);
    return async function (ctx, params, otherOpts = {}) {
      const {
        mock,
        cache,
        cacheAge,
        cacheKey
      } = Object.assign({
        mock: false,
        cache: false,
        cacheAge: 5000,
        cacheKey: null
      }, otherOpts);

      if (mock) {
        return mockData;
      }

      if (!cache) {
        return await func(ctx, params);
      }

      const key = cacheKey === null ? `${dsFile}-${(0, _objectHash.default)(params)}` : cacheKey();

      if (!ctx.$caches.has(key)) {
        const value = await func(ctx, params);
        ctx.$caches.set(key, value, cacheAge);
      }

      return ctx.$caches.get(key);
    };
  };

  (0, _glob.default)(join('**/*.js'), {
    cwd: drPath,
    dot: false,
    sync: true
  }).map(file => {
    const name = (0, _camelcase.default)(file.replace(/\//g, ' ').replace(/\.\w+$/, ''));
    ds[name] = dsFunc(join(drPath, file));
  });
  app.context['$ds'] = ds;
}