import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm'
import { getListData } from '@/api'
import { Table, Button, Tabs } from 'antd'
import HasPower from '@/container/HasPower'
import OrderTable from '@/container/OrderTable'
import _ from 'lodash'
import AreaSelect from '@/container/searchComponent/AreaSelect'
import { connect } from 'react-redux'
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

  render() {
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL" onChange={this.callback}>
            <TabPane tab="待处理订单" key="NOALL">
              <OrderTable SearchParams={this.state.searchParams} SearchUrl={'order/audit/list'} TableFrom={'account'} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL">
              <OrderTable SearchParams={this.state.searchParams} SearchUrl={'order/audit/list'} TableFrom={'account'} isAll={true}/>
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
