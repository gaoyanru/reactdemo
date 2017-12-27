import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '@/style/global.css';
import Routers from './routers';
import registerServiceWorker from './registerServiceWorker';
import store from '@/store'

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

ReactDOM.render(<Routers store={store}/>, document.getElementById('root'));
registerServiceWorker();
