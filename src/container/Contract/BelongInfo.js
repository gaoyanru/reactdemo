import React, { Component } from 'react'
import Title from '@/component/Title';
import {fOrderStatus } from '@/config/filters'

class Main extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    const style = {marginLeft: '70px'}
    return(
      <div>
        <Title title= '归属信息'/>
        <div style={{padding: '10px 0'}}>
          <span style={style}>订单号：</span>{data.OrderNo}
          <span style={style}>所属公司：</span>{data.SubsidiaryName}
          <span style={style}>订单状态：</span>{fOrderStatus(data.OrderStatus, data.OrderSourceId)}
        </div>
      </div>
    )
  }
}

export default Main
