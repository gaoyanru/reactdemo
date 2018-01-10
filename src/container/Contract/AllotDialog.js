import React, { Component } from 'react'
import { Tabs, List, Spin, message, Button } from 'antd'
import { getListData, putData } from '@/api'
import ViewCustomer from '@/container/Contract/ViewCustomer'
import EditCustomer from '@/container/Contract/EditCustomer'
import OrderAll from '@/container/Contract/OrderAll'
import OutWork from '@/container/Contract/OutWork'
import _ from 'lodash'
import AllotInfo from '@/container/Contract/AllotInfo'
import CurrentOrderInfo from '@/container/Contract/CurrentOrderInfo'

const TabPane = Tabs.TabPane;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null,
      customerInfo: null,
      activeKey: "1",
      isEditing: false,
    }
    this.getOrderInfo = this.getOrderInfo.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.setEditing = this.setEditing.bind(this);
    this.getOrderInfo()
    this.closeDialog = this.closeDialog.bind(this);
  }
  closeDialog(){
    this.handler.close();
  }
  refresh(){
    this.forceUpdate();
  }
  getOrderInfo(){
    const row = this.props.row;
    getListData('customerdetail/'+ this.props.row.OrderId).then(res=>{
      res.data = _.extend(res.data, row);
      this.setState({
        customerInfo: res.data
      })
    })
    getListData('order/'+ this.props.row.OrderId).then(res=>{
      res.data = _.extend(res.data, row);
      this.setState({
        orderInfo: res.data
      })
    })
  }
  setEditing(){
    if(this.state.isEditing){
      let data = this.editform.getFieldsValue();
      if(!data.AreaCode){
        message.error('请选择区域');
        return;
      }
      putData(`Customer/update/${data.Id}?syncDate=`,data).then(res=>{
        if(res.status){
          message.info('保存成功!');
          this.setState({
            customerInfo: {...data}
          });
        }
      });
    }
    this.setState((preState)=>{
      return {
        isEditing: !preState.isEditing
      }
    });
  }
  onTabClick(arg){
    this.setState({activeKey:arg});
  }
  render() {
    return(
      <div style={this.props.style} className="company-dialog">
        <AllotInfo row={this.state.customerInfo} closeDialog={this.closeDialog} />
        <div>
          <Tabs type="card" style={{width: '100%'}} activeKey={this.state.activeKey} onTabClick={this.onTabClick}>
            <TabPane tab="公司信息" key="1">
              { this.state.orderInfo && this.state.orderInfo.ServiceStatus < 13 && <Button type="primary" style={{float:'right'}} onClick={this.setEditing}>{this.state.isEditing?'保存':'编辑'}</Button> }
              { this.state.customerInfo?(this.state.isEditing? <EditCustomer data={this.state.customerInfo} wrappedComponentRef={view=>{this.editform = view;}}/>:<ViewCustomer data={this.state.customerInfo}/>):<Spin/> }
              { this.state.orderInfo?(<CurrentOrderInfo data={this.state.orderInfo}/>):<Spin/> }
            </TabPane>
            <TabPane tab="订单汇总信息" key="2">
              <OrderAll companyId={this.props.companyId}/>
            </TabPane>
            <TabPane tab="外勤任务" key="3">
              <OutWork companyId={this.props.companyId}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default Main
