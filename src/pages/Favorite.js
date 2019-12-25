import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, SafeAreaView} from 'react-native';
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
import TrendingItem from '../common/TrendingItem';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

class Favorite extends Component {
  constructor(props) {
    super(props);
  }

  /**动态tab*/
  _createDynamicTopTab() {
    const {theme} = this.props;
    return createAppContainer(createMaterialTopTabNavigator(
      {
        'Popular': {
          screen: props => <FavoriteTabPage {...props} theme={theme} flag={FLAG_STORAGE.flag_popular}/>,
          navigationOptions: {
            title: '最热',
          },
        },
        'Trending': {
          screen: props => <FavoriteTabPage {...props} theme={theme} flag={FLAG_STORAGE.flag_trending}/>,
          navigationOptions: {
            title: '趋势',
          },
        },
      },
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          style: {
            backgroundColor: theme.themeColor,
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      },
    ));
  }

  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;
    const TopTab = this._createDynamicTopTab();
    return <View style={{flex: 1}}>
      {navigationBar}
      <TopTab/>
    </View>;
  }
}

const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapFavoriteStateToProps)(Favorite);

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount() {
    this.loadData(true);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      //data.to 在DynamicTabnavigator.js 传过来的
      //2 表示tab下标，收藏页的下标是2
      if (data.to === 2) {
        this.loadData(false);
      }
    });
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],  //要显示的数据
      };
    }
    return store;
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending);
    }
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigatorUtil.goPage({
          theme,
          projectModel: item,
          flag: this.storeName,
          callback,
        }, 'Detail');
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />;
  }


  render() {
    const {theme} = this.props;
    let store = this._store();
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              tintColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
            />
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);


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
