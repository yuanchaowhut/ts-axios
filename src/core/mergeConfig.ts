import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

const strategyMap = Object.create(null)

// 默认策略
const defaultStrategy = (val1: any, val2: any) => {
  return val2 !== undefined ? val2 : val1
}

// 从val2取值策略
const fromVal2Strategy = (val1: any, val2: any) => {
  if (val2 !== undefined) {
    return val2
  }
}

// deepMerge策略
const deepMergeStrategy = (val1: any, val2: any) => {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (val2 !== undefined) {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (val1 !== undefined) {
    return val1
  }
}

const strategyKeysFromVal2 = ['url', 'params', 'data']
strategyKeysFromVal2.forEach(key => {
  strategyMap[key] = fromVal2Strategy
})

const strategyKeysDeepMerge = ['headers']
strategyKeysDeepMerge.forEach(key => {
  strategyMap[key] = deepMergeStrategy
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)
  for (let key in config2) {
    mergeField(key)
  }
  // 还有一些是config1中有但是config2中没有的配置项
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strategy = strategyMap[key] || defaultStrategy
    config[key] = strategy(config1[key], config2![key])
  }

  return config
}
