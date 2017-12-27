import React from 'react'
import { Form, Input, Row, Col, Spin } from 'antd'
import CrmCustomer from '@/component/CrmCustomer'
import { getListData, deleteData, postData } from '@/api' 
import TagSelect from '@/component/TagSelect'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CustomerTrack from '@/component/CustomerTrack'
import RemindDate from '@/component/RemindDate'

const FormItem = Form.Item;
const TextArea = Input.TextArea
const Tags = connect(state => {
  return {
    tags: state.tags,
  }
})(TagSelect)

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {
    state= {
      customer:{},
      customerId: this.props.customerId,
      tags: null
    }
    saveCustomer= ()=> {
        const that = this;
        return new Promise((resolve, reject)=>{
          var result = that.cusform.getFieldsValue();
          if (result) {
            let org = this.state.customer;
            if(org.RegisterDate && org.RegisterDate.substr(0,4)!=='0001') 
              org.RegisterDate = moment(org.RegisterDate).format('YYYY-MM-DD');
            else
              org.RegisterDate = null
            function customizer(objValue, othValue) {
              return !Object.keys(objValue).some(field => objValue[field]!=othValue[field])
            }
            if(!_.isEqualWith(org,result,customizer)){
              result.isSave = true
            }
            resolve(result)
          }else{
            reject();
          }
        })
        
    }
    getFieldsValue = ()=>{
      const errors = this.props.form.getFieldsError();
      if(!hasErrors(errors)){
        const formValues =  this.props.form.getFieldsValue()
        if(this.props.data.Id){
          return {...this.props.data,...formValues}
        }else{
          return formValues
        }
      }
      return null
    }
    addTag = (tag)=>{
      const selected = _.find(this.state.tagSelected, {TagType: tag.TagType})
      if(selected) this._deleteTag(selected)
      postData('customertag',{
        CustomerId: this.state.customer.Id,
        TagId: tag.Id
      }).then(res=>{
        if(res.status){
          this.getSelectedTags()
        }
      })
    }
    deleteTag = (tag)=>{
      const selected = _.find(this.state.tagSelected, {TagId: +tag.Id})
      if(selected){
        this._deleteTag(selected)
      }
    }
    _deleteTag = (tag)=>{
      deleteData('customertag/'+ tag.Id)
    }
    getCustomerInfo =()=>{
      getListData('customerdetail/'+ this.state.customerId).then(res=>{
        if(res.status){
            this.setState({customer: res.data})
        }
      })
    }
    getSelectedTags = ()=>{
      getListData('customertag/'+ this.state.customerId).then(res=>{
        if(res.status){
            this.setState({tagSelected: res.data})
        }
      });
    }
    getCustomerTrack = ()=>{
      getListData('customertrack/'+ this.state.customerId).then(res=>{
        if(res.status){
            this.setState({customertrack: res.data})
        }
      });
    }
    getRemindDate = ()=>{
      getListData('nexttrackremind/'+ this.state.customerId).then(res=>{
        if(res.status){
            this.setState({reminds: res.data})
        }
      });
    }
    removeRemind = (id)=>{
      deleteData('nexttrackremind/'+ id)
    }
    addRemind = (val) =>{
      postData('nexttrackremind',{
        CustomerId: this.state.customerId,
        NextTrackTime: val,
        SalesId: JSON.parse(sessionStorage.getItem('user')).Id
      }).then(res=>{
        if(res.status){
          this.getRemindDate()
        }
      })
    }
    submitTrack = (val)=>{
      postData('customertrack',{
        CustomId: this.state.customerId,
        Description: val
      }).then(res=>{
        this.getCustomerTrack()
      })
    }
    showNext = (id)=>{
      this.setState({customerId:id,customer:{}})
      this.getCustomerInfo()
      this.getSelectedTags()
      this.getCustomerTrack()
      this.getRemindDate()
    }
    componentWillMount(){
      this.getCustomerInfo()
      this.getSelectedTags()
      this.getCustomerTrack()
      this.getRemindDate()
    }
    render () {
      console.log(this.state.tagSelected)
      return (<Row>
        <Col span={8}> {this.state.customer.Id? <CrmCustomer data={this.state.customer} wrappedComponentRef={cusform =>{this.cusform = cusform}} /> : <Spin/>}</Col>
        <Col span={16}>
          {this.state.tagSelected && <Tags 
            tags={this.props.tags} 
            selected={this.state.tagSelected} 
            addTag={this.addTag}
            deleteTag={this.deleteTag}
            /> || <Spin/>}
          <CustomerTrack data={this.state.customertrack} submitTrack={this.submitTrack} />
          <RemindDate data={this.state.reminds} onRemove={this.removeRemind} onAdd={this.addRemind}/>
        </Col>
      </Row>)
    }
}

export default Main;
