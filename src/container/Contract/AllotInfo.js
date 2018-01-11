import React, { Component } from 'react'
import { Button, Row, Col, message, Form, Modal, DatePicker, Radio, Spin } from 'antd'
import HasPower from '@/container/HasPower'
import {fServiceStatus, fAccountantStatus, fCheckStatus } from '@/config/filters'
import Confirm from '@/component/Confirm'
import { putData, postData } from '@/api'
import _ from 'lodash'

import Dialog from '@/container/Dialog'
import PartSelectDialog from '@/container/Contract/PartSelectDialog';
import OutworkerTask from '@/container/Outworker/Task'
import TaskListWeight from '@/container/Outworker/TaskListWeight';





class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initRow: props.row,
      visible: false
    }
    this.AccountCheck = this.AccountCheck.bind(this);
    this.OutworkerCheck = this.OutworkerCheck.bind(this);
  }

  AccountCheck(){
    const item = this.state.initRow;
    let isOnlyPartChoose;
    if (item.DisableCommitAccount == 0 && item.DisableOutWorkCommitAccount == 1) {
      isOnlyPartChoose = true
    } else {
      isOnlyPartChoose = false
    }
    Dialog({
        content: <PartSelectDialog onlyAll={isOnlyPartChoose} ref={view=>{this.view = view}}/>,
        width: 500,
        confirmLoading: false,
        handleOk: ()=>{
          const result = this.view.getValues();
          return result;
        },
        title: '提交会计'
    }).result.then((select)=>{
       //$http.put('/api/order/audit/toaccountant/' + $scope.postData.orderId + '/?partTax=' + $scope.partT ).success(function(res) {
      const data = this.state.initRow;
      putData(`order/audit/toaccountant/${data.OrderId}/?partTax=${select.select1}`).then(res=>{
        if(res.status){
          if(select.select1){
            if(data.AccountantStatus == 4 && data.OutWorkerStatus != 3){
              this.props.closeDialog();
              return;
            }
            if(data.AccountantStatus != 3){
              this.OutworkerCheck()
              return;
            }
          }
          this.props.closeDialog()
        }
      })

    },()=>{});
  }
  OutworkerCheck() {
    const customer = {
      Customer:{
        CompanyName: this.props.row.CompanyName,
        Id: this.props.row.customerId
      },
       AreaCode: this.props.row.AreaCode
    };
    Dialog({
      content: <OutworkerTask data={customer}  wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
      width: 1200,
      handleOk: ()=>{
          return new Promise((resolve, reject) => {
              const formdata = this.crmform.getFieldsValue();
              let taskform;
              if(formdata){
                  if(formdata.Task.CommonTaskId === 0){
                      Dialog({
                          content: <TaskListWeight data={formdata.Task.ChildTasks}  ref={form =>{if(form)taskform = form;}}/>,
                          width: 600,
                          handleOk: ()=>{
                              if(_.uniqBy(taskform.data,'Weight').length< taskform.data.length){
                                  message.error('权重不允许重复！')
                                  return false;
                              }
                              return true;
                          },
                          confirmLoading: false,
                          handleCancel (){
                          },
                          title: "修改权重" 
                      }).result.then(()=>{
                          formdata.Task.ChildTasks = taskform.data;
                          saveData();
                      },reject);
                  }else{
                      saveData();
                  }
              }else{
                  reject(); 
              }

              function saveData(){
                  _.each(formdata.Task.ChildTasks, item => {
                      item.CustomerId = formdata.Customer.Id
                  });
                  postData('maintask', {
                      ...formdata.Task, 
                      AreaCode: formdata.AreaCode, 
                      MainTaskName: formdata.MainTaskName, 
                      CustomerId: formdata.Customer.Id 
                  }).then(res=>{
                      if(res.status){
                          resolve()
                      }else{
                         reject(); 
                      }
                  },reject);
              }
          });
      },
      confirmLoading: false,
      handleCancel (){
          console.log('onCancel')
      },
      title: "添加任务" 
    }).result.then(()=>{
      this.props.closeDialog()
    },()=>{});
  }
  componentWillReceiveProps(nextProps){
    const data = nextProps.row;
    if(data){
      this.setState({initRow: data});
    }
  }
  render() {
    if(!this.state.initRow) return <Spin/>
    const data = this.state.initRow;
    return(
      <div>
        <Row className="company-info">
          <Col span={22}>
            <Row>
             <label>序列ID:</label>{data.SequenceNo}
             <label>公司名称:</label>{data.CompanyName}
             <label>当前服务日期:</label>{data.ServiceStart} - {data.ServiceEnd}
            </Row>
            <Row>
            <label>服务状态:</label>{fServiceStatus(data.ServiceStatus)}
             <label>外勤审核状态:</label>{fCheckStatus(data.OutWorkerStatus)}
             <label>会计审核状态:</label>{fAccountantStatus(data.AgentStatus)}
            </Row>
          </Col>
          <Col span={2}>
            <Button.Group>
              <HasPower power="TOKJ"  key={"btn_TOKJ"}>
                <Button type="primary" disabled={data.DisableCommitAccount == 1 || data.OrderStatus == 7 || data.OrderStatus == 8} onClick={this.AccountCheck.bind(this)}>审核提交会计</Button>
              </HasPower>
              <HasPower power="TOWQ"  key={"btn_TOWQ"}>
                <Button type="primary" disabled={data.DisableOutWorkCommitAccount == 1 || data.OrderStatus == 7 || data.OrderStatus == 8} onClick={this.OutworkerCheck}>审核提交外勤</Button>
              </HasPower>
            </Button.Group>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Main
