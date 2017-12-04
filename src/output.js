import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '@/style/global.css';
import Login from '@/pages/login';
import store from '@/store'
const output = function(el) {
    ReactDOM.render(<Login store={store}/>,el);
}
window.output = output
export default  output
