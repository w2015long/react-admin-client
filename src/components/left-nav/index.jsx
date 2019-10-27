import React, {Component} from 'react';
import {Link,NavLink} from 'react-router-dom';
import { Menu, Icon } from 'antd';

import './index.less';
import logo from '../../assets/images/logo.png';
const { SubMenu } = Menu;


class LeftNav extends Component{
    constructor (props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className={"left-nav"}>
                <Link class="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h2>管理员后台</h2>
                </Link>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                >
                    <Menu.Item key="1">
                        <NavLink to="/"><Icon type="home" /><span>首页</span></NavLink>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="shopping" />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="5">
                            <NavLink to="/product">
                                <Icon type="unordered-list" />
                                <span>品类管理</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="6">
                                 <span>
                                <Icon type="shop" />
                                <span>商品管理</span>
                            </span>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="2">
                        <NavLink to="/user"><Icon type="user" /><span>用户管理</span></NavLink>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NavLink to="/role"><Icon type="solution" /><span>角色管理</span></NavLink>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}
export default LeftNav;