import React, { Component } from 'react'
import { Button, Menu, Dropdown, Icon, Upload, Spin  } from 'antd'
import { connect } from 'react-redux'
import { getCustomerSource } from '@/store/actions'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state= {
        action: '/api/files/4'
    }
    this.handleUpload = this.handleUpload.bind(this);
  }
  handleUpload(item) {
    this.setState({
        action: '/api/files/4?customSourceId=' + item.Id + '&saleId=' +  this.props.user.Id
    });
    this.refs.upload.querySelector('input').click()
  }
  componentWillMount() {
    this.props.getCustomerSource()
  }
  render() {
    if(!this.props.customerSource) return <Spin/>;
     const menu = (
      <Menu onClick={this.handleUpload}>
        {this.props.customerSource.map(item=> <Menu.Item key={item.Id}>{item.Marking}</Menu.Item>)}
      </Menu>
    );
    return (
        <div style={Object.assign({display: "inline-block"},this.props.style)}>
          <Dropdown overlay={menu}>
            <div ref="upload">
                <Button type="primary">导入数据 <Icon type="down" /></Button>
                <Upload action= {this.state.action}  headers= {{Authorize: this.props.user.Token}} showUploadList={false} style={{display:'none'}} onChange={this.props.onChange}></Upload>
            </div>
          </Dropdown>
        </div>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    customerSource: common.customerSource,
    user: common.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getCustomerSource: payload => {
      dispatch(getCustomerSource())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
