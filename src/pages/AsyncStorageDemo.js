import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, AsyncStorage} from 'react-native';
import Common from '../common';

class AsyncStorageDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userPhone: '',
            test: '',
        };
    }

    render() {
        return (
            <View>
                <View>
                    <Text>姓名:</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.userName}
                        onChangeText={text => {
                            this.setState({
                                userName: text,
                            });
                        }}
                    />
                </View>
                <View>
                    <Text>手机号:</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.userPhone}
                        onChangeText={text => {
                            this.setState({
                                userPhone: text,
                            });
                        }}
                    />
                </View>
                <Text>{this.state.test}</Text>
                <View>
                    <Text
                        onPress={() => {
                            this.saveData();
                        }}
                    >保存</Text>
                    <Text
                        onPress={() => {
                            this.getData();
                        }}>获取</Text>
                    <Text
                        onPress={() => {
                            this.removeData();
                        }}
                    >删除</Text>
                </View>
            </View>
        );
    }


    saveData() {
        let params = this.state;
        Common.setStorage('userData', params);
        this.setState({
            userName: '',
            userPhone: '',
        });
    }

    getData() {
        Common.getStorage('userData').then((data) => {
            this.setState({
                userName: data === null ? '' : data.userName,
                userPhone: data === null ? '' : data.userPhone,
            });
        });
    }

    removeData() {
        Common.removeStorage('userData');
    }
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
    },
});

export default AsyncStorageDemo;
