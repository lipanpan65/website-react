import * as React from 'react'

// import {
//     Link,
//     NavLink,
//   } from "react-router-dom"  

import {
  List
  // Space,
  // Dropdown,
  // Menu,
  // Row,
  // Col,
  // Avatar,
} from 'antd'

const rowKeyF = (record: { id: number }): number => record.id


const Article: React.FC = () => {

  const [loading, setLoading] = React.useState<any>(false)
  const [article, setAticle] = React.useState<any>([])
  const [pagination, setPagination] = React.useState<any>({
    total: 0,
    current: 0,
    pageSize: 5,
    showTotal: (total: any) => `共${total}条记录`
  })

  return (
    <React.Fragment>
      <List
        loading={loading}
        itemLayout="horizontal"
        pagination={{
          ...pagination,
          showSizeChanger: false,
          // onChange // function(page, pageSize)
        }}
        rowKey={rowKeyF}
      />
    </React.Fragment>
  )

}

export default Article







