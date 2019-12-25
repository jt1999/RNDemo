import Types from '../../action/types';

const defaultState = {
  showText: '搜索',
  items: [],
  isLoading: false,
  projectModels: [],//要显示的原始数据
  hideLoadingMore: true,//默认隐藏加载更多
  showButtomButton: false,
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.SEARCH_REFRESH: //搜索
      return {
        ...state,
        isLoading: true,
        hideLoadingMore: true,
        showButtomButton: false,
        showText: '取消',
      };
    case Types.SEARCH_REFRESH_SUCCESS: //搜索成功
      return {
        ...state,
        isLoading: false,
        hideLoadingMore: false,
        showButtomButton: action.showButtomButton,
        items: action.items,
        projectModels: action.projectModels,
        pageIndex: action.pageIndex,
        showText: '搜索',
        inputKey: action.inputKey,
      };
    case Types.SEARCH_FAIL: //刷新失败
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      };
    case Types.SEARCH_FAIL: //取消搜索
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      }
    case Types.SEARCH_LOAD_MORE_SUCCESS: //加载更多成功
      return {
        ...state,//Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        projectModels: action.projectModels,
        hideLoadingMore: false,
        pageIndex: action.pageIndex,
      };
    case Types.SEARCH_LOAD_MORE_FAIL://上拉加载更多失败
      return {
        ...state,//Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        hideLoadingMore: true,
        pageIndex: action.pageIndex,
      };
    default:
      return state;
  }
}
