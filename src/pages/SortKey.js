import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import NavigationBar from '../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import CheckBox from 'react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorUtil from '../navigator/NavigatorUtil';
import Common from '../common';
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//常量


class SortKey extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.languageDao = new LanguageDao(this.params.flag);
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    this.state = {
      checkedArray: SortKey._keys(this.props), //已经选择的集合
    };
  }

  /**
   * 牢记：https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
   * componentWillReceiveProps在新版React中不能再用了
   * @param nextProps
   * @param prevState
   * @returns {*}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKey._keys(nextProps, null, prevState);
    if (prevState.keys !== checkedArray) {
      return {
        checkedArray: checkedArray,
      };
    }
    return null;
  }

  componentDidMount() {
    this.backPress.componentDidMount();
    //如果props中标签为空则从本地存储中获取标签
    //CustomKey 页面名
    if (SortKey._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress(e) {
    this.onBack();
    return true;
  }

  /**
   * 获取标签
   * @param props
   * @param state
   * @returns {*}
   * @private
   */
  static _keys(props, state) {
    //如果state中有checkedArray则使用state中的checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray;
    }
    //否则从原始数据中获取checkedArray
    const flag = SortKey._flag(props);
    let dataArray = props.language[flag] || [];
    let keys = [];
    for (let i = 0, len = dataArray.length; i < len; i++) {
      let data = dataArray[i];
      if (data.checked) {
        keys.push(data);
      }
    }
    return keys;
  }


  static _flag(props) {
    const {flag} = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
  }

  /**
   * 获取右侧文字按钮
   * @param title
   * @param callBack
   * @returns {*}
   */
  static getRightButton(title, callBack) {
    return <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={callBack}
    >
      <Text style={{fontSize: 20, color: '#FFFFFF', marginRight: 10}}>{title}</Text>
    </TouchableOpacity>;
  }

  onBack() {
    if (!Common.isEqual(SortKey._keys(this.props), this.state.checkedArray)) {
      Alert.alert(
        '系统提示',
        '要保存修改吗？',
        [
          {
            text: '否', onPress: () => {
              NavigatorUtil.goBack(this.props.navigation);
            },
          },
          {
            text: '是', onPress: () => {
              this.onSave(true);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      NavigatorUtil.goBack(this.props.navigation);
    }

  }

  onSave(hasChecked) {
    if (!hasChecked) {
      //如果没有排序则直接返回
      if (Common.isEqual(SortKey._keys(this.props), this.state.checkedArray)) {
        NavigatorUtil.goBack(this.props.navigation);
        return;
      }
    }
    //保存排序后的数据
    //获取排序后的数据
    //更新本地数据
    this.languageDao.save(this.getSortResult());
    const {onLoadLanguage} = this.props;
    //更新store  让其他调用这些数据的地方能及时更新
    onLoadLanguage(this.params.flag);
    NavigatorUtil.goBack(this.props.navigation);
  }

  /**
   *  获取排序后的标签结果
   * @returns {*[]|Array}
   */
  getSortResult() {
    const flag = SortKey._flag(this.props);
    //从原始数据中复制一份数据出来，以便对这份数据进行排序
    let sortResultArray = Common.cloneArray(this.props.language[flag]);
    //获取排序前的排列顺序
    const origianlCheckedArray = SortKey._keys(this.props);
    //遍历排序之前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0, j = origianlCheckedArray.length; i < j; i++) {
      let item = origianlCheckedArray[i];
      //找到要替换的元素所在位置
      let index = this.props.language[flag].indexOf(item);
      //进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
    return sortResultArray;
  }

  onClick(data, index) {
    data.checked = !data.checked;
    Common.updateArray(this.changeValues, data);
    this.state.keys[index] = data;//更新state以便显示选中状态
    this.setState({
      keys: this.state.keys,
    });
  }

  render() {
    const {theme}=this.params;
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
    let navigationBar = <NavigationBar
      title={title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
      style={theme.styles.navBar}
    />;

    return <SafeAreaView style={styles.container}>
      {navigationBar}
      <SortableListView
        style={{flex: 1}}
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)} //相当于key
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate();
        }}
        renderRow={row => <SortCell data={row} theme={theme} {...this.params}/>}
      />
    </SafeAreaView>;
  }
}

class SortCell extends Component {
  render() {
    return <TouchableHighlight
      underlayColor={'#eee'}
      style={this.props.data.checked ? styles.item : styles.hidden}
      {...this.props.sortHandlers}
    >
      <View style={{marginLeft: 10, flexDirection: 'row'}}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{marginRight: 10, color: this.props.theme.themeColor}}
        />
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>;
  }
}

const mapPopularStateToProps = state => ({
  language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是个function,并不一定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKey);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
  hidden: {
    height: 0,
  },
  item: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center',
  },
});

