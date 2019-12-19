import AsyncStorage from '@react-native-community/async-storage';
import Trending from 'GitHubTrending/trending/GitHubTrending';


export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};
/**
 * 参考链接：https://blog.csdn.net/m0_38066007/article/details/92801410
 */
export default class DataStore {
    /**
     * 保存数据
     * @param url
     * @param data
     * @param callback
     */
    saveData(url, data, callback) {
        if (!data || !url) {
            return;
        }
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise<unknown>}
     */
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            });
        });
    }

    /**
     * 获取网络数据
     * @param url
     * @param flag
     * @returns {Promise<unknown>}
     */
    fetchNetData(url, flag) {
        return new Promise((resolve, reject) => {
            if (flag !== FLAG_STORAGE.flag_trending) {
                fetch(url, {
                    credentials: 'include',//为了在当前域名内自动发送 cookie ， 必须提供这个选项
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',//请求的模式
                    cache: 'force-cache',
                })
                    .then((response) => {
                        // console.log('【返回JSOn】', response);
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok');
                    })
                    .then((responseData) => {
                        // console.log('[网络请求responseData]', responseData);
                        this.saveData(url, responseData);
                        resolve(responseData);
                    })
                    .catch((error) => {
                        console.log('[网络请求Error]', error);
                        reject(error);
                    });
            } else {
                new Trending().fetchTrending(url).then(items => {
                    if (!items) {
                        throw new Error('responseData is null');
                    }
                    this.saveData(url, items);
                    resolve(items);
                })
                    .catch(error => {
                        reject(error);
                    });
            }
        });
    }

    /**
     *  实现缓存策略
     *  优先从本地获取数据，如果数据过时或不存在则从服务器获取数据
     * @param url
     * @param flag
     * @returns {Promise<unknown>}
     */
    fetchData(url, flag) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData);
                } else {
                    console.log('[网络请求]');
                    this.fetchNetData(url, flag)
                        .then((data) => {
                            resolve(this._wrapData(data));
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            })
                .catch((error) => {
                    this.fetchNetData(url, flag)
                        .then((data) => {
                            resolve(this._wrapData(data));
                        })
                        .catch((error => {
                            reject(error);
                        }));
                });
        });
    }

    /**
     *  检查timestamp是否在有效期内  true 不需要更新,false 需要更新
     * @param timestamp
     * @returns {boolean}
     */
    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) {
            return false;
        }
        if (currentDate.getDate() !== targetDate.getDate()) {
            return false;
        }
        if (currentDate.getHours() - targetDate.getDate() > 4) {
            return false; // 有效期4个小时
        }
        return true;
    }

    /**
     * 数据的有效期
     * 注意：这里我们取的是本地时间作为的时间戳，本地时间存在被篡改的风险，如果条件允许可以取服务器的时间作为时间戳
     * @param data
     * @returns {{data: *, timestamp: *}}
     * @private
     */
    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()};
    }
}
