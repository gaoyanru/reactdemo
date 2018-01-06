import React from 'react'
import { Spin, message, Button } from 'antd'
import { getListData, postData, putData } from '@/api'
import _ from 'lodash'
import * as ContractActions from '@/config/contractActions'
import Dialog from '@/container/Dialog'
import Title from '@/component/Title'

import CustomerBaseInfo from '@/container/Contract/CustomerBaseInfo'
import ContractInfo from '@/container/Contract/ContractForm'
import PayInfo from '@/container/Contract/PayInfo'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: {}
    }
    this.onSave = this.onSave.bind(this);
  }
  onSave(){
    
    const msg2 = this.ContractInfo.validateField();
    const msg3 = this.PayInfo.validateField();

    if(msg2) message.error(msg2);
    if(msg3) message.error(msg3);
    if(msg2 || msg3) return;

    let cusInfo = this.CustomerBaseInfo.getFieldsValue();
    if(!cusInfo) return;

    let ctrInfo = this.ContractInfo.getFieldsValue();
    let payInfo = this.PayInfo.getFieldsValue();

    const data = {
      ...cusInfo,
      ...ctrInfo,
      ...payInfo
    };

    postData('contract',data).then(res=>{
      if(res.status){
        message.info('保存成功！');
        this.handler.close();
      }
    })
  }
  render() {
    return (
      <div style={this.props.style} className="order-dialog">
        <CustomerBaseInfo wrappedComponentRef={e=>{this.CustomerBaseInfo = e}} data={this.props.data} readOnly={this.props.readOnly}/>
        <ContractInfo ref={e=>{this.ContractInfo = e}} data={this.props.data} readOnly={this.props.readOnly}/>
        <PayInfo ref={e=>{this.PayInfo = e}} data={this.props.data} readOnly={this.props.readOnly}/>
        <div style={{textAlign:'center'}}><Button type="primary" disabled={this.props.readOnly} onClick={this.onSave}>保存并提交</Button></div>
      </div>
    );
  }
}

export default Main
