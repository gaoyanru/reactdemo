import React, { Component } from 'react'
import { Form, Select, Input, Button, DatePicker } from 'antd';
import zhcn from 'antd/lib/date-picker/locale/zh_CN'

console.log('zhcn',zhcn)
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSearch(values)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const Items = this.props.items.map((item,index)=>{
      if(item.type === "text"){
        return (
          <FormItem label={item.label} key={index}>
            {getFieldDecorator(item.field,{initialValue: item.defaultValue ||''})(<Input style={{width: 150}}/>)}
          </FormItem>
        )
      }else if(item.type === "select"){
        if(!item.data) return null;
        let options;
        if(Array.isArray(item.data)){
          options = item.data.map(d => <Option key={d[(item.option && item.option.key) || 'id']}>{d[(item.option && item.option.key)||'label']}</Option>);
        }else if(typeof item.data === 'object'){
          let arr = [];
          for(var key in item.data){
            arr.push({id: key, label: item.data[key]})
          }
          options = arr.map(d => <Option key={d.id}>{d.label}</Option>);;
        }
        return (
          <FormItem label={item.label} key={index}>
            {getFieldDecorator(item.field,{initialValue: item.defaultValue ||''})(<Select style={{width: 150}}>{options}</Select>)}
          </FormItem>
        );
      }else if(item.type === "custom"){
        return (
          <FormItem label={item.label} key={index}>
            {getFieldDecorator(item.field,{initialValue: item.defaultValue || null})(<item.view style={{width: 150}}/>)}
          </FormItem>
        );
      }else if(item.type === "date"){
        return (
          <FormItem label={item.label} key={index}>
            {getFieldDecorator(item.field,{initialValue: item.defaultValue || null})(<DatePicker locale={zhcn} style={{width: 150}}/>)}
          </FormItem>
        );
      }
      return null;
    });
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} className="ant-advanced-search-form">
        {Items}
        <FormItem>
          <Button type="primary" htmlType="submit">查询</Button>
          {this.props.buttons}
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(SearchForm);
