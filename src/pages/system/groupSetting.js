import React, { Component } from 'react'
import { getListData, postData, putData } from '@/api'
import { message, Spin, Table, Button, List, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import Dialog from '@/container/Dialog'
import { getGroups, addGroup, deleteGroup } from '@/store/actions'
import Prompt from '@/component/Prompt'
import SelectSaler from '@/container/searchComponent/SalerSelect'


class SalerSelect extends Component {
    render() {
        return <SelectSaler multiple={true} width="100%" onChange={v=> this.setState({value:v})}/>
    }
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
        
        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.fetchSalers = this.fetchSalers.bind(this);
        this.addNew = this.addNew.bind(this);
        this.addUsers = this.addUsers.bind(this);
        this.handleRemoveGroup = this.handleRemoveGroup.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }
    handleGroupClick (dep){
        console.log('handleGroupClick')
        this.setState({
            selected: dep
        }, this.fetchSalers)
    }
    handleRemoveGroup (dep){
       this.props.deleteGroups(dep.DepartmentId);
    }
    fetchSalers(){
        if(!this.state.selected) return
        const params = {
            groupId: this.state.selected.DepartmentId
        }
        getListData("groups", params).then(res => {
            this.setState((prevState, props) => ({
              loading: false,
              data: res.data
            }));
        })
    }
    componentWillMount() {
        this.props.getGroups();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.groups && !this.state.selected){
            this.setState({
                selected: nextProps.groups[0]
            }, this.fetchSalers)
        }
    }
    addNew() {
        Prompt({
            title: '分组名称',
            handleOk: (res)=>{
                if(!res){
                    message.error("部门名称不能为空！")
                    return;
                }
                this.props.addGroup({
                    DepartmentName: res,
                    ParentID: 0
                })
            }
        })
    }
    addUsers() {
        const that = this;
        const options = {
            content: <SalerSelect ref={(comp)=>{this.comp = comp}}/>,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    postData('addgroups?departmentid='+ that.state.selected.DepartmentId, that.comp.state.value).then(res=>{
                        if(res.status){
                            message.info('增加成功！')
                            resolve();
                        }else{
                            reject()
                        }
                    })
                
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: '新增用户' 
        };
        Dialog(options).result.then(res=>{
            this.fetchSalers()
        },error=>{
            console.log('Canceled')
        });

    }
    removeUser(user) {
        putData('delgroup?userid='+  user.Id).then(res=>{
            if(res.status){
                message.info('删除成功！')
                this.fetchSalers()
            }
        })
    }
    render() {
        if(!this.props.groups) return (<Spin style={{ marginLeft: 8 }} />);
        const columns = [{
            title: '姓名',
            dataIndex: 'RealName'
        },  {
            title: '操作',
            render: (text, record) => {
                return (
                    <Button.Group  key={"btn_Group_" + record.Id} >
                        <Button size="small" onClick={e=>{this.setLeader(record)}}>设为组长</Button>
                        <Popconfirm placement="topRight" title="确认要删除？" 
                            onConfirm={this.removeUser.bind(this,record)}
                            onClick={e=>{e.stopPropagation()}}
                            okText="是" 
                            cancelText="否">
                            <Button size="small">移除成员</Button>
                        </Popconfirm>
                    </Button.Group>
                )
            }
        }];
        return (
            <div style={{display:'flex'}}>
                <div style={{ width: '300px' }}>
                    <List
                      size="small"
                      bordered
                      dataSource={this.props.groups}
                      renderItem={item => (<List.Item 
                        className={this.state.selected.DepartmentId === item.DepartmentId? "m-list-item active":"m-list-item"} 
                        onClick={(e)=>this.handleGroupClick(item)}
                        actions={[<Popconfirm placement="topRight" title="确认要删除？" 
                            onConfirm={this.handleRemoveGroup.bind(this,item)}
                            onClick={e=>{e.stopPropagation()}}
                            okText="是" 
                            cancelText="否"><Button shape="circle" icon="close" /></Popconfirm>]} 
                        >{item.DepartmentName} 
                        </List.Item>)}
                    />
                    <div style={{textAlign:'center', margin:'12px'}}> <Button type="primary" onClick={e=>{this.addNew()}}>新增分组</Button> </div>  
                </div>
                
                <div style={{flex:1,margin:"0 12px"}}>
                    <div style={{textAlign: 'right'}}> <Button type="primary" size="large" onClick={this.addUsers} style={{margin: '0 0 20px 0'}}>增加成员</Button> </div>
                    <Table columns={columns} 
                        rowKey={record => record.Id}
                        pagination={false}
                        dataSource={this.state.data} 
                        loading={this.state.loading}
                        onChange={this.handleTableChange}
                        size="middle"
                        bordered={true}
                    />
                </div>                
            </div>
        )
    }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    groups: state.groups,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getGroups: payload => {
        dispatch(getGroups())
    },
    addGroup: payload => {
        dispatch(addGroup(payload))
    },
    deleteGroups: payload => {
        dispatch(deleteGroup(payload))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
