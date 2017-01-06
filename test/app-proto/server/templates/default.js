import Template from 'app-proto-recipes/template'

export default class DefaultTpl extends Template {
  constructor(serveData) {
    super(serveData)
  }

  toHtml() {
    return '<!DOCTYPE html><html><body>服务端渲染的内容</body></html>'
  }
}
