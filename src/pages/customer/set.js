import React, { Component } from 'react'
import { Row, Col, List, Form, Input, Spin } from 'antd'
import { getListData } from '@/api'
import Immutable from 'immutable';
const FormItem = Form.Item;

class SetContent extends Component{
  constructor(props) {
    super(props)
    this.state= {
      data: null
    };
    this.initData = this.initData.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
  }

  initData() {
    this.setState({loading: true})
    return getListData('cuscategory').then(res => {
      if (res.status) {
        console.log(res)
        this.setState({
            data: Immutable.fromJS(res.data.sort((a,b)=>(parseInt(a.Name)-parseInt(b.Name))))
        });
      }
      return res;
    })
  }
  setFieldValue(index,field,value){
    const data = this.state.data;
    const item = data.get(index).set(field,value);
    this.setState({
      data: data.set(index,item)
    })

  }
  componentWillMount() {
    this.initData();
  }

  handleSubmit= (e)=> {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onSubmit(values);
        }
      });
  }

  render() {
    if(!this.state.data) return <Spin/>
    return (
      <div className="gutter-example">
        <Row gutter={{md: 24}}>
          <Col className="gutter-row" span={5}>意向度</Col>
          <Col className="gutter-row" span={5}>库容(/个)</Col>
          <Col className="gutter-row" span={5}>跟进期限(/天)</Col>
          <Col className="gutter-row" span={5}>最大保护期(/天)</Col>
        </Row>
        {this.state.data.map((item, index)=>{
          return (
            <Row gutter={{md: 24}} key={item.get('CustomerCategoryId')} style={{margin:'12px 0'}}>
              <Col className="gutter-row" span={5}>{item.get('Name')}</Col>
              <Col className="gutter-row" span={5}><Input value={item.get('Repertory')} onChange={e=>{this.setFieldValue(index,'Repertory',e.target.value)}}/></Col>
              <Col className="gutter-row" span={5}><Input value={item.get('NoTrackDate')} onChange={e=>{this.setFieldValue(index,'NoTrackDate',e.target.value)}}/></Col>
              <Col className="gutter-row" span={5}><Input value={item.get('LongestData')} onChange={e=>{this.setFieldValue(index,'LongestData',e.target.value)}}/></Col>
            </Row>
          )
        })}
      </div>
    )
  }
}
export default SetContent
