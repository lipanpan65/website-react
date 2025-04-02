import { useReducer, useContext, createContext, ReactNode, Dispatch, useCallback } from 'react';
import { api } from '@/api';
import { message } from 'antd';

// 定义 Topic 的类型
interface Topic {
  id: number;
  topic_name: string;
  enable: number;
  remark?: string;
  update_user?: string;
  update_time?: string;
}

// 定义 state 的类型
interface StateType {
  loading: boolean;
  open: boolean;
  record: Partial<Topic>;
  page: { 
    total: number; 
    current: number; 
    pageSize: number;
  };
  data: Topic[];
  params: Record<string, any>;
  error: string | null;
}

// 定义 action 的类型
type ActionType =
  | { type: 'UPDATE_PARAMS'; payload: { params: Record<string, any> } }
  | { type: 'CREATE'; payload: { data: Topic } }
  | { type: 'UPDATE'; payload: { data: Topic } }
  | { type: 'DELETE'; payload: { id: number } }
  | { type: 'READ_DONE'; payload: { data: Topic[]; page: StateType['page'] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 定义中间件类型
type Middleware = (dispatch: Dispatch<ActionType>) => Dispatch<ActionType>;

// 创建日志中间件
const loggerMiddleware: Middleware = (dispatch) => (action) => {
  console.log('Action dispatched:', action);
  dispatch(action);
  console.log('State after dispatch');
};

// 创建错误处理中间件
const errorMiddleware: Middleware = (dispatch) => (action) => {
  try {
    dispatch(action);
  } catch (error) {
    console.error('Error in action:', error);
    message.error('操作失败，请重试');
    throw error;
  }
};

// 创建性能监控中间件
const performanceMiddleware: Middleware = (dispatch) => (action) => {
  const start = performance.now();
  dispatch(action);
  const end = performance.now();
  console.log(`Action ${action.type} took ${end - start}ms`);
};

// 应用中间件
const applyMiddleware = (middlewares: Middleware[]) => (dispatch: Dispatch<ActionType>): Dispatch<ActionType> => {
  return middlewares.reduceRight(
    (next, middleware) => middleware(next),
    dispatch
  );
};

// 初始状态
const initialState: StateType = {
  loading: false,
  open: false,
  record: {},
  page: { total: 0, current: 1, pageSize: 10 },
  data: [],
  params: {},
  error: null,
};

// reducer 函数
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'UPDATE_PARAMS':
      return { ...state, params: action.payload.params, error: null };
    case 'CREATE':
      return { 
        ...state, 
        data: [...state.data, action.payload.data],
        error: null 
      };
    case 'UPDATE':
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item
        ),
        error: null
      };
    case 'DELETE':
      return {
        ...state,
        data: state.data.filter((item) => item.id !== action.payload.id),
        error: null
      };
    case 'READ_DONE':
      return { 
        ...state, 
        data: action.payload.data, 
        page: action.payload.page,
        error: null 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// 创建 Context
const TopicsContext = createContext<{
  state: StateType;
  dispatch: Dispatch<ActionType>;
} | null>(null);

// Provider 组件
export const TopicsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TopicsContext.Provider value={{ state, dispatch }}>
      {children}
    </TopicsContext.Provider>
  );
};

// 自定义 Hook
export const useTopics = () => {
  const context = useContext(TopicsContext);
  if (!context) {
    throw new Error('useTopics must be used within a TopicsProvider');
  }

  const { state, dispatch } = context;

  // 应用中间件
  const enhancedDispatch = useCallback(
    applyMiddleware([loggerMiddleware, errorMiddleware, performanceMiddleware])(dispatch),
    [dispatch]
  );

  // 设置加载状态
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [dispatch]);

  // 设置错误信息
  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  // 获取数据的方法
  const fetchTopics = useCallback(async (params: Record<string, any>) => {
    try {
      setLoading(true);
      const response = await api.topic.fetch(params);
      if (response?.success) {
        dispatch({ 
          type: 'READ_DONE',
          payload: {
            data: response.data.data.map((record: any) => ({
              ...record,
              topic_name: record.name // Assuming the name field exists in TopicRecord
            })),
            page: response.data.page
          }
        });
      } else {
        setError(response?.message || '获取数据失败');
        message.error(response?.message || '获取数据失败');
      }
    } catch (error) {
      setError('请求失败，请稍后重试');
      message.error('请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [dispatch, setLoading, setError]);

  return { 
    state, 
    enhancedDispatch,
    fetchTopics,
    setLoading,
    setError
  };
}; 