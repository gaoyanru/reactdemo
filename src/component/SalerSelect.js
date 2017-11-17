import React, { Component } from 'react'
import { Select } from 'antd';
import { getSalers } from '../api'
const Option = Select.Option;

class SalerSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      data: []
    };
    // {UserId: 40, RealName: "十七", DepartmentId: 0}
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e);
  }
  componentDidMount() {
    getSalers().then(res=>{
      this.setState({data: res.data});
    })
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.UserId}>{d.RealName}</Option>);
    return (
      <Select style={{width: 150}} onChange={this.handleChange}>{options}</Select>
    );
  }
}
export default SalerSelect;
