import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm'
import BelongCompany from '@/container/searchComponent/BelongCompany'
import { getListData } from '@/api'
import { Table, Button, Tabs } from 'antd'
import HasPower from '@/container/HasPower'
import OrderTable from '@/container/Contract/OrderTable'
import _ from 'lodash'
import { fDate, fOrderSource, fOrderStatus } from '@/config/filters'
import AddOrderDialog from '@/container/Contract/AddOrderDialog'
import Dialog from '@/container/Dialog'

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
        field: 'contact'
    }, {
        label: '签单销售',
        type: 'text',
        field: 'saleName'
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
          1: "电商",
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
  }

  onSearch(res) {
    this.setState({searchParams: res});
  }
  addNew(){
    const dialog = Dialog({
        content: <AddOrderDialog handler={dialog} ref={e=>{ e && (e.handler = dialog)}}/>,
        width: 1300,
        confirmLoading: false,
        footer: null,
        title: '新增订单'
    })
    dialog.result.then((res)=>{
        console.log(res)
    },()=>{});
  }

  render() {
    const columns = [{
      title: '订单号',
      dataIndex: 'OrderNo',
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '签单销售',
      dataIndex: 'SalesName',
    }, {
      title: '订单来源',
      dataIndex: 'OrderSourceId',
      render: val=> fOrderSource(val)
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
              <OrderTable SearchParams={this.state.searchParams} searchUrl="contract" columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL">
              <OrderTable SearchParams={this.state.searchParams} searchUrl="contract" columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Main
