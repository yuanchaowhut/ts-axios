import { isDate, isPlainObject } from './util'

export function encode(val: string): string {
  // @等特殊字符不进行转义、空格替换为+
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = [] // ["name=tom", "age=18"]
  Object.keys(params).forEach(key => {
    const val = params[key]
    // 丢弃空值，forEach里的return并不能终止遍历，它相当于for循环中的continue
    if (val === null || typeof val === 'undefined') {
      return
    }

    // 数组和非数组统一放到一个数组中，便于统一管理
    let values = []
    if (Array.isArray(val)) {
      key += '[]' // foo[]=bar1&foo[]=bar2
      values = val
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  // url中不能带hash
  const markIndex = url.indexOf('#')
  if (markIndex !== -1) {
    url = url.slice(0, markIndex)
  }

  // 拼接参数
  const paramStr = parts.join('&')
  if (paramStr) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + paramStr
  }

  return url
}
