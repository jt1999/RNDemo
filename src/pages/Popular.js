import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import NavigatorUtil from '../navigator/NavigatorUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import Ionicons from 'react-native-vector-icons/Ionicons';

//常量
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class Popular extends Component {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }

  _genTabs() {
    const tabs = {};
    const {keys, theme} = this.props;
    keys.forEach((item, index) => {
      //只展示选中的
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} theme={theme} tabLabel={item.name}/>,
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }

  /**动态tab*/
  _createDynamicTopTab() {
    const {theme} = this.props;
    return createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: theme.themeColor,
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
        lazy: true, //懒加载，一次只加载一个tab的数据
      },
    ));
  }

  renderRightButton() {
    const {theme} = this.props;
    return <TouchableOpacity
      onPress={() => {
        //新版本友盟SDK 时间统计方法由 track -> onEvent
        // AnalyticsUtil.onEvent("SearchButtonClick");
        NavigatorUtil.goPage({theme}, 'Search');
      }}
    >
      <View style={{padding: 5, marginRight: 8}}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white',
          }}/>
      </View>
    </TouchableOpacity>;
  }

  render() {
    const {keys, theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;
    const TopTab = keys.length ? this._createDynamicTopTab() : null;
    return <View style={{flex: 1}}>
      {navigationBar}
      {TopTab && <TopTab/>}
    </View>;
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是个function,并不一定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(Popular);

const pageSize = 10; //默认显示10条数据，常量防止别的地方修改它
class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();

    //监听收藏模块里的最热里的收藏状态变化
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.isFavoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });

    //监听底部tab切换
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.isFavoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }


  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this._store();
    const url = this.getFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callBack => {
        console.log('没有更多了');
      });
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
      this.isFavoriteChanged = false;
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],  //要显示的数据
        hideLoadMore: true, //默认显示加载更多
      };
    }
    return store;
  }

  getFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigatorUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback,
        }, 'Detail');
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />;
  }


  renderListFooter() {
    const {theme} = this.props;
    return this._store().hideLoadingMode ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          color={theme.themeColor}
        />
        <Text>正在加载更多</Text>
      </View>;
  }

  render() {
    // const {popular} = this.props;
    // let store = popular[this.storeName];//动态获取state  因为storeName是不固定的，所以可以通过这种方式去动态获取
    // if (!store) {
    //     store = {
    //         items: [],
    //         isLoading: false,
    //     };
    // }
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.id}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              tintColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
            />
          }
          ListFooterComponent={() => this.renderListFooter()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}  //当距离内容最底部还有多远时触发onEndReached回调
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----');
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#ffffff',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  pageText: {
    marginTop: 20,
    padding: 5,
    backgroundColor: '#61dafb',
    color: '#fff',
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});


//@sourceURL=Popular.js
