import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.scss';
import Routers from './routers';
import registerServiceWorker from './registerServiceWorker';
import store from '@/store'

ReactDOM.render(<Routers store={store}/>, document.getElementById('root'));
registerServiceWorker();
