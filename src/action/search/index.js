import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, doCallBack, handleData} from '../ActionUtil';
import Common from '../../common';
import Utils from '../../util/Utils';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = []; //取消的所有的key

/**
 *
 * @param inputKey  搜索Key
 * @param pageSize
 * @param token 与该搜索关联的唯一token
 * @param favoriteDao
 * @param popularKeys  最热模块下的所有的标签 例如 java
 * @param callBack
 * @returns {Function}
 */
export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
  return dispatch => {
    dispatch({type: Types.SEARCH_REFRESH});
    fetch(genFetchUrl(inputKey)).then(response => {
      //如果取消搜索则返回null 否则返回json数据
      return hasCancel(token) ? null : response.json();
    }).then(responseData => {
      if (hasCancel(token, true)) {
        console.log('用户取消搜索');
        return;
      }
      //没有取消 但数据为空
      if (!responseData || !responseData.items || responseData.items.length === 0) {
        dispatch({type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目`});
        doCallBack(callBack, `没找到关于${inputKey}的项目`);
        return;
      }
      let items = responseData.items;
      handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', {data: items}, pageSize, favoriteDao, {
        showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey), //是否显示底部按钮
        inputKey,
      });
    }).catch(e => {
      console.log(e);
      dispatch({type: Types.SEARCH_FAIL, error: e});
    });
  };
}

/**
 * 加载更多
 * @param pageIndex 第几页
 * @param pageSize 一页多少条
 * @param dataArray  原始数据
 * @param favoriteDao
 * @param callBack  回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @returns {Function}
 */
export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    //模拟网络请求
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        //已经加载全部数据
        doCallBack(callBack, '没有更多');
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: '没有更多',
          pageIndex: --pageIndex,
        });
      } else {
        //本次和载入的最大数据
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}

/**
 * 取消搜索
 * @param token 某个搜索
 * @returns {Function}
 */
export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token);
    dispatch({type: Types.SEARCH_CANCEL});
  };
}

function genFetchUrl(key) {
  return API_URL + key + QUERY_STR;
}

/**
 * 检查指定token是否取消
 * @param token
 * @param isRemove
 * @returns {boolean}
 */
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && Common.removeArray(CANCEL_TOKENS, token);
    return true;
  }
  return false;
}

