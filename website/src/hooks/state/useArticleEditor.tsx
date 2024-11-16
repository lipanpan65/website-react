import { useReducer, useContext, createContext, ReactNode, Dispatch } from 'react';


interface ArticleType {
  id: string | null;
  title: string | null;
  content: string | null;
  summary: string | null;
  html: string | null;
  category_id: string | null;
}

interface StateType {
  loading: boolean;
  article: ArticleType;
}

type ActionType =
  | { type: 'READ' }
  | { type: 'READ_DONE'; payload: { article: ArticleType } }
  | { type: 'UPDATE_ARTICLE'; payload: Partial<ArticleType> };

const initialState: StateType = {
  loading: false,
  article: {
    id: null,
    title: null,
    content: null,
    summary: null,
    html: null,
    category_id: null,
  },
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'READ':
      return { ...state, loading: true };
    case 'READ_DONE':
      return { ...state, loading: false, article: action.payload.article };
    case 'UPDATE_ARTICLE':
      return { ...state, article: { ...state.article, ...action.payload } };
    default:
      return state;
  }
};

type EnhancedDispatch = (action: ActionType | ((dispatch: Dispatch<ActionType>) => void)) => void;

export const ArticleEditorContext = createContext<{
  state: StateType;
  enhancedDispatch: EnhancedDispatch;
}>({
  state: initialState,
  enhancedDispatch: () => { },
});

export const useArticleEditor = () => useContext(ArticleEditorContext);

export const ArticleEditorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch: EnhancedDispatch = (action) => {
    if (typeof action === 'function') {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return (
    <ArticleEditorContext.Provider value={{ state, enhancedDispatch }}>
      {children}
    </ArticleEditorContext.Provider>
  );
};