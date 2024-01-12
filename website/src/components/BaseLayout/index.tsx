import * as React from 'react'

import {
  NavLink,
  Outlet
} from "react-router-dom"

const BaseLayout: React.FC = (props: any) => {

  return (
    <React.Fragment>
      {props.children}
      <Outlet/>
    </React.Fragment>
  )
}

export default BaseLayout