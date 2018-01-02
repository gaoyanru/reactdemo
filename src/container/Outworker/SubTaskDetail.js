import React, { Component } from 'react'
import { Table, Icon, Button, Tooltip, message } from 'antd'
import RIf from '@/component/RIF'
import HasPower from '@/container/HasPower'
import _ from 'lodash'
import { getListData, postData, putData } from '@/api'
import { fDate, fSubTaskDetailStatus } from '@/config/filters'
import OutworkerSelect from '@/container/searchComponent/OutworkerSelect'
import EditCustomer from '@/container/Outworker/EditCustomer'
import Dialog from '@/container/Dialog'
import Confirm from '@/component/Confirm'
import { powerList } from '@/config/filters'



class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: [],
      loading: true,
      toall: ' '
    };
    this.onToOtherAll = this.onToOtherAll.bind(this);
    this.onToOther = this.onToOther.bind(this);
    this.toOther = this.toOther.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.edit = this.edit.bind(this);

    this.hasPower= powerList(props.functions);
    this.onSearch();
  }
  edit(row){
    Dialog({
        content: <EditCustomer customerId={row.Id}/>,
        width: 800,
        handleOk: ()=>{
            return new Promise((resolve, reject) => {
                // this.toOther(row.Id,saler).then(res=>{
                //     if(res.status){
                //         message.info('转出成功！')
                //         this.onSearch()
                //         resolve()
                //     }
                // })
            });
        },
        confirmLoading: false,
        handleCancel (){
            console.log('onCancel')
        },
        title: "编辑"
    }).result.then(()=>{
        this.onSearch(this.state.searchParams)
    },()=>{});
  }
  onToOther(row){
    let saler;
    Dialog({
        content: <div><span>选择外勤:&nbsp;&nbsp;</span><OutworkerSelect hideAll={true} onChange={v=>{saler=v}}/></div>,
        width: 540,
        handleOk: ()=>{
            return new Promise((resolve, reject) => {
                this.toOther(row.Id,saler).then(res=>{
                    if(res.status){
                        message.info('转出成功！')
                        this.onSearch()
                        resolve()
                    }
                })
            });
        },
        confirmLoading: false,
        handleCancel (){
            console.log('onCancel')
        },
        title: "任务转出-"+ row.TaskName 
    }).result.then(()=>{
        this.onSearch(this.state.searchParams)
    },()=>{});
  }
  onToOtherAll(wid){
    this.toOther(this.state.selected.join(','), wid).then(res=>{
      if(res.status){
        message.info('转出成功！')
        this.onSearch()
      }
    });
  }
  toOther(ids,wid){
    return putData(`childtask/trans?ids=${ids}&outworkerId=${wid}`);
  }
  changeStatus(id,status,msg){
    Confirm({
      message: `确认要${msg}?`
    }).result.then(()=>{
      putData(`childtask/${id}/${status}`).then(res=>{
        if(res.status){
          message.info('操作成功！')
          this.onSearch()
        }
      });
    });
  } 
  onSearch(){
    getListData('maintask/'+ this.props.item.Id).then(res=>{
      if(res.status){
        this.setState({data: res.data,loading: false})
      }
    })
  }
  render() {
    const columns = [{
            title: '序列ID',
            dataIndex: 'Id'
        },{
            title: '子任务名称',
            dataIndex: 'TaskName'
        },{
            title: '当前外勤人员',
            dataIndex: 'OutWorkerName'
        },{
            title: '开始时间',
            dataIndex: 'StartTime',
            render: val=> fDate(val)
        },{
            title: '完成时间',
            dataIndex: 'EndTime',
            render: val=> fDate(val)
        },{
            title: '状态',
            dataIndex: 'Status',
            render: val=> fSubTaskDetailStatus(val)
        },{
            title: '操作',
            width: 305,
            render: (text, record) => (
                <Button.Group >
                    <HasPower power="DETAIL"  key={"btn_DETAIL"} ><Button size="small" onClick={e=>{this.edit(record)}} disabled={record.Status != 3}>编辑</Button></HasPower>
                    <HasPower power="ENSURE"  key={"btn_ENSURE"} ><Button size="small" onClick={e=>{this.changeStatus(record.Id,3,'确认资料')}} disabled={record.Status!==2}>确认资料</Button></HasPower>
                    <HasPower power="COMPLETE"  key={"btn_COMPLETE"} ><Button size="small" onClick={e=>{this.changeStatus(record.Id,5,'完成任务')}} disabled={record.Status!==3}>完成</Button></HasPower>
                    <HasPower power="TOOTHER"  key={"btn_TOOTHER"} ><Button size="small" onClick={e=>{this.onToOther(record)}} disabled={record.Status>3}>转接任务</Button></HasPower>
                    <HasPower power="CANCELSUB"  key={"btn_CANCELSUB"} ><Button size="small" onClick={e=>{this.changeStatus(record.Id,4,'完成任务')}} disabled={record.Status>3}>取消</Button></HasPower>
                </Button.Group>
            )
        }];
    let rowSelection;
    if(this.hasPower("FENPEIALL")){
      rowSelection = {
        getCheckboxProps: record => {
          return {
            disabled : record.Status>3
          }
        },
        onChange: vals =>{
          this.setState({selected: vals})
        }
      }
    }else{
      rowSelection = null;
    }
    return (
      <div>
        <div style={{textAlign:'right',padding: '12px'}}>
          <RIf if={!this.props.curUser.IsChannel}><Tooltip placement="top" title={this.props.item.Remark}>
            <Icon type="warning" style={{color: "red", fontSize: "20px"}} />
          </Tooltip></RIf>
          <HasPower power="SUBMIT" ><Button type="primary" disabled={this.state.isSub} onClick={this.addNew} style={{margin:'0 8px'}}>提交会计</Button></HasPower>
        </div>
        <Table columns={columns}
          rowKey={record => record.Id}
          dataSource={this.state.data}
          loading={this.state.loading}
          pagination={false} 
          onChange={this.handleTableChange}
          size="middle"
          rowSelection = {rowSelection}
          bordered={true}
        />
        <HasPower power="FENPEIALL" >
          <div style={{padding: '12px'}}><span>批量分配</span> <OutworkerSelect value={this.state.toall} hideAll={true} onChange={this.onToOtherAll} disabled={this.state.selected.length === 0}/></div>
        </HasPower>
      </div>
    );
  }
}


export default Main


