import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../res/data/keys';
import langs from '../../res/data/langs';
import Common from '../../common';

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'};
export default class LanguageDao {
  constructor(flag) {
    //flag 用于标识是 趋势模块 调用还是 最热模块调用
    this.flag = flag;
  }

  /**
   * 获取语言或标签
   * @returns {Promise<R>}
   */
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
          this.save(data);
          resolve(data);
        } else {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
        }
      });
    });
  }

  /**
   * 保存语言或标签
   * @param objectData
   */
  save(objectData) {
    // let stringData = JSON.stringify(objectData);
    // AsyncStorage.setItem(this.flag, stringData, (error, result) => {
    //
    // });
    Common.setStorage(this.flag, objectData);
  }
}
