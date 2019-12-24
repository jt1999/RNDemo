import React from 'react';
import {AsyncStorage} from 'react-native';
import Toast from 'react-native-root-toast';

export const BASE_URL = 'http://192.168.1.254:86';

export default class Common {
  /**
   * 判断是否为空
   * @param str 值
   * */
  static strIsNull(str) {
    if (str === '' || str === null || str === undefined || str === 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 验证手机号
   * @param phone 手机号
   * */
  static regexPhone(phone) {
    const phoneRegex = /^1[3456789]\d{9}$/;
    if (phoneRegex.test(phone)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 保存数据到缓存里
   * @param key 名称
   * @param params 参数
   * */
  static setStorage(key, params) {
    return AsyncStorage.setItem(key, JSON.stringify(params), (error) => {
      console.log(error);
    });
  }

  /**
   * 从缓存中获取数据
   * @param key 名称
   * */
  static getStorage(key) {
    return AsyncStorage.getItem(key).then((value, error) => {
      if (!error) {
        const jsonValue = JSON.parse(value);
        return jsonValue;
      } else {
        return {};
      }
    });
  }

  /**
   * 从缓存中删除数据
   * @param key 名称
   * */
  static removeStorage(key) {
    AsyncStorage.removeItem(key, (error) => {
      console.log(error);
    });
  }

  /**
   * 根据key更新缓存
   * @param key 名称
   * @param params 参数
   * */
  static updateStorage(key, params) {
    return Common.getStorage(key).then((item) => {
      params = typeof params === 'string' ? params : Object.assign({}, item, params);
      return AsyncStorage.setItem(key, JSON.stringify(params));
    });
  }

  /**
   * 清空所有缓存数据
   * 不推荐使用此方法
   * */
  static clearStorage() {
    AsyncStorage.clear((error) => {
      console.log(error);
    });
  }

  /**
   * 手机号脱敏处理
   * @param phone 手机号
   * */
  static replacePhone(phone) {
    if (!phone) {
      return '';
    }
    var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
    var phoneNums = phone.match(regx);
    if (phoneNums != null && phoneNums.length > 0) {
      for (var i = 0; i < phoneNums.length; i++) {
        //手机号全部替换
        //str = str.replace(phoneNums[i],"[****]");
        var temp = phoneNums[i];
        //隐藏手机号中间4位(例如:12300102020,隐藏后为132****2020)
        temp = temp.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        phone = phone.replace(phoneNums[i], temp);
      }
    }
    return phone;
  }

  /**
   * 弹框
   * @param message
   * @param options
   */
  static toast(message, options = {position: Toast.positions.BOTTOM}) {
    Toast.show(message, options);
  }

  /**
   * 判断两个数组的是否相等
   * @param arr1
   * @param arr2
   * @returns {boolean} true 数组长度相等并且元素相等
   */
  static isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) {
      return false;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true
  }
}

