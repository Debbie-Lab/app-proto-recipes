export default [
  {
    urls: ['/schema', '/foo'],
    methods: ['GET'],
    middlewares: ['schema-logger'],
    template: 'schema',
    controller: async function (ctx) {
      return {foo: 'hello', bar: 'world'}
    },
  },
  {
    urls: ['/s'],
    methods: ['POST', 'GET'],
    middlewares: ['schema-logger'],
    controller: async function (ctx) {
      return {status: 0, data: {foo: 'hello', bar: 'world'}}
    },
  },
  {
    urls: ['/bar'],
    controller: async function (ctx) {
      await ctx.render('schema', {status: 0, data: {foo: 'hello', bar: 'world'}}, 'default')
    },
  },
]
