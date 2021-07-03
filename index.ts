import * as http from "http"
import {IncomingMessage, ServerResponse} from "http"
import * as fs from "fs"
import * as p from 'path'

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public')
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url: path, headers } = request
  /**
   * url.parse 已过期
   * 这是因为nodejs的url.parse方法采用的传统的urlObject,不符合URL现存标准-WHATWG URL API,因此弃用了。同时
   * url.format(), url.resolve()也弃用了
   */
  const { pathname, search, searchParams } = new URL(path,'http://localhost:8888/')
  console.log(search, searchParams.get('q'))
  switch (pathname) {
    case '/index.html':
      response.setHeader('Content-Type', 'text/html; charset=utf-8')
      fs.readFile(p.resolve(publicDir, 'index.html'), (error, data) => {
        if (error) throw error
        response.end(data.toString())
      })
      break
    case '/style.css':
      response.setHeader('Content-Type', 'text/css; charset=utf-8')
      fs.readFile(p.resolve(publicDir, 'style.css'), (error, data) => {
        if (error) throw error
        response.end(data.toString())
      })
      break
    case '/main.js':
      response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
      fs.readFile(p.resolve(publicDir, 'main.js'), (error, data) => {
        if (error) throw error
        response.end(data.toString())
      })
      break
    default:
      response.statusCode = 404
      response.end()
  }
})

server.listen(8888)