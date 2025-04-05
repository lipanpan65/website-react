import { useReducer, useCallback, createContext, useContext, ReactNode } from 'react';

// 定义 State 类型
interface StateType {
  loading: boolean;
  data: any[];
  page: {
    total: number;
    current: number;
    pageSize: number;
  };
  params: Record<string, any>;
  error: string | null;
}

// 定义 Action 类型
type ActionType =
  | { type: 'UPDATE_PARAMS'; payload: { params: Record<string, any> } }
  | { type: 'READ_DONE'; payload: { data: any[]; page: StateType['page'] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 初始状态
const initialState: StateType = {
  loading: false,
  data: [],
  page: { total: 0, current: 1, pageSize: 10 },
  params: {},
  error: null,
};

// reducer 函数
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'UPDATE_PARAMS':
      return { ...state, params: action.payload.params, error: null };
    case 'READ_DONE':
      return { ...state, data: action.payload.data, page: action.payload.page, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// 创建 Context
const UsersContext = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => {},
});

// 创建 Hook
export const useUsers = () => {
  const context = useContext(UsersContext);
  
  const enhancedDispatch = useCallback(
    (action: ActionType | ((dispatch: React.Dispatch<ActionType>) => void)) => {
      if (typeof action === 'function') {
        action(context.dispatch);
      } else {
        context.dispatch(action);
      }
    },
    [context.dispatch]
  );

  return {
    state: context.state,
    enhancedDispatch,
  };
};

// Provider 组件
export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UsersContext.Provider value={{ state, dispatch }}>
      {children}
    </UsersContext.Provider>
  );
}; 