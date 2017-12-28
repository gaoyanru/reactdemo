import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { fDate } from '@/config/filters'
import HasPower from '@/container/HasPower'
import ImportData from '@/container/searchComponent/ImportData'
import CustomerType from '@/container/searchComponent/CustomerType'
import SearchForm from '@/container/SearchForm'
import { getListData, postData, putData, deleteData } from '@/api'
import CrmCustomer from '@/component/CrmCustomer'
import CrmCustomerRepeatWarning from '@/container/CrmCustomerRepeatWarning'
import CrmCustomerView from '@/container/CrmCustomerView'
import Dialog from '@/container/Dialog'
import _ from 'lodash'
import Confirm from '@/component/Confirm'

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

class DialogScan extends Component {
  constructor(props) {
    super(props);
    this.state= {loading: false}
  }

  onClose = ()=>{
    this.props.onClose
  }

  onNext = ()=>{
    this.setState({loading: true})
    this.props.onNext().then(res=>{
      this.setState({loading: false})
    })
  }
  render (){
    return (
      [<Button key="back" type="primary" onClick={this.props.onClose}>关闭</Button>,
        <Button key="toput" type="primary" loading={this.state.loading} onClick={this.onNext.bind(this)}>下一条</Button>
    ])
  }
}

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
    this.edit = this.edit.bind(this);
    this.pickCustomer = this.pickCustomer.bind(this)
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
                                  reject();
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
                                  },()=>{
                                      reject()
                                  });

                              }
                          }else{
                              if(res.status){
                                  message.info('保存成功！')
                                  resolve()
                              }else{
                                  // message.error(res.message);
                                  reject()
                              }

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

  edit(row){
    let current = row.Id;
    console.log(row.CompanyName, 'CompanyName')
    const  closeDialog = ()=>{
      d.close()
    }
    const next =()=>{
        const that = this;
        return new Promise((resolve,reject)=>{
            that.crmform.saveCustomer().then(customer=>{
               resolve()
               that.showNext(customer.Id)
            })
        });
      }
    const d = Dialog({
      content: <CrmCustomerView customerId={row.Id} ref={crmform =>{this.crmform = crmform}} readOnly={true}/>,
      width: 1200,
      confirmLoading: false,
      handleCancel: ()=> true,
      handleOk: ()=>true,
      title: row.CompanyName,
      footer: <DialogScan onClose={closeDialog} onNext={next}/>
    })

    d.result.then(()=>{
      this.onSearch(this.state.searchParams)
    },()=>{ this.onSearch(this.state.searchParams)});
  }

  showNext = (id)=>{
      const index = _.findIndex(this.state.data,t=>t.Id=== +id)
      if(index>-1 && index< this.state.data.length){
          if(index+1< this.state.data.length){
              this.crmform.showNext(this.state.data[index+1].Id)
          }else{
              const pagination = this.state.pagination;
              if((pagination.current-1)*pagination.pageSize + index +1 < pagination.total){
                  this.setState({
                      pagination: {...pagination, current:pagination.current+1}
                  })
                  this.onSearch(this.state.searchParams).then(res=>{
                      this.crmform.showNext(res.data.list[0].Id)
                  })
              }
          }
      }
  }

  pickCustomer(row){
    console.log(row)
    putData('opencustomer/' + row.Id + '/6').then((res)=>{
      if(res.status){
        message.info('操作成功！')
        this.onSearch(this.state.searchParams)
      }
    })
  }

  deleteItem(row){
    Confirm({
      handleOk:()=>{
        deleteData('opencustomer/' + row.Id).then((res)=>{
          if(res.status){
            message.info('删除成功！')
            this.onSearch(this.state.searchParams)
          }
        })
      },
      message: '确认要删除吗？'
    })
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
          <HasPower power="DETEAL"  key={"btn_DETEAL"} ><Button size="small" onClick={e=>{this.edit(record)}}>查看</Button></HasPower>
          <HasPower power="GETCUS"  key={"btn_GETCUS"} ><Button size="small" onClick={e=>{this.pickCustomer(record)}}>抢客户</Button></HasPower>
          <HasPower power="DELETE"  key={"btn_DELETE"} ><Button size="small" onClick={e=>{this.deleteItem(record)}}>删除</Button></HasPower>
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
