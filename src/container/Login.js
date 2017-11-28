
import React, { Component } from 'react'
// import { hashHistory } from 'react-router'
import { Spin, message, Form, Icon, Input, Button, Row, Col } from 'antd'
// import { requestLogin } from './api'

import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

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
        <div className="btmLogin">
          <div className="sy_bottom">
            <h1 id="PerformName">ERP</h1>
            <Row className="ul-wrap">
              <Col span={24}>
                <Spin spinning={!!this.props.loading}>
                  <Form onSubmit={this.handleSubmit}>
                    <FormItem hasFeedback>
                      {getFieldDecorator('UserName', {
                        rules: [
                          { required: true, message: '请输入用户名' },
                          { validator: this.checkName },
                          // { pattern: regExpConfig.IDcardTrim, message: '身份证号格式不正确' }
                        ],
                        // validateTrigger: 'onBlur',
                      })(
                        <Input
                          prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                          placeholder="请输入用户名"
                          type="text"
                        />
                        )}
                    </FormItem>
                    <FormItem hasFeedback>
                      {getFieldDecorator('PassWord', {
                        rules: [
                          { required: true, message: '请输入密码' },
                          // { pattern: regExpConfig.pwd, message: '密码只能是6-16个数字或者字母组成' }
                        ],
                        // validateTrigger: 'onBlur',
                      })(
                        <Input
                          prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                          placeholder="请输入密码"
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
          </div>
        </div>
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
