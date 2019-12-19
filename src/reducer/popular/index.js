import Types from '../../action/types';

const defaultState = {};


/***
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 *
 * 0.state树，横向扩展
 * 1。如何动态的设置store，和动态获取store(难点：storekey不固定)
 * @param state
 * @param action
 * @returns {{theme: *}}
 */
export default function onAction(state = defaultState, action) {
    //注意：不能在这修改state,只能返回新的state或者返回原state
    switch (action.type) {
        case Types.POPULAR_REFRESH_SUCCESS:  //下拉刷新成功
            console.log('下拉刷新成功', action);
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items, //为了加载更多的时候取到所有数据，让数据一直传下去【原始数据】
                    projectModels: action.projectModels,//【此次要展示的数据】
                    isLoading: false,
                    hideLoadingMode: false,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.POPULAR_REFRESH: //下拉刷新
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMode: true,
                },
            };
        case Types.POPULAR_REFRESH_FAIL: //下拉刷新失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                },
            };
        case Types.POPULAR_LOAD_MODE_SUCCESS:  //上拉加载成功
            console.log('上拉加载成功');
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    hideLoadingMode: false,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.POPULAR_LOAD_MODE_FAIL:  //上拉加载失败
            console.log('上拉加载失败');
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMode: true,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.POPULAR_FLUSH_FAVORITE: //刷新收藏状态
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                },
            };
        default:
            return state;
    }
}
