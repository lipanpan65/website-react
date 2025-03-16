import { all } from 'redux-saga/effects'

import { authSaga } from '@/pages/operator/account/authenticate/store/sagas'

export function* rootSaga() {
  yield all([
    authSaga()
  ])
}