'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Templates = function () {
  function Templates(serveData) {
    _classCallCheck(this, Templates);

    this.serveData = serveData;
  }

  _createClass(Templates, [{
    key: 'renderJs',
    value: function renderJs() {}
  }, {
    key: 'renderCss',
    value: function renderCss() {}
  }, {
    key: 'toHtml',
    value: function toHtml() {
      return '<!DOCTYPE html><html><body>服务端渲染内容</body></html>';
    }
  }]);

  return Templates;
}();