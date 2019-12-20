import React, {Component} from 'react';
import {View, Clipboard, Linking} from 'react-native';
import NavigatorUtil from '../../navigator/NavigatorUtil';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/config';
import GlobalStyles from '../../res/style/GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Common from '../../common';

const THEME_COLOR = '#678';

export default class AboutAuthor extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me,
    }, data => this.setState({...data}));
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false,
    };
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  componentWillUnmount() {
    this.aboutCommon.componentWillUnmount();
  }

  onClick(data) {
    if (!data) {
      return;
    }
    //网页
    if (data.url) {
      NavigatorUtil.goPage({
        title: data.title,
        url: data.url,
      }, 'WebViewPage');
    }
    //邮箱
    if (data.account && data.account.indexOf('@') > -1) {
      let url = 'mailto://' + data.account;
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => console.error('An error occurred', err));
      return;
    }
    //群
    if (data.account) {
      //复制到剪切板  对应getString()
      Clipboard.setString(data.account);
      Common.toast(data.title + data.account + '已复制到剪切板。');
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }

  _item(menu, isShow, key) {
    return ViewUtil.getSettingItem(() => {
      this.setState({
        [key]: !this.state[key],
      });
    }, menu.name, THEME_COLOR, Ionicons, menu.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down');
  }

  /**
   * 列表数据
   * @param dic
   * @param isShowAccount
   */
  renderItems(dic, isShowAccount) {
    if (!dic) {
      return null;
    }
    let views = [];
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, THEME_COLOR)}
          <View style={GlobalStyles.line}/>
        </View>,
      );
    }
    return views;
  }

  render() {
    let aboutMe = this.state.data.aboutMe;
    const contentView = <View>
      {this._item(aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
      <View style={GlobalStyles.line}/>
      {this.state.showTutorial ? this.renderItems(aboutMe.Tutorial.items) : null}

      {this._item(aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GlobalStyles.line}/>
      {this.state.showBlog ? this.renderItems(aboutMe.Blog.items) : null}

      {this._item(aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GlobalStyles.line}/>
      {this.state.showQQ ? this.renderItems(aboutMe.QQ.items, true) : null}

      {this._item(aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GlobalStyles.line}/>
      {this.state.showContact ? this.renderItems(aboutMe.Contact.items, true) : null}
    </View>;
    return this.aboutCommon.render(contentView, this.state.data.author);
  }
}

