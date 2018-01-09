import React, { Component } from 'react'
import _ from 'lodash'
import SearchForm from '@/container/SearchForm'
import SalerSelect from '@/container/searchComponent/SalerSelect'
import AreaSelect from '@/container/searchComponent/AreaSelect'
import TaxStatusSelect from '@/container/searchComponent/TaxStatusSelect'

import CompanyDialog from '@/container/Contract/CompanyDialog'

import { getListData, postData, putData } from '@/api'
import { Table, Button, message, Select, Input} from 'antd'
import Dialog from '@/container/Dialog'
import { fDate, fTaxStatus } from '@/config/filters'
import HasPower from '@/container/HasPower'
import RIf from '@/component/RIF'
import * as action from '@/config/contractActions'


let search = {
    items: [{
        label: '序列ID',
        type: 'text',
        field: 'sequenceNumber'
    }, {
        label: '公司名称',
        type: 'text',
        field: 'companyName'
    }, {
        label: '所属区域',
        type: 'custom',
        field: 'areaCode',
        view: AreaSelect
    }, {
        label: '联系人',
        type: 'text',
        field: 'contact'
    }, {
        label: '销售人员',
        type: 'text',
        field: 'SalesName'
    }, {
        label: '运营会计',
        type: 'text',
        field: 'accounting'
    }, {
        label: '报税状态',
        type: 'custom',
        field: 'firsttracktime',
        view: TaxStatusSelect
    }, {
        label: '服务期止',
        type: 'date',
        field: 's_serviceendtime'
    }, {
        label: '至',
        type: 'date',
        field: 'e_serviceendtime'
    }, {
        label: '创建时间',
        type: 'date',
        field: 'e_createtime'
    }, {
        label: '至',
        type: 'date',
        field: 'createend'
    }],
    buttons:[]
};

class Main extends Component {
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
            loading: false,
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.onUpload = this.onUpload.bind(this)
        this.addNew = this.addNew.bind(this)
        this.view = this.view.bind(this)
        this.openDialog = this.openDialog.bind(this)
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
        return getListData('signcustomerlist', vals).then(res => {
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
        
    }
    addNew(){
        
    }
    view(row){

        Dialog({
            content: <CompanyDialog companyId={row.Id} row={row}/>,
            width: 1200,
            confirmLoading: false,
            footer: null,
            title: row.CompanyName 
        }).result.then(()=>{
            this.onSearch(this.state.searchParams)
        },()=>{});

    }
    mark = (row)=>{
        if(!row.RemarkSignId){
            action.mark(row).then(()=>{
                this.onSearch(this.state.searchParams)
            },()=>{});

        }else{
            action.mark(row).then(res=>{
                if(res.status){
                    this.onSearch(this.state.searchParams);
                }
            })
        }
    }
    hangUp = (row) => {
        action.hangUp(row).then(()=>{
            this.onSearch(this.state.searchParams);
        })
    }
    toOther = (row) => {
        let saler;
        Dialog({
            content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect hideAll = {true} onChange={v=>{saler=v}}/></div>,
            width: 540,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    putData(`customer/${row.Id}/${saler}`).then(res=>{
                        if(res.status){
                            message.info('转出成功！')
                            this.onSearch(this.state.searchParams)
                            }else{
                            reject();
                        }
                    },()=>reject())
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "换销售-"+ row.CompanyName 
        }).result.then(()=>{
            this.onSearch(this.state.searchParams);
        },()=>{});
    }
    toOthers = ()=>{
        let saler;
        Dialog({
            content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect hideAll = {true} onChange={v=>{saler=v}}/></div>,
            width: 540,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    const ids = this.state.selected;
                    putData(`transcustomer/${saler}`, ids).then(res=>{
                        if(res.status){
                            message.info('转出成功！')
                            this.onSearch(this.state.searchParams);
                            resolve();
                        }else{
                            reject();
                        }
                    },()=>reject())
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "批量换销售"
        }).result.then(()=>{
            this.onSearch(this.state.searchParams);
        },()=>{});
        
    }
    componentWillMount() {
        this.onSearch();
    }
    render() {
        
        const columns = [{
            title: '序列ID',
            dataIndex: 'SequenceNo',
            width: 150,
            render: (val,row)=>{
                const cnames = ['mark-style mark-style-yellow','mark-style mark-style-blue','mark-style mark-style-red']
                return [<RIf if={!!row.RemarkSignId} key={val+'_1'}><span className={cnames[row.RemarkSignId-1]}></span></RIf>,<span key={val+'_2'} style={{float:'right'}}>{val}</span>]
            }
        }, {
            title: '公司名称',
            dataIndex: 'CompanyName',
            render: (val,record) => (<a href="javascript:;" onClick={e=>{this.view(record)}}>{val}</a>)
        }, {
            title: '所属区域',
            dataIndex: 'AreaName',
        }, {
            title: '联系人',
            dataIndex: 'Mobile',
        }, {
            title: '当前负责销售',
            dataIndex: 'SalesName'
        }, {
            title: '运营会计',
            dataIndex: 'AccountantName'
        }, {
            title: '报税状态',
            dataIndex: 'AgentStatus',
            render: val=> fTaxStatus(val)
        }, {
            title: '服务期止',
            dataIndex: 'ServiceEnd',
            render: val=> fDate(val)
        }, {
            title: '创建时间',
            dataIndex: 'CreateDate',
            render: val=> fDate(val)
        }, {
            title: '操作',
            render: (text, record) => (
                <Button.Group >
                    <HasPower power="MARK"  key={"btn_MARK"} ><Button size="small" onClick={e=>{this.mark(record)}}>{record.RemarkSignId?'取消':'标记'}</Button></HasPower>
                    <HasPower power="GUAQI"  key={"btn_GUAQI"} ><Button size="small" disabled={!record.IfCancelHangup} onClick={e=>{this.hangUp(record)}}>挂起</Button></HasPower>
                    <Button size="small" onClick={e=>{this.toOther(record)}}>换销售</Button>
                </Button.Group>
            ),
        }];
        const rowSelection = {
            onChange: vals =>{
              this.setState({selected: vals})
            }
        }
        // search.buttons=[
        // <HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增客户</Button></HasPower>,
        // <HasPower power="IMPORT" key="btn_IMPORT"><ImportData onChange={this.onUpload} style={{margin:'0 8px'}}/></HasPower>]
        
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
                    rowSelection = {rowSelection}
                />
                <Button  type="primary" onClick={this.toOthers}>批量换销售</Button>
            </div>
        );
    }
}

export default Main