import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NavigatorUtil from '../navigator/NavigatorUtil';
import actions from '../action';
import {connect} from 'react-redux';

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 3,
        };
    }

    componentDidMount() {
        this.props.onThemeInit();
        const that = this;
        this.timer = setInterval(() => {
            let time = that.state.time;
            time--;
            if (time < 0) {
                clearInterval(this.timer);
                NavigatorUtil.resetToHomePage(that.props);
            } else {
                that.setState({
                    time: time,
                });
            }
        }, 1000);
    }

    componentWillMount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>WelcomePage:{this.state.time}</Text>
                <Text
                    onPress={() => {
                        NavigatorUtil.resetToHomePage(this.props);
                    }}
                >跳过</Text>
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null,mapDispatchToProps)(Welcome)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

