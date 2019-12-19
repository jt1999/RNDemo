import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigatorUtil from '../navigator/NavigatorUtil';

class Popular extends Component {
    constructor(props) {
        super(props);
        this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React-Native', 'C++', '.Net', 'C#'];
    }

    /**动态tab*/
    _createDynamicTopTab() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTab {...this.props} tabLabel={item}/>,
                navigationOptions: {
                    title: item,
                },
            };
        });
        return createAppContainer(createMaterialTopTabNavigator(
            tabs,
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    style: {
                        backgroundColor: '#a67',
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle,
                },
            },
        ));
    }

    /**静态tab*/
    _createTopTab() {
        return createAppContainer(createMaterialTopTabNavigator({
            PopularTab1: {
                screen: PopularTab,
                navigationOptions: {
                    title: 'Tab1',
                },
            },
            PopularTab2: {
                screen: PopularTab,
                navigationOptions: {
                    title: 'Tab2',
                },
            },
        }));
    }

    render() {
        // const TopTab = this._createTopTab();
        const TopTab = this._createDynamicTopTab();
        return (
            <TopTab/>
        );
    }
}

class PopularTab extends Component {
    render() {
        return (
            <View>
                <Text>PupularTab</Text>
                <Text
                    style={styles.pageText}
                    onPress={() => {
                        NavigatorUtil.goPage({}, 'Detail');
                    }}
                >点击这里跳转到详情页面</Text>
                <Text
                    style={styles.pageText}
                    onPress={() => {
                        NavigatorUtil.goPage({}, 'AsyncStorageDemo');
                    }}
                >点击这里跳转到缓存案例</Text>
                <Text
                    style={styles.pageText}
                    onPress={() => {
                        NavigatorUtil.goPage({}, 'DataStoreDemo');
                    }}
                >
                    点击这里跳转到离线缓存案例
                </Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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
});

export default Popular;
