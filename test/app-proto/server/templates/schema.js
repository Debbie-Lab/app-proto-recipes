import Template from '@app-proto/recipes/template'

export default class SchemaTpl extends Template {
  constructor(serveData) {
    super(serveData)
  }

  async toHtml() {
    const serveData = await JSON.stringify(this.serveData)
    console.log(serveData)
    console.log(this.serveData)
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
