import React, { Component } from 'react'
import { Tabs, List, Spin, message, Button } from 'antd'
import { getListData, putData } from '@/api'
import _ from 'lodash'
import OrderDialog from '@/container/Contract/OrderDialog'
import Prompt from '@/component/Prompt'
const TabPane = Tabs.TabPane;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null,
      customerInfo: null,
      activeKey: "1",
      isEditing: false,
    }
    this.pass = this.pass.bind(this);
    this.reject = this.reject.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }
  closeDialog(){
    this.handler.close();
  }
  pass(){
    const data = this.props.data;
    const post = {
      OrderId: data.OrderId,
      remark: '',
      auditVal: 0
    };
    putData('order/audit', post).then(res =>{
        // console.log(res)
      if(res.status) {
        message.info('审核成功')
        this.closeDialog();
      }
    });
  }
  reject(arg){
    Prompt({
        title: '驳回原因',
        handleOk: (resStr)=>{
          return new Promise((resolve, reject) => {
            console.log(this, 'remark')
            resStr = this.props.data.Remark ? this.props.data.Remark + resStr : resStr
            putData('order/audit',{
                OrderId: this.props.data.OrderId,
                remark: resStr,
                auditVal: 1
            }).then(res=>{
                if(res.status){
                    message.info('驳回成功！');
                    this.closeDialog();
                    resolve();
                }
            })
          });
        }
    });
  }
  render() {
    return(
      <div style={this.props.style} className="company-dialog">
        {this.props.data.OrderStatus === 1?(<Button.Group style={{float:'right'}}>
            <Button type="primary"  onClick={this.pass.bind(this)}>审核</Button>
            <Button type="primary"  onClick={this.reject.bind(this)}>驳回</Button>
          </Button.Group>):null}
        <OrderDialog readOnly={true} id={this.props.data.OrderId} closeDialog ={this.closeDialog}/>
      </div>
    )
  }
}

export default Main
