import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal  } from 'antd';
import store from '@/store'
import { Provider } from 'react-redux'

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      confirmLoading: false
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  handleOk(e) {
    this.setState({confirmLoading: true})
    const handleOk = this.props.handleOk || this.props.content.handleOk || (()=>e||true);
    var result = handleOk(e);
    if(result && result.constructor === Promise){
      result.then(this.onClose,()=>{
        this.setState({confirmLoading: false})
      });
    }else if(result){
      this.onClose(result);
    }else{
      this.setState({confirmLoading: false})
    }
  }
  handleCancel(e) {
    const handleCancel = this.props.handleCancel || this.props.content.handleCancel || (()=>e||true);
    var result = handleCancel(e);
    if(result && result.constructor === Promise){
      result.then(this.onClose,()=>this.setState({confirmLoading: false}));
    }else{
      this.onCancel(result);
    }
  }
  onClose(result){
    this.setState({visible: false});
    const that = this;
    setTimeout(()=>{
      that.props.onClose && that.props.onClose(result)
    },500);
  }
  onCancel(result){
    this.setState({visible: false});
    const that = this;
    setTimeout(()=>{
      that.props.onCancel && that.props.onCancel(result)
    },500);
  }
  render() {
    let Content = this.props.content;
    return (
      this.state.visible?
      <Modal title={this.props.title}
          width={this.props.width || 520}
          visible={this.state.visible}
          onOk={(e)=>{this.handleOk(e)}}
          confirmLoading={ this.state.confirmLoading}
          onCancel={(e)=>{this.handleCancel(e)}}
          footer = {this.props.footer}
          okText= "确定"
          cancelText = "取消"
          maskClosable={false}>
        <Provider store={this.props.store}>
        {Content}
        </Provider>
      </Modal>:null
    );
  }
}

function createDialog(options){
  const div = document.createElement('div');
  let dc;
  const dialog = new Promise(function(resolve, reject) {
    
    options.onClose = function(arg){
      resolve(arg);
      div.remove();
    };
    options.onCancel = function(arg){
      div.remove();
      reject(arg);
    }
    const d = <Dialog store={store} {...options} ref={t=>{dc=t}} />;
    ReactDOM.render(d, div);
    document.body.appendChild(div);
  });

  return {
    result: dialog,
    close (arg){
      dc.handleOk(arg)
    },
    cancel(arg){
      dc.handleCancel(arg)
    }
  };
}
export default createDialog;
