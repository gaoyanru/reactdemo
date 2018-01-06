import React from 'react'
import { Tabs, List, Spin, message } from 'antd'
import { getListData, postData, putData } from '@/api'
import CompanyInfo from '@/container/Contract/CompanyInfo'
import ViewCustomer from '@/container/Contract/ViewCustomer'
import EditCustomer from '@/container/Contract/EditCustomer'
import _ from 'lodash'
import * as ContractActions from '@/config/contractActions'
import Dialog from '@/container/Dialog'
import ChangeWarning from '@/container/Contract/ChangeWarning'
import OrderAll from '@/container/Contract/OrderAll'
import OutWork from '@/container/Contract/OutWork'
import RemarkList from '@/container/Contract/RemarkList'
import OperateList from '@/container/Contract/OperateList'

const TabPane = Tabs.TabPane;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyInfo: {},
      activeKey: "1"
    }

    this.onAction = this.onAction.bind(this);
    this.getCompanyInfo = this.getCompanyInfo.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.patch = this.patch.bind(this)
    this.getCompanyInfo()
  }
  getCompanyInfo(){
    getListData('customerdetail/'+ this.props.companyId).then(res=>{
      res.data = _.extend(res.data, this.props.row);
      this.setState({
        companyInfo: res.data
      })
    })
  }
  editCompany(data){
    if(data.isEditing){
      const vals = this.editform.getFieldsValue();
      const syncDate = vals.syncDate || '';
      delete vals.isEditing;
      delete vals.syncDate;
      putData(`Customer/update/${vals.Id}?syncDate=${syncDate}`,vals).then(res=>{
        if(res.status){
          message.info('保存成功!');
          this.setState({
            companyInfo: {...vals, isEditing: false}
          });
        }
      });
    }else{
      let dialog = Dialog({
        content: <ChangeWarning onSelect={t=>{dialog.close(t)}} />,
        width: 540,
        confirmLoading: false,
        handleCancel (){
            console.log('onCancel')
        },
        title: "选择变更类别",
        footer: null
      });
      dialog.result.then(res=>{
        this.setState((prevState, props) => ({
          companyInfo: {...prevState.companyInfo, isEditing: true, syncDate: res.syncDate}
        }));
      });

    }
  }
  onAction(action,params){
    if(action in ContractActions){
      ContractActions[action](params).then(()=>{
        this.patch(action,params);
      });
    }else{
      this[action](params);
    }
  }
  patch(action,params){
    if(action === "mark"){
      if(params.RemarkSignId){ //取消标记，修改RemarkSignId => 0
         this.setState((prevState, props) => ({
          companyInfo: {...prevState.companyInfo, RemarkSignId: 0}
         }));
      }else{ //打标记，修改RemarkSignId => 1(暂存为1)
        this.setState((prevState, props) => ({
          companyInfo: {...prevState.companyInfo, RemarkSignId: 1}
        }));
      }
    }else if(action === "hangUp"){ //挂起
        this.setState((prevState, props) => ({
          companyInfo: {...prevState.companyInfo, AgentStatus: 2, IfCancelHangup: 0}
        }));
    }
  }
  onTabClick(arg){
    this.setState({activeKey:arg});
  }
  render() {
    return (
      <div style={this.props.style} className="company-dialog">
        <CompanyInfo data={this.state.companyInfo} type="signed" onAction={this.onAction}/>
        <div>
          <Tabs type="card" style={{width: '100%'}} activeKey={this.state.activeKey} onTabClick={this.onTabClick}>
            <TabPane tab="公司信息" key="1">{ this.state.companyInfo?(this.state.companyInfo.isEditing? <EditCustomer data={this.state.companyInfo} wrappedComponentRef={view=>{this.editform = view;}}/>:<ViewCustomer data={this.state.companyInfo}/>):<Spin/> }</TabPane>
            <TabPane tab="订单汇总信息" key="2">
              <OrderAll companyId={this.props.companyId}/>
            </TabPane>
            <TabPane tab="外勤任务" key="3">
              <OutWork companyId={this.props.companyId}/>
            </TabPane>
            <TabPane tab="备注信息" key="4">
              <RemarkList companyId={this.props.companyId}/>
            </TabPane>
            <TabPane tab="操作记录" key="5">
              <OperateList companyId={this.props.companyId}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Main
