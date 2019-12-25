import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigatorUtil from '../navigator/NavigatorUtil';
import BackPressComponent from '../common/BackPressComponent';

class WebViewPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false, //是否能返回到上一页
    };
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress});
  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress() {
    this.onBack();
    return true;
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigatorUtil.goBack(this.props.navigation);
    }
  }


  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url,
    });
  }

  render() {
    const {theme} = this.params;
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      title={this.state.title}
      style={theme.styles.navBar}
    />;
    return (
      <SafeAreaView style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

export default WebViewPage;
