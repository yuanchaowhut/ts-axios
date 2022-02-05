import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth
    } = config

    // 创建request对象
    const request = new XMLHttpRequest()
    // 初始化请求
    request.open(method, url!, true)
    // 处理配置信息
    configureRequest()
    // 添加事件监听
    addEvents()
    // 处理Header相关逻辑
    processHeaders()
    // 处理取消请求逻辑
    processCancel()
    // 真正发送请求
    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      request.onreadystatechange = function() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
          return
        }
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          request.responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 网络错误
      request.onerror = function() {
        reject(createError('Network Error', config, null, request))
      }
      // 网络连接超时
      request.ontimeout = function() {
        reject(createError(`timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      // 上传下载进度事件
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      // 附件上传的请求Content-Type浏览器自动设置
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // XSRF防御token(服务端生成)，每次发送请求客户端都携带
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      // 处理Authorization相关逻辑
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      // 设置headers、发送数据
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed width status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
