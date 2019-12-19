export default class NavigatorUtil {
    /**
     * 跳转到指定页面
     *@param params 要传递的参数
     *@param page   要跳转的页面名（页面路由名）
     * */
    static goPage(params, page) {
        const navigation = NavigatorUtil.navigation;
        if (!navigation) {
            console.log('NavigatorUtil.navigation can not be null');
        }
        //不为空的情况进行跳转
        navigation.navigate(
            page,
            {
                ...params,
            },
        );
    }
    /**
     * 返回上一页
     * @param navigation
     */
    static goBack(navigation) {
        navigation.goBack();
    }
    /**
     * 重置到首页
     * */
    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate('MainNavigator');
    }
}
