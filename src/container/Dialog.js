import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal  } from 'antd';

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
    var result = this.props.handleOk(e);
    if(result && result.constructor === Promise){
      result.then(this.onClose);
    }else{
      this.onClose(result);
    } 
  }
  handleCancel(e) {
    var result = this.props.handleCancel(e);
    if(result && result.constructor === Promise){
      result.then(this.onClose);
    }else{
      this.onCancel(result);
    }
  }
  onClose(result){
    this.setState({visible: false});
    setTimeout(()=>{
      this.props.onClose(result)
    },500);
  }
  onCancel(result){
    this.setState({visible: false});
    setTimeout(()=>{
      this.props.onCancel(result)
    },500);
  }
  render() {
    return (
      this.state.visible?
      <Modal title={this.props.title}
          visible={this.state.visible}
          onOk={(e)=>{this.handleOk(e)}}
          confirmLoading={ this.state.confirmLoading}
          onCancel={(e)=>{this.handleCancel(e)}}>
        {this.props.content}
      </Modal>:null
    );
  }
}

function createDialog(options){
  const div = document.createElement('div');
  var dialog = new Promise(function(resolve, reject) {
    options.onClose = function(arg){
      resolve(arg);
      div.remove();
    };
    options.onCancel = function(arg){
      div.remove();
      reject(arg);
    }
    ReactDOM.render(<Dialog {...options} />, div);
    document.body.appendChild(div);
  });

  return dialog;
}
export default createDialog;
