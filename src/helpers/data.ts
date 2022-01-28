import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }

  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string' && (data.indexOf('{') !== -1 || data.indexOf('[') !== -1)) {
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.log(e)
    }
  }

  return data
}
