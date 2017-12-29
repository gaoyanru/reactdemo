import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { getListData, postData } from '@/api'
import Dialog from '@/container/Dialog'
import AddCompany from '@/container/Company/AddCompany'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    }
    this.addNew = this.addNew.bind(this);
    // this.edit = this.edit.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  onSearch() {
    getListData('subsidiary').then(res => {
      if (res.status) {
        this.setState({
          loading: false,
          data: res.data.list
        });
      }
    })
  }

  componentWillMount() {
    this.onSearch()
  }

  openDialog(companyinfo,title,width){
      Dialog({
          content: <AddCompany data={companyinfo} wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
          width: width|| 540,
          handleOk: ()=>{
              return new Promise((resolve, reject) => {
                console.log(this)
                  const formValues = this.crmform.getFieldsValue()
                  console.log(formValues, 'formValues')
                  if(formValues){
                      postData('subsidiary?verify=0', formValues).then(res=>{
                        if(res.status){
                            message.info('保存成功！')
                            resolve()
                        }else{
                            // message.error(res.message);
                            reject()
                        }
                      });
                  }else{
                      reject();
                  }
              });
          },
          confirmLoading: false,
          handleCancel (){
            console.log('onCancel')
          },
          title: title
      }).result.then(()=>{
          this.onSearch()
      },()=>{});
  }

  addNew() {
    this.openDialog({},'新增公司')
  }

  render() {
    const columns = [{
      title: '公司名称',
      dataIndex: 'CompanyName'
    }, {
      title: '地址',
      dataIndex: 'Address'
    }, {
      title: '操作',
      render: (text, record) => (
        <Button.Group >
          <Button size="small" onClick={e=>{this.edit(record)}}>查看</Button>
        </Button.Group>
      )
    }]

    return (
      <div>
        <Button type="primary" onClick={this.addNew}>新增公司</Button>
        <Table columns={columns}
            rowKey={record => record.Id}
            dataSource={this.state.data}
            loading={this.state.loading}
            size="middle"
            bordered={true}
        />
      </div>
    );
  }
}

export default Main
