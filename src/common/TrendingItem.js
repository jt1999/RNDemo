import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HtmlView from 'react-native-htmlview';
import BaseItem from './BaseItem';

class TrendingItem extends BaseItem {
    render() {
        const {projectModel} = this.props;
        const {item} = projectModel;
        if (!item) {
            return null;
        }

        let description = '<p>' + item.description + '</p>';
        return (
            // activeOpacity={1}  取消点击时透明度
            <TouchableOpacity onPress={() => this.onItemClick()}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.fullName}</Text>
                    {/*<Text style={styles.description}>{item.description}</Text>*/}
                    <HtmlView
                        value={description}
                        stylesheet={{
                            p: styles.description,
                            a: styles.description,
                        }}
                    />
                    <Text style={styles.description}>{item.meta}</Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Built by:</Text>
                            {
                                item.contributors.map((result, i) => {
                                    return <Image
                                        key={i}
                                        style={{height: 22, width: 22, margin: 2}}
                                        source={{uri: result}}
                                    />;
                                })
                            }
                        </View>
                        {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
                        {/*    <Text>Start:</Text>*/}
                        {/*    <Text>{item.starCount}</Text>*/}
                        {/*</View>*/}
                        {this._favoriteIcon()}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // _favoriteItem() {
    //     return (
    //         <TouchableOpacity
    //             style={{padding: 6}}
    //             underlayColor='transparent'
    //             onPress={() => {
    //             }}>
    //             <FontAwesome
    //                 name={'star-o'}
    //                 size={26}
    //                 style={{color: THEME_COLOR}}
    //             />
    //         </TouchableOpacity>
    //     );
    // }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        //ios 阴影
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        //ios 阴影end
        elevation: 2, //android 阴影
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    },
});

export default TrendingItem;
