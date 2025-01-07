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
    | { type: 'UPDATE_PARAMS'; payload: { params: Record<string, any> } };


// 初始化 state
const initialState: StateType = {
    loading: false,
    open: false,
    record: {},
    page: { total: 0, current: 0, pageSize: 5 },
    data: [],
    params: {},
};



