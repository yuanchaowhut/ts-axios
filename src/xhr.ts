import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const request = new XMLHttpRequest()

  const { url, method = 'get', data } = config

  request.open(method, url, true)

  request.send(data)
}
