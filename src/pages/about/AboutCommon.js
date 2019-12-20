import React from 'react';
import {Text, View, Dimensions, Image, Platform, DeviceInfo, StyleSheet} from 'react-native';
import BackPressComponent from '../../common/BackPressComponent';
import NavigatorUtil from '../../navigator/NavigatorUtil';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../../res/style/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
// import config from '../../res/data/config'; //导入本地文件 json导成对象

const THEME_COLOR = '#678';
const window = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const ROW_HEIGHT = 60;
const TOP = (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + TOP : GlobalStyles.nav_bar_height_android;
export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};
export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState; //function
    //物理返回键处理
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress});

    /**
     * 第一种方法：加载本地config
     */
    // this.updateState({
    //   config,
    // });
  }

  componentDidMount() {
    this.backPress.componentDidMount();
    this.getConfig();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onShare() {

  }

  getParallaxRenderConfig(params) {
    let config = {};
    let avatar = typeof (params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;
    //底部背景
    config.renderBackground = () => (
      <View key="background">
        <Image source={{
          uri: params.backgroundImg,
          width: window.width,
          height: PARALLAX_HEADER_HEIGHT,
        }}/>
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT,
        }}/>
      </View>
    );
    //前景  头像、标题、描述
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar}
               source={avatar}/>
        <Text style={styles.sectionSpeakerText}>
          {params.name}
        </Text>
        <Text style={styles.sectionTitleText}>
          {params.description}
        </Text>
      </View>
    );
    //顶部悬停 顶部标题
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    //顶部左右两边固定不动的按钮
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => NavigatorUtil.goBack(this.props.navigation))}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    );

    return config;
  }

  render(contentView, params) {
    const renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor={THEME_COLOR}
        contentBackgroundColor={GlobalStyles.backgroundColor}  //内容背景色
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}  //顶部悬浮的高度
        backgroundScrollSpeed={10} //移动速度视差
        {...renderConfig} //es7语法
      >
        {contentView}
      </ParallaxScrollView>
    );
  }

  onBackPress() {
    NavigatorUtil.goBack(this.props.navigation);
    return true;
  }

  /**
   * 第二种方法：网络加载config
   */
  getConfig() {
    fetch('https://www.devio.org/io/GitHubPopular/json/github_app_config.json').then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('网络出错！');
    }).then((config) => {
      if (config) {
        console.log('【fetchConfig】', config);
        this.updateState({
          data: config,
        });
        console.log('【updateState】', this.updateState.data);
      }
    }).catch(e => {
      console.log(e);
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
  },
});
