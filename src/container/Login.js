
import React, { Component } from 'react'
// import { hashHistory } from 'react-router'
import { Spin, Form, Icon,  Button, Row, Col } from 'antd'
// import { requestLogin } from './api'
import CInput from '@/component/clearableInput'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import  '@/style/login.less';

const FormItem = Form.Item

class Login extends Component {
    // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    console.log(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onLogin(values);
      }
    })
  }
  render() {
    // const { loginResponse } = this.props.loginResponse

     if (this.props.isLogin) {
      return (
        <Redirect to={'/main'}/>
      )
    }

    const  getFieldDecorator  = this.props.form.getFieldDecorator
    return (
      <div className="login">
        <div className="title"><span className="logo"></span> <span className="text">噼里啪ERP管理系统</span> <span className="text-tag">V2.2.2</span></div>
        <Row className="logo-context">
          <Col span={24}>
            <Spin spinning={!!this.props.loading}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('UserName')(
                    <CInput
                      prefix={<Icon type="user"/>}
                      placeholder="请输入用户名"
                      type="text"
                      size="large"
                    />
                    )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('PassWord')(
                    <CInput
                      prefix={<Icon type="lock" />}
                      placeholder="请输入密码"
                      size="large"
                      type="password"
                    />
                    )}

                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit">登录</Button>
                </FormItem>
              </Form>
            </Spin>
          </Col>
        </Row>
        <div className="down-app">
          <div className="down-app-img"></div>
          <div className="down-app-text">扫一扫下载移动端</div>
        </div>
        <div className="footer">@2017 北京爱康鼎科技有限公司 版权所有</div>
      </div>
    );
  }
}

Login.propTypes = {
  loading: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default Form.create()(Login);
