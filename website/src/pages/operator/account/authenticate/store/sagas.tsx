import {
  takeEvery,
  call,
  put,
} from "redux-saga/effects"

import { request } from "@/utils"

import { actions } from './reducers'

// 定义请求参数和响应的数据结构
interface AuthPayload {
  action: string;
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

// 抽离 API 请求逻辑
// function* handleAuthRequest(url: string, data: AuthPayload): Generator<any, { data: AuthResponse }, any> {
function* handleAuthRequest(url: string, data: any): Generator<any, { data: any }, any> {
  return yield call(request, {
    url,
    method: 'POST',
    data,
  });
}

export function* authSaga(): Generator {
  yield takeEvery(actions.login.type, function* (action: ReturnType<typeof actions.login>): Generator<any, void, any> {
    try {
      // const response: { data: AuthResponse } = yield handleAuthRequest('/api/operation/configure/user/login/', action.payload);
      const response: any = yield handleAuthRequest('/api/operator/v1/authentication/login', action.payload);
      yield put(actions.authenticateSuccess({ action: 'login', ...response.data }));
    } catch (error: any) {
      yield put(actions.authenticateFailed(error.toString())); // 处理错误
    }
  });

  yield takeEvery(actions.logout.type, function* (action: ReturnType<typeof actions.logout>): Generator<any, void, any> {
    try {
      // const response: { data: AuthResponse } = yield handleAuthRequest('/api/operation/configure/user/logout/', action.payload);
      const response: { data: any } = yield handleAuthRequest('/api/operator/v1/authentication/logout/', action.payload);
      yield put(actions.clearSession({ action: 'logout', ...response.data }));
    } catch (error: any) {
      yield put(actions.authenticateFailed(error.toString())); // 处理错误
    }
  });
}




