import React, {Component} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import NavigatorUtil from '../../navigator/NavigatorUtil';
import {MORE_MENU} from '../../common/MORE_MENU';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/config';
import GlobalStyles from '../../res/style/GlobalStyles';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about,
    }, data => this.setState({...data}));
    this.state = {
      data: config,
    };
  }

  onClick(menu) {
    const {theme}=this.params;
    let RouteName, params = {theme};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutAuthor';
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://crazycodeboy@gmail.com';
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              //不支持
              console.log('暂不支持此功能！');
            } else {
              Linking.openURL(url);
            }
          })
          .catch(e => {
            console.error(e);
          });
        break;
    }
    if (RouteName) {
      NavigatorUtil.goPage(params, RouteName);
    }
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  componentWillUnmount() {
    this.aboutCommon.componentWillUnmount();
  }

  getItem(menu) {
    const {theme}=this.params;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
  }

  render() {
    const contentView = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.Feedback)}
    </View>;
    return this.aboutCommon.render(contentView, this.state.data.app);
  }
}

