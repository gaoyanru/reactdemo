import React from 'react'
import { Collapse, Checkbox } from 'antd'
import _ from 'lodash'

import { connect } from 'react-redux'
import { getMainTask } from '@/store/actions'

const Panel = Collapse.Panel;
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      common_value: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.onCommonChange = this.onCommonChange.bind(this)
  }
  handleChange(e){
    const val = e.target.value;
    if(!val) return;
    this.props.submitTrack(e.target.value);
    e.target.value = ''
  }
  onCommonChange(v){
    console.log(v)
    if(v.length === 0){
      this.setState({common_value:v});
    }else{
      this.setState(prevState => {
        return {common_value: _.difference(v, prevState.common_value)}
      })
    }
    
  }
  render() {
    const groups = _.groupBy(_.filter(this.props.main_tasks,{Status:1}), 'CommonTaskId')
    return (
      <Collapse accordion defaultActiveKey="1">
        <Panel header="通办任务" key="1">
          <Checkbox.Group onChange={this.onCommonChange} value={this.state.common_value}>
            {_.map(groups,(val,key)=>{
              return (<div key={key}>
                        <div style={{margin:'12px 0', fontSize:'14px'}}><Checkbox value={key}>{val[0].CommonTaskName}</Checkbox></div>
                        <div style={{margin:'0 12px'}}>{val.map((item,index)=>(<span key={key + index}>{index+1}. {item.TaskName}</span>))}</div>
                      </div>
                    );
            })}
          </Checkbox.Group>
        </Panel>
        <Panel header="其他" key="2" disabled={this.state.common_value.length>0}>
          <p>text</p>
        </Panel>
      </Collapse>
    );
  }
}

const mapStateToProps = state => {
  return {
    main_tasks: state.main_tasks,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getMainTask: payload => {
      dispatch(getMainTask())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);