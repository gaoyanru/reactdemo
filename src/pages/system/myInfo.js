import React, { Component } from 'react'
import { fetchUserInfo, postData, putData } from '@/api'
import { message } from 'antd'
import { connect } from 'react-redux'
import Title from '@/component/Title'
import UserInfo from '@/container/UserInfo'
import ResetPassword from '@/container/ResetPassword'

import {fContractType, fContractStatus, fDate, fFinancialAuditStatus, powerList} from '@/config/filters'


class MyInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchMyInfo = this.fetchMyInfo.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.state = {
            userInfo: null
        }
    }
    handleSubmit (data){
        postData('users', data).then(res=>{
            if(res.status){
                message.info('保存成功！')
            }
        })
    }
    resetPassword (data){
        putData('user/pwd/reset',data).then(res=>{
           if(res.status){
            message.info('密码修改成功！')
           }
        })
    }
    fetchMyInfo(){
        fetchUserInfo(this.props.userId).then(res=>{
            this.setState({userInfo:res.data})
        })
    }
    componentDidMount() {
        this.fetchMyInfo();
    }
    render() {
        if(!this.state.userInfo) return (<b>loading</b>);
        return (
            <div>
                <Title title="修改用户信息" />
                <div style={{width:'600px',padding:'24px'}}>
                    <UserInfo user={this.state.userInfo} onSubmit={this.handleSubmit} />
                </div>
                <Title title="修改密码" />
                <div style={{width:'600px',padding:'24px'}}>
                    <ResetPassword  onSubmit={this.resetPassword} />
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
  return {
    userId: state.user.Id
  }
}
export default connect(mapStateToProps)(MyInfo)
