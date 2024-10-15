import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { rootSaga } from './sagas';
// import { composeWithDevTools } from "redux-devtools-extension"

// import counterReducer from '../features/counter/counterSlice';

import { reducer as authReducer } from '@/pages/operator/account/authenticate/store';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga)

export default store;
