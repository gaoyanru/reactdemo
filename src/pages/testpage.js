import React, { Component } from 'react'
import Test from '@/pages/contract/signed'
import { setPowerList } from '@/store/actions'
import { connect } from 'react-redux'
class Main extends Component {
    constructor(props) {
        super(props);
        // this.functions = [{"Children":[],"FunctionId":83,"Id":83,"ParentId":18,"FunctionName":"新增","FunctionKey":"ADD","FunctionLevel":3,"FunctionCenter":0,"Rank":2,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":84,"Id":84,"ParentId":18,"FunctionName":"审核","FunctionKey":"REVIEW","FunctionLevel":3,"FunctionCenter":0,"Rank":3,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":85,"Id":85,"ParentId":18,"FunctionName":"驳回","FunctionKey":"REJECT","FunctionLevel":3,"FunctionCenter":0,"Rank":4,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":86,"Id":86,"ParentId":18,"FunctionName":"主任务取消","FunctionKey":"CANCELMAIN","FunctionLevel":3,"FunctionCenter":0,"Rank":5,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":87,"Id":87,"ParentId":18,"FunctionName":"提交","FunctionKey":"SUBMIT","FunctionLevel":3,"FunctionCenter":0,"Rank":6,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":88,"Id":88,"ParentId":18,"FunctionName":"任务批量分配","FunctionKey":"FENPEIALL","FunctionLevel":3,"FunctionCenter":0,"Rank":7,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":89,"Id":89,"ParentId":18,"FunctionName":"编辑","FunctionKey":"DETAIL","FunctionLevel":3,"FunctionCenter":0,"Rank":8,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":90,"Id":90,"ParentId":18,"FunctionName":"确认资料","FunctionKey":"ENSURE","FunctionLevel":3,"FunctionCenter":0,"Rank":9,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":91,"Id":91,"ParentId":18,"FunctionName":"完成","FunctionKey":"COMPLETE","FunctionLevel":3,"FunctionCenter":0,"Rank":10,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":92,"Id":92,"ParentId":18,"FunctionName":"转接任务","FunctionKey":"TOOTHER","FunctionLevel":3,"FunctionCenter":0,"Rank":11,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":93,"Id":93,"ParentId":18,"FunctionName":"子任务取消","FunctionKey":"CANCELSUB","FunctionLevel":3,"FunctionCenter":0,"Rank":12,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null}];
        // props.setPowerList(this.functions)
    }
    render() {
        const item = {"Id":3231,"SequenceNo":3231,"CompanyName":"66公司大明子","AreaName":"怀柔区","Connector":"收拾","SalesName":"管理员","ServiceStatus":3,"OutWorkerStatus":2,"AccountantStatus":null,"PartTax":null,"OrderId":8867,"MainTaskName":"工商变更","MainTaskStatus":1,"childTaskName":"网上申请","OutWorkerName":null,"SubmitTaskTime":"2017-12-27T18:54:22","Status":1,"Remark":"发","AccountantTaskSource":null,"AgentStatus":3}
        return (
            <div style={{width:1000}}>
                <Test  {...this.props}  />
            </div>
        )
    }
}
const mapStateToProps = state => {
  return {
    curUser: state.user,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setPowerList: payload => {
      dispatch(setPowerList(payload))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)
