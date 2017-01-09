import Template from 'app-proto-recipes/template'

export default class DefaultTpl extends Template {
  constructor(serveData) {
    super(serveData)
  }

  toHtml() {
    const serveData = JSON.stringify(this.serveData)
    return `
      <!DOCTYPE html>
      <html>
        <head></head>
        <script>window.serveData=${serveData}</script>
        <body>服务端渲染的内容</body>
      </html>
    `
  }
}
