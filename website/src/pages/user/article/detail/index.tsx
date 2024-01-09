import * as React from 'react'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// TODO 查看如何使用
import rehypeHighlight from 'rehype-highlight'
import { useParams } from 'react-router-dom'
import 'github-markdown-css';
import 'react-markdown-editor-lite/lib/index.css';
import request from '../../../../utils/request'
// import request from '@/services';
// import './style.css'

const ArticleDetail: React.FC = () => {
  const params = useParams()
  const markdown = 'This ~is not~ strikethrough, but ~~this is~~! `code` '
  // const markdown = 'This ~is not~ strikethrough, but ~~this is~~! ```sql select * from  ``` '

  const getArticle = () => {
    const { id } = params
    request({
      url: `/api/operation/subjects/posts/${id}/`,
      method: 'GET',
    }).then((res: any) => {
      console.log("res=======>", res)
    })
  }

  React.useEffect(() => getArticle(), [])


  return (
    <React.Fragment>
      <Markdown
        className={'markdown-body'}
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
        {markdown}
      </Markdown>
    </React.Fragment>
  )
}

export default ArticleDetail