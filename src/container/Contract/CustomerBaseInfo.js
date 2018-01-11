import React from 'react';
import { Form, Input, Spin } from 'antd';
import Title from '@/component/Title';
import CustomerSelect from '@/container/CustomerSelect';
import { getListData } from '@/api';
import _ from 'lodash';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {   
    getFieldsValue = ()=>{
      if(this.validateField()) return null;
      const fields = this.props.form.getFieldsValue();
      return {
        CustomerId: fields.Company.Id,
        CompanyName: fields.Company.CompanyName,
        Connector: fields.Connector,
        Mobile: fields.Mobile,
        SalesId: fields.Company.SalesId,
        SalesName: fields.Company.SalesName
      }
    }
    componentWillReceiveProps(nextProps){
      const data = nextProps.data;
      if(data && (!data.Company) && data.CustomerId){
        data.Company = {
          CompanyName: data.CompanyName,
          Id: data.CustomerId
        }
        this.props.form.setFieldsValue({Company: data.Company});
      }
    }
    validateField = ()=>{
      this.props.form.validateFields();
      const errors = this.props.form.getFieldsError();
      return hasErrors(errors);
    }
    CustomerSelected = (v)=>{
      console.log('CustomerSelected', v);
      const setFieldsValue = this.props.form.setFieldsValue;
      setFieldsValue({CompanyId: v.CustomerId});
      setFieldsValue({CompanyName: v.CompanyName});
      setFieldsValue({Connector: v.Connector});
      setFieldsValue({Mobile: v.Mobile});
      setFieldsValue({SalesName: v.SalesName});
    }
    render () {
      let data = this.props.data || {};
      if(data && (!data.Company) && data.CustomerId){
        data.Company = {
          CompanyName: data.CompanyName,
          Id: data.CustomerId
        }
      }
      const formItemLayout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 14,
        }
      };
      
      const { getFieldDecorator } = this.props.form;
      console.log(data)
      return (
        <Form className="tinyForm" layout="inline">
            <Title title= '客户基本信息'/>
             <FormItem 
              {...formItemLayout}
              label="甲方"
             >
              {getFieldDecorator('Company', {
                rules: [{
                  required: true, message: '请选择公司!',
                }],
                initialValue: data.Company
              })(
                <CustomerSelect canEdit={true} readOnly={this.props.readOnly}  onChange={this.CustomerSelected}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
            >
              {getFieldDecorator('Connector', {
                rules: [{
                  required: true, message: '请填写联系人!',
                }],
                initialValue: data.Connector
              })(
                <Input readOnly={this.props.readOnly}/>
              )}
            </FormItem>
             <FormItem
              {...formItemLayout}
              label="联系电话"
            >
              {getFieldDecorator('Mobile', {
                rules: [{
                  required: true, message: '请填写联系电话!',
                }],
                initialValue: data.Mobile
              })(
                <Input readOnly={this.props.readOnly}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="签单销售"
            >
              {getFieldDecorator('SalesName', {
                rules: [{
                  required: true, message: '请保证客户有签单销售!'
                }],
                initialValue: data.Mobile
              })(
                <Input disabled/>
              )}
            </FormItem>
        </Form>
        )
    }
}

export default Form.create()(Main);;
