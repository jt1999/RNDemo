import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
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

//常量
const THEME_COLOR = '#678';


class CustomKey extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.changeValues = []; //保存用户所触发的一些变更
    this.isRemoveKey = !!this.params.isRemoveKey;  //是否为移除
    this.languageDao = new LanguageDao(this.params.flag);
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    this.state = {
      keys: [],
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
    if (prevState.keys !== CustomKey._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKey._keys(nextProps, null, prevState),
      };
    }
    return null;
  }

  componentDidMount() {
    this.backPress.componentDidMount();
    //如果props中标签为空则从本地存储中获取标签
    //CustomKey 页面名
    if (CustomKey._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
    this.setState({
      keys: CustomKey._keys(this.props),
    });
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
   * @param original 移除标签时使用，是否从props获取原始对的标签
   * @param state 移除标签时使用
   * @returns {*}
   * @private
   */
  static _keys(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params;
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    if (isRemoveKey && !original) {
      //移除标签
      //如果state中的keys为空则从props中取
      return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
        return {//注意：不直接修改props，copy一份
          ...val,
          checked: false,
        };
      });
    } else {
      //自定义标签
      return props.language[key];
    }
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
    if (this.changeValues.length > 0) {
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
              this.onSave();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      NavigatorUtil.goBack(this.props.navigation);
    }

  }

  onSave() {
    if (this.changeValues.length === 0) {
      NavigatorUtil.goBack(this.props.navigation);
      return;
    }
    //如果是标签移除 进行特殊处理
    let keys;
    if (this.isRemoveKey) {
      for (let i = 0, len = this.changeValues.length; i < len; i++) {
        Common.removeArray(keys = CustomKey._keys(this.props, true), this.changeValues[i], 'name');
      }
    }

    //更新本地数据
    this.languageDao.save(keys || this.state.keys);
    //更新store  让其他调用这些数据的地方能及时更新
    const {onLoadLanguage} = this.props;
    onLoadLanguage(this.params.flag);
    NavigatorUtil.goBack(this.props.navigation);
  }

  onClick(data, index) {
    data.checked = !data.checked;
    Common.updateArray(this.changeValues, data);
    this.state.keys[index] = data;//更新state以便显示选中状态
    this.setState({
      keys: this.state.keys,
    });
  }


  /**
   * 渲染checkbox 图标
   * @param checked
   * @returns {*}
   * @private
   */
  _checkedImage(checked) {
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{
        color: THEME_COLOR,
      }}/>;
  }

  /**
   * 渲染每个checkbox
   * @param data
   * @param index
   * @returns {*}
   */
  renderCheckbox(data, index) {
    return <CheckBox
      style={{flex: 1, padding: 10}}
      onClick={() => this.onClick(data, index)}
      isChecked={data.checked}
      leftText={data.name}
      checkedImage={this._checkedImage(true)}
      unCheckedImage={this._checkedImage(false)}
    />;
  }

  renderView() {
    let dataArray = this.state.keys;
    if (!dataArray || dataArray.length === 0) {
      return;
    }
    let len = dataArray.length;
    let views = [];
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View keys={i}>
          <View style={styles.item}>
            {this.renderCheckbox(dataArray[i], i)}
            {/*渲染第二个元素的时候判断数组没有越界也不是最后的元素 就渲染*/}
            {i + 1 < len && this.renderCheckbox(dataArray[i + 1], i + 1)}
          </View>
          <View style={styles.line}/>
        </View>,
      );
    }
    return views;
  }

  render() {
    let title = this.isRemoveKey ? '标签移除' : '自定义标签';
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
    let navigationBar = <NavigationBar
      title={title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
      style={{backgroundColor: THEME_COLOR}}
    />;

    return <SafeAreaView style={styles.container}>
      {navigationBar}
      <ScrollView>
        {
          this.renderView()
        }
      </ScrollView>
    </SafeAreaView>;
  }
}

const mapPopularStateToProps = state => ({
  language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是个function,并不一定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKey);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});

