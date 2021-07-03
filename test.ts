import * as http from "http"
import {IncomingMessage, ServerResponse} from "http";
import {Buffer} from "buffer";

const server = http.createServer()

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('有人请求了')
  console.log(request.httpVersion, request.url, request.method)
  console.log('headers: ', request.headers)
  const array = []

  /**
   * 当用户上传了内容时，每上传一段内容，都会触发，由于每次可上传的内容是有限的，所以会多次触发data事件
   * chunk可以认为是一小段数据
   */
  request.on('data', (chunk) => {
    array.push(chunk)
  })

  /**
   * 当流中没有数据时触发，即数据上传完
   */
  request.on('end', () => {
    // 将array中的buffer连接到一起
    const body = Buffer.concat(array).toString()
    console.log('body:', body)
    response.statusCode = 400
    response.setHeader('X-frank', 'i am frank')
    response.end('hi')
  })
})

server.listen(8888)