import { useReducer, useContext, createContext, ReactNode, useCallback, useMemo, useRef, useEffect } from 'react';

// ==================== 带请求取消的 Context 实现 ====================
interface StateType {
  loading: boolean;
  error: string | null;
  open: boolean;
  record: Record<string, any>;
  page: { total: number; current: number; pageSize: number };
  data: any[];
  params: Record<string, any>;
}

interface ActionsType {
  read: (params?: Record<string, any>) => Promise<void>;
  create: (data: Record<string, any>) => Promise<void>;
  update: (data: Record<string, any>) => Promise<void>;
  delete: (data: Record<string, any>) => Promise<void>;
  openDialog: (open: boolean, record?: Record<string, any>) => void;
  updateParams: (params: Record<string, any>) => void;
  reset: () => void;
  refresh: () => Promise<void>;
  cancelRequest: () => void; // 新增取消请求方法
}

interface ArticleListContextType {
  state: StateType;
  actions: ActionsType;
}

// ==================== API 服务接口（支持 AbortSignal）====================
interface ApiService {
  read: (params: Record<string, any>, signal?: AbortSignal) => Promise<{ data: any[]; page: { total: number; current: number; pageSize: number } }>;
  create: (data: Record<string, any>, signal?: AbortSignal) => Promise<any>;
  update: (data: Record<string, any>, signal?: AbortSignal) => Promise<any>;
  delete: (data: Record<string, any>, signal?: AbortSignal) => Promise<any>;
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

// ==================== 初始状态 ====================
const initialState: StateType = {
  loading: false,
  error: null,
  open: false,
  record: {},
  page: { total: 0, current: 1, pageSize: 10 },
  data: [],
  params: {},
};

// ==================== Reducer ====================
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
        error: null
      };
    
    case ACTION_TYPES.CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: [...state.data, action.payload.data],
        open: false,
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

// ==================== 创建上下文 ====================
export const ArticleListContext = createContext<ArticleListContextType | null>(null);

export const useArticleList = () => {
  const context = useContext(ArticleListContext);
  if (!context) {
    throw new Error('useArticleList must be used within an ArticleListProvider');
  }
  return context;
};

// ==================== Provider 实现 ====================
export const ArticleListProvider = ({ children, apiService }: { children: ReactNode; apiService: ApiService }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 统一的错误处理
  const handleError = useCallback((error: any) => {
    // 如果是用户主动取消的请求，不显示错误
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
      return;
    }
    
    console.error('API Error:', error);
    const errorMessage = error.message || error.toString() || 'Unknown error occurred';
    dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
  }, []);

  // 取消当前请求
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // 创建新的 AbortController
  const createAbortController = useCallback(() => {
    cancelRequest(); // 先取消之前的请求
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, [cancelRequest]);

  const actions = useMemo((): ActionsType => ({
    read: async (params?: Record<string, any>) => {
      try {
        const controller = createAbortController();
        const mergedParams = { ...state.params, ...params };
        
        dispatch({ type: 'UPDATE_PARAMS', payload: { params: mergedParams } });
        dispatch({ type: 'SET_LOADING', payload: { loading: true } });
        
        const result = await apiService.read(mergedParams, controller.signal);
        
        // 检查请求是否被取消
        if (controller.signal.aborted) return;
        
        dispatch({ 
          type: 'READ_SUCCESS', 
          payload: { data: result.data, page: result.page } 
        });
      } catch (error: any) {
        handleError(error);
      }
    },

    create: async (data: Record<string, any>) => {
      try {
        const controller = createAbortController();
        dispatch({ type: 'SET_LOADING', payload: { loading: true } });
        
        const result = await apiService.create(data, controller.signal);
        
        if (controller.signal.aborted) return;
        
        dispatch({ 
          type: 'CREATE_SUCCESS', 
          payload: { data: result } 
        });
      } catch (error) {
        handleError(error);
      }
    },

    update: async (data: Record<string, any>) => {
      try {
        const controller = createAbortController();
        dispatch({ type: 'SET_LOADING', payload: { loading: true } });
        
        const result = await apiService.update(data, controller.signal);
        
        if (controller.signal.aborted) return;
        
        dispatch({ 
          type: 'UPDATE_SUCCESS', 
          payload: { data: result } 
        });
      } catch (error) {
        handleError(error);
      }
    },

    delete: async (data: Record<string, any>) => {
      try {
        const controller = createAbortController();
        dispatch({ type: 'SET_LOADING', payload: { loading: true } });
        
        await apiService.delete(data, controller.signal);
        
        if (controller.signal.aborted) return;
        
        dispatch({ 
          type: 'DELETE_SUCCESS', 
          payload: { id: data.id } 
        });
      } catch (error) {
        handleError(error);
      }
    },

    openDialog: (open: boolean, record?: Record<string, any>) => {
      dispatch({ 
        type: 'OPEN_DIALOG', 
        payload: { open, record } 
      });
    },

    updateParams: (params: Record<string, any>) => {
      dispatch({ 
        type: 'UPDATE_PARAMS', 
        payload: { params } 
      });
    },

    reset: () => {
      cancelRequest(); // 重置时取消所有请求
      dispatch({ type: 'RESET' });
    },

    refresh: async () => {
      try {
        const controller = createAbortController();
        dispatch({ type: 'SET_LOADING', payload: { loading: true } });
        
        const result = await apiService.read(state.params, controller.signal);
        
        if (controller.signal.aborted) return;
        
        dispatch({ 
          type: 'READ_SUCCESS', 
          payload: { data: result.data, page: result.page } 
        });
      } catch (error) {
        handleError(error);
      }
    },

    cancelRequest, // 暴露取消请求的方法
  }), [state.params, apiService, handleError, createAbortController, cancelRequest]);

  // 组件卸载时取消所有请求
  useEffect(() => {
    return () => {
      cancelRequest();
    };
  }, [cancelRequest]);

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

// ==================== 使用示例 ====================
/*
// 1. API 服务需要支持 AbortSignal
const articleApiService: ApiService = {
  read: async (params, signal) => {
    const response = await fetch(`/api/articles?${new URLSearchParams(params)}`, {
      signal // 传递 AbortSignal
    });
    return response.json();
  },
  create: async (data, signal) => {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal
    });
    return response.json();
  },
  // ... 其他方法
};

// 2. 在组件中使用
const ArticleList = () => {
  const { state, actions } = useArticleList();

  // 搜索时自动取消之前的请求
  const handleSearch = useCallback((searchTerm: string) => {
    actions.read({ search: searchTerm });
  }, [actions]);

  // 分页切换时自动取消之前的请求
  const handlePageChange = useCallback((page: number) => {
    actions.read({ page });
  }, [actions]);

  // 手动取消请求
  const handleCancel = useCallback(() => {
    actions.cancelRequest();
  }, [actions]);

  return (
    <div>
      {state.loading && (
        <div>
          Loading... 
          <button onClick={handleCancel}>取消</button>
        </div>
      )}
      {state.error && <div>Error: {state.error}</div>}
      {state.data.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
*/

// ==================== 高级用法：防抖搜索 ====================
/*
const SearchComponent = () => {
  const { actions } = useArticleList();
  const [searchTerm, setSearchTerm] = useState('');

  // 防抖搜索，自动取消之前的请求
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim()) {
        actions.read({ search: term });
      }
    }, 300),
    [actions]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="搜索文章..."
    />
  );
};
*/

// ==================== 优势总结 ====================
/*
1. 防止内存泄漏：
   - 组件卸载时自动取消请求
   - 避免已卸载组件的状态更新

2. 提升用户体验：
   - 快速搜索时不会有多个请求同时进行
   - 用户可以主动取消长时间的请求

3. 资源优化：
   - 减少不必要的网络请求
   - 避免过期请求的处理

4. 开发友好：
   - 清晰的错误处理（区分取消和真正的错误）
   - 统一的请求管理

5. 适用场景：
   - 搜索功能
   - 分页切换
   - 数据刷新
   - 表单提交
*/