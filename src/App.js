import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigators from './navigator/AppNavigators';
import store from './store';

class App extends Component {
    render() {
        /***
         * 第三步：将store传递给app框架
         */
        return (
            <Provider store={store}>
                <AppNavigators/>
            </Provider>
        );
    }
}

export default App;

