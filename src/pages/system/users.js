import React, { Component } from 'react'
import { fetchUserInfo, postData, putData } from '@/api'
import { message, Card } from 'antd'
import { connect } from 'react-redux'
import { getDepartments } from '@/store/actions'
import _ from 'lodash'



class Users extends Component {
    handleSubmit (data){
        console.log(this.state.userInfo,data,_.extend(this.state.userInfo,data))
        postData('users', _.extend(this.state.userInfo,data)).then(res=>{
            if(res.status){
                message.info('保存成功！')
            }
        })
    }
    componentWillMount() {
        console.log('componentWillMount');
        this.props.getDepartments();
    }
    render() {
        if(!this.state.userInfo) return (<b>loading</b>);
        return (
            <div>
                <Card title="我的信息" bordered={false} style={{ width: 600 }}>                
                    <div style={{width:'600px',padding:'24px'}}>
                        <UserInfo user={this.state.userInfo} onSubmit={this.handleSubmit} />
                    </div>
                </Card>
                <Card title="修改密码" bordered={false} style={{ width: 600 }}> 
                    <div style={{width:'600px',padding:'24px'}}>
                        <ResetPassword  onSubmit={this.resetPassword} />
                    </div>
                </Card>
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

export default connect(mapStateToProps)(Users)
