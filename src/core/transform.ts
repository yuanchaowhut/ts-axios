import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // 遍历，每一次的输出作为下一次的输出
  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
