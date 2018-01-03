import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm'
import BelongCompany from '@/container/searchComponent/BelongCompany'
import { getListData } from '@/api'
import { Table, Button, Tabs } from 'antd'
import HasPower from '@/container/HasPower'
import OrderTable from '@/container/OrderTable'

const TabPane = Tabs.TabPane;

let search = {
    items: [{
      label: '所属公司',
      type: 'custom',
      field: 'subsidairy',
      view: BelongCompany,
      defaultValue: '0'
    }, {
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
        label: '订单来源',
        type: 'select',
        field: 'orderSource',
        data:{
          0: "全部",
          1: "电商",
          2: "天猫"
        },
        defaultValue: '0'
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
        label: '签单销售',
        type: 'text',
        field: 'saleName'
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
    search.buttons=[(<HasPower power="EXPORT" key="btn_export"><Button type="primary" onClick={this.export} >导出</Button></HasPower>)]

    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL" onChange={this.callback}>
            <TabPane tab="待处理订单" key="NOALL">
              <OrderTable key="orderTable1" SearchParams={this.state.searchParams} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL">
              <OrderTable key="orderTable2" SearchParams={this.state.searchParams} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Finance
