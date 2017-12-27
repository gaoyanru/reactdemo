import React, { Component } from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import { getAreas } from '@/store/actions'


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
    this.props.getAreas()
  }
  render() {
    if(!this.props.salers) return null;
    const options = this.props.salers.map(d => <Option key={d.AreaCode}>{d.AreaName}</Option>);
    const all = <Option key=''>全部</Option>
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
    areas: state.areas,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAreas: payload => {
      dispatch(getAreas())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);