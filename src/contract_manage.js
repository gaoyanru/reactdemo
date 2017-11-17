import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.scss';
import ContractManage from './pages/contract/manage';
import registerServiceWorker from './registerServiceWorker';

function render(el){
    ReactDOM.render(<ContractManage />, el);
}

window.render = render;
registerServiceWorker();
