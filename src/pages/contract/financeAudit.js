import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm'
import BelongCompany from '@/container/searchComponent/BelongCompany'
import { getListData } from '@/api'
import { Table, Button, Tabs } from 'antd'
import HasPower from '@/container/HasPower'
import OrderTable from '@/container/OrderTable'
import _ from 'lodash'
import {fOrderSource } from '@/config/filters'
import Dialog from '@/container/Dialog'
import OrderDialog from '@/container/Contract/OrderDialog'

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
        field: 'orderSourceId',
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
        field: 'OrderSalesName'
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
    this.export = this.export.bind(this);
    this.view = this.view.bind(this);
  }

  onSearch(res) {
    console.log(res, 'search')
    this.setState({searchParams: res});
  }

  export() {
    console.log(this.state.searchParams , 'download 参数')
    console.log(sessionStorage, 'sessionStorage')
    const Authorize = sessionStorage.getItem('token')
    var Params = _.cloneDeep(this.state.searchParams)
    Params.Authorize = Authorize
    if (Params.starttime === null) {
      Params.starttime = ''
    }
    if (Params.endtime === null) {
      Params.endtime = ''
    }
    console.log(Params, 'Params')
    var query = ''
    for (let i in Params) {
      query += '&' + i + '=' + Params[i]
    }
    query = '?' + query.slice(1)
    console.log(query)
    var url = '/api/download/financelist' + query
    window.open(url)
  }
  view(row) {
    const dialog = Dialog({
      content: <OrderDialog id={row.OrderId} readOnly={true}/>,
      width: 1300,
      confirmLoading: false,
      footer: null,
      title: '查看订单'
    })
    dialog.result.then(()=>{
        this.onSearch()
    },()=>{});
  }

  render() {
    search.buttons=[(<HasPower power="EXPORT" key="btn_export"><Button style={{marginLeft: '10px'}} type="primary" onClick={this.export} >导出</Button></HasPower>)]
    const columns = [{
      title: '所属公司',
      dataIndex: 'SubsidiaryName',
    }, {
      title: '订单号',
      dataIndex: 'OrderNo',
      render: (val,record) => (<a href="javascript:;" onClick={e=>{this.view(record)}}>{val}</a>)
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
      render: (val,record) => (<a href="javascript:;" onClick={e=>{this.view(record)}}>{val}</a>)
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '签单销售',
      dataIndex: 'OrderSalesName',
    }, {
      title: '订单来源',
      dataIndex: 'OrderSourceId',
      render: val=> fOrderSource(val)
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
    }, {
      title: '订单总金额',
      dataIndex: 'Amount',
    }, {
      title: '订单状态',
      dataIndex: 'OrderStatus',
      render: (val, record)=> {
        // console.log(val, record)
        var str = ''
        switch (+val) {
            case 1:
                str = '审单待审核'
                break;
            case 2:
                str = '审单已审核'
                break;
            case 3:
                str = '审单驳回'
                break;
            case 4:
                if (+record.OrderSourceId === 1) {
                  str = '财务已审核'
                  break;
                } else if (+record.OrderSourceId === 2) {
                  str = '网店到款'
                  break;
                }
            case 5:
                str = '财务已驳回'
                break;
            case 6:
                str = '财务确认'
                break;
        }
        return str;
      }
    }];
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL" onChange={this.callback}>
            <TabPane tab="待处理订单" key="NOALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} SearchUrl={'order/financelist'} columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} SearchUrl={'order/financelist'} columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Finance
