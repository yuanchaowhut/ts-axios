import axios from '../../src/index'

// ----------------------------------GET请求------------------------------------
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: ['bar', 'baz']
  }
})

axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: {
      bar: 'baz'
    }
  }
})

const date = new Date()

axios({
  method: 'get',
  url: '/base/get',
  params: {
    date
  }
})

axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: '@:$, '
  }
})

axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: 'bar',
    baz: null
  }
})

axios({
  method: 'get',
  url: '/base/get#hash',
  params: {
    foo: 'bar'
  }
})

axios({
  method: 'get',
  url: '/base/get?foo=bar',
  params: {
    bar: 'baz'
  }
})

// 综合性举例
axios({
  method: 'get',
  url: '/base/get?name=tom#hash',
  params: {
    age: 18,
    registerDate: new Date(),
    hobbies: ['basketball', 'fishing'],
    address: {
      beijing: 'TianAnMen',
      wuhan: 'DongHu'
    },
    foo: '@:$',
    bar: null,
    biz: ' '
  }
})

// ----------------------------------POST请求------------------------------------
axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
})

axios({
  method: 'post',
  url: '/base/buffer',
  data: new Int32Array([21, 31])
})

axios({
  method: 'post',
  url: '/base/post',
  headers: {
    'content-type': 'application/json;charset=utf-8',
    Accept: 'application/json, text/plain, */*'
  },
  data: {
    a: 1,
    b: 2
  }
})

// https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
// data可以是 Blob, BufferSource (en-US), FormData, URLSearchParams, 或者 USVString 对象，不传则默认为null
const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)
axios({
  method: 'post',
  url: '/base/post',
  data: searchParams
})
