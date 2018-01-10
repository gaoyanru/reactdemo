import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm'
import BelongCompany from '@/container/searchComponent/BelongCompany'
import { getListData } from '@/api'
import { Table, Button, Tabs } from 'antd'
import HasPower from '@/container/HasPower'
import OrderTable from '@/container/Contract/OrderTable'
import _ from 'lodash'
import { fDate, fServiceStatus, fCheckStatus } from '@/config/filters'

import Dialog from '@/container/Dialog'

import ServiceStatusSelect from '@/container/searchComponent/ServiceStatusSelect'
import OutworkerSelect from '@/container/searchComponent/OutworkerSelect'
import AreaSelect from '@/container/searchComponent/AreaSelect'
import AllotDialog from '@/container/Contract/AllotDialog'


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
        label: '所属区（县）',
        type: 'custom',
        field: 'areacode',
        view: AreaSelect,
        defaultValue: ''
    }, {
        label: '联系人',
        type: 'text',
        field: 'contact'
    }, {
        label: '当前负责销售',
        type: 'text',
        field: 'SalesName'
    },{
        label: '合同编号',
        type: 'text',
        field: 'contractNO'
    }, {
        label: '服务状态',
        type: 'custom',
        field: 'serviceStatus',
        view: ServiceStatusSelect
    }, {
        label: '外勤处理状态',
        type: 'custom',
        field: 'serviceStatus',
        view: OutworkerSelect
    }, {
      label: '会计处理状态',
      type: 'select',
      field: 'accountantStatus',
      data:{
        1: "待审核",
        2: "已审核",
        3: "已驳回",
        5: "部分审核"
      },
      defaultValue: ''
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
    this.viewOrder = this.viewOrder.bind(this);
  }

  onSearch(res) {
    this.setState({searchParams: res});
  }
  viewOrder(row){
     const dialog = Dialog({
          content: <AllotDialog  row={row} ref={v=>{ v && (v.handler = dialog)}}/>,
          width: 1200,
          confirmLoading: false,
          footer: null,
          title: row.CompanyName
      })
      dialog.result.then(()=>{
          this.onSearch()
      },()=>{});
  }
  render() {
    const columns = [{
      title: '订单号',
      dataIndex: 'OrderNo',
      render: (val,record)=>{
        return <a href="javascript:;" onClick={this.viewOrder.bind(this,record)}>{val}</a>;
      }
    }, {
      title: '公司名称',
      dataIndex: 'CompanyName',
      render: (val,record)=>{
        return <a href="javascript:;" onClick={this.viewOrder.bind(this,record)}>{val}</a>;
      }
    }, {
      title: '所属区域',
      dataIndex: 'AreaName',
    }, {
      title: '当前负责销售',
      dataIndex: 'SalesName',
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
      render: val=> fDate(val)
    }, {
      title: '服务状态',
      dataIndex: 'ServiceStatus',
      render: val=>fServiceStatus(val)
    }, {
      title: '外勤处理状态',
      dataIndex: 'OutWorkerStatus',
      render: val=>fCheckStatus(val)
    }, {
      title: '会计处理状态',
      dataIndex: 'AgentStatus',
      render: val=>fCheckStatus(val)
    }];
    
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL">
            <TabPane tab="待处理订单" key="NOALL">
              <OrderTable SearchParams={this.state.searchParams} searchUrl="taskdistributionlist" columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL">
              <OrderTable SearchParams={this.state.searchParams} searchUrl="taskdistributionlist" columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Main
