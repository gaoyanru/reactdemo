import React from 'react'
import { Button, Row, Col, Icon } from 'antd'
import Title from '@/component/Title';
import AreaSelect from '@/container/searchComponent/AreaSelect';
import ImageViewer from '@/component/ImageViewer'
import { fDate, fAddedValue } from '@/config/filters'
class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    return (
      <div>
        <Title title= '客户基本信息'/>
        <Row className="company-info">
          <Col span={8}>
             <label>公司名称</label>{data.CompanyName}
          </Col>
          <Col span={8}>
            <label>联系人:</label>{data.Connector}
          </Col>
          <Col span={8}>
            <label>联系电话:</label>{data.Mobile}
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={8}>
             <label>所属销售:</label>{data.SalesName}
          </Col>
          <Col span={8}>
            <label>纳税人类别:</label>{fAddedValue(data.AddedValue)}
          </Col>
          <Col span={8}>
            <label>所属区域:</label><AreaSelect value={data.AreaCode} disabled={true}/>
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={24}>
             <label>公司地址:</label>{data.Address}
          </Col>
        </Row>
        <Title title= '营业执照信息'/>
        <Row className="company-info">
          <Col span={8}>
             <label>注册号:</label>{data.RegNO}
          </Col>
          <Col span={8}>
            <label>营业执照:</label> {data.BusinessLicense?<ImageViewer src={data.BusinessLicense} additional="?x-oss-process=image/resize,m_lfit,h_30,w_50" />: null}
          </Col>
          <Col span={8}>
            <label>注册资金:</label>{data.RegisteredCapital}
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={8}>
            <label>法人姓名:</label> {data.LegalPerson}
          </Col>
          <Col span={8}>
            <label>法人身份证号:</label>{data.PersonCardID}
          </Col>
          <Col span={8}>
             <label>法人身份证:</label> {data.PersonCardPath?<ImageViewer src={data.PersonCardPath} additional="?x-oss-process=image/resize,m_lfit,h_30,w_50" />: null} 
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={24}>
             <label>营业期限:</label> {fDate(data.RegisterDate)}至{data.NoDeadLine?'无期限':fDate(data.BusnissDeadline)}
          </Col>
        </Row>
        <Row className="company-info">
          <Col span={24}>
             <label>经营范围:</label> {data.BusinessScope}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Main
