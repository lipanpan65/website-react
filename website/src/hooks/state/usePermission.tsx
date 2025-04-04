import { useReducer, useContext, createContext, ReactNode, Dispatch } from 'react';

import { State } from '@/types/common'

export interface PermissionData {

}

// 初始化 state
const initialState: State<PermissionData> = {
  loading: true,
  open: false,
  record: {} as PermissionData,
  page: { total: 0, current: 0, pageSize: 5 },
  data: [],
  params: {
    enable: 1
  },
};

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
  | { type: 'UPDATE_PARAMS'; payload: { params: Record<string, any> } };

type EnhancedDispatch = (action: ActionType | ((dispatch: Dispatch<ActionType>) => void)) => void;

const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'READ':
      return { ...state, loading: true, params: action.payload.params };
    case 'READ_DONE':
      return { ...state, loading: false, data: action.payload.data, page: action.payload.page };
    case 'OPEN_DIALOG':
      return { ...state, open: action.payload.open, record: action.payload.record };
    case 'CREATE':
    case 'UPDATE':
      return {
        ...state,
        loading: true,
        params: {
          ...state.params, // 保留旧的参数
          ...(action.payload.params ?? {}), // 安全地合并 `params`
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
          ...(action.payload.params ?? {}), // 安全地合并 `params`
        },
        loading: true,
      };
    default:
      return state;
  }
};

// 创建上下文
export const PermissionContext = createContext<{
  state: State;
  enhancedDispatch: EnhancedDispatch;
}>({
  state: initialState,
  enhancedDispatch: () => { },
});

// 自定义 Hook
export const usePermission = () => useContext(PermissionContext);

// Provider 组件
export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 定义 enhancedDispatch 逻辑
  const enhancedDispatch: EnhancedDispatch = (action) => {
    if (typeof action === 'function') {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return (
    <PermissionContext.Provider value={{ state, enhancedDispatch }}>
      {children}
    </PermissionContext.Provider>
  );
};