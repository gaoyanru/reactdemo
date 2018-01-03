import React, { Component } from 'react'
import { Table } from 'antd'
import { getListData } from '@/api'
import {fOrderSource, fOrderStatus} from '@/config/filters'
import _ from 'lodash'
class OrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
          current: 1,
          pageSize: 15,
          showTotal(total) {
            return `共计 ${total} 条`;
          }
      },
      searchParams: {},
      selectedRowKeys: [],
      loading: false,
    };
    this.Search = this.Search.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  handleTableChange (pagination){
    this.setState({pagination: pagination}, ()=>{this.Search()})
  }
  Search() {
      console.log(this.state.searchParams, 'searchParams')
      this.setState({loading: true});
      const state = _.cloneDeep(this.state);
      const searchParams = state.searchParams;
      const pagination = state.pagination;
      console.log(pagination, 'pagination')
      var vals = searchParams
      vals.limit = pagination.pageSize;
      vals.offset = (pagination.current - 1) * pagination.pageSize;
      if (this.props.isAll) {
        vals.treatedOrder = 1
      } else {
        vals.treatedOrder = 0
      }
      console.log(vals, 'vals')
      if (vals.offset === 0) {
        vals.starttime = vals.starttime ? vals.starttime.format('YYYY-MM-DD') : '';
        vals.endtime = vals.endtime ? vals.endtime.format('YYYY-MM-DD') : '';
      }
      getListData('contract/financelist', vals).then(res => {
          if(res.status){
              const pagination = { ...this.state.pagination };
              pagination.total = res.data.total;
              this.setState({
                  loading: false,
                  data: res.data.list,
                  pagination,
              });
          }
      },err=>{
          this.setState({
              loading: false
          });
      })
  }
  componentWillMount () {
    this.Search()
  }
  componentWillReceiveProps(props) { // 在组件接收到新的props的时候调用
    console.log(props, 'props Search')
    var pagination = {
      current: 1,
      pageSize: 15,
      showTotal(total) {
        return `共计 ${total} 条`;
      }
    }
    this.setState({searchParams: props.SearchParams, pagination: pagination}, () => {
      this.Search()
    })
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  render() {
    const columns = [{
      title: '所属公司',
      dataIndex: 'SubsidiaryName',
    }, {
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
      dataIndex: 'SaleName',
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
      render: val=> fOrderStatus(val)
    }];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Table columns={columns}
          rowKey={record => record.OrderId}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          size="middle"
          bordered={true}
          rowSelection={rowSelection}
      />
    )
  }
}

export default OrderTable
