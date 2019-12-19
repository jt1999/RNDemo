import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';
import favorite from './favorite';

/***
 * 第一步：合并reducer
 * @type {Reducer<unknown>}
 */
const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
});

export default index;
