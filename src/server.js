import http from 'node:http';
import { routes } from './router.js';
import { json } from './middlewares/json.js';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
