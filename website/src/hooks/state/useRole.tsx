import { useReducer, useContext, createContext, ReactNode, Dispatch } from 'react';

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
  | { type: 'OPEN_DIALOG'; payload: { open: boolean; record: Record<string, any> } }
  | {
    type: 'CREATE';
    payload: {
      params?: Record<string, any>; // 在创建时，params 是可选的
      data: Record<string, any>; // `data` 是 `CREATE` 操作时的必填字段
    };
  }
  | {
    type: 'UPDATE';
    payload: {
      params?: Record<string, any>;
      data: Record<string, any>; // `data` 是 `UPDATE` 操作时的必填字段
    };
  }
  | {
    type: 'DELETE';
    payload: {
      data: Record<string, any>; // `data` 是 `DELETE` 操作时的必填字段
    };
  }
  | { type: 'UPDATE_PARAMS'; payload: { params: Record<string, any> } }
  | { type: 'GRANT'; payload: { data: any; params?: any } };

// 初始化 state
const initialState: StateType = {
  loading: true,
  open: false,
  record: {},
  page: { total: 0, current: 0, pageSize: 5 },
  data: [],
  params: {},
};

// 定义 enhancedDispatch 类型，支持 ActionType 和函数
type EnhancedDispatch = (action: ActionType | ((dispatch: Dispatch<ActionType>) => void)) => void;
    



const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'READ':
      return { ...state, loading: true, params: action.payload.params };
    case 'READ_DONE':
      return { ...state, loading: false, data: action.payload.data, page: action.payload.page };
    case 'OPEN_DIALOG':
      return { ...state, open: action.payload.open, record: action.payload.record };
    case 'CREATE':
    case 'UPDATE':
    case 'GRANT':
      return {
        ...state,
        loading: true,
        params: {
          ...state.params,
          ...(action.payload.params ?? {}),
        },
      };
    case 'DELETE':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_PARAMS':
      return {
        ...state,
        params: {
          ...state.params,
          ...(action.payload.params ?? {}),
        },
        loading: true,
      };
    default:
      return state;
  }
};

// 创建上下文
export const RoleContext = createContext<{
  state: StateType;
  enhancedDispatch: EnhancedDispatch;
}>({
  state: initialState,
  enhancedDispatch: () => { },
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch: EnhancedDispatch = (action) => {
    if (typeof action === 'function') {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return (
    <RoleContext.Provider value={{ state, enhancedDispatch }}>
      {children}
    </RoleContext.Provider>
  );
};
