import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm'
import BelongCompany from '@/container/searchComponent/BelongCompany'
import { getListData } from '@/api'
import { Table, Button, Tabs } from 'antd'
import HasPower from '@/container/HasPower'
import OrderTable from '@/container/Contract/OrderTable'
import _ from 'lodash'
import { fDate, fOrderSource, fOrderStatus } from '@/config/filters'
import OrderDialog from '@/container/Contract/OrderDialog'
import Dialog from '@/container/Dialog'
import ReviewOrderDialog from '@/container/Contract/ReviewOrderDialog'

const TabPane = Tabs.TabPane;

let search = {
    items: [{
        label: '订单号',
        type: 'text',
        field: 'orderNo'
    }, {
        label: '甲方',
        type: 'text',
        field: 'companyname'
    }, {
        label: '联系人',
        type: 'text',
        field: 'connector'
    }, {
        label: '签单销售',
        type: 'text',
        field: 'OrderSalesName'
    }, {
        label: '订单状态',
        type: 'select',
        field: 'orderStatus',
        data:{
          0: "全部",
          2: "待审核",
          4: "已审核",
          5: "已驳回"
        },
        defaultValue: '0'
    }, {
        label: '订单来源',
        type: 'select',
        field: 'orderSource',
        data:{
          0: "全部",
          1: "电销",
          2: "天猫"
        },
        defaultValue: '0'
    },  {
        label: '合同编号',
        type: 'text',
        field: 'contractNO'
    }, {
        label: '签订日期',
        type: 'date',
        field: 'starttime'
    }, {
        label: '至',
        type: 'date',
        field: 'endtime'
    }],
    buttons:[]
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: {}
    };
    this.onSearch = this.onSearch.bind(this);
    this.addNew = this.addNew.bind(this);
    this.viewOrder = this.viewOrder.bind(this);
  }

  onSearch(res) {
    this.setState({searchParams: res});
  }
  addNew(){
    const dialog = Dialog({
        content: <OrderDialog handler={dialog} ref={e=>{ e && (e.handler = dialog)}}/>,
        width: 1300,
        confirmLoading: false,
        footer: null,
        title: '新增订单'
    })
    dialog.result.then((res)=>{
        console.log(res)
    },()=>{});
  }
  viewOrder(row){
    const dialog = Dialog({
        content: <ReviewOrderDialog data={row} handler={dialog} ref={e=>{ e && (e.handler = dialog)}}/>,
        width: 1300,
        confirmLoading: false,
        footer: null,
        title: '新增订单'
    })
    dialog.result.then((res)=>{
        this.setState(prestate=>{
          prestate.searchParams._id = _.uniqueId('r_')
        });
    },()=>{});
  }
  render() {
    const columns = [{
      title: '订单号',
      dataIndex: 'OrderNo',
      render:(val,record)=>{
        return <a href="javascript:;" onClick={e=>this.viewOrder(record)}>{val}</a>
      }
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
      render:(val,record)=>{
        return <a href="javascript:;" onClick={e=>this.viewOrder(record)}>{val}</a>
      }
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '签单销售',
      dataIndex: 'OrderSalesName',
    }, {
      title: '订单来源',
      dataIndex: 'SourceName'
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
      render: val=> fDate(val)
    }, {
      title: '订单总金额',
      dataIndex: 'Amount',
    }, {
      title: '订单状态',
      dataIndex: 'OrderStatus',
      render: (val, record)=>fOrderStatus(record.OrderStatus,+record.OrderSourceId)
    }];
    search.buttons=[
        <HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增订单</Button></HasPower>
    ];
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL">
            <TabPane tab="待处理订单" key="NOALL">
              <OrderTable SearchParams={this.state.searchParams} searchUrl="order" columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL">
              <OrderTable SearchParams={this.state.searchParams} searchUrl="order" columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Main
