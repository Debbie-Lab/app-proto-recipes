import rp from 'request-promise'


export default class Http {
  constructor() {
    this.rp = rp
  }

  post(uri, data) {
    /* eslint-disable quote-props */
    return rp({
      method: 'POST',
      uri,
      // POST data to a JSON REST API
      body: data,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  }

  get(uri) {
    return rp({
      method: 'GET',
      uri,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  }
}

