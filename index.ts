import * as http from "http"
import {IncomingMessage, ServerResponse} from "http"
import * as fs from "fs"
import * as p from 'path'

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public')
const cacheAge = 5 // 5s

console.log(process.argv)

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url: path, headers } = request
  /**
   * url.parse 已过期
   * 这是因为nodejs的url.parse方法采用的传统的urlObject,不符合URL现存标准-WHATWG URL API,因此弃用了。同时
   * url.format(), url.resolve()也弃用了
   */
  const { pathname, search, searchParams } = new URL(path,'http://localhost:8888/')
  // console.log(search, searchParams.get('q'))
  let filename = pathname.slice(1)
  if(filename === '') filename = 'index.html'
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      if(error.errno === -2) {
        response.statusCode = 404
        fs.readFile(p.resolve(publicDir, '404.html'), (err, data) => {
          response.end(data)
        })
      } else {
        response.statusCode = 500
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.end('服务器繁忙')
      }
    } else {
      // 添加缓存
      response.setHeader('Cache-Control', `public, max-age=${cacheAge}`)
      response.end(data)
    }
  })
})

server.listen(8888)