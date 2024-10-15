import * as React from 'react'
import { Table, theme } from 'antd'

import {
  Navigate,
  useLocation,
  useRoutes,
  useNavigate
} from 'react-router-dom'

const System = () => {

  const navigate = useNavigate()

  const handleLinkTo = () => {
    navigate('/')
  }

  return (
    <React.Fragment>
      <div className='wrapper'>
        <span onClick={handleLinkTo}>
          系统设置
        </span>
      </div>
    </React.Fragment>
  )
}

export default System