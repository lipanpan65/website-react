
import { request } from '@/utils/request'

export default {
  getArticleList: (params: any) => {
    return request({
      url: `/api/user/v1/article/`,
      method: 'GET',
      params: params || {}
    })
  },
  createArticle: (data: any) => {
  },
  updateArticle: (data: any) => {

  },
}



