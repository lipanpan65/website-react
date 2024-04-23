
import * as React from 'react'

/**
 * 菜单管理
 * @returns 
 */


const AppMenuSearch = () => {

  return (
    <React.Fragment>

    </React.Fragment>
  )
}

const AppMenuTable = () => {

  return (
    <React.Fragment>
      
    </React.Fragment>
  )
}

const AppMenuDialog = () => {
  return (
    <React.Fragment>

    </React.Fragment>
  )
}


// 初始化参数
const initialState = {
  loading: false,
  menu: {
    id: null,
    title: null,
    content: null,
    summary: null,
    html: null
  },
  page: {},
  data: []
};

// 定义 context 
export const MenuContext = React.createContext<{
  state: typeof initialState,
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
})



const reducer = (preState: any, action: any) => {

  let { type } = action;
  if (typeof action == 'function') {
    type = action()
  }

  switch (action.type) {
    case 'READ':
      return preState

    default:
      return preState
  }

}

const AppMenu = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // 定义action 
  const dispatchF: React.Dispatch<any> = (action: any) => {
    // 判断action是不是函数，如果是函数，就执行,并且把dispatch传进去
    if (typeof action === 'function') {
      action(dispatch)
    } else {
      dispatch(action)
    }
  }


  return (
    <React.Fragment>
      <MenuContext.Provider value={{ state, dispatch: dispatchF }}>
        <AppMenuSearch />
        <AppMenuTable />
        <AppMenuDialog />
      </MenuContext.Provider>

    </React.Fragment>
  )
}

export default AppMenu


