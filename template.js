module.exports = class Templates {
  constructor(params) {
    this.ctx = params.ctx
    this.page = params.page || null
    this.serveData = params.serveData || {}
    this.serveBundle = params.serveBundle || null
  }

  async toHtml() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        </head>
        <body>
          <main>${'Live for nothing or die for something.'}</main>
        </body>
      </html>
    `
  }
}

