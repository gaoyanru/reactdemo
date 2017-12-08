import React, { Component } from 'react'
import { fetchUserInfo, postData, putData } from '@/api'
import { message, Spin, Table } from 'antd'
import { connect } from 'react-redux'
import { getDepartments } from '@/store/actions'
import Department from '@/container/Department'

class Users extends Component {
    handleDepartmentClick (data){
        console.log(data)
       
    }
    componentWillMount() {
        console.log('componentWillMount');
        this.props.getDepartments();
    }
    render() {
        if(!this.props.departments) return (<Spin style={{ marginLeft: 8 }} />);
        const columns = [{ 
            title: '员工编号',
            dataIndex: 'EmployeeNo'
        }, {
            title: '姓名',
            dataIndex: 'RealName'
        }, {
            title: '手机号',
            dataIndex: 'Phone',
        }, {
            title: '所属部门',
            dataIndex: 'DepartmentName',
        }, {
            title: '角色',
            dataIndex: 'RoleStrs'
        }, {
            title: '最后操作人',
            dataIndex: 'ModifyBy'
        }, {
            title: '最后修改日期',
            dataIndex: 'ModifyDate'
        },  {
            title: '操作',
            render: (text, record) => (
                <span>
                    <a ng-show="hasPower('EDIT')" ng-if="customer.Status ==='1'"  href="javascript:;" ng-click="open(customer)">编辑</a>
                    <a ng-show="hasPower('STOP')" ng-if="customer.Status ==='1'" href="javascript:;" ng-click="status(customer,2)">禁用</a>
                    <a ng-show="hasPower('STOP')" ng-if="customer.Status ==='2'" href="javascript:;" ng-click="status(customer,1)">启用</a>
                    <a ng-show="hasPower('STOP')"  ng-if="customer.Status ==='1'" href="javascript:;" ng-click="reset(customer)">重置密码</a>
                </span>
            ),
        }];
        return (
            <div style={{display:'flex'}}>
                <Department data={this.props.departments} companyName={this.props.user.SubsidiaryName} onclick={this.handleDepartmentClick}  style={{ width: '300px' }}/>
                <div style={{flex:1,margin:"0 12px"}}>
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
            </div>
        )
    }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    departments: state.departments
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getDepartments: payload => {
      dispatch(getDepartments({offset:0,limit:99999}))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Users)
