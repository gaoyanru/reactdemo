import React from 'react'
import { Button, Row, Col } from 'antd'
import { fDate, fTaxStatus } from '@/config/filters'
import HasPower from '@/container/HasPower'
class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    return (
      <Row className="company-info">
        <Col span={16}>
           <label>序列ID:</label>{data.SequenceNo}
           <label>公司名称:</label>{data.CompanyName}
           <label>报税状态:</label>{fTaxStatus(data.AgentStatus)}
           <label>运营会计:</label>{data.AccountantName}
        </Col>
        <Col span={8}>
          <Button.Group>
            <HasPower power="MARK"  key={"btn_Mark"}><Button type="primary" onClick={e=>{this.props.onAction('mark', data)}}>{data.RemarkSignId?'取消标记':'标记'}</Button></HasPower>
            <HasPower power="GUAQI"  key={"btn_GUAQI"}><Button type="primary" disabled={!data.IfCancelHangup} onClick={e=>{this.props.onAction('hangUp', data)}}>挂起</Button></HasPower>
            <Button type="primary" onClick={e=>{this.props.onAction('editCompany', data)}}>{data.isEditing?'提交并保存':'变更企业信息'}</Button>
            <Button type="primary" disabled>变更企业性质</Button>
          </Button.Group>
        </Col>
      </Row>
    );
  }
}

export default Main
