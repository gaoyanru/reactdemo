import React, { Component } from 'react'
import { Button, Row, Col, Form, DatePicker, message } from 'antd'
import _ from 'lodash'
import { putData, postData } from '@/api'
import store from '@/store'
import $ from 'jquery'

const FormItem = Form.Item;

class ModelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceStartDate: '',
      serviceEndDate: '',
      contractMonth: '',
      setFirstMonth: ''
    }
    this.getserviceEndDate = this.getserviceEndDate.bind(this);
    this.submit = this.submit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }
  componentWillMount() {
    var setFirstMonth = _.filter(this.props.data.CrmOrderItems, {
      "ChildItemId": 1,
      "MainItemId": 1
    })
    this.setState({setFirstMonth: setFirstMonth})
  }
  closeDialog(){
    this.handler.close();
  }
  getserviceEndDate(){
    console.log(this.props.data, 'this.props.data')
    const setFirstMonth = _.filter(this.props.data.CrmOrderItems, {
      "ChildItemId": 1,
      "MainItemId": 1
    })
    console.log(setFirstMonth, 'setFirstMonth')
    const allmonths = setFirstMonth[0].OrderMonths + (setFirstMonth[0].GiftMonth ? this.props.setFirstMonth[0].GiftMonth : 0)
    this.setState({contractMonth: allmonths}, () => {
      var serviceMonth = allmonths - 1
      var start = _.cloneDeep(this.props.form.getFieldsValue().serviceStartDate)
      var enddate = _.cloneDeep(start).add(serviceMonth, 'month')
      this.setState({serviceEndDate: enddate.format('YYYY-MM')})
      console.log(this.state.serviceEndDate)
    })
  }
  submit() {
    const info = this.props.data
    var AccountantTaskSource = info.AccountantTaskSource,
    PartTax = info.PartTax?info.PartTax:0,
    ServiceStatus = info.ServiceStatus;
    var ServiceStart = _.extend(this.props.form.getFieldsValue().serviceStartDate).format('YYYY-MM')
    var ServiceEnd = this.state.serviceEndDate
    putData('order/audit/pass/' + info.OrderId + '?accountantTaskSource=' + AccountantTaskSource + '&partTax=' + PartTax + '&serviceStatus=' + ServiceStatus + '&serviceStartDate=' + ServiceStart + '&serviceEndDate=' + ServiceEnd).then(res => {
      console.log(store)
      if (res.status) {
        message.info('审核成功！');
        this.closeDialog();
        store.dispatch({
          type: 'set contract account modal status',
          status: {
            modal1: false,
            modal2: false
          }
        })
      }
    })
  }
  render() {
    const { form, data } = this.props;
    console.log(data, 'data')
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
      <div style={{overflow: 'hidden'}}>
        <div><label>合同编号：</label>{data.ContractNo}</div>
        <div><label>服务月份：</label>{this.state.setFirstMonth[0].OrderMonths + this.state.setFirstMonth[0].GiftMonth + '个月'}</div>
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
        <Button style={{float: 'right'}} type="primary" onClick={this.submit} >保存并提交</Button>
      </div>
    )
  }
}
export default Form.create()(ModelForm)
