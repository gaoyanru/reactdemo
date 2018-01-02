import React, { Component } from 'react'
import { Input, Icon, Modal, Button, Table } from 'antd'
import { getListData } from '@/api'


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      selected: {},
      param: '',
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal(total) {
          return `共计 ${total} 条`;
        }
      }

    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleTableSelectChange = this.handleTableSelectChange.bind(this);
    this.onSearch = this.onSearch.bind(this);

  }

  handleInputChange(e){
    this.setState({
      param: e.target.value
    })
  }
  handleCancel() {
    this.setState({visible: false})
  }
  showModal(){
    this.setState({visible: true})
    this.onSearch()
  }
  handleTableSelectChange(v){
    this.setState({selected: v,visible: false});
    this.props.onChange(v);
  }
  onSearch() {
    this.setState({loading: true});
    const params = {
      companyname: this.state.param
    }
    const pagination =this.state.pagination;
    params.limit = pagination.pageSize;
    params.offset = (pagination.current - 1) * pagination.pageSize;
    return getListData('order/customer', params).then(res => {
        if(res.status){
            const pagination = { ...this.state.pagination };
            pagination.total = res.data.total;
            this.setState({
                loading: false,
                data: res.data.list,
                pagination,
            });
        }
        return res;
    },err=>{
        this.setState({
            loading: false
        });
    })
  } 
  componentWillMount() {

  }
  render() {
    const columns = [{
            title: '公司名称',
            dataIndex: 'CompanyName',
            render: (val,row)=>{
              return <a href="javascript:;" onClick={this.handleTableSelectChange.bind(this,row)}>{val}</a>
            }
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '联系电话',
            dataIndex: 'Mobile',
        }, {
            title: '销售',
            dataIndex: 'SalesName',
        }]
    return (
      <div style={{paddingRight: '35px'}}>
        <Input onClick={this.showModal} addonAfter={<Icon type="plus" onClick={this.showModal} />} value={this.state.selected.CompanyName} readOnly onChange={this.handleChange}/>
        <Modal title= "选择公司"
            width= {800}
            visible={this.state.visible}
            onOk={(e)=>{this.handleOk(e)}}
            confirmLoading={ this.state.confirmLoading}
            onCancel={(e)=>{this.handleCancel(e)}}
            footer={ <Button  onClick={this.handleCancel}>取消</Button>}
            maskClosable={false}>
            <div className="ant-row ant-form-item">
              <div className="ant-col-4 ant-form-item-label">
                <label title="公司名称/联系人">公司名称/联系人</label>
              </div>
              <div className="ant-col-12 ant-form-item-control-wrapper">
                <Input onChange={this.handleInputChange} /> 
              </div>
              <div className="ant-col-2 ant-form-item-control-wrapper">
                <Button type="primary" onClick={this.onSearch}>查询</Button>
              </div>
            </div>
            <Table columns={columns}
                rowKey={record => record.Id}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                size="middle"
                bordered={true}
            />
        </Modal>
      </div>
    );
  }
}


export default Main
