import React, { Component } from 'react';
import LeftMenu from './container/LeftMenu'
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin } from 'antd';
import {Link, Switch, BrowserRouter as Router, Route} from 'react-router-dom'
import { connect } from 'react-redux'
import  '@/style/BasicLayout.less';
import  '@/style/app.less';
import logo from './logo.svg';

import { setPowerList } from '@/store/actions'

const { Header, Sider, Content } = Layout;
class WithPower extends Component {
  componentWillMount(){
    setPowerList(this.props.functions)
  }
  render(){
    var CompView = this.props.child
    return (<CompView {...this.props.args}/>)
  }
}

const pagesMap = {
  'contract_manage' : 'contract/manage',
  'user_my': 'system/myInfo',
  'users': 'system/users'
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

  arr = arr.map(f=>{
    const key = f.FunctionKey.replace('main.','');
    try{
      if(pagesMap[key]){
        return {
          key: key,
          path:'/main/'+key,
          functions: f.Children,
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
    return (<Route strict  path={fun.path} render={(args)=>(<WithPower functions={fun.functions} args={args} child={fun.component.default}/>)} key={fun.key} />)
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
    console.log(leftmenu)
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
              <img src={logo} style={{height:'30px'}}/>
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
                <Route exact path="/main" render={props=>(<div> "hello" </div>)}/>
              </Switch>
            </div>
          </Content>        
        </Layout>
      </Layout>
    );
  }
}
/*

<Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
              <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              />
              <NoticeIcon
                className={styles.action}
                count={currentUser.notifyCount}
                onItemClick={(item, tabProps) => {
                  console.log(item, tabProps); // eslint-disable-line
                }}
                onClear={this.handleNoticeClear}
                onPopupVisibleChange={this.handleNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
              >
                <NoticeIcon.Tab
                  list={noticeData['通知']}
                  title="通知"
                  emptyText="你已查看所有通知"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['消息']}
                  title="消息"
                  emptyText="您已读完所有消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['待办']}
                  title="待办"
                  emptyText="你已完成所有待办"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                />
              </NoticeIcon>
              {currentUser.name ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                    {currentUser.name}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRouteData('BasicLayout').map(item =>
                    (
                      <Route
                        exact={item.exact}
                        key={item.path}
                        path={item.path}
                        component={item.component}
                      />
                    )
                  )
                }
                <Redirect exact from="/" to="/dashboard/analysis" />
                <Route component={NotFound} />
              </Switch>
            </div>
            <GlobalFooter
              links={[{
                title: 'Pro 首页',
                href: 'http://pro.ant.design',
                blankTarget: true,
              }, {
                title: 'GitHub',
                href: 'https://github.com/ant-design/ant-design-pro',
                blankTarget: true,
              }, {
                title: 'Ant Design',
                href: 'http://ant.design',
                blankTarget: true,
              }]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2017 蚂蚁金服体验技术部出品
                </div>
              }
            />
          </Content>
<div className="App">
        <div className="AppHeader">
          <h4>
            <svg width="50" height="40" xmlns="http://www.w3.org/2000/svg">
             <g>
              <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
               <rect fill="url(#gridpattern)" strokeWidth="0" y="0" x="0" height="100%" width="100%"/>
              </g>
             </g>
             <g>
              <title>Layer 1</title>
              <rect id="svg_1" height="40" width="16" y="-0.25" x="0" strokeWidth="0" fill="#c6181e"/>
              <rect id="svg_2" height="21" width="133" y="94" x="165.5" strokeWidth="0" fill="#c6181e"/>
              <rect id="svg_4" height="21" width="31" y="0" x="0" strokeOpacity="null" strokeWidth="0"  fill="#c6181e"/>
              <rect id="svg_5" height="19" width="16" y="21" x="35" strokeOpacity="null" strokeWidth="0"  fill="#c6181e"/>
             </g>
            </svg>
            <span>噼里啪ERP管理系统</span>
          </h4>
        </div>
        <Router>
          <div className="AppContent">
            <LeftMenu currentMenu={menu}/>
            <div style={{flex:1,overflow:'auto',padding:'6px'}}>
                {routers}
                <Route exact path="/main" render={props=>(<div> "hello" </div>)}/>
            </div>
          </div>
        </Router>
      </div>
*/
const mapStateToProps = state => {
  return {
    functions: JSON.parse(state.user.FunctionList),
    currentUser: state.user
  }
}
export default connect(
  mapStateToProps
)(App);