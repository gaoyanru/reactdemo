import React from 'react';
import { Menu, Icon, Button } from 'antd';
import {Link} from 'react-router-dom'

const SubMenu = Menu.SubMenu;

class LeftMenu extends React.Component {
  state = {
    collapsed: false,
    width: 160,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      width: this.state.collapsed? 160 : 65
    });
  }
  render() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const menu = JSON.parse(user.FunctionList)
    return (
      <div style={{ width: this.state.width ,background: '#404040' }}>
        <Button type="primary" onClick={this.toggleCollapsed} style={{float:'right',margin: 10}}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <Menu style={{clear:'both'}}
          defaultSelectedKeys={[]}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >
        {menu.map((route, index) => (
          <SubMenu key={route.FunctionId} title={<span><Icon type="mail" /><span>{route.FunctionName}</span></span>}>
          {route.Children.map((page,index)=>(
            <Menu.Item key={page.FunctionId}>
              <Link to={ '/' + page.FunctionKey.replace('.','/')}>
                <Icon type="pie-chart" />
                <span>{page.FunctionName}</span>
              </Link>
            </Menu.Item>
          ))}
          </SubMenu>
        ))}
        </Menu>
      </div>
    );
  }
}

export default LeftMenu;
