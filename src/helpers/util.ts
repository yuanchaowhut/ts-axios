const getType = Object.prototype.toString

export function isDate(val: any): val is Date {
  return getType.call(val) === '[object Date]'
}

export function isPlainObject(val: any): val is Object {
  return getType.call(val) === '[object Object]'
}

export function isFormData(val: any): val is Object {
  return getType.call(val) === '[object FormData]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
