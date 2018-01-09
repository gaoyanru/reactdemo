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
import OrderDialog from '@/container/Contract/OrderDialog'


const TabPane = Tabs.TabPane;

let search = {
    items: [ {
        label: '公司名称',
        type: 'text',
        field: 'companyname'
    },  {
        label: '联系人',
        type: 'text',
        field: 'connector'
    }, {
        label: '销售',
        type: 'text',
        field: 'OrderSalesName'
    },{
        label: '合同结束期',
        type: 'select',
        field: 'contractEndPeriod',
        data:{
          0: "全部",
          1: "近一个月",
          2: "近两个月",
          3: "近三个月"
        }
    }, {
        label: '合同签订日期',
        type: 'date',
        field: 'contractDateStart'
    }, {
        label: '至',
        type: 'date',
        field: 'contractDateEnd'
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
         content: <OrderDialog id={row.OrderId} readOnly={true}/>,
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
      title: '合同编号',
      dataIndex: 'ContractNo',
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
      title: '公司联系人',
      dataIndex: 'Connector',
    }, {
      title: '销售人员',
      dataIndex: 'OrderSalesName'
    }, {
      title: '合同签订日期',
      dataIndex: 'ContractDate',
      render: val=>fDate(val)
    }, {
      title: '服务开始',
      dataIndex: 'ServiceStart',
      render: val=>fDate(val)
    }, {
      title: '服务结束',
      dataIndex: 'ServiceEnd',
      render: val=>fDate(val)
    }];
    
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <OrderTable SearchParams={this.state.searchParams} searchUrl="order/expire/list" columns={columns} isAll={true}/>
        </div>
    );
  }
}

export default Main
