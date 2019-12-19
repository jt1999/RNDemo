import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer,NavigationActions} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Favorite from './Favorite';
import Popular from './Popular';
import Trending from './Trending';
import My from './My';
import NavigatorUtil from '../navigator/NavigatorUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import BackPressComponent from '../common/BackPressComponent';

class Home extends Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: this.onBackPress});
    }
    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /**
     * 处理 Android 中的物理返回键
     * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
     * @returns {boolean}
     */
    onBackPress = () => {
        const {dispatch, nav} = this.props;
        //if (nav.index === 0) {
        if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    _createBottomTab() {
        return createAppContainer(createBottomTabNavigator({
            Popular: {
                screen: Popular,
                navigationOptions: {
                    tabBarLabel: '最热',
                    tabBarIcon: ({tintColor, focused}) => (
                        <MaterialIcons
                            name={'whatshot'}
                            size={26}
                            style={{color: tintColor}}
                        />
                    ),
                },
            },
            Trending: {
                screen: Trending,
                navigationOptions: {
                    tabBarLabel: '趋势',
                    tabBarIcon: ({tintColor, focused}) => (
                        <Ionicons
                            name={'md-trending-up'}
                            size={26}
                            style={{color: tintColor}}
                        />
                    ),
                },
            },
            Favorite: {
                screen: Favorite,
                navigationOptions: {
                    tabBarLabel: '收藏',
                    tabBarIcon: ({tintColor, focused}) => (
                        <MaterialIcons
                            name={'favorite'}
                            size={26}
                            style={{color: tintColor}}
                        />
                    ),
                },
            },
            My: {
                screen: My,
                navigationOptions: {
                    tabBarLabel: '我的',
                    tabBarIcon: ({tintColor, focused}) => (
                        <Entypo
                            name={'user'}
                            size={26}
                            style={{color: tintColor}}
                        />
                    ),
                },
            },
        }));
    }

    render() {
        //FIX DynamicTabNavigator中的页面无法跳转到外层导航器页面的问题
        NavigatorUtil.navigation = this.props.navigation;
        const Tab = this._createBottomTab();
        return <DynamicTabNavigator/>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Home;
