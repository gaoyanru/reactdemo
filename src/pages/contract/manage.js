import React, { Component } from 'react'
import SearchForm from '@/container/SearchForm';
import ContractStatusSelect from '@/component/ContractStatusSelect';
import { getContractManageList } from '@/api'
import { Table } from 'antd';
import Dialog from '@/container/Dialog'

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
            loading: false
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }
    handleTableChange (pagination){
        const pager = {
            ...this.state.pagination
        };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.onSearch(this.state.searchParams);
    }
    onSearch(vals={}) {
        this.setState({searchParams: vals, loading: true});
        const pagination = this.state.pagination;
        vals.limit = pagination.pageSize;
        vals.offset = (pagination.current - 1) * pagination.pageSize;

        getContractManageList(vals).then(res => {
            const pagination = { ...this.state.pagination };
            pagination.total = res.data.total;
            this.setState({
                loading: false,
                data: res.data.list,
                pagination,
            });
        })
    }
    openDialog(row){
        console.log(row);
        Dialog({
            content: (<div>test</div>),
            handleOk (){
                console.log('handleOk')
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: '表头' 
        });
    }
    componentDidMount() {
        this.onSearch();
    }
    render() {
        const search = {
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
                field: 'contractType',
                view: ContractStatusSelect
            }, {
                label: '合同状态',
                type: 'custom',
                field: 'contractType',
                view: ContractStatusSelect
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
            }]
        };
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
            title: 'Action',
            render: (text, record) => (
                <span>
                  <a href="#" className="ant-dropdown-link" onClick={(e)=>this.openDialog(record)}>
                    More 
                  </a>
                </span>
            ),
        }];

        const mapStateToProps = state => {
          return {
            loading: state.loading,
            isLogin: state.isLogin
          }
        }
        const mapDispatchToProps = dispatch => {
          return {
            onSearch: payload => {
              dispatch(login(payload))
            }
          }
        }
        
        
        return (
            <div>
                <SearchForm items={search.items} onSearch={this.onSearch}> 
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

export default Manage;
