import React, { Component } from 'react'
import { fetchUserInfo, postData, putData } from '@/api'
import { message, Spin } from 'antd'
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
        console.log(this.props.departments)
        if(!this.props.departments) return (<Spin style={{ marginLeft: 8 }} />);
        return (
            <div>
                <Department data={this.props.departments} companyName={this.props.user.SubsidiaryName} onclick={this.handleDepartmentClick}  style={{ width: '300px' }}/>                
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
