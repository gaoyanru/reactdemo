import React, { Component } from 'react'
import { Button, Row, Col, message, Form, Modal, DatePicker } from 'antd'
import HasPower from '@/container/HasPower'
import {fServiceStatus, fAccountantStatus, fCheckStatus } from '@/config/filters'
import Confirm from '@/component/Confirm'
import { putData, postData } from '@/api'
import SetServiceMonth from '@/container/Contract/SetServiceMonth'
import store from '@/store'
import Dialog from '@/container/Dialog'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initRow: {},
      visible: false
    }
    this.AccountCheck = this.AccountCheck.bind(this);
    this.AccountCheckSecond = this.AccountCheckSecond.bind(this);
    this.onReject = this.onReject.bind(this);
    console.log(store, 'xxx')
  }
  AccountCheck = () => {
    Dialog({
        content: <SetServiceMonth data={this.props.row}/>,
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
    const OrderId = this.props.row.OrderId
    Confirm({
        handleOk:()=>{
          putData('order/audit/reject/' + OrderId).then(res => {
            if (res.status) {
              // 关闭上一个弹窗并且刷新列表
            }
          })
        },
        message: '确认要驳回吗？'
    })
  }
  componentWillMount() {
    this.setState({initRow: this.props.row}, () => {
      console.log(this.state.initRow, 'initRow')
    })
  }
  render() {
    const data = this.state.initRow;
    console.log(data.ServiceStart, data.AccountantStatus, 'render')
    return(
      <div>
        <Row className="company-info">
          <Col span={22}>
             <label>序列ID:</label>{data.SequenceNo}
             <label>公司名称:</label>{data.CompanyName}
             <label>当前服务日期:</label>{data.ServiceStart} - {data.ServiceEnd}
             <label>服务状态:</label>{fServiceStatus(data.ServiceStatus)}
             <label>外勤审核状态:</label>{fCheckStatus(data.OutWorkerStatus)}
             <label>会计审核状态:</label>{fAccountantStatus(data.AgentStatus)}
          </Col>
          <Col span={2}>
            <Button.Group>
              {(data.ServiceStart && data.AccountantStatus != 1) && <HasPower power="REVIEW"  key={"btn_REVIEW"}>
                <Button type="primary" onClick={this.AccountCheck}>会计审核</Button>
              </HasPower>}
              {(data.ServiceStart && data.AccountantStatus == 1) && <HasPower power="REVIEW"  key={"btn_REVIEW"}>
                <Button type="primary" onClick={this.AccountCheckSecond}>二次会计审核</Button>
              </HasPower>}
              <HasPower power="REJECT"  key={"btn_REJECT"}>
                {(data.AccountantStatus != 1) && <Button type="primary" onClick={this.onReject}>会计驳回</Button>}
              </HasPower>
            </Button.Group>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Main
