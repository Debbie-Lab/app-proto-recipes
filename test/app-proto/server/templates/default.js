import Template from 'app-proto-recipes/template'

export default class DefaultTpl extends Template {
  constructor(serveData) {
    super(serveData)
  }

  toHtml() {
    const serveData = JSON.stringify(this.serveData)
    const page = new this.page
    return `
      <!DOCTYPE html>
      <html>
        <head></head>
        <script>window.serveData=${serveData}</script>
        <body>
          ${page.render()}
        </body>
      </html>
    `
  }
}
