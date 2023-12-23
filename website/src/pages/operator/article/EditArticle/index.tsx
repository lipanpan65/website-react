import * as React from 'react'

import {
  Row,
  Col
} from 'antd'
import Markdown from 'react-markdown'
import 'github-markdown-css';
// import 'react-markdown-editor-lite/lib/index.css';


const EditArticle: React.FC = () => {

  return (
    <React.Fragment>
      <div>
        <Markdown
          children={"# 标题一"}
          className='markdown-body'
        // remarkPlugins={[remarkGfm]}
        // rehypePlugins={[rehypeHighlight]}
        />
      </div>
      <Row justify="center" gutter={[8, 16]} style={{ display: 'none' }}>
        <Col span={12}>
          <div>h1</div>
          <h3>ssss</h3>
          <div>
            {/* <h1
              style={{
                margin: "0 0 1.667rem",
                fontSize: "2.677rem",
                lineHeight: 1.31,
                fontWeight: 600,
                color: "#252933",
                paddingTop: "2.667rem"
              }}
            >{title}</h1> */}
            <Markdown
              // children={post}
              // children={[]}
              className='markdown-body'
            // remarkPlugins={[remarkGfm]}
            // rehypePlugins={[rehypeHighlight]}
            />
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default EditArticle