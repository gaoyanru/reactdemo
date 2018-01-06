import React, { Component } from 'react'
import { Select } from 'antd';

const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      data: [{ id:1, label:"银行卡转账" }, {id:2, label: "拉卡拉"}, {id:3, label: "微信"}, {id:4, label: "支付宝"}, {id:5, label: "现金"}]
    };
    // {UserId: 40, RealName: "十七", DepartmentId: 0}
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e);
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.id}>{d.label}</Option>);
    const all = <Option key={0}>全部</Option>
    const value = this.props.value && (''+this.props.value) || '';
    if(this.props.disabled|| this.props.readOnly){
      const item = this.state.data.find(t=>t.id === +this.props.value);
      if(item){
        return <span>{item.label}</span>
      }else{
        return null;
      }
    }
    return (
      <Select size={this.props.size} style={{width: this.props.width || 150}} defaultValue={value} onChange={this.handleChange}>
      {options}
      </Select>
    );
  }
}
export default Main;
