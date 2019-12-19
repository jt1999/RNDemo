import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import DataStore from '../expand/dao/DataStore';

class DataStoreDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            showText: '',
        };
        this.dataStore = new DataStore();
    }

    render() {
        return (
            <View>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => {
                        this.setState({
                            inputValue: text,
                        });
                    }}
                />
                <Text
                    onPress={() => {
                        this.loadData();
                    }}
                >点击load</Text>
                <Text>{this.state.showText}</Text>
            </View>
        );
    }

    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.value}`;
        this.dataStore.fetchData(url).then(data => {
            console.log(data);
            let showData = `初次数据加载时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
            this.setState({
                showText: showData,
            });
        }).catch((error) => {
            error && console.log(error.toString());
        });
    }
}

const styles = StyleSheet.create({
    textInput: {
        borderColor: '#cdcdcd',
        borderWidth: 1,
        marginBottom: 20,
    },
});


export default DataStoreDemo;
