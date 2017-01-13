// @notice 此文件在Node端也会执行（如果涉及Isomorphism 则在此文件中引入前端模块的内容）

export default class Templates {
  constructor(tplParams) {
    this.serveData = Object.assign({}, tplParams.serveData || {})
    this.routes = Object.assign({}, tplParams.routes || [])
    this.pages = Object.assign({}, tplParams.pages || [])
    this.page = tplParams.page || null
    this.key = tplParams.key || null
  }

  async toHtml() {
    return '<!DOCTYPE html><html><body>服务端渲染内容</body></html>'
  }
}

