import React, { Component } from 'react'
import { Form, Input, Radio, Select } from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends Component{
  constructor(props) {
    super(props)
  }

  handleSubmit= (e)=> {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onSubmit(values);
        }
      });
  }

  getFieldsValue = ()=>{
    this.props.form.validateFields();
    const errors = this.props.form.getFieldsError();
    console.log(errors);
    if(!hasErrors(errors)){
      let formValues =  this.props.form.getFieldsValue()
      // if(this.props.data.Id){
      //   if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD')
      //   return {...this.props.data,...formValues}
      // }else{
      //   return formValues
      // }
      return formValues
    }
    return null
  }

  render () {
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
      }
      const props = this.props;
      const { getFieldDecorator } = props.form;
      return (
      <Form onSubmit={this.handleSubmit} className="tinyForm">
          <FormItem
            {...formItemLayout}
            label="公司名称"
            hasFeedback
          >
            {getFieldDecorator('CompanyName', {
              rules: [{
                required: true, message: '请填写公司名称!',
              }],
              initialValue: props.data.CompanyName
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="地址"
            hasFeedback
          >
            {getFieldDecorator('Address', {
              rules: [{
                required: true, message: '请填写公司地址!',
              }],
              initialValue: props.data.Address
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="管理员手机号"
            hasFeedback
          >
            {getFieldDecorator('Phone', {
              rules: [{
                required: true, message: '请填写管理员手机号!',
              }],
              initialValue: props.data.Phone
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="管理员姓名"
            hasFeedback
          >
            {getFieldDecorator('RealName', {
              rules: [{
                required: true, message: '请填写管理员姓名!',
              }],
              initialValue: props.data.RealName
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      )
  }
}

Main.propTypes = {
  data: PropTypes.object.isRequired
}

export default Form.create()(Main);
