import axios from 'axios'
// import Mock from 'mockjs'
// const Random = Mock.Random // tpl中的@符号等价于Random

const mockRoutes = [
  // 发送get请求
  {
    url: '/mock/posts/list',
    method: 'get',
    tpl: {
      code: 0,
      msg: 'success',
      data: {
        'dataSource|1-10': [{ //
          'id|+1': 1,
          'title': '@ctitle', // 表示返回的是一个中文的名字
          'posts_content': '@cparagraph',
          'create_user': '@cname', // 表示返回的是一个中文的名字
          'create_time': '@datetime',
          // 'email': '@email(163.com)', // 表示生成的是163的邮箱
          // 'county': Random.county(true) // 增减true表示的是 生成 省市县三级的名称
        }]
      }
    }
  },
  // 发送post请求
  {
    url: '/mock/posts/list',
    method: 'post',
    tpl: {
      code: 0,
      msg: 'success',
      data: {}
    }
  }
]

const getPostsList = (page = 1) => {
  return axios.get('/mock/posts/list')
    .then((r: any) => {
      const { data } = r
      return data
    })
}

const createPost = (data: any) => {
  return axios.post('/mock/posts/list', data).then((r: any) => {
    return r
  })
}


export default {
  mockRoutes,
  getPostsList, createPost
}

