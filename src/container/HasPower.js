import React from 'react'
import { connect } from 'react-redux'
import { powerList } from '@/config/filters'


class HasPower extends React.Component {
  render() {
    const hasPower= powerList(this.props.functions);
    if(hasPower(this.props.power)){
        var tmp = this.porps.children[0];
        return (<tmp/>)
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
