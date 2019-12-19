import React, {Component} from 'react';
import {View, Text, StyleSheet,SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import NavigationBar from '../common/NavigationBar';
import NavigatorUtil from '../navigator/NavigatorUtil';
const THEME_COLOR = '#678';
class My extends Component {
    render() {
        const {navigation} = this.props;
        let statusBar = {
            backgroundColor:THEME_COLOR,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'我的'}
                statusBar={statusBar}
                style={{backgroundColor:THEME_COLOR}}
            />;
        return (
            <SafeAreaView>
                {navigationBar}
                <View style={styles.container}>
                    <Text
                        style={styles.text}
                        onPress={() => this.props.onThemeChange('#ff5619')}
                    >点击更换主题</Text>
                    <Text
                        style={styles.pageText}
                        onPress={() => {
                            NavigatorUtil.goPage({}, 'AsyncStorageDemo');
                        }}
                    >点击这里跳转到缓存案例</Text>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});


const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});

export default connect(null, mapDispatchToProps)(My);
