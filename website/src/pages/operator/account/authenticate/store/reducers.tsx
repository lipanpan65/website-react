import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCookie } from '@/utils'

interface AuthState {
  username: string | null;
  curRole: string | null;
  token: string | null;
  isLogin: boolean;
}

interface AuthPayload {
  username: string;
  role: string;
  token: string;
  action: string; // 新增 action 字段
  data: any;
}

// const initialState: AuthState = {
const initialState: any = {
  username: getCookie("username") || null,
  curRole: getCookie("curRole") || null,
  token: getCookie("token") || null,
  isLogin: Boolean(getCookie("username") && getCookie("token")),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  // initialState: () => {
  //   // TODO 为什么会重复执行3次
  //   const token: any = getCookie("token")
  //   const username: any = getCookie("username")
  //   const curRole: any = getCookie("curRole")
  //   if (token && username) {
  //     return { username, curRole, token, isLogin: true }
  //   }
  //   return {
  //     isLogin: false,
  //     username: null,
  //     curRole: null,
  //     token: null
  //   }
  // },
  reducers: {
    login(state, _) {
      state.isLogin = false // - true fulfilled true
    },
    logout(state, __: any) {
      // console.log("初始化state")
      // TODO 如果不设置则不会刷新App的页面
      state.isLogin = false;
      state.username = null;
      state.curRole = null;
      state.token = null;
    },
    clearSession(state, action: any) {
      // clearSession(state, action: PayloadAction<AuthPayload>) {
      const { payload } = action
      const { username, role, token } = payload.data
      state.isLogin = false
      state.username = username
      state.curRole = role
      state.token = token
    },
    authenticateSuccess(state, action: any): void {
      const { payload } = action
      const { username, role, token } = payload.data
      state.isLogin = true
      state.username = username
      state.curRole = role
      state.token = token
    },
    authenticateFailed(state, action: any) {

    }
  }
})

export const { reducer, actions } = authSlice
export default authSlice