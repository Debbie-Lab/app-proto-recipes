'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Templates = function () {
  function Templates(params) {
    _classCallCheck(this, Templates);

    this.ctx = params.ctx;
    this.page = params.page || null;
    this.serveData = params.serveData || {};
    this.serveBundle = params.serveBundle || null;
  }

  _createClass(Templates, [{
    key: 'toHtml',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', '\n      <!DOCTYPE html>\n      <html>\n        <head>\n          <meta charset="UTF-8">\n          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">\n        </head>\n        <body>\n          <main>' + 'Live for nothing or die for something.' + '</main>\n        </body>\n      </html>\n    ');

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