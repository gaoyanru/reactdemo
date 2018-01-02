import React, { Component } from 'react'
import { Input, Table } from 'antd'
import _ from 'lodash'


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
    this.data = _.cloneDeep(props.data);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(row,value){
    _.find(this.data,{TaskId: row.TaskId}).Weight = +value;
  }
  render() {
    const columns = [{
            title: '子任务名称',
            dataIndex: 'TaskName'
        }, {
            title: '权重',
            dataIndex: 'Weight',
            render: (val,row)=>{return <Input defaultValue={val} onChange={e=>{this.handleInputChange(row,e.target.value)}}/>}
        }]
    return (
      <Table columns={columns}
        rowKey={record => record.TaskId}
        dataSource={this.state.data}
        loading={this.state.loading}
        pagination={false} 
        onChange={this.handleTableChange}
        size="middle"
        bordered={true}
      />
    );
  }
}


export default Main
