import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import NavigatorUtil from '../../navigator/NavigatorUtil';
import {MORE_MENU} from '../../common/MORE_MENU';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/config';
import GlobalStyles from '../../res/style/GlobalStyles';

const THEME_COLOR = '#678';

export default class My extends Component {
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
    let RouteName, params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
        break;
    }
    if (RouteName) {
      NavigatorUtil.goPage(params, RouteName);
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
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

