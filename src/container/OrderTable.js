import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { getListData, putData } from '@/api'
import {fOrderSource, fOrderStatus} from '@/config/filters'
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
          pageSizeOptions: ['20','50','80','100','200'],
          showQuickJumper: true,
          showSizeChanger: true,
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
    this.checkAll = this.checkAll.bind(this);
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

  checkAll() {
    console.log(this.state.selectedRowKeys, '批量审核时的选中参数')
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请至少选择一个公司！');
      return false
    }
    const selectKeys = this.state.selectedRowKeys
    console.log(selectKeys, typeof(selectKeys), 'selectKeys')
    Confirm({
        handleOk:()=>{
          putData('contract/financeauditlist', selectKeys).then(res => {
            console.log(res)
            if (res.status) {
              message.info('审核成功！');
              this.Search()
              this.setState({selectedRowKeys: []})
            }
          })
        },
        message: '确认要批量审核吗？'
    })
  }

  render() {
    const btnStyle = {position:' relative', bottom: '45px'}
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
      dataIndex: 'SalesName',
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
    const { selectedRowKeys } = this.state;
    const rowSelection = !this.props.isAll ? {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
          disabled: record.OrderStatus != 2
      })
    } : null;
    return (
      <div>
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
        {(!this.props.isAll) && <Button style={btnStyle} type="primary" onClick={this.checkAll} >批量审核</Button>}
      </div>
    )
  }
}

export default OrderTable
