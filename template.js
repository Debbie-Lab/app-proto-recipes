'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @notice 此文件在Node端也会执行（如果涉及Isomorphism 则在此文件中引入前端文件）

var Templates = function () {
  function Templates(tplParams) {
    _classCallCheck(this, Templates);

    console.log(tplParams);
    this.serveData = Object.assign({}, tplParams.serveData || {});
    this.routes = Object.assign({}, tplParams.routes || []);
  }

  _createClass(Templates, [{
    key: 'toHtml',
    value: function toHtml() {
      return '<!DOCTYPE html><html><body>服务端渲染内容</body></html>';
    }
  }]);

  return Templates;
}();

exports.default = Templates;