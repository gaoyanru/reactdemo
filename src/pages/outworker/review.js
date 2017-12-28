import React, { Component } from 'react'
import _ from 'lodash'
import SearchForm from '@/container/SearchForm'
import SalerSelect from '@/container/searchComponent/SalerSelect'
import TaskSelect from '@/container/searchComponent/TaskSelect'
import SubtaskSelect from '@/container/searchComponent/SubtaskSelect'
import ServiceStatusSelect from '@/container/searchComponent/ServiceStatusSelect'
import MainTaskStatusSelect from '@/container/searchComponent/MainTaskStatusSelect'
import OutworkerSelect from '@/container/searchComponent/OutworkerSelect'
import AreaSelect from '@/container/searchComponent/AreaSelect'
import ImportData from '@/container/searchComponent/ImportData'
import OutworkerTask from '@/container/Outworker/Task'
import RIf from '@/component/RIF'

import { getListData, postData, putData } from '@/api'
import { Table, Button, message} from 'antd'
import Dialog from '@/container/Dialog'
import { fDate, fServiceStatus, fCheckStatus, fPartTax, fMainTaskStatus, fSubTaskStatus } from '@/config/filters'
import HasPower from '@/container/HasPower'
import Confirm from '@/component/Confirm'


let search = {
    items: [{
        label: '序列ID',
        type: 'text',
        field: 'sequenceNo'
    },{
        label: '公司名称',
        type: 'text',
        field: 'companyName'
    }, {
        label: '任务名称',
        type: 'custom',
        field: 'taskname',
        view: TaskSelect,
        defaultValue: ''
    }, {
        label: '当前子任务',
        type: 'custom',
        field: 'childtaskname',
        view: SubtaskSelect,
        defaultValue: ''
    }, {
        label: '外勤人员',
        type: 'custom',
        field: 'outworkId',
        view: OutworkerSelect,
        defaultValue: '0'
    }, {
        label: '服务状态',
        type: 'custom',
        field: 'servicestatus',
        view: ServiceStatusSelect,
        defaultValue: ''
    }, {
        label: '任务提交日期',
        type: 'date',
        field: 'starttime'
    }, {
        label: '至',
        type: 'date',
        field: 'endtime'
    }, {
        label: '所属区（县）',
        type: 'custom',
        field: 'areacode',
        view: AreaSelect,
        defaultValue: ''
    }, {
        label: '销售人员',
        type: 'custom',
        field: 'salesId',
        view: SalerSelect,
        defaultValue: '0'
    }, {
        label: '主任务状态',
        type: 'custom',
        field: 'taskstatus',
        view: MainTaskStatusSelect,
        defaultValue: ''
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
        this.addNew = this.addNew.bind(this);
        console.log(this)
    }

    handleTableChange (pagination){
        this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
    }
    onSearch(vals={}) {
        this.setState({searchParams: vals, loading: true});
        const pagination =this.state.pagination;
        let params = _.extend({},{outworkId:0,salesId:0,sequenceNo:'',companyname:'',connector:'',taskname:'',childtaskname:'',starttime:'',endtime:'',areacode:'',taskstatus:'',servicestatus:''},vals)
        params.limit = pagination.pageSize;
        params.offset = (pagination.current - 1) * pagination.pageSize;
        console.log('params',params)
        return getListData('maintask', params).then(res => {
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
    addNew(){
        Dialog({
            content: <OutworkerTask data={{}}  wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
            width: 1200,
            handleOk: ()=>{
                
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "添加任务" 
        }).result.then(()=>{
            this.onSearch(this.state.searchParams)
        },()=>{});
    }
    render() {

        const columns = [{
            title: '序列ID',
            dataIndex: 'SequenceNo',
            className: 'text-right',
            width: 65,
            render: (val,row)=>{
                return [<RIf if={!!row.Remark} key={val+'_1'}><span className="remark-msg"></span></RIf>,<span key={val+'_2'}>{val}</span>]
            }
        },{
            title: '公司名称',
            dataIndex: 'CompanyName'
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '所属区域',
            dataIndex: 'AreaName',
        }, {
            title: '销售人员',
            dataIndex: 'SalesName'
        }, {
            title: '服务状态',
            dataIndex: 'ServiceStatus',
            render: val=> fServiceStatus(val)
        }, {
            title: '审核状态',
            dataIndex: 'OutWorkerStatus',
            render: val=> fCheckStatus(val)
        }, {
            title: '会计审核',
            dataIndex: 'AccountantStatus',
            render: val=> fCheckStatus(val)
        }, {
            title: '部分报税',
            dataIndex: 'PartTax',
            render: val=> fPartTax(val)
        }, {
            title: '任务名称',
            dataIndex: 'MainTaskName',
        }, {
            title: '总任务状态',
            dataIndex: 'MainTaskStatus',
            render: val=> fMainTaskStatus(val)
        }, {
            title: '当前子任务',
            dataIndex: 'childTaskName'
        }, {
            title: '子任务状态',
            dataIndex: 'Status',
            render: val=> fSubTaskStatus(val)
        }, {
            title: '当前外勤人员',
            dataIndex: 'OutWorkerName'
        }, {
            title: '提交任务时间',
            dataIndex: 'SubmitTaskTime',
            render: val=> fDate(val)
        }, {
            title: '操作',
            render: (text, record) => (
                <Button.Group >
                    <HasPower key={"btn_DETAIL"} ><Button size="small" onClick={e=>{this.edit(record)}}>查看</Button></HasPower>
                    <HasPower power="REVIEW"  key={"btn_REVIEW"} ><Button size="small" onClick={e=>{this.toOther(record)}} disabled={record.OutWorkerStatus != 1|| record.ServiceStatus==8}>审核</Button></HasPower>
                    <HasPower power="REJECT"  key={"btn_REJECT"} ><Button size="small" onClick={e=>{this.toOther(record)}} disabled={record.OutWorkerStatus != 1|| record.ServiceStatus==8}>驳回</Button></HasPower>
                    <HasPower power="SUBMIT"  key={"btn_SUBMIT"} ><Button size="small" onClick={e=>{this.toPub(record)}}>提交</Button></HasPower>
                </Button.Group>
            ),
        }];

        search.buttons=[
        <HasPower power="ADD" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增</Button></HasPower>]
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

export default Main
