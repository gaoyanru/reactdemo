import React, { Component } from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import { getAllSalers } from '@/store/actions'


const Option = Select.Option;

class SalerSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e);
  }
  componentWillMount() {
    this.props.getAllSalers()
  }
  render() {
    if(!this.props.salers) return null;
    const options = this.props.salers.map(d => <Option key={d.Id}>{d.RealName}</Option>);
    const all = <Option key={0}>全部</Option>
    return (
      <Select 
        style={{width: this.props.width || 150}} 
        mode={this.props.multiple?'multiple':''} 
        showSearch={!this.props.multiple} 
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        defaultValue={this.props.value} 
        onChange={this.handleChange}
      >
      {(!this.props.multiple) && all}
      {options}
      </Select>
    );
  }
}
const mapStateToProps = state => {
  return {
    salers: state.salers,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllSalers: payload => {
      dispatch(getAllSalers())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SalerSelect);
