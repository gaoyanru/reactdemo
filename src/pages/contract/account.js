import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm'
import { getListData } from '@/api'
import { Table, Button, Tabs } from 'antd'
import HasPower from '@/container/HasPower'
import OrderTable from '@/container/Contract/OrderTable'
import _ from 'lodash'
import AreaSelect from '@/container/searchComponent/AreaSelect'
import { connect } from 'react-redux'
import {fServiceStatus, fAccountantStatus, fPartTax } from '@/config/filters'
import Dialog from '@/container/Dialog'
import store from '@/store'
import AccountDetailDialog from '@/container/Contract/AccountDetailDialog'

const TabPane = Tabs.TabPane;
let search = {
    items: [{
        label: '订单号',
        type: 'text',
        field: 'orderNo'
    }, {
        label: '公司名称',
        type: 'text',
        field: 'companyname'
    }, {
        label: '公司联系人',
        type: 'text',
        field: 'connector'
    }, {
        label: '销售人员',
        type: 'text',
        field: 'salesName'
    }, {
        label: '所属区域',
        type: 'custom',
        field: 'areacode',
        view: AreaSelect,
        defaultValue: ''
    }, {
        label: '来源',
        type: 'select',
        field: 'accountantTaskSource',
        data:{
          "审单": "审单",
          "外勤": "外勤"
        },
        defaultValue: ''
    }, {
        label: '合同编号',
        type: 'text',
        field: 'contractNO'
    }, {
        label: '合同签订日期',
        type: 'date',
        field: 'starttime'
    }, {
        label: '至',
        type: 'date',
        field: 'endtime'
    }, {
        label: '服务状态',
        type: 'select',
        field: 'serviceStatus',
        data:{
          2: "未开始",
          3: "外勤服务",
          4: "外勤会计服务",
          5: "会计服务",
          7: "结束",
          8: "中止"
        },
        defaultValue: ''
    }, {
      label: '会计审核状态',
      type: 'select',
      field: 'accountantStatus',
      data:{
        1: "待审核",
        2: "已审核",
        3: "已驳回",
        5: "部分审核"
      },
      defaultValue: ''
    }],
    buttons:[]
};

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: {}
    };
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(res) {
    console.log(res, 'search')
    this.setState({searchParams: res});
  }
  accountview(row){
    const dialog = Dialog({
        content: <AccountDetailDialog companyId={row.CustomerId} row={row}/>,
        width: 1200,
        confirmLoading: false,
        footer: null,
        title: row.CompanyName
    })
    dialog.result.then(()=>{
        this.onSearch()
    },()=>{});
    store.dispatch({
      type: 'set contract account modal status',
      status: {
        modal1: true
      }
    })
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.unsubscribe = store.subscribe(() => {
      const {account} = store.getState()
      if(!account.modal1) {
        dialog.cancel()
        console.log(this, 'this')
        this.onSearch(this.state.searchParams)
      }
    })
  }

  render() {
    const columns = [{
      title: '订单号',
      dataIndex: 'OrderNo',
      render: (val,record) => (<a href="javascript:;" onClick={e=>{this.accountview(record)}}>{val}</a>)
    }, {
      title: '公司名称',
      dataIndex: 'CompanyName',
      render: (val,record) => (<a href="javascript:;" onClick={e=>{this.accountview(record)}}>{val}</a>)
    }, {
      title: '所属区域',
      dataIndex: 'AreaName',
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '当前负责销售',
      dataIndex: 'SalesName',
    }, {
      title: '来源',
      dataIndex: 'AccountantTaskSource'
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
    }, {
      title: '服务状态',
      dataIndex: 'ServiceStatus',
      render: val=> fServiceStatus(val)
    }, {
      title: '会计审核状态',
      dataIndex: 'AccountantStatus',
      render: val=> fAccountantStatus(val)
    }, {
      title: '部分报税',
      dataIndex: 'PartTax',
      render: val=> fPartTax(val)
    }];
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL" onChange={this.callback}>
            <TabPane tab="待处理订单" key="NOALL">
              <OrderTable SearchParams={this.state.searchParams} searchUrl={'order/audit/list'} columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL">
              <OrderTable SearchParams={this.state.searchParams} searchUrl={'order/audit/list'} columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default connect(({account}) => {
  return {
    account
  }
})(Finance)
