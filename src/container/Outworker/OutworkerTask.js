import React from 'react'
import { Collapse, Checkbox } from 'antd'
import _ from 'lodash'

import { connect } from 'react-redux'
import { getMainTask , getSubTask } from '@/store/actions'

const Panel = Collapse.Panel;
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      common_value: [],
      other_value: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.onCommonChange = this.onCommonChange.bind(this)
    this.onOtherChange = this.onOtherChange.bind(this)
  }
  handleChange(){
    let result = {
      CommonTaskId: null,
      ChildTasks: [],
      MainTaskName: ''
    }
    if(this.state.common_value.length>0){
      const items = _.filter(this.props.main_tasks,{Status:1,CommonTaskId: +this.state.common_value[0]});
      result.CommonTaskId = items[0].CommonTaskId;
      result.ChildTasks = _.map(items, item => {
        return{
          TaskId: item.OuterTaskId,
          Weight: item.Weight,
          TaskName: item.TaskName,
          CustomerId: 0
        };
      });
      result.MainTaskName = items[0].CommonTaskName
    }else{
      const ov = this.state.other_value;
      const subitems = _.filter(this.props.sub_task, t=>{
        return ov.indexOf(t.Id)> -1
      })
      result.CommonTaskId = 0;
      result.ChildTasks = _.map(subitems, (item,index) =>{
        return {
          TaskId: item.Id,
          Weight: index+1,
          TaskName: item.TaskName,
          CustomerId: 0
        };
      });
      result.MainTaskName = "其他";
    }
    this.props.onChange(result)
  }
  onCommonChange(v){

    if(v.length === 0){
      this.setState({common_value:v},this.handleChange);
    }else{
      this.setState(prevState => {
        return {common_value: _.difference(v, prevState.common_value)}
      },this.handleChange)
    }
    
  }
  onOtherChange(v){
    this.setState({other_value:v},this.handleChange);
  }
  componentWillMount(){
    this.props.getMainTask()
    this.props.getSubTask()
  }
  render() {
    const subMap = {
      1: '税务',
      2: '工商',
      3: '其他'
    }
    const groups = _.groupBy(_.filter(this.props.main_tasks,{Status:1}), 'CommonTaskId')
    const subGroups = _.map(_.groupBy(_.filter(this.props.sub_task, {Status: 1}), 'BusinessType'), function(val, key) {
        return {
          list: val,
          label: subMap[key]
        }
    });
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
          <Checkbox.Group onChange={this.onOtherChange} value={this.state.other_value}>
            {_.map(subGroups, (val, index)=>{
              return (<div key={"subtask" + index} className="cblist">
                  <div style={{margin:'12px 0', fontSize:'14px'}}>{val.label}</div>
                  <div style={{margin:'0 12px'}}>{val.list.map((item,index)=>(<Checkbox value={item.Id} key={item.Id}> {item.TaskName}</Checkbox>))}</div>
                </div>
              )
            })}
          </Checkbox.Group>
        </Panel>
      </Collapse>
    );
  }
}

const mapStateToProps = state => {
  return {
    main_tasks: state.main_tasks,
    sub_task: state.sub_task
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getMainTask: payload => {
      dispatch(getMainTask())
    },
    getSubTask: payload => {
      dispatch(getSubTask())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);