'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @notice 此文件在Node端也会执行（如果涉及Isomorphism 则在此文件中引入前端模块的内容）

var Templates = function () {
  function Templates(tplParams) {
    _classCallCheck(this, Templates);

    this.ctx = tplParams.ctx;
    this.serveData = Object.assign({}, tplParams.serveData || {});
    this.routes = Object.assign({}, tplParams.routes || []);
    this.pages = Object.assign({}, tplParams.pages || []);
    this.page = tplParams.page || null;
    this.key = tplParams.key || null;
  }

  _createClass(Templates, [{
    key: 'toHtml',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', '<!DOCTYPE html><html><body>服务端渲染内容</body></html>');

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function toHtml() {
        return _ref.apply(this, arguments);
      }

      return toHtml;
    }()
  }]);

  return Templates;
}();

exports.default = Templates;