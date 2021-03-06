import React from 'react';
import { Form, Input, Spin } from 'antd';
import AreaSelect from '@/container/searchComponent/AreaSelect';
import AddedValue from '@/container/searchComponent/AddedValue';
import Title from '@/component/Title';
import { getListData } from '@/api';
import UploadFile from '@/container/UploadFile';
const FormItem = Form.Item;
const TextArea = Input.TextArea


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {
    state= {
      data: null
    }
    componentWillMount(){
      getListData('customerdetail/'+ this.props.customerId).then(res=>{
        if(res.data){
          const user = JSON.parse(sessionStorage.getItem('user'))
          res.data.CityName = user.CityName;
          res.data.CityCode = user.CityCode;
          this.setState({data: res.data})
        }
      })
    }
    getFieldsValue = ()=>{
      this.props.form.validateFields();
      const errors = this.props.form.getFieldsError();
      if(!hasErrors(errors)){
        let formValues =  this.props.form.getFieldsValue()
        if(this.props.customerId){
          if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD')
          return {...this.state.data,...formValues}
        }else{
          return formValues
        }
      }
      return null

    }
    render () {
      if(!this.state.data) return <Spin/>;
      const formItemLayout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      }
      const data = this.state.data;
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
              label="城市"
            >
              {getFieldDecorator('CityName', {
                initialValue: data.CityName
              })(
                <Input disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="区域"
            >
              {getFieldDecorator('AreaCode', {
                initialValue: data.AreaCode
              })(
                <AreaSelect />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公司地址"
            >
              {getFieldDecorator('Address', {
                initialValue: data.Address
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="纳税人类别"
            >
              {getFieldDecorator('AddedValue', {
                initialValue: data.AddedValue
              })(
                <AddedValue hideAll={true}/>
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
              label="手机"
            >
              {getFieldDecorator('Mobile', {
                initialValue: data.Mobile
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
              label="法人"
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
              label="营业期限"
            >
              {getFieldDecorator('PersonCard', {
                initialValue: data.PersonCard
              })(
                <Input />
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
              label="经营范围"
            >
              {getFieldDecorator('BusinessScope', {
                initialValue: data.BusinessScope
              })(
                <TextArea />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="上传营业执照"
            >
              {getFieldDecorator('BusinessLicense', {
                initialValue: data.BusinessLicense
              })(
                <UploadFile />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="上传法人身份证"
            >
              {getFieldDecorator('PersonCardPath', {
                initialValue: data.PersonCardPath
              })(
                <UploadFile />
              )}
            </FormItem>
        </Form>
        )
    }
}

export default Form.create()(Main);;
