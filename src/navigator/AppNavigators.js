import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Welcome from '../pages/Welcome';
import Home from '../pages/Home';
import Detail from '../pages/Detail';
import AsyncStorageDemo from '../pages/AsyncStorageDemo';
import DataStoreDemo from '../pages/DataStoreDemo';
import {connect} from 'react-redux';
import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers';
import WebViewPage from '../pages/WebViewPage';
import About from '../pages/about/About';

export const rootCom = 'InitNavigator';//设置根路由，对应RootNavigator中第一个初始化的路由名

const InitNavigator = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
      navigationOptions: {header: null},
    },
  },
);

const MainNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {header: null},
    },
    Detail: {
      screen: Detail,
      navigationOptions: {header: null},
    },
    AsyncStorageDemo: {
      screen: AsyncStorageDemo,
      navigationOptions: {
        title: '缓存案例',
      },
    },
    DataStoreDemo: {
      screen: DataStoreDemo,
      navigationOptions: {
        title: '离线缓存案例',
      },
    },
    WebViewPage: {
      screen: WebViewPage,
      navigationOptions: {
        header: null,
      },
    },
    About: {
      screen: About,
      navigationOptions: {header: null},
    },
  },
);

export default createAppContainer(createSwitchNavigator({
  InitNavigator,
  MainNavigator,
}, {
  navigationOptions: {
    header: null,
  },
}));


export const RootNavigator = createAppContainer(createSwitchNavigator({
  [rootCom]: InitNavigator,
  Main: MainNavigator,
}, {
  navigationOptions: {
    header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
  },
}));

/**
 * 1.初始化react-navigation与redux的中间件，
 * 该方法的一个很大的作用就是为createReduxContainer的key设置actionSubscribers(行为订阅者)
 * 设置订阅者@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L29
 * 检测订阅者是否存在@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L97
 * @type {Middleware}
 */
export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root',
);

/**
 * 2.将根导航器组件传递给 createReduxContainer 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 * 注意：
 * a.要在createReactNavigationReduxMiddleware之后执行
 * b.key是createReduxContainer用来关联RootNavigator与middleware的
 * ，所以要和createReactNavigationReduxMiddleware的入参key保持一致
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

/**
 * State到Props的映射关系
 * @param state
 */
const mapStateToProps = state => ({
  state: state.nav,//v2
});
/**
 * 3.连接 React 组件与 Redux store
 */
// export default connect(mapStateToProps)(AppWithNavigationState);
