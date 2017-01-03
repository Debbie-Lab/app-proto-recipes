import Koa from 'koa'
import path from 'path'
import assert from 'assert'
import request from 'supertest'

import contextRecipe from 'app-proto-recipes/recipes/context'


const testCase = async (recipes, done) => {
  const hnObj = await recipes.$context.http.get('https://hacker-news.firebaseio.com/v0/item/160705.json?print=pretty')
  try {
    assert('yes, ban them; i\'m tired of seeing valleywag stories on news.yc.', hnObj.text)
    done()
  } catch(err) {
    done(err)
  }
}

export default function(done) {

    const app = new Koa()
    const crPath = path.join(__dirname, '..', 'app-proto/server/context')
    console.log('crPath', crPath)
    contextRecipe(app, crPath)

    const recipes = {}

    app.use((context, next) => {
      recipes.$context = context
      context.status = 204
    })

    request(app.listen())
      .get('/')
      .expect(204)
      .end(async () => {
        await testCase(recipes, done)
      })

}
