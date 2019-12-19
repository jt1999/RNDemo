import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil';


/**
 * 获取趋势数据的异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {{theme: *, type: *}}
 */
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        //异步action与数据流
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending).then(data => {
            handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao);
        }).catch(error => {
            console.log(error);
            dispatch({type: Types.TRENDING_REFRESH_FAIL, storeName, error});
        });
    };
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize  一页展示多少条
 * @param dataArray  原始数据
 * @param callBack 回调函数，可以通过回调函数来调用页面通信：比如异常信息的展示，没有更多，等待
 * @returns {string}
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
    return dispatch => {
        //模拟网络请求
        setTimeout(() => {
            //已加载全部数据
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callBack === 'function') {
                    callBack('我是有底线的！');
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MODE_FAIL,
                    error: '我是有底线的！',
                    storeName: storeName,
                    pageIndex: --pageIndex, //因为pageIndex是请求第几页的数据，如果没有这第几页的数据就pageindex-1
                });
            } else {
                //本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize;
                _projectModels(dataArray.splice(0, max), favoriteDao, data => {
                    dispatch({
                        type: Types.TRENDING_LOAD_MODE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: data,
                    });
                });

            }
        }, 500);
    };
}
