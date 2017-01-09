
const api = 'https://api.unsplash.com/users/r3dmax?client_id=05c48433144b0f28724136442dd832c756fee270decc2b9db2a945399770fab9'

export default async function(ctx, params) {
  const http = ctx.http
  console.log(http)

  const result = await http.get(api)

  return result
}
