import React from 'react'
import { Input, List } from 'antd'
import _ from 'lodash'
import Title from '@/component/Title'

const TextArea = Input.TextArea

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(e){
    const val = e.target.value;
    if(!val) return;
    this.props.submitTrack(e.target.value);
    e.target.value = ''
  }
  render() {
    return (
      <div style={this.props.style} className="track-list">
        {(!this.props.readOnly) && <Title title= '跟踪记录'/>}
        {(!this.props.readOnly) && <TextArea rows={2} onBlur={this.handleChange} onPressEnter={this.handleChange} />}
        <List
          bordered
          dataSource={this.props.data}
          renderItem={item => (<List.Item key={item.Id}> <List.Item.Meta description={item.TrackDate.replace('T', ' ')}/>
            {item.Description}</List.Item>)}
        ></List>
      </div>
    );
  }
}

export default Main
