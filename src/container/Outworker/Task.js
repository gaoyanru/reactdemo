import React from 'react'
import { Form, Input } from 'antd'
import AreaSelect from '@/container/searchComponent/AreaSelect'
import OutworkerTask from '@/container/Outworker/OutworkerTask'

const FormItem = Form.Item;
const TextArea = Input.TextArea


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {
    state= {
      customer:{},
      customerId: this.props.customerId,
      tags: null
    }
    componentWillMount(){

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
        <Form className="tinyForm">
           <FormItem>
              {getFieldDecorator('Task', {
                rules: [{
                  required: true, message: '请选择任务内容!',
                }],
                initialValue: props.data.Task
              })(
                <OutworkerTask />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择公司"
              hasFeedback
            >
              {getFieldDecorator('CompanyName', {
                rules: [{
                  required: true, message: '请选择公司!',
                }],
                initialValue: props.data.CompanyName
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择区域"
              hasFeedback
            >
              {getFieldDecorator('areaSele', {
                rules: [{
                  required: true, message: '请选择区域!',
                }],
                initialValue: props.data.CompanyName
              })(
                <AreaSelect />
              )}
            </FormItem>
        </Form>
        )
    }
}

export default Form.create()(Main);;
