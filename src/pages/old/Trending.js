import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';

class Trending extends Component {
    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.text}>TrendingPage</Text>
                <Text
                    style={styles.text}
                    onPress={() => this.props.onThemeChange('orange')}
                >点击更换主题[orange]</Text>
                <Text
                    style={styles.text}
                    onPress={() => this.props.onThemeChange('yellow')}
                >点击更换主题[yellow]</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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

export default connect(null, mapDispatchToProps)(Trending);
