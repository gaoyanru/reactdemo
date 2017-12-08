import React from 'react';
import { List } from 'antd';
import Title from '@/component/Title'

class Department extends React.Component {
  state={selected: undefined}
  onClick(item){
    this.props.onclick(item)
    this.setState({
      selected: item
    })
  }
  render() {
    return (
      <div style={this.props.style}>
        <Title title={this.props.companyName} onClick={()=>this.onClick()}/> 
        <List
          size="small"
          bordered
          dataSource={this.props.data}
          renderItem={item => (<List.Item className={this.state.selected === item? "m-list-item active":"m-list-item"} onClick={(e)=>this.onClick(item)}>{item.DepartmentName}</List.Item>)}
        />
      </div>
    );
  }
}

export default Department;
