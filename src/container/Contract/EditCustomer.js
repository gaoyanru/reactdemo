import React from 'react';
import { Form, Input, Spin } from 'antd';
import AreaSelect from '@/container/searchComponent/AreaSelect';
import AddedValue from '@/container/searchComponent/AddedValue';
import BusinessLine from '@/container/Contract/BusinessLine'
import Title from '@/component/Title';
import { getListData } from '@/api';
import _ from 'lodash';
import UploadFile from '@/container/UploadFile';
const FormItem = Form.Item;
const TextArea = Input.TextArea


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {   
    getFieldsValue = ()=>{
      this.props.form.validateFields();
      const errors = this.props.form.getFieldsError();
      if(!hasErrors(errors)){
        let formValues =  this.props.form.getFieldsValue();
        formValues = _.extend(formValues,formValues.BusinessLine)
        // if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD');
        delete formValues.BusinessLine;
        return {...this.props.data,...formValues}
      }
      return null

    }
    render () {
      if(!this.props.data) return <Spin/>;
      const formItemLayout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      }
      const data = this.props.data;
      const { getFieldDecorator } = this.props.form;
      return (
        <Form className="tinyForm form-3col" layout="inline">
            <Title title= '客户基本信息'/>
             <FormItem 
              {...formItemLayout}
              label="公司名称"
             >
              {getFieldDecorator('CompanyName', {
                initialValue: data.CompanyName
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
            >
              {getFieldDecorator('Connector', {
                initialValue: data.Connector
              })(
                <Input />
              )}
            </FormItem>
             <FormItem
              {...formItemLayout}
              label="联系电话"
            >
              {getFieldDecorator('Mobile', {
                initialValue: data.Mobile
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属销售"
            >
              {getFieldDecorator('SalesName', {
                initialValue: data.SalesName
              })(
                <Input disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="纳税人类别"
            >
              {getFieldDecorator('AddedValue', {
                initialValue: data.AddedValue
              })(
                <AddedValue hideAll={true} disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属区域"
            >
              {getFieldDecorator('AreaCode', {
                initialValue: data.AreaCode
              })(
                <AreaSelect />
              )}
            </FormItem>
            <FormItem className="form-row"
              {...formItemLayout}
              label="公司地址"
            >
              {getFieldDecorator('Address', {
                initialValue: data.Address
              })(
                <Input />
              )}
            </FormItem>
            <Title title= '营业执照信息'/>
            <FormItem
              {...formItemLayout}
              label="注册号"
            >
              {getFieldDecorator('RegNO', {
                initialValue: data.RegNO
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="营业执照"
            >
              {getFieldDecorator('BusinessLicense', {
                initialValue: data.BusinessLicense
              })(
                <UploadFile additional="?x-oss-process=image/resize,m_lfit,h_30,w_50"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="注册资金"
            >
              {getFieldDecorator('RegisteredCapital', {
                initialValue: data.RegisteredCapital
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="法人姓名"
            >
              {getFieldDecorator('LegalPerson', {
                initialValue: data.LegalPerson
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="法人身份证号"
            >
              {getFieldDecorator('PersonCardID', {
                initialValue: data.PersonCardID
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="法人身份证"
            >
              {getFieldDecorator('PersonCardPath', {
                initialValue: data.PersonCardPath
              })(
                <UploadFile additional="?x-oss-process=image/resize,m_lfit,h_30,w_50"/>
              )}
            </FormItem>
            <FormItem className="form-row"
              {...formItemLayout}
              label="营业期限"
            >
              {getFieldDecorator('BusinessLine', {
                initialValue: _.pick(data, ['RegisterDate','BusnissDeadline','NoDeadLine'])
              })(
                <BusinessLine />
              )}
            </FormItem>
            <FormItem className="form-row"
              {...formItemLayout}
              label="经营范围"
            >
              {getFieldDecorator('BusinessScope', {
                initialValue: data.BusinessScope
              })(
                <TextArea />
              )}
            </FormItem>
            
            
        </Form>
        )
    }
}

export default Form.create()(Main);;
