import React from 'react'
import { connect } from 'react-redux'
import { powerList } from '@/config/filters'


class HasPower extends React.Component {
  render() {
    console.log('HasPower',this.props)
    const hasPower= powerList(this.props.functions);
    if(hasPower(this.props.power)){
        return (<span>{this.props.children}</span>)
    }else{
        return null;
    }
  }
}
const mapStateToProps = state => {
  return {
    functions: state.functions
  }
}

export default connect(mapStateToProps)(HasPower);
