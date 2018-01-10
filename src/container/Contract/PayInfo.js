import React from 'react'
import {Button, Select, Input, DatePicker, Row, Col, message } from 'antd'
import _ from 'lodash';
import moment from 'moment'

import Rif from '@/component/RIF'
import UploadFile from '@/container/UploadFile'

import Title from '@/component/Title'
import PayTypeSelect from '@/container/Contract/PayTypeSelect'
import ImageViewer from '@/component/ImageViewer'

const Option = Select.Option;

class PayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.data;
    this.setStateChange = this.setStateChange.bind(this);
  }
  setStateChange(obj){
    this.setState(obj,()=>{
      this.props.onChange(this.state);
    })
  }
  render(){
    if(this.props.readOnly){
      const data = this.props.data;
      return (
        <Row style={{lineHeight: '34px'}}>
          <Col key="pay1" span={5}><label className="ant-form-item-required">支付方式：</label><PayTypeSelect width={120} value={this.state.PayTypeId} readOnly/></Col>
          <Rif key="pay2" if={(+data.PayTypeId) !== 5}><Col span={5}><label className="ant-form-item-required">支付方账号：</label>{data.PayAccountNo}</Col></Rif>
          <Col key="pay3" span={5}><label className="ant-form-item-required">支付时间：</label>{data.PayTime && moment(data.PayTime).format('YYYY-MM-DD')}</Col>
          <Rif key="pay4" if={(+data.PayTypeId) !== 5}><Col span={5}><label className="ant-form-item-required">凭证：</label><ImageViewer src={data.PayImagePath} additional="?x-oss-process=image/resize,m_lfit,h_30,w_50"  /></Col></Rif>
        </Row>
      )
    }
    return (
      <Row style={{lineHeight: '34px'}}>
        <Col key="pay1" span={5}><label className="ant-form-item-required">支付方式：</label><PayTypeSelect width={120} value={this.state.PayTypeId} onChange={v=>{this.setStateChange({PayTypeId:v})}}/></Col>
        <Rif key="pay2" if={(+this.state.PayTypeId) !== 5}><Col span={5}><label className="ant-form-item-required">支付方账号：</label><Input style={{width:'110px'}} defaultValue={this.state.PayAccountNo} onBlur={v=>{this.setStateChange({PayAccountNo:v.target.value})}}/></Col></Rif>
        <Col key="pay3" span={5}><label className="ant-form-item-required">支付时间：</label><DatePicker style={{width:'120px'}} onChange={v=>{this.setStateChange({PayTime:v})}}/></Col>
        <Rif key="pay4" if={(+this.state.PayTypeId) !== 5}><Col span={5}><label className="ant-form-item-required">凭证：</label><UploadFile value={this.state.PayImagePath} additional="?x-oss-process=image/resize,m_lfit,h_35,w_50" onChange={v=>{this.setStateChange({PayImagePath:v})}}/></Col></Rif>
        <Col key="pay5" span={4}><Button size="small" onClick={this.props.onAdd}>添加</Button><Button size="small" onClick={this.props.onDelete}>删除</Button></Col>
      </Row>
    )
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    if(!props.data.OrderSourceId){
      this.state = {
        OrderSourceId: "1",
        PayInfoList: [{PayTypeId: 0,id:_.uniqueId('pid_')}]
      }
    }else{
      this.state = {
        OrderSourceId: ""+ props.data.OrderSourceId,
        PayInfoList: props.data.PayInfoList
      }
    }
    
    this.onFiledChange = this.onFiledChange.bind(this);
    this.getFieldsValue = this.getFieldsValue.bind(this);
    this.validateField = this.validateField.bind(this);
  }
  componentWillReceiveProps(nextProps){
    const data = nextProps.data;
    if(data){
      let nextState = _.pick(data, ['OrderSourceId', 'PayInfoList']);
      _.each(nextState.PayInfoList,pay=> {
        pay.id=_.uniqueId('pid_');
        if(pay.PayTime) pay.PayTime = moment(pay.PayTime)
      })
      this.setState(nextState);
    }
  }
  onAdd(index){
    let paylist = _.cloneDeep(this.state.PayInfoList);
    paylist.splice(index+1,0,{PayTypeId: 0,id:_.uniqueId('pid_')});
    this.setState({PayInfoList: paylist});
  }
  onDelete(index){
    let paylist = _.cloneDeep(this.state.PayInfoList);
    if(paylist.length ===0){
      message.info("支付信息不能为空！");
      return;
    }
    paylist.splice(index,1);
    this.setState({PayInfoList: paylist});
  }
  onFiledChange(index,value) {
    let paylist = _.cloneDeep(this.state.PayInfoList);
    if(_.isObject(value.PayTime)) value.PayTime = value.PayTime.format("YYYY-MM-DD"); 
    paylist[index] = value;
    this.setState({PayInfoList: paylist});
  }
  getFieldsValue(){
    return this.state;
  }
  validateField(){
    var data = this.state;
    if( (+data.OrderSourceId) === 2) return null;
    const paylist = data.PayInfoList;
    let msg;
    for(let i =0; i<paylist.length; i++){
      msg = validatePay(paylist[i])
      if(msg) return msg;
    }
    return;
    function validatePay(pay){
      if(!pay.PayTypeId) return "请选择支付方式！";
      if(!pay.PayTime) return "请选择支付时间！";
      if(5!==+pay.PayTypeId){
        if(!pay.PayAccountNo) return "请选择支付账号！";
        if(!pay.PayImagePath) return "请上传支付凭证！";
      }
      return;
    }
  }
  render() {
    return (
      <div>
        <Title title= '支付信息'/>
        <Row style={{padding: '12px 0'}}>
          <Col span={3}>
            <label>订单来源：</label>
            <Select value={this.state.OrderSourceId} style={{width:'80px'}} disabled={this.props.readOnly} onChange={v=>{this.setState({OrderSourceId:v})}}>
              <Option key={"1"}>电销</Option>
              <Option key={"2"}>天猫</Option>
            </Select>
          </Col>
          {(+this.state.OrderSourceId) ===1 &&(
            <Col span={20}>
              {this.state.PayInfoList.map((pay,index)=>{
                return <PayInfo readOnly={this.props.readOnly} key={pay.id || pay.Id} data={pay} onChange={v=>this.onFiledChange(index,v)} onAdd={()=>{this.onAdd(index)}} onDelete={()=>{this.onDelete(index)}}/>
              })}
            </Col>
            )
          }
        </Row>
      </div>
    );
  }
}

export default Main
