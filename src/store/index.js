import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';
import {middleware} from '../navigator/AppNavigators';

/***
 * 自定义log中间件
 * 方便排查问题
 * @param store
 * @returns {function(*): Function}
 */
const logger = store => next => action => {
    if (typeof action === 'function') {
        console.log('dispatching is function');
    } else {
        console.log('dispatching', action);
    }
    const result = next(action);
    console.log('nextState', store.getState());
    return result;
};

const middlewares = [
    middleware,
    logger,
    thunk,
];

/***
 * 第二步：创建store
 */
export default createStore(reducers, applyMiddleware(...middlewares));


