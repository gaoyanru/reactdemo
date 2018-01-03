import React from 'react'
import { Button, Row, Col } from 'antd'
import { fDate, fTaxStatus } from '@/config/filters'
class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    return (
      <Row className="company-info">
        <Col span={20}>
           <label>序列ID:</label>{data.SequenceNo}
           <label>公司名称:</label>{data.CompanyName}
           <label>报税状态:</label>{fTaxStatus(data.AgentStatus)}
           <label>运营会计:</label>{data.AccountantName}
        </Col>
        <Col span={4}>
          <Button type="primary">取消标记</Button>
          <Button type="primary">挂起</Button>
        </Col>
      </Row>
    );
  }
}

export default Main
