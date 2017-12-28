import React from 'react'
import { Form, Input, DatePicker } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import CustomerType from '@/container/searchComponent/CustomerType'
import CustomerSourceSelect from '@/container/searchComponent/CustomerSourceSelect'

const FormItem = Form.Item;
const TextArea = Input.TextArea

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {

    handleSubmit= (e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.onSubmit(values);
          }
        });
    }
    getFieldsValue = ()=>{
      const errors = this.props.form.getFieldsError();
      if(!hasErrors(errors)){
        let formValues =  this.props.form.getFieldsValue()
        if(this.props.data.Id){
          if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD')
          return {...this.props.data,...formValues}
        }else{
          return formValues
        }
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
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
              hasFeedback
            >
              {getFieldDecorator('Connector', {
                rules: [{
                  required: true, message: '请填写联系人!',
                }],
                initialValue: props.data.Connector
              })(
                <Input type="text" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系电话"
              hasFeedback
            >
              {getFieldDecorator('Mobile', {
                rules: [{
                  required: true, message: '请填写联系电话!',
                }],
                initialValue: props.data.Mobile
              })(
                <Input type="text" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="注册时间"
            >
              {getFieldDecorator('RegisterDate', {
                initialValue: props.data.RegisterDate && props.data.RegisterDate.substr(0,4)!=='0001'?moment(props.data.RegisterDate):null
              })(
                <DatePicker/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="意向度"
              hasFeedback
            >
              {getFieldDecorator('CustomerTypeId', {
                rules: [{
                  required: true, message: '请选择意向度!',
                }],
                initialValue: props.data.CustomerTypeId || ''
              })(
                <CustomerType hideAll={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="来源"
            >
              {getFieldDecorator('CustomerSourceId', {
                initialValue: ''+ (props.data.CustomerSourceId || '') 
              })(
                 <CustomerSourceSelect hideAll={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label= '备注'
            >
              {getFieldDecorator('Mark', {
                initialValue: props.data.Mark
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
            {props.data.Id && <FormItem
              {...formItemLayout}
              label="创建时间"
              hasFeedback
            >
              {props.data.CreateDate?moment(props.data.CreateDate).format('YYYY-MM-DD HH:mm:ss'):null}
            </FormItem>}
          </Form>
        )
    }
}
Main.propTypes = {
  data: PropTypes.object.isRequired
}

export default Form.create()(Main);
