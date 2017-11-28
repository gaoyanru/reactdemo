import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm';
import ContractStatusSelect from '@/component/ContractStatusSelect';
import { getListData } from '@/api'
import { Table, Button } from 'antd';
import Dialog from '@/container/Dialog'
import {fContractType, fContractStatus, fDate, fFinancialAuditStatus, powerList} from '@/config/filters'

let search = {
    items: [{
        label: '合同编号',
        type: 'text',
        field: 'contractNo'
    }, {
        label: '甲方',
        type: 'text',
        field: 'companyname'
    }, {
        label: '联系人',
        type: 'text',
        field: 'contact'
    }, {
        label: '销售人员',
        type: 'text',
        field: 'saleName'
    }, {
        label: '合同状态',
        type: 'custom',
        field: 'contractStatus',
        view: ContractStatusSelect,
        defaultValue: '0'
    }, {
        label: '合同类型',
        type: 'select',
        field: 'contractType',
        data:[{id:0,label:'请选择'},{id:1,label:'新增'},{id:2,label:'续费'}],
        defaultValue: '0'
    }, {
        label: '财务状态选择',
        type: 'select',
        field: 'financeStatus',
        data:{ 
          0: "请选择",
          1: "待审核",
          2: "已审核",
          3: "已驳回"
        },
        defaultValue: '0'
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

class Manage extends Component {
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
            loading: false,
        };
        
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        console.log('manage', this)
        this.hasPower= powerList(this.props.functions);
    }
    handleTableChange (pagination){
        this.setState({pagination: pagination})
        this.onSearch(this.state.searchParams,pagination);
    }
    onSearch(vals={"contractNo":"","companyname":"","contact":"","saleName":"","contractStatus":"0","contractType":"0","financeStatus":"0","starttime":null,"endtime":null},pager) {

        this.setState({searchParams: vals, loading: true});
        const pagination = pager || this.state.pagination;
        vals.limit = pagination.pageSize;
        vals.offset = (pagination.current - 1) * pagination.pageSize;

        getListData('contract', vals).then(res => {
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
    openDialog(row){
        Dialog({
            content: (<div>test</div>),
            handleOk (){
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: '表头' 
        });
    }
    addNew(){
        Dialog({
            content: (<div>test</div>),
            handleOk (){
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: '合同新建' 
        });
    }
    componentDidMount() {
        this.onSearch();
    }
    render() {
        
        const columns = [{
            title: '合同编号',
            dataIndex: 'ContractNo',
        }, {
            title: '甲方',
            dataIndex: 'CompanyName',
            render: text => <a href="#">{text}</a>,
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '销售人员',
            dataIndex: 'SaleName',
        }, {
            title: '合同类型',
            dataIndex: 'OrderType',
            render: type=> fContractType(type)
        }, {
            title: '合同状态',
            dataIndex: 'OrderStatus',
            render: val=> fContractStatus(val)
        }, {
            title: '合同签订日期',
            dataIndex: 'ContractDate',
            render: val=> fDate(val)
        }, {
            title: '合同总金额',
            dataIndex: 'Amount',
        }, {
            title: '财务审核',
            dataIndex: 'FinancialAuditStatus',
            render: val=> fFinancialAuditStatus(val)
        }, {
            title: '最后操作人',
            dataIndex: 'ModifyUserName',
        }, {
            title: '最后修改日期',
            dataIndex: 'ModifyDate',
            render: val=> fDate(val)
        }, {
            title: 'Action',
            render: (text, record) => (
                <span>
                  <a href="javascript:;" className="ant-dropdown-link" onClick={(e)=>this.openDialog(record)}>
                    More 
                  </a>
                </span>
            ),
        }];
        if(this.hasPower("NEW")){
            search.buttons=[(<Button type="primary" onClick={this.addNew} key="btn_addNew">新建</Button>)]
        }
       
        return (
            <div>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}> 
                </SearchForm>
                <Table columns={columns} 
                    rowKey={record => record.OrderId}
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

export default Manage