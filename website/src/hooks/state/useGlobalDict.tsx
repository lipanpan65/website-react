import { useReducer, useContext, createContext, ReactNode } from 'react';


// 定义 state 的类型
interface StateType {
  loading: boolean;
  open: boolean;
  record: Record<string, any>;
  page: { total: number; current: number; pageSize: number };
  data: any[];
  params: Record<string, any>;
}


type ActionType =
  | { type: 'READ'; payload: { params: Record<string, any> } }
  | { type: 'READ_DONE'; payload: { data: any[]; page: { total: number; current: number; pageSize: number } } }
  | { type: 'OPEN_DIALOG'; payload: { open: boolean; record: Record<string, any> } } // 使用 OPEN_DIALOG
  | { type: 'CREATE'; payload: { record: Record<string, any> } }
  | { type: 'UPDATE'; payload: { record: Record<string, any> } };

// 初始化 state
const initialState: StateType = {
  loading: false,
  open: false,
  record: {},
  page: { total: 0, current: 0, pageSize: 5 },
  data: [],
  params: {},
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'READ':
      return { ...state, loading: true, params: action.payload.params };
    case 'READ_DONE':
      return { ...state, loading: false, data: action.payload.data, page: action.payload.page };
    case 'OPEN_DIALOG': // 使用 OPEN_DIALOG
      return { ...state, open: action.payload.open, record: action.payload.record };
    case 'CREATE':
      return { ...state, data: [...state.data, action.payload.record] };
    case 'UPDATE':
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.record.id ? action.payload.record : item
        ),
      };
    default:
      return state;
  }
};


// 创建上下文
export const GlobalContext = createContext<{
  state: typeof initialState,
  enhancedDispatch: React.Dispatch<any>
}>({
  state: initialState,
  enhancedDispatch: () => { }
});

// 自定义 Hook
export const useGlobalDict = () => useContext(GlobalContext);

// Provider 组件
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 定义 enhancedDispatch 逻辑
  const enhancedDispatch: React.Dispatch<any> = (action) => {
    if (typeof action === 'function') {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return (
    <GlobalContext.Provider value={{ state, enhancedDispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
