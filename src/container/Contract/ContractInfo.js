import React, { Component } from 'react'
import { Button, Row, Col, message, Form, Modal, DatePicker } from 'antd'
import HasPower from '@/container/HasPower'
import {fServiceStatus, fAccountantStatus, fCheckStatus } from '@/config/filters'
import Confirm from '@/component/Confirm'
import { putData, postData } from '@/api'
import SetServiceMonth from '@/container/Contract/SetServiceMonth'
import store from '@/store'
import Dialog from '@/container/Dialog'
import _ from 'lodash'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initRow: {},
      visible: false,
      setFirstMonth: ''
    }
    this.AccountCheck = this.AccountCheck.bind(this);
    this.AccountCheckSecond = this.AccountCheckSecond.bind(this);
    this.onReject = this.onReject.bind(this);
    console.log(store, 'xxx')
  }
  AccountCheck = () => {
    Dialog({
        content: <SetServiceMonth data={this.state.initRow}/>,
        width: 500,
        confirmLoading: false,
        footer: null,
        title: '设置首报月'
    }).result.then(()=>{
        // 关闭弹窗后
    },()=>{});
  }

  closeAll () {

  }
  AccountCheckSecond() {
    const info = this.state.initRow
    var AccountantTaskSource = info.AccountantTaskSource,
    PartTax = info.PartTax,
    ServiceStatus = info.ServiceStatus,
    ServiceStart = info.ServiceStart.replace('/', '-'),
    ServiceEnd = info.ServiceEnd.replace('/', '-');
    putData('order/audit/pass/' + info.OrderId + '?accountantTaskSource=' + AccountantTaskSource + '&partTax=' + PartTax + '&serviceStatus=' + ServiceStatus + '&serviceStartDate=' + ServiceStart + '&serviceEndDate=' + ServiceEnd).then(res => {
      if (res.status) {
        message.info('审核成功！');
        // 关闭上一个弹窗并且刷新列表
      }
    })
  }
  onReject() {
    const OrderId = this.props.data.OrderId
    Confirm({
        handleOk:()=>{
          putData('order/audit/reject/' + OrderId).then(res => {
            if (res.status) {
              // 关闭上一个弹窗并且刷新列表
              message.info('驳回成功！');
              store.dispatch({
                type: 'set contract account modal status',
                status: {
                  modal1: false,
                  modal2: false
                }
              })
            }
          })
        },
        message: '确认要驳回吗？'
    })
  }
  componentWillMount() {
    this.setState({initRow: this.props.data}, () => {
      console.log(this.state.initRow, 'initRow')
      var setFirstMonth = _.filter(this.state.initRow.CrmOrderItems, {
        "ChildItemId": 1,
        "MainItemId": 1
      })
      this.setState({setFirstMonth: setFirstMonth})
      console.log(setFirstMonth, 'setFirstMonth')
      if (setFirstMonth && setFirstMonth.length) {
        this.setState({isSetFirstMonth: true})
      } else {
        this.setState({isSetFirstMonth: false})
      }
    })
  }
  render() {
    const data = this.state.initRow;
    // console.log(data.ServiceStart, data.AccountantStatus, 'render')
    console.log(data.AccountantStatus !== 1)
    console.log(data.AccountantStatus !== 3)
    return(
      <div>
        <Row className="company-info">
          <Col span={22}>
             <label>序列ID:</label>{data.SequenceNo}
             <label>公司名称:</label>{data.CompanyName}
             <label>当前服务日期:</label>{data.ServiceStart} - {data.ServiceEnd}
             <label>服务状态:</label>{fServiceStatus(data.ServiceStatus)}
             <label>外勤审核状态:</label>{fCheckStatus(data.OutWorkerStatus)}
             <label>会计审核状态:</label>{fAccountantStatus(data.AccountantStatus)}
          </Col>
          <Col span={2}>
            <Button.Group>
              {(this.state.isSetFirstMonth) && <HasPower power="REVIEW"  key={"btn_REVIEW"}>
                <Button type="primary" onClick={this.AccountCheck} disabled={data.AccountantStatus === 2}>会计审核</Button>
              </HasPower>}
              {(!this.state.isSetFirstMonth) && <HasPower power="REVIEW"  key={"btn_REVIEW"}>
                <Button type="primary" onClick={this.AccountCheckSecond} disabled={data.AccountantStatus === 2}>会计审核</Button>
              </HasPower>}
             <HasPower power="REJECT"  key={"btn_REJECT"}>
                <Button type="primary" onClick={this.onReject} disabled={data.AccountantStatus === 2}>会计驳回</Button>
              </HasPower>
            </Button.Group>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Main
