import React, {Component} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Popular from '../pages/Popular';
import Trending from '../pages/Trending';
import Favorite from '../pages/Favorite';
import My from '../pages/My';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {connect} from 'react-redux';

const TABS = {
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
};

class DynamicTabNavigator extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true; //关闭黄色警告框
    }

    _tabNavigator() {
        if (this.Tabs) {
            return this.Tabs;
        }
        const {Favorite, Trending, Popular, My} = TABS;
        const tabs = {Popular, Trending, Favorite, My};
        // Popular.navigationOptions.tabBarLabel = '最热1';//动态修改导航栏名称
        return this.Tabs = createAppContainer(createBottomTabNavigator(
            tabs, {
                // tabBarComponent: TabBarComponent,
                tabBarComponent: props => {
                    return <TabBarComponent theme={this.props.theme} {...props}/>;
                },
            },
        ));
    }

    render() {
        const Tab = this._tabNavigator();
        return <Tab/>;
    }

}

class TabBarComponent extends Component {
    // constructor(props) {
    //     super(props);
    //     this.theme = {
    //         tintColor: props.activeTintColor,
    //         updateTime: new Date().getTime(),
    //     };
    // }

    render() {
        // const {navigation} = this.props;
        // const {state} = navigation;
        // const {routes, index} = state;
        // if (routes[index].params) {
        //     const {theme} = routes[index].params;
        //     //以最新的最新时间为主，防止被其他tab之前的修改所覆盖
        //     if (theme && theme.updateTime > this.theme.updateTime) {
        //         this.theme = theme;
        //     }
        // }
        //
        // return <BottomTabBar
        //     {...this.props}
        //     activeTintColor={this.theme.tintColor || this.props.activeTintColor}
        // />;
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme}
        />;
    }
}


/***
 * @param state
 * @returns {{theme: *}} state.theme.theme state指的是store这个仓库；第一个theme指的是这个仓库下有一个叫做theme.js的文件，第二个theme指的是theme.js下 theme 这个键
 * state.模块名.键
 */
const mapStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);
