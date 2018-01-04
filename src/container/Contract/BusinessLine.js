
import React, { Component } from 'react'
import { DatePicker, Checkbox } from 'antd'
import moment from 'moment'
import _ from 'lodash'
const fDate =(val)=>{
    if((!val) || val.length<10 || val.substr(0,4)==='0001') return null;
    return val.substr(0, 10);
}
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RegisterDate: null,
      BusnissDeadline: null,
      NoDeadLine: this.props.value.NoDeadLine
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(v) {
    this.setState(v,()=>{
      this.props.onChange(this.state);
    });
  }
  render() {
    let data = _.extend({
      RegisterDate: null,
      BusnissDeadline: null,
      NoDeadLine: false
    }, this.props.value);
    data.RegisterDate = fDate(data.RegisterDate);
    data.BusnissDeadline = fDate(data.BusnissDeadline);
    return (
      <div style={{display:'inline-block'}}>
        <DatePicker defaultValue={data.RegisterDate && moment(data.RegisterDate)} onChange={v=>{this.handleChange({RegisterDate:v.format('YYYY-MM-DD')})}}/> 
        <span>至</span> 
        <DatePicker disabled={!!this.state.NoDeadLine} defaultValue={data.BusnissDeadline && moment(data.BusnissDeadline)} onChange={v=>{this.handleChange({BusnissDeadline:v.format('YYYY-MM-DD')})}}/>  
        <Checkbox defaultChecked={data.NoDeadLine} onChange={e=>{this.handleChange({NoDeadLine: e.target.checked})}}>无期限</Checkbox>
      </div>
    );
  }
}

export default Main;