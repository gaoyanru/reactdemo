import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { getListData, putData } from '@/api'

import _ from 'lodash'
import Confirm from '@/component/Confirm'

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
      this.setState({loading: true});
      const state = _.cloneDeep(this.state);
      const searchParams = state.searchParams;
      const pagination = state.pagination;
      var vals = searchParams
      vals.limit = pagination.pageSize;
      vals.offset = (pagination.current - 1) * pagination.pageSize;
      if (this.props.isAll) {
        vals.treatedOrder = 0
      } else {
        vals.treatedOrder = 1
      }
      vals.starttime = vals.starttime ? vals.starttime.format('YYYY-MM-DD') : '';
      vals.endtime = vals.endtime ? vals.endtime.format('YYYY-MM-DD') : '';
      getListData(this.props.searchUrl, vals).then(res => {
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
    this.Search();
  }
  componentWillReceiveProps(props) {
    if(!_.isEqual(this.props.SearchParams,props.SearchParams)){
      this.setState((preState)=>{
        return {
          searchParams: props.SearchParams,
          pagination: {...preState.pagination, current:1}
        };
      }, () => {
        this.Search();
      });
    }
  }
  render() {
    const btnStyle = {position:' relative', bottom: '45px'}
    const { selectedRowKeys } = this.state;
    return (
      <div>
        <Table columns={this.props.columns}
          rowKey={record => record.OrderId}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          size="middle"
          bordered={true}
        />
      </div>
    )
  }
}

export default OrderTable
