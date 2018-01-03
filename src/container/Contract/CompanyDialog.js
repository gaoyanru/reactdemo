import React from 'react'
import { Tabs, List } from 'antd'
import { getListData, postData, putData } from '@/api'
import CompanyInfo from '@/container/Contract/CompanyInfo'

const TabPane = Tabs.TabPane;
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      companyInfo: {}
    }

    getListData('customerdetail/'+ this.props.companyId).then(res=>{
      res.data.SequenceNo = this.props.SequenceNo;
      this.setState({
        companyInfo: res.data
      })
    })
  }
  handleChange(e){
    const val = e.target.value;
    if(!val) return;
    this.props.submitTrack(e.target.value);
    e.target.value = ''
  }
  render() {
    return (
      <div style={this.props.style} className="company-dialog">
        <CompanyInfo data={this.state.companyInfo}/>
        <Tabs type="card">
          <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
          <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
          <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Main
