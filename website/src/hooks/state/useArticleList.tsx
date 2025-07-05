import { useReducer, useContext, createContext, ReactNode, Dispatch, useCallback, useMemo, useRef } from 'react';


// 定义 state 的类型
interface StateType {
  loading: boolean;
  error: string | null; // 新增错误状态
  open: boolean;
  record: Record<string, any>;
  page: { total: number; current: number; pageSize: number };
  data: any[];
  params: Record<string, any>;
}

// 明确定义 actions 的类型
interface ActionsType {
  read: (params?: Record<string, any>) => Promise<void>;
  create: (data: Record<string, any>) => Promise<void>;
  update: (data: Record<string, any>) => Promise<void>;
  delete: (data: Record<string, any>) => Promise<void>;
  openDialog: (open: boolean, record?: Record<string, any>) => void;
  updateParams: (params: Record<string, any>) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}


// Context 类型定义
interface ArticleListContextType {
  state: StateType;
  actions: ActionsType;
}

// ==================== Action Types ====================
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  READ_SUCCESS: 'READ_SUCCESS',
  OPEN_DIALOG: 'OPEN_DIALOG',
  CREATE_SUCCESS: 'CREATE_SUCCESS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  UPDATE_PARAMS: 'UPDATE_PARAMS',
  RESET: 'RESET',
} as const;



// API 服务接口定义
interface ApiService {
  read: (params: Record<string, any>) => Promise<{ data: any[]; page: { total: number; current: number; pageSize: number } }>;
  create: (data: Record<string, any>) => Promise<any>;
  update: (data: Record<string, any>) => Promise<any>;
  delete: (data: Record<string, any>) => Promise<any>;
}

type ActionType =
  | { type: typeof ACTION_TYPES.SET_LOADING; payload: { loading: boolean } }
  | { type: typeof ACTION_TYPES.SET_ERROR; payload: { error: string | null } }
  | { type: typeof ACTION_TYPES.READ_SUCCESS; payload: { data: any[]; page: { total: number; current: number; pageSize: number } } }
  | { type: typeof ACTION_TYPES.OPEN_DIALOG; payload: { open: boolean; record?: Record<string, any> } }
  | { type: typeof ACTION_TYPES.CREATE_SUCCESS; payload: { data: any } }
  | { type: typeof ACTION_TYPES.UPDATE_SUCCESS; payload: { data: any } }
  | { type: typeof ACTION_TYPES.DELETE_SUCCESS; payload: { id: string | number } }
  | { type: typeof ACTION_TYPES.UPDATE_PARAMS; payload: { params: Record<string, any> } }
  | { type: typeof ACTION_TYPES.RESET };


// 初始化 state
const initialState: StateType = {
  loading: false,
  error: null,
  open: false,
  record: {},
  page: { total: 0, current: 1, pageSize: 10 },
  data: [],
  params: {},
};


const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload.loading };

    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case ACTION_TYPES.READ_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload.data,
        page: action.payload.page
      };

    case ACTION_TYPES.OPEN_DIALOG:
      return {
        ...state,
        open: action.payload.open,
        record: action.payload.record || {},
        error: null // 清除之前的错误
      };

    case ACTION_TYPES.CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: [...state.data, action.payload.data],
        open: false, // 创建成功后关闭对话框
      };

    case ACTION_TYPES.UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: state.data.map(item =>
          item.id === action.payload.data.id ? action.payload.data : item
        ),
        open: false,
      };

    case ACTION_TYPES.DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: state.data.filter(item => item.id !== action.payload.id),
      };

    case ACTION_TYPES.UPDATE_PARAMS:
      return {
        ...state,
        params: {
          ...state.params,
          ...action.payload.params,
        },
      };

    case ACTION_TYPES.RESET:
      return initialState;

    default:
      return state;
  }
};


// 上下文接口
interface ArticleListContextType {
  state: StateType;
  actions: {
    read: (params?: Record<string, any>) => Promise<void>;
    create: (data: Record<string, any>) => Promise<void>;
    update: (data: Record<string, any>) => Promise<void>;
    delete: (data: Record<string, any>) => Promise<void>;
    openDialog: (open: boolean, record?: Record<string, any>) => void;
    updateParams: (params: Record<string, any>) => void;
    reset: () => void;
    refresh: () => Promise<void>; // 刷新当前数据
  };
}


// 创建上下文
export const ArticleListContext = createContext<ArticleListContextType | null>(null);

export const useArticleList = () => {
  const context = useContext(ArticleListContext);
  if (!context) {
    throw new Error('useArticleList must be used within an ArticleListProvider');
  }
  return context;
};


interface ArticleListProviderProps {
  children: ReactNode;
  apiService: ApiService; // 注入 API 服务
}

export const ArticleListProvider = ({ children, apiService }: ArticleListProviderProps) => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  // 统一的错误处理

  // 取消正在进行的请求
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // 统一的错误处理
  const handleError = useCallback((error: any) => {
    console.error('API Error:', error);
    const errorMessage = error.message || error.toString() || 'Unknown error occurred';
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: { error: errorMessage } });
  }, []);

  const actions = useMemo((): ActionsType => ({
    read: async (params?: Record<string, any>) => {
      try {
        const mergedParams = { ...state.params, ...params };
        dispatch({ type: ACTION_TYPES.UPDATE_PARAMS, payload: { params: mergedParams } });
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: { loading: true } });

        const result = await apiService.read(mergedParams);

        dispatch({
          type: ACTION_TYPES.READ_SUCCESS,
          payload: { data: result.data, page: result.page }
        });
      } catch (error: any) {
        handleError(error);
      }
    },

    create: async (data: Record<string, any>) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: { loading: true } });
        const result = await apiService.create(data);
        dispatch({
          type: ACTION_TYPES.CREATE_SUCCESS,
          payload: { data: result }
        });
      } catch (error) {
        handleError(error);
      }
    },

    update: async (data: Record<string, any>) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: { loading: true } });
        const result = await apiService.update(data);
        dispatch({
          type: ACTION_TYPES.UPDATE_SUCCESS,
          payload: { data: result }
        });
      } catch (error) {
        handleError(error);
      }
    },

    delete: async (data: Record<string, any>) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: { loading: true } });
        await apiService.delete(data);
        dispatch({
          type: ACTION_TYPES.DELETE_SUCCESS,
          payload: { id: data.id }
        });
      } catch (error) {
        handleError(error);
      }
    },

    openDialog: (open: boolean, record?: Record<string, any>) => {
      dispatch({
        type: ACTION_TYPES.OPEN_DIALOG,
        payload: { open, record }
      });
    },

    updateParams: (params: Record<string, any>) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_PARAMS,
        payload: { params }
      });
    },

    reset: () => {
      dispatch({ type: ACTION_TYPES.RESET });
    },

    refresh: async () => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: { loading: true } });
        const result = await apiService.read(state.params);
        dispatch({
          type: ACTION_TYPES.READ_SUCCESS,
          payload: { data: result.data, page: result.page }
        });
      } catch (error) {
        handleError(error);
      }
    },
  }), [state.params, apiService, handleError]);


  // 使用 useMemo 缓存 context value
  const contextValue = useMemo((): ArticleListContextType => ({
    state,
    actions,
  }), [state, actions]);

  return (
    <ArticleListContext.Provider value={contextValue}>
      {children}
    </ArticleListContext.Provider>
  );
};























