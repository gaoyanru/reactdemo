import React, { Component } from 'react';
import LeftMenu from './container/LeftMenu'
import { Layout, Menu, Icon, Avatar, Dropdown, Spin } from 'antd';
import {Link, Switch, Route} from 'react-router-dom'
import { connect } from 'react-redux'
import  '@/style/BasicLayout.less';
import  '@/style/app.less';
import logo from './logo.svg';
import store from '@/store'
import { setPowerList } from '@/store/actions'
import childcompany from '@/pages/contract/financeAudit'

import Test from '@/pages/testpage'

const { Header, Sider, Content } = Layout;

class WithPower extends Component {
  componentWillMount(){
    setPowerList(this.props.functions)(store.dispatch)
  }
  render(){
    var CompView = this.props.child
    return (<CompView {...this.props.args}/>)
  }
}

const pagesMap = {
  'contract_manage' : 'contract/manage',
  'user_my': 'system/myInfo',
  'users': 'system/users',
  'roles_setting': 'system/roleSetting',
  'department_setting': 'system/departmentSetting',
  'user_group': 'system/groupSetting',
  'cus_my': 'customer/my',
  'cus_settings': 'customer/set',
  'outwork_manage': 'outworker/review',
  'cus_pub': 'customer/pub',
  'outwork_dict': 'outworker/dict',
  'company_sub': 'zcompany/childcompany',
  'static_order': 'statistic/staticOrder',
  'function_setting': 'system/functionManage',
  'finance_manage_contract': 'contract/financeAudit'
}

function getCurrentMenu(funs,path){
  const current = path.substr(1).replace('/','.');
  let menu = {parentId: [],funId: []};
  funs.forEach(f=>{
    const c = f.Children.find(item=>item.FunctionKey === current)
    if(c) menu = {
      parentId: [f.FunctionId+''],
      funId: [c.FunctionId+'']
    }
  });
  return menu;
}

function getRouterMap(funs){
  var arr = [];
  funs.forEach(f=>{
    arr = arr.concat(f.Children);
  });
  const state = store.getState()
  arr = arr.map(f=>{
    const key = f.FunctionKey.replace('main.','');
    try{
      if(pagesMap[key]){
        return {
          key: key,
          path:'/main/'+key,
          functions: f.Children,
          curUser: state.user,
          component: require('@/pages/' + pagesMap[key])
        }
      }else{
        return false
      }

    } catch(error) {
      return false
    }
  })
  return arr.filter(f=>!!f).map((fun,index)=>{
    return (<Route strict  path={fun.path} render={(args)=>(<WithPower functions={fun.functions} args={{...args,curUser:fun.curUser}} child={fun.component.default}/>)} key={fun.key} />)
  })
}


class App extends Component {
  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    // this.menus = props.navData.reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      collapsed: false
    };
    this.toggle = this.toggle.bind(this)
  }
  toggle(){
    const { collapsed } = this.state;
    this.setState({collapsed:!collapsed})
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      // this.props.dispatch({
      //   type: 'login/logout',
      // });
    }
  }
  render() {
    const leftmenu = getCurrentMenu(this.props.functions, this.props.location.pathname)
    const routers = getRouterMap(this.props.functions)
    const currentUser = this.props.currentUser
    const {collapsed} = this.state

    const menu = (
      <Menu className="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item><Link to="/main/user_my"><Icon type="user" />个人中心</Link></Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );

    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={256}
          className='sider'
        >
          <div className='logo'>
            <Link to="/">
              <img src={logo} style={{height:'30px'}} alt="logo"/>
              <h1>PILIPA ERP</h1>
            </Link>
          </div>
          <LeftMenu currentMenu={leftmenu}/>
        </Sider>
        <Layout>
          <Header className="header">
            <Icon
              className= "trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className="right">
              {currentUser.RealName ? (
                <Dropdown overlay={menu}>
                  <span className="action account">
                    <Avatar size="small" className="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/eHBsAsOrrJcnvFlnzNTT.png" />
                    {currentUser.RealName}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {routers}
                <Route exact path="/main" component={Test}/>
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = state => {
  return {
    functions: JSON.parse(state.user.FunctionList),
    currentUser: state.user
  }
}
export default connect(
  mapStateToProps
)(App);
