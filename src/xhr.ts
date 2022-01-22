import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const request = new XMLHttpRequest()

  const { url, method = 'get', data, headers } = config

  request.open(method, url, true)

  // 设置headers
  Object.keys(headers).forEach(name => {
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })
  console.log('111111111111')
  console.log(headers)
  request.send(data)
}
