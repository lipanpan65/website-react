import { all } from 'redux-saga/effects'


// import { userSaga } from '../pages/operation/configure/user/store/sagas'
// import { userGroupSaga } from '../pages/operation/configure/user-group/store/sagas'
// import { authSaga } from '../pages/common/login/store/sagas'
// import { dictSaga } from '../pages/operation/configure/dict/store/sagas'
// import { userRoleSaga } from '@/pages/operation/configure/user-role/store/sagas'
// import { menusSaga } from '@/pages/operation/configure/user-menus/store/sagas'

import { authSaga } from '@/pages/operator/account/authenticate/store/sagas'

export function* rootSaga() {
  yield all([
    authSaga()
    // userGroupSaga(),
    // userRoleSaga(),
    // authSaga(),
    // dictSaga(),
    // menusSaga(),
  ])
}