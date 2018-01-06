import React, { Component } from 'react'
import { Button, Row, Col, Form, DatePicker, message } from 'antd'
import _ from 'lodash'
import { putData, postData } from '@/api'
import store from '@/store'

const FormItem = Form.Item;

class ModelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceStartDate: '',
      serviceEndDate: '',
      contractMonth: ''
    }
    this.getserviceEndDate = this.getserviceEndDate.bind(this);
    this.submit = this.submit.bind(this);
  }
  getserviceEndDate(){
    console.log(arguments, 'start')
    console.log(this.props.form)
    console.log(this.props.form.getFieldsValue(), 'this.')
    const allmonths = this.props.data.OrderMonths + this.props.data.GiftMonth
    this.setState({contractMonth: allmonths}, () => {
      // var serviceMonth = allmonths - 1
      // var start = _.extend(this.props.form.getFieldsValue().serviceStartDate)
      // var serviceStart = start.format('YYYY-MM-DD')
      // var date = new Date(serviceStart)
      // var enddate = new Date(date.setMonth(date.getMonth() + serviceMonth))
      this.setState({serviceEndDate: '2018-10'})
      console.log(this.state.serviceEndDate)
    })
  }
  submit() {
    const info = this.props.data
    var AccountantTaskSource = info.AccountantTaskSource,
    PartTax = info.PartTax,
    ServiceStatus = info.ServiceStatus;
    var ServiceStart = _.extend(this.props.form.getFieldsValue().serviceStartDate).format('YYYY-MM')
    var ServiceEnd = this.state.serviceEndDate
    putData('order/audit/pass/' + info.OrderId + '?accountantTaskSource=' + AccountantTaskSource + '&partTax=' + PartTax + '&serviceStatus=' + ServiceStatus + '&serviceStartDate=' + ServiceStart + '&serviceEndDate=' + ServiceEnd).then(res => {
      console.log(store)
      store.dispatch({
        type: 'set contract account modal status',
        status: {
          modal1: false,
          modal2: false
        }
      })
      if (res.status) {
        message.info('审核成功！');
        // 关闭上一个弹窗并且刷新列表
      }
    })
  }
  render() {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <div>
        <div><label>合同编号：</label>{data.ContractNo}</div>
        <div><label>服务月份：</label>{data.OrderMonths + data.GiftMonth + '个月'}</div>
        <Form layout="vertical">
          <FormItem
            {...formItemLayout}
            label="请选择首报月"
          >
            {getFieldDecorator('serviceStartDate', {
              rules: [{
                required: true, message: '请选择首报月!',
              }]
            })(
              <DatePicker onChange={this.getserviceEndDate}/>
            )}
          </FormItem>
        </Form>
        <div><label>服务结束月：</label>{this.state.serviceEndDate}</div>
        <Button type="primary" onClick={this.submit} >保存并提交</Button>
      </div>
    )
  }
}
export default Form.create()(ModelForm)
