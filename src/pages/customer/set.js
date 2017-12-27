import React, { Component } from 'react'
import { Row, Col, List, Form, Input } from 'antd'
import { getCustomerSetList } from '@/api'

const FormItem = Form.Item;

class SetContent extends Component{
  constructor(props) {
    super(props)
    this.state= {
      loading: false,
      data: []
    };
    this.initData = this.initData.bind(this);
  }

  initData() {
    this.setState({loading: true})
    return getCustomerSetList('cuscategory').then(res => {
      if (res.status) {
        console.log(res)
        this.setState({
            loading: false,
            data: res.data
        });
      }
      return res;
    }, err => {
      this.setState({
          loading: false
      });
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
    const props = this.props;
    const { getFieldDecorator } = props.form;
    return (
      <div className="gutter-example">
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{md: 24}}>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">意向度</div>
              <List
                itemLayout="horizontal"
                dataSource={this.state.data}
                renderItem={item => (
                  <List.Item>
                    {item.Name}
                  </List.Item>
                )}
              />
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">库容(/个)</div>
              <List
                itemLayout="horizontal"
                dataSource={this.state.data}
                renderItem={item => (
                  <List.Item>
                    <FormItem>
                      {getFieldDecorator('item.Repertory', {})(
                        <Input/>
                      )}
                    </FormItem>
                  </List.Item>
                )}
              />
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">跟进期限(/天)</div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">最大保护期(/天)</div>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(SetContent)
