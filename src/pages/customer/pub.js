import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { fDate } from '@/config/filters'
import HasPower from '@/container/HasPower'
import ImportData from '@/container/searchComponent/ImportData'
import CustomerType from '@/container/searchComponent/CustomerType'
import SearchForm from '@/container/SearchForm'
import { getListData } from '@/api'
import CrmCustomer from '@/component/CrmCustomer'
import CrmCustomerRepeatWarning from '@/container/CrmCustomerRepeatWarning'
import Dialog from '@/container/Dialog'

let search = {
    items: [{
        label: '公司名称',
        type: 'text',
        field: 'companyName'
    }, {
        label: '联系电话',
        type: 'text',
        field: 'Mobile'
    }, {
        label: '意向度',
        type: 'custom',
        field: 'CustomerTypeId',
        view: CustomerType,
        defaultValue: '0'
    }],
    buttons:[]
};

class PubMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
          current: 1,
          pageSize: 15,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal(total) {
            return `共计 ${total} 条`;
          }
      },
      searchParams: {},
      loading: false,
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.addNew = this.addNew.bind(this);
  }

  handleTableChange (pagination){
    this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
  }

  onSearch(vals={}) {
    this.setState({searchParams: vals, loading: true});
    const pagination =this.state.pagination;
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    return getListData('opencustomer', vals).then(res => {
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
    this.onSearch();
  }

  openDialog(customer,title,width){
      Dialog({
          content: <CrmCustomer data={customer} wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
          width: width|| 540,
          handleOk: ()=>{
              return new Promise((resolve, reject) => {
                  const formValues = this.crmform.getFieldsValue()
                  if(formValues){
                      postData('customer?verify=0', formValues).then(res=>{
                          if (res && _.isObject(res.data)) {
                              const data = res.data;
                              if (data.errorcode == 1) {
                                  message.error(res.data.name);
                              } else {
                                  const customers = JSON.parse(data.name);
                                  Dialog({
                                      content: <CrmCustomerRepeatWarning data={customers}/>,
                                      width: 800,
                                      handleOk (){
                                          return true
                                      },
                                      confirmLoading: false,
                                      handleCancel (){
                                          console.log('onCancel')
                                      },
                                      title: '新增客户'
                                  }).result.then(()=>{
                                       postData('customer?verify=1', formValues).then(res=>{
                                          message.info('保存成功！')
                                          resolve()
                                       })
                                  });

                              }
                          }else{
                              message.info('保存成功！')
                              resolve()
                          }
                      });
                  }else{
                      reject();
                  }
              });
          },
          confirmLoading: false,
          handleCancel (){
              console.log('onCancel')
          },
          title: title
      }).result.then(()=>{
          this.onSearch(this.state.searchParams)
      },()=>{});
  }

  addNew(){
    this.openDialog({},'新增客户')
  }

  render() {
    const columns = [{
      title: '公司名称',
      dataIndex: 'CompanyName'
    }, {
      title: '历史意向度',
      dataIndex: 'cusTypeName'
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '注册日期',
      dataIndex: 'RegisterDate',
      render: val=> fDate(val)
    }, {
      title: '操作',
      render: (text, record) => (
        <Button.Group >
          <HasPower power="DETAIL"  key={"btn_DETAIL"} ><Button size="small" onClick={e=>{this.edit(record)}}>查看</Button></HasPower>
          <HasPower power="TOOTHER"  key={"btn_TOOTHER"} ><Button size="small" onClick={e=>{this.toOther(record)}}>抢客户</Button></HasPower>
          <HasPower power="TOPUB"  key={"btn_TOPUB"} ><Button size="small" onClick={e=>{this.toPub(record)}}>删除</Button></HasPower>
        </Button.Group>
      ),
    }];

    search.buttons=[
    <HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增公海客户</Button></HasPower>]

    return (
      <div>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
            rowKey={record => record.Id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            size="middle"
            bordered={true}
        />
      </div>
    );
  }
}
export default PubMain
