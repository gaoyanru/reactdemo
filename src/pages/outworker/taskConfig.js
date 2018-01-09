import React from 'react';
import { Button } from 'antd';
import { getSubTask, getTaskConfigList } from '@/store/actions'
import store from '@/store'
import { postData } from '@/api'
import { connect } from 'react-redux'
import Dialog from '@/container/Dialog'
import TaskConfItem from '@/container/Outworker/TaskConfItem'
import TaskConfDetail from '@/container/Outworker/TaskConfDetail'
class TaskConfig extends React.Component {
  componentWillMount () {
    this.props.dispatch(getSubTask())
    this.props.dispatch(getTaskConfigList())
  }
  mapList () {
    const { list } = this.props
    const node = []
    let i = 0
    for (let key in list) {
      node.push((<TaskConfItem key={'task-conf-item-' + i} title={list[key][0].CommonTaskName} data={list[key]}/>))
      i++
    }
    return node
  }
  addConf () {
    const dialog = Dialog({
      content: <TaskConfDetail data={[]}/>,
      width: 900,
      handleOk: ()=>{
        return new Promise((resolve, reject) => {
          postData('commontask', store.getState().taskConf.detailInfo).then((res) => {
            this.props.dispatch(getTaskConfigList())
            resolve()
          })
        })
      },
      confirmLoading: false,
      handleCancel (){
          console.log('onCancel')
      },
      title: "新增通办任务"
    }).result;
    this.props.dispatch({
      type: 'change outworker task config selected task',
      data: []
    })
    this.props.dispatch({
      type: 'change outworker task config detail info',
      payload: {
        CommonTaskName: '',
        Weight: 0,
        Status: 2
      }
    })
  }
  render () {
    console.log(this.props)
    return (
      <div className="task-config-container">
        <div className="task-config-top well">
          <Button type="primary" onClick={this.addConf.bind(this)}>新增</Button>
        </div>
        {this.mapList()}
      </div>
    )
  }
}
export default connect(({common, taskConf}) => {
  return {
    ...common,
    list: taskConf.list
  }
})(TaskConfig)
