import { useReducer, useContext, createContext, ReactNode } from 'react';
import { api } from '@/api';

const initialState = {
  loading: false,
  open: false,
  record: {},
  page: { total: 0, current: 0, pageSize: 5 },
  data: [],
  params: {},
};

const reducer = (state: any, action: any) => {
  
  switch (action.type) {
    case 'READ':
      return { ...state, loading: true, params: action.payload.params };
    case 'READ_DONE':
      return { ...state, loading: false, data: action.payload.data, page: action.payload.page };
    case 'SHOW_MODAL':
      return { ...state, open: action.payload.open, record: action.payload.record };
    default:
      return state;
  }
};

// 创建上下文
export const GlobalContext = createContext<{
  state: typeof initialState,
  dispatchF: React.Dispatch<any>
}>({
  state: initialState,
  dispatchF: () => { }
});

// 自定义 Hook
export const useGlobalDict = () => useContext(GlobalContext);

// Provider 组件
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // 定义 dispatchF 逻辑
  const dispatchF: React.Dispatch<any> = (action) => {
    if (typeof action === 'function') {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return (
    <GlobalContext.Provider value={{ state, dispatchF }}>
      {children}
    </GlobalContext.Provider>
  );
};
