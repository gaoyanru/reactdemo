import React from 'react'
import { Spin, message, Button, Modal, Input, DatePicker, Row, Col } from 'antd'
import _ from 'lodash';
import moment from 'moment'

import Title from '@/component/Title'
import AddedValue from '@/container/searchComponent/AddedValue'
import MainItemSelect from '@/container/Contract/MainItemSelect'
import ChildItemSelect from '@/container/Contract/ChildItemSelect'

class Accounting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    }
    this.setFieldValue = this.setFieldValue.bind(this);
    this.getFieldValue = this.getFieldValue.bind(this);
    this.validateField = this.validateField.bind(this);

  }
  setFieldValue(obj){
    let data = _.cloneDeep(this.state.data);
    data = _.extend(data,obj);
    this.setState({data},()=>{
      if('Amount' in obj){
        this.props.onAmountChange();
      }
    });
  }
  validateField(){
    const data = this.state.data;
    if(!data.ContractNo) return '请填写合同编号';
    if(_.find(data.items,item=>!item.ChildItemId)) return '请选择子项目';
    if(!data.OrderMonths) return '请填写服务期限';
    if(!data.Amount) return '请填写费用金额';
    return null
  }
  getFieldValue(){
    return this.state.data;
  }
  render(){
    const data = this.props.data;
    if(this.props.readOnly){
      return(
        <tbody className="ant-table-tbody" key="group1">
          <tr className="ant-table-row">
            <td>{data.ContractNo}</td>
            <td>记账报税</td>
            <td>{data.ChildItemId === 1?"小规模": "一般纳税人"}</td>
            <td>{data.Amount}</td>
            <td>{data.Remark}</td>
            <td></td>
          </tr>
          <tr className="ant-table-row" >
            <td colSpan="6" style={{background:'#f8d795',padding:'3px 12px'}}>
              <span>服务期限:{data.OrderMonths} + {data.GiftMonth||0 }</span>
            </td>
          </tr>
        </tbody>);
    }else{
      return (<tbody className="ant-table-tbody" key="group1">
          <tr className="ant-table-row">
            <td><Input size="small" defaultValue={data.ContractNo} onChange={e=>{this.setFieldValue({ContractNo:e.target.value})}} /></td>
            <td>记账报税</td>
            <td><AddedValue size="small" hideAll={true} value={data.ChildItemId} onChange={v=>{this.setFieldValue({ChildItemId: +v})}}  /></td>
            <td><Input size="small" defaultValue={data.Amount} onChange={e=>{this.setFieldValue({Amount:e.target.value})}}/></td>
            <td><Input size="small" maxLength="50" defaultValue={data.Remark} onChange={e=>{this.setFieldValue({Remark:e.target.value})}}/></td>
            <td><Button size="small" onClick={this.props.onDelete}>删除</Button></td>
          </tr>
          <tr className="ant-table-row">
            <td colSpan="6" style={{background:'#f8d795',padding:'3px 12px'}}>
              <span>服务期限：
                <Input maxLength="2" size="small" defaultValue={data.OrderMonths} style={{width: '35px'}} onChange={e=>{this.setFieldValue({OrderMonths:e.target.value})}}/>
                +
                <Input maxLength="1" size="small" defaultValue={data.GiftMonth} style={{width: '25px'}} onChange={e=>{this.setFieldValue({GiftMonth:e.target.value})}}/>
              </span>
            </td>
          </tr>
        </tbody>);
    }

  }
}

class AddedService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    }
    this.setFieldValue = this.setFieldValue.bind(this);
    this.getFieldValue = this.getFieldValue.bind(this);
    this.validateField = this.validateField.bind(this);
  }
  setContractNo(obj){
    let data = _.cloneDeep(this.state.data);
    data = _.extend(data,obj);
    this.setState({data});
  }
  setFieldValue(index, obj){
    let data = _.cloneDeep(this.state.data);
    data.items[index] = _.extend(data.items[index],obj);
    this.setState({data}, ()=>{
      if('Amount' in obj){
        this.props.onAmountChange();
      }
    });
  }
  onAdd(index){
    let data = _.cloneDeep(this.state.data);
    data.items.splice(index+1,0,{id:_.uniqueId('p3_')});
    this.setState({data});
  }
  onDelete(index){
    let data = _.cloneDeep(this.state.data);
    data.items.splice(index,1);
    this.setState({data});
    if(data.items.length === 0){
      this.props.onDelete(2);
    }
  }
  validateField(){
    const data = this.state.data;
    if(!data.ContractNo) return '请填写合同编号';
    if(_.find(data.items,item=>!item.MainItemId)) return '请选择主项目';
    if(_.find(data.items,item=>!item.ChildItemId)) return '请选择子项目';
    if(_.find(data.items,item=>!item.Amount)) return '请填写费用金额';
    return null
  }
  getFieldValue(){
    const data = this.state.data;
    return _.map(data.items,(item)=>{
      return _.extend(item,_.pick(data,['ContractNo','Group']));
    });
  }
  render(){
    const data = this.state.data;
    if(this.props.readOnly){
      return(
        <tbody className="ant-table-tbody" key="group3">
          {data.items.map((item,index)=>{
          return(
            <tr className="ant-table-row" key={item.id}>
              {index===0 && <td rowSpan={data.items.length}>{data.ContractNo}</td>}
              <td><MainItemSelect disabled size="small" defaultValue={item.MainItemId} onChange={v=>{this.setFieldValue(index,{MainItemId: +v});}}/></td>
              <td><ChildItemSelect disabled={true} size="small" mainId={item.MainItemId}  defaultValue={item.ChildItemId } onChange={v=>{this.setFieldValue(index,{ChildItemId: +v})}} /></td>
              <td>{item.Amount}</td>
              <td>{data.Remark}</td>
              <td></td>
            </tr>
          );
        })}
        </tbody>);
    }else{
      return (<tbody className="ant-table-tbody" key="group3">
        {data.items.map((item,index)=>{
          return(
            <tr className="ant-table-row"  key={item.id}>
              {index===0 && <td rowSpan={data.items.length}><Input size="small" defaultValue={data.ContractNo} onChange={e=>{this.setContractNo({ContractNo:e.target.value})}} /></td>}
              <td><MainItemSelect size="small" defaultValue={item.MainItemId} onChange={v=>{this.setFieldValue(index,{MainItemId: +v});}}/></td>
              <td><ChildItemSelect disabled={false} size="small" mainId={item.MainItemId}  defaultValue={item.ChildItemId } onChange={v=>{this.setFieldValue(index,{ChildItemId: +v})}} /></td>
              <td><Input size="small" defaultValue={data.Amount} onChange={e=>{this.setFieldValue(index,{Amount:e.target.value})}}/></td>
              <td><Input size="small" maxLength="50" defaultValue={data.Remark} onChange={e=>{this.setFieldValue(index,{Remark:e.target.value})}}/></td>
              <td><Button size="small" onClick={this.onAdd.bind(this,index)}>添加子项目</Button><Button size="small" onClick={this.onDelete.bind(this,index)}>删除</Button></td>
            </tr>
          );
        })}
        </tbody>);
    }

  }
}
class Others extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    }
    this.setFieldValue = this.setFieldValue.bind(this);
    this.getFieldValue = this.getFieldValue.bind(this);
    this.validateField = this.validateField.bind(this);
  }
  setContractNo(obj){
    let data = _.cloneDeep(this.state.data);
    data = _.extend(data,obj);
    this.setState({data})
  }
  setFieldValue(index, obj){
    let data = _.cloneDeep(this.state.data);
    data.items[index] = _.extend(data.items[index],obj);
    this.setState({data}, ()=>{
      if('Amount' in obj){
        this.props.onAmountChange();
      }
    });
  }
  onAdd(index){
    let data = _.cloneDeep(this.state.data);
    data.items.splice(index+1,0,{MainItemId:4,id:_.uniqueId('p4_')});
    this.setState({data});
  }
  onDelete(index){
    let data = _.cloneDeep(this.state.data);
    data.items.splice(index,1);
    this.setState({data});
    if(data.items.length === 0){
      this.props.onDelete(2);
    }
  }
  validateField(){
    const data = this.state.data;
    if(!data.ContractNo) return '请填写合同编号';
    if(_.find(data.items,item=>!item.ChildItemId)) return '请选择子项目';
    if(_.find(data.items,item=>!item.Amount)) return '请填写费用金额';
    return null
  }
  getFieldValue(){
    const data = this.state.data;
    return _.map(data.items,(item)=>{
      return _.extend(item,_.pick(data,['ContractNo']));
    });
  }
  render(){
    const data = this.state.data;
    if(this.props.readOnly){
      return(
        <tbody className="ant-table-tbody" key="group4">
          {data.items.map((item,index)=>{
          return(
            <tr className="ant-table-row"  key={item.id}>
              {index===0 && <td rowSpan={data.items.length}>{data.ContractNo}</td>}
              <td>代收费</td>
              <td><ChildItemSelect disabled size="small" mainId={4}  defaultValue={item.ChildItemId}/></td>
              <td>{item.Amount}</td>
              <td>{data.Remark}</td>
              <td></td>
            </tr>
          );
        })}
        </tbody>);
    }else{
      return (<tbody className="ant-table-tbody" key="group4">
        {data.items.map((item,index)=>{
          return(
            <tr className="ant-table-row" key={item.id}>
              {index===0 && <td rowSpan={data.items.length}><Input size="small" defaultValue={data.ContractNo} onChange={e=>{this.setContractNo({ContractNo:e.target.value})}} /></td>}
              <td>代收费</td>
              <td><ChildItemSelect size="small" mainId={4}  defaultValue={item.ChildItemId} onChange={v=>{this.setFieldValue(index,{ChildItemId: +v})}} /></td>
              <td><Input size="small" defaultValue={data.Amount} onChange={e=>{this.setFieldValue(index,{Amount:e.target.value})}}/></td>
              <td><Input size="small" maxLength="50" defaultValue={data.Remark} onChange={e=>{this.setFieldValue(index,{Remark:e.target.value})}}/></td>
              <td><Button size="small" onClick={this.onAdd.bind(this,index)}>添加子项目</Button><Button size="small" onClick={this.onDelete.bind(this,index)}>删除</Button></td>
            </tr>
          );
        })}
        </tbody>);
    }

  }
}


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeVisible: false,
      type1: null,
      type2: null,
      type3: null,
      ContractDate: null,
      Remark: '',
      BookKeepFeed: 0,
      FinanceServiceFeed: 0,
      OutWorkServiceFeed: 0,
      AgentFeed: 0,
      Amount: 0
    }
    this.onTypeSelect = this.onTypeSelect.bind(this);
    this.validateType = this.validateType.bind(this);
    this.delete = this.delete.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.formatData = this.formatData.bind(this);
    const state = this.formatData(props.data);
    this.state = _.extend(this.state,state);
  }
  componentWillReceiveProps(nextProps){
    const data = nextProps.data;
    const state = this.formatData(data);
    this.setState(state);
  }
  formatData(data){
    if(data){
      let nextState = _.pick(data, ['ContractDate', 'Remark', 'BookKeepFeed', 'FinanceServiceFeed', 'OutWorkServiceFeed','AgentFeed','Amount']);
      console.log(nextState, 'nextState')
      nextState.ContractDate = moment(nextState.ContractDate);
      const crmOrderItems = data.CrmOrderItems || data.Contracts;
      let type1 = _.find(crmOrderItems,{MainItemId:1});
      if(type1) type1.Group = 1;
      let type2 = {
        Group: 2,
        items: _.chain(crmOrderItems).filter(item=>(item.MainItemId ===2 || item.MainItemId===3)).each(item=>(item.id =_.uniqueId('p3_'))).value()
      };
      if(type2.items.length === 0)
        type2 = null;
      else
        type2 = _.extend(type2, _.pick(type2.items[0], ['ContractNo','Amount','Remark']));
      let type3 = {
        Group: 3,
        items: _.chain(crmOrderItems).filter(item=>(item.MainItemId === 4)).each(item=>(item.id =_.uniqueId('p4_'))).value()
      };
      if(type3.items.length === 0)
        type3 = null;
      else
        type3 = _.extend(type3, _.pick(type3.items[0], ['ContractNo','Amount','Remark']));
      return {
        ...nextState,
        type1,
        type2,
        type3
      };
    }
    return null;
  }
  validateField(){
    let result;
    if(this.component1){
      result = this.component1.validateField();
      if(result) return result;
    }
    if(this.component2){
      result = this.component2.validateField();
      if(result) return result;
    }
    if(this.component3){
      result = this.component3.validateField();
      if(result) return result;
    }
    return result;
  }
  getFieldsValue(){
    let result = [];
    if(this.component1){
      result.push(this.component1.getFieldValue())
    }
    if(this.component2){
      result = result.concat(this.component2.getFieldValue())
    }
    if(this.component3){
      result = result.concat(this.component3.getFieldValue())
    }
    let others = _.pick(this.state,['ContractDate','Remark','BookKeepFeed','FinanceServiceFeed','OutWorkServiceFeed','AgentFeed','Amount']);
    if(_.isObject(others.ContractDate)) others.ContractDate = others.ContractDate.format('YYYY-MM-DD')
    return {
      CrmOrderItems: result,
      ...others
    };
  }
  setAmount(){
    let amount = {BookKeepFeed: 0,
      FinanceServiceFeed: 0,
      OutWorkServiceFeed: 0,
      AgentFeed: 0,
      Amount: 0
    };
    if(this.component1){
      amount.BookKeepFeed = +this.component1.getFieldValue().Amount;
    }
    if(this.component2){
      const fields2Value = this.component2.getFieldValue();
      _.each(fields2Value,(item)=>{
        if(item.MainItemId === 2){
          amount.FinanceServiceFeed += +(item.Amount||0);
        }
        if(item.MainItemId === 3){
          amount.OutWorkServiceFeed += +(item.Amount||0);
        }
      });
    }
    if(this.component3){
      const fields3Value = this.component3.getFieldValue();
      _.each(fields3Value,(item)=>{
          amount.AgentFeed += +(item.Amount||0);
      });
    }
    amount.Amount = amount.BookKeepFeed + amount.FinanceServiceFeed + amount.OutWorkServiceFeed + amount.AgentFeed;
    this.setState(amount);
  }
  onTypeSelect(type){
    if(!this.validateType(type)) return;
    if(type === 1){
      const item = {
        Group: 1,
        MainItemId: 1
      }
      this.setState({typeVisible: false, type1: item});
    }else if(type === 2){
      const item = {
        Group: 2,
        items :[{id:_.uniqueId('p3_')}]
      }
      this.setState({typeVisible: false, type2: item});
    }else if(type === 3){
      const item = {
        Group: 3,
        items :[{MainItemId:4,id:_.uniqueId('p4_')}]
      }
      this.setState({typeVisible: false, type3: item});
    }
  }
  delete(type){
    let obj = {};
    obj['type'+type] = null
    this.setState(obj);
  }
  validateType(type){
    if(this.state['type' + type]) return false;
    return true;
  }
  render() {
    const AddNew = <Button size="small" type="primary" disabled={this.props.readOnly} onClick={e=>{this.setState({typeVisible: true})}}>添加合同</Button>;
    return (
      <div>
        {(!this.props.hideTitle) && <Title title= '合同信息' addon={AddNew}/>}
        <div className="ant-table ant-table-middle ant-table-bordered ant-table-scroll-position-left">
          <div className="ant-table-content">
            <div className="ant-table-body">
              <table className="">
                <thead className="ant-table-thead">
                  <tr>
                    <th style={{width: '200px'}}><span>合同编号</span></th>
                    <th style={{width: '150px'}}><span>项目</span></th>
                    <th style={{width: '200px'}}><span>子项目</span></th>
                    <th style={{width: '100px'}}><span>费用</span></th>
                    <th><span>备注</span></th>
                    <th style={{width: '160px'}}><span>操作</span></th>
                  </tr>
                </thead>
                {this.state.type1 && <Accounting readOnly={this.props.readOnly} onAmountChange={this.setAmount} ref={e=>{this.component1 = e}} data={this.state.type1} onDelete={e=>{this.delete(1)}}/>}
                {this.state.type2 && <AddedService readOnly={this.props.readOnly} onAmountChange={this.setAmount} ref={e=>{this.component2 = e}} data={this.state.type2} onDelete={e=>{this.delete(2)}}/>}
                {this.state.type3 && <Others readOnly={this.props.readOnly} onAmountChange={this.setAmount} ref={e=>{this.component3 = e}} data={this.state.type3} onDelete={e=>{this.delete(3)}}/>}
                 {(!this.props.hideTitle) && <tfoot>
                  <tr>
                    <td colSpan={6} style={{background:'#ccc',lineHeight:'34px'}}>
                      <Row>
                        <Col span={3}><label>记账报税费用：{this.state.BookKeepFeed}</label></Col>
                        <Col span={3}><label>财务服务费用：{this.state.FinanceServiceFeed }</label></Col>
                        <Col span={3}><label>外勤服务费用：{this.state.OutWorkServiceFeed }</label></Col>
                        <Col span={3}><label>代收费用：{this.state.AgentFeed }</label></Col>
                        <Col span={3}><label>订单总金额：{this.state.Amount }</label></Col>
                        <Col span={6}><label className="ant-form-item-required">签订日期：</label><DatePicker disabled={this.props.readOnly} value={this.state.ContractDate} onChange={v=>{this.setState({ContractDate:v})}}/>  </Col>
                      </Row>
                    </td>
                  </tr>
                </tfoot>}
              </table>
            </div>
          </div>
        </div>
        <Row style={{padding: '12px 0'}}>
          <Col span={2}><label>备注信息：</label></Col>
          <Col span={22}><Input.TextArea readOnly={this.props.readOnly} value={this.state.Remark} onChange={v=>{this.setState({Remark:v.target.value})}}/></Col>
        </Row>
        <Modal title= "合同类型"
            width= {400}
            visible={this.state.typeVisible}
            onCancel={(e)=>{this.setState({typeVisible: false})}}
            footer={null}
            maskClosable={false}>
            <div className="ant-row ant-form-item">
              <h2 style={{textAlign:'center',cursor:'pointer',margin:"6px 0",background:this.validateType(1)?'#aae2f6':'#ccc',padding:'12px'}} onClick={e=>{this.onTypeSelect(1)}}>
                记账报税
              </h2>
              <h2 style={{textAlign:'center',cursor:'pointer',margin:"6px 0",background:this.validateType(2)?'#aae2f6':'#ccc',padding:'12px'}} onClick={e=>{this.onTypeSelect(2)}}>
                增值
              </h2>
              <h2 style={{textAlign:'center',cursor:'pointer',margin:"6px 0",background:this.validateType(3)?'#aae2f6':'#ccc',padding:'12px'}} onClick={e=>{this.onTypeSelect(3)}}>
                代收
              </h2>
            </div>
        </Modal>
      </div>
    );
  }
}

export default Main
