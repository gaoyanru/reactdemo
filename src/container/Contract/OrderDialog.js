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
      data: null,
      readOnly: props.readOnly
    }
    this.onSave = this.onSave.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.getOrderDetail = this.getOrderDetail.bind(this);
    if(props.id){
      this.getOrderDetail(props.id);
    }else{
      this.state.data = {};
    }
  }
  getOrderDetail(id){
    getListData('order/'+ id).then(res=>{
      if(res.status){
        res.data.SalesId = res.data.OrderSalesId;
        res.data.SalesName = res.data.OrderSalesName;
        this.setState({data: res.data});
      }
    })
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
    // data.OrderSalesId = data.SalesId
    if(!this.state.data.OrderId){
      postData('order',data).then(res=>{
        if(res.status){
          message.info('保存成功！');
          if(this.handler) this.handler.close();
          if(this.props.closeDialog) this.props.closeDialog();
        }
      })
    }else{

      putData('order/'+this.state.data.OrderId,_.extend({},this.state.data,data)).then(res=>{
        if(res.status){
          message.info('保存成功！');
          if(this.handler) this.handler.close();
          if(this.props.closeDialog) this.props.closeDialog();
        }
      })
    }
    
  }
  onEdit(){
    this.setState({readOnly: false})
  }
  render() {
    if(!this.state.data) return <Spin/>;
    return (
      <div style={this.props.style} className="order-dialog">
        <CustomerBaseInfo wrappedComponentRef={e=>{this.CustomerBaseInfo = e}} data={this.state.data} readOnly={this.state.readOnly}/>
        <ContractInfo ref={e=>{this.ContractInfo = e}} data={this.state.data} readOnly={this.state.readOnly}/>
        <PayInfo ref={e=>{this.PayInfo = e}} data={this.state.data} readOnly={this.state.readOnly}/>
        {this.state.readOnly? (isReandOnly(this.state.data.OrderStatus)?  null : <div style={{textAlign:'center'}}><Button type="primary" onClick={this.onEdit}>编辑</Button></div>)
          : <div style={{textAlign:'center'}}><Button type="primary" onClick={this.onSave}>保存并提交</Button></div>}
      </div>
    );
  }
}
function isReandOnly(status){
  if(status === 1 || status ===3 || status ===5){ //1.待审核，2.审单已审核，3.审单驳回，4财务已审核/ 网店到款（天猫）,5财务驳回,6.财务确认（天猫）
    return false;
  }
  return true;
}
export default Main
