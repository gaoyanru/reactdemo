import React from 'react'
import { DatePicker , Tag} from 'antd'
import _ from 'lodash'
import Title from '@/component/Title'
import moment from 'moment'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleClose(e){
    this.props.onRemove(e.Id)
  }
  handleChange(m){
    this.props.onAdd(m.format('YYYY-MM-DD'))
  }
  disabledDate(current){
    return current && current.valueOf() < Date.now();
  }
  render() {
    return (
      <div style={this.props.style} className="track-list">
        <Title title= '提醒日期'/>
        <div style={{margin:"12px 0"}}>
        {this.props.data && this.props.data.map(remind=>{
          return <Tag key={remind.Id} closable={true} afterClose={() => this.handleClose(remind)} color="#108ee9">
              {moment(remind.NextTrackTime).format('YYYY-MM-DD')}
            </Tag>
          })
        }
        <DatePicker 
          onChange={this.handleChange}  
          disabledDate={this.disabledDate}
          value={this.state.value}
        />
        </div>
      </div>
    );
  }
}

export default Main