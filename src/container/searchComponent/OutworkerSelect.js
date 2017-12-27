import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getOutworkers } from '@/store/actions'

const Option = Select.Option;

class Main extends Component {
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
    this.props.getOutworkers()
  }
  render() {
    if(!this.props.outworkers) return <Spin/>;
    const options = this.props.outworkers.map(d => <Option key={d.UserId}>{d.RealName}</Option>);
    const all = <Option key={0}>全部</Option>
    return (
      <Select style={{width: this.props.width || 150}} defaultValue={this.props.value} onChange={this.handleChange}>
      {(!this.props.hideAll) && all}
      {options}
      </Select>
    );
  }
}
const mapStateToProps = state => {
  return {
    outworkers: state.outworkers,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getOutworkers: payload => {
      dispatch(getOutworkers())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
