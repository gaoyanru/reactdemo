import React, { Component } from 'react'
import _ from 'lodash'
import SearchForm from '@/container/SearchForm'
import SalerSelect from '@/container/searchComponent/SalerSelect'
import CustomerType from '@/container/searchComponent/CustomerType'
import TagsSelect from '@/container/searchComponent/TagsSelect'
import CustomerSourceSelect from '@/container/searchComponent/CustomerSourceSelect'
import ImportData from '@/container/searchComponent/ImportData'
import CrmCustomer from '@/component/CrmCustomer'
import CrmCustomerRepeatWarning from '@/container/CrmCustomerRepeatWarning'
import CrmCustomerView from '@/container/CrmCustomerView'
import { getListData, postData, putData } from '@/api'
import { Table, Button, message} from 'antd'
import Dialog from '@/container/Dialog'
import { fDate } from '@/config/filters'
import HasPower from '@/container/HasPower'
import Confirm from '@/component/Confirm'


let search = {
    items: [{
        label: '公司名称',
        type: 'text',
        field: 'companyName'
    }, {
        label: '联系电话',
        type: 'text',
        field: 'phone'
    }, {
        label: '意向度',
        type: 'custom',
        field: 'CustomerTypeId',
        view: CustomerType,
        defaultValue: '0'
    }, {
        label: '标签',
        type: 'custom',
        field: 'tagIds',
        view: TagsSelect
    }, {
        label: '来源',
        type: 'custom',
        field: 'CustomerSourceId',
        view: CustomerSourceSelect,
        defaultValue: '0'
    }, {
        label: '首次跟踪',
        type: 'date',
        field: 'firsttracktime'
    }, {
        label: '最后跟踪',
        type: 'date',
        field: 'lasttracktime'
    }, {
        label: '分组',
        type: 'date',
        field: 'DepartmentId'
    }, {
        label: '销售',
        type: 'custom',
        field: 'SalesId',
        view: SalerSelect,
        defaultValue: '0'
    }, {
        label: '创建时间',
        type: 'date',
        field: 'createstart'
    }, {
        label: '至',
        type: 'date',
        field: 'createend'
    }],
    buttons:[]
};

class DialogFooter extends Component{
    constructor(props) {
        super(props)
        this.state= {loading: false}
    }

    onClose = ()=>{
        this.props.onClose
    }
    onSave = ()=>{
        this.setState({loading: true})
        this.props.onSave().then(res=>{
            this.setState({loading: false})
        })
    }
    onPub = ()=>{
       this.setState({loading: true})
        this.props.onPub().then(res=>{
            this.setState({loading: false})
        })
    }
    render (){
        return ([<Button key="back" type="primary" onClick={this.props.onClose}>关闭</Button>,
            <Button key="toput" type="primary" loading={this.state.loading} onClick={this.onPub.bind(this)}>转公海&下一条</Button>,
             <Button key="submit" type="primary" loading={this.state.loading} onClick={this.onSave.bind(this)}>保存&下一条</Button>
             ])
    }
}

class Main extends Component {
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
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.onUpload = this.onUpload.bind(this)
        this.addNew = this.addNew.bind(this)
        this.edit = this.edit.bind(this)
        this.openDialog = this.openDialog.bind(this)
        this.toPubBatch = this.toPubBatch.bind(this)
        this.toOtherBatch = this.toOtherBatch.bind(this)
    }
    onUpload (res){
        if(res.file && res.file.status==="done"){
            if(res.file.response.data.length){
                message.error(res.file.response.data.map(m=><div>{m}</div>));
            }else{
                message.info('导入成功！');
            }
        }
    }
    handleTableChange (pagination){
        this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
    }
    onSearch(vals={}) {
        this.setState({searchParams: vals, loading: true});
        const pagination =this.state.pagination;
        vals.limit = pagination.pageSize;
        vals.offset = (pagination.current - 1) * pagination.pageSize;
        return getListData('Customer', vals).then(res => {
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
        const  closeDialog = ()=>{
            d.close()
        }
        const save_next =()=>{
            const that = this;
            return new Promise((resolve,reject)=>{
                that.crmform.saveCustomer().then(customer=>{
                    if(customer.isSave){
                        putData('customer/'+customer.Id+'?verify=0', customer).then(res=>{
                            if (res && _.isObject(res.data)) {
                                const data = res.data;
                                if (data.errorcode == 1) {
                                    message.error(res.data.name);
                                    resolve()
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
                                         putData('customer/'+customer.Id+'?verify=1', customer).then(res=>{
                                            message.info('保存成功！')
                                            resolve()
                                            that.showNext(customer.Id)
                                         })
                                    },()=>{resolve()});

                                }
                            } else{
                                message.info('保存成功！')
                                resolve()
                                that.showNext(customer.Id)
                            }
                        })
                    }else{
                       resolve()
                       that.showNext(customer.Id)
                    }
                })
            });
        }
        const pub_next =()=>{
            const that = this;
            return new Promise((resolve,reject)=>{
                that.crmform.saveCustomer().then(customer=>{
                    putData('custranstoocean?customerId='+ customer.Id).then((res)=>{
                        if(res.status){
                            that.showNext(customer.Id)
                            resolve()
                        }
                    })
                })
            });
        }
        const d = Dialog({
            content: <CrmCustomerView customerId={row.Id} ref={crmform =>{this.crmform = crmform}}/>,
            width: 1200,
            confirmLoading: false,
            handleCancel: ()=> true,
            handleOk: ()=>true,
            title: '',
            footer: <DialogFooter onClose={closeDialog} onSave={save_next} onPub={pub_next}/>
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
    toPub = (row)=>{
        Confirm({
            handleOk:()=>{
                putData('custranstoocean?customerId='+ row.Id).then((res)=>{
                    if(res.status){
                        message.info('转出成功！')
                        this.onSearch(this.state.searchParams)
                    }
                })
            },
            message: '确认要转到公海吗？'

        })

    }
    onSelectChange = (selectedRowKeys) => {
      this.setState({ selectedRowKeys });
    }
    toPubBatch() {
      if (this.state.selectedRowKeys.length === 0) {
        message.error('请至少选择一个客户！');
        return false
      }
      const selectKeys = this.state.selectedRowKeys
      postData('customerocean', selectKeys).then(res => {
        if (res.status){
          message.info('转出成功！')
          this.onSearch(this.state.searchParams)
          this.setState({selectedRowKeys: []})
        }
      })
    }
    toOther = (row)=>{
        let saler;
        Dialog({
            content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect onChange={v=>{saler=v}}/></div>,
            width: 540,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    putData(`customer/${row.Id}/${saler}`).then(res=>{
                        if(res.status){
                            message.info('转出成功！')
                            this.onSearch(this.state.searchParams)
                            resolve()
                        }
                    })
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "转出-"+ row.CompanyName
        }).result.then(()=>{
            this.onSearch(this.state.searchParams);
        },()=>{});
    }
    toOtherBatch() {
      let saler;
      Dialog({
          content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect onChange={v=>{saler=v}}/></div>,
          width: 540,
          handleOk: ()=>{
              return new Promise((resolve, reject) => {
                  putData(`transcustomer/${saler}`, this.state.selectedRowKeys).then(res=>{
                      if(res.status){
                          message.info('转出成功！')
                          this.onSearch(this.state.searchParams)
                          this.setState({selectedRowKeys: []})
                          resolve()
                      }
                  })
              });
          },
          confirmLoading: false,
          handleCancel (){
              console.log('onCancel')
          },
          title: "批量转出客户"
      }).result.then(()=>{
          this.onSearch(this.state.searchParams);
      },()=>{});
    }
    componentWillMount() {
        this.onSearch();
    }
    render() {
      var { selectedRowKeys } = this.state;
      var rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange
      };
        const columns = [{
            title: '公司名称',
            dataIndex: 'CompanyName'
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '联系电话',
            dataIndex: 'Mobile',
        }, {
            title: '意向度',
            dataIndex: 'CustomerTypeName'
        }, {
            title: '创建日期',
            dataIndex: 'CreateDate',
            render: val=> fDate(val)
        }, {
            title: '注册日期',
            dataIndex: 'RegisterDate',
            render: val=> fDate(val)
        }, {
            title: '首次跟踪时间',
            dataIndex: 'FirstTrackTime',
            render: val=> fDate(val)
        }, {
            title: '最后跟踪时间',
            dataIndex: 'LastTrackTime',
            render: val=> fDate(val)
        }, {
            title: '来源',
            dataIndex: 'Marking',
        }, {
            title: '销售',
            dataIndex: 'SalesName'
        }, {
            title: '操作',
            render: (text, record) => (
                <Button.Group >
                    <HasPower power="DETAIL"  key={"btn_DETAIL"} ><Button size="small" onClick={e=>{this.edit(record)}}>查看</Button></HasPower>
                    <HasPower power="TOOTHER"  key={"btn_TOOTHER"} ><Button size="small" onClick={e=>{this.toOther(record)}}>客户转出</Button></HasPower>
                    <HasPower power="TOPUB"  key={"btn_TOPUB"} ><Button size="small" onClick={e=>{this.toPub(record)}}>转到公海</Button></HasPower>
                </Button.Group>
            ),
        }];

        search.buttons=[
        <HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增客户</Button></HasPower>,
        <HasPower power="IMPORT" key="btn_IMPORT"><ImportData onChange={this.onUpload} style={{margin:'0 8px'}}/></HasPower>]

        return (
            <div style={{position: 'relative'}}>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
                <Table columns={columns}
                    rowKey={record => record.Id}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="middle"
                    bordered={true}
                    rowSelection={rowSelection}
                />
                <div style={{position:'absolute',bottom:'10px'}}>
                  <Button type="primary" onClick={this.toPubBatch} style={{margin:'0 8px'}}>批量转入公海</Button>
                  <Button type="primary" onClick={this.toOtherBatch} style={{margin:'0 8px'}}>批量转其他人</Button>
                </div>
            </div>
        );
    }
}

export default Main
