import React, {Component} from 'react';
import {NavLink,withRouter} from 'react-router-dom';
import { Menu, Icon } from 'antd';
import Menus from '../../config/menuConfig'

import './index.less';
import logo from '../../assets/images/logo.png';
const { SubMenu,Item } = Menu;


class LeftNav extends Component{
    constructor (props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {//在第一次render之前 执行一次
        this.menuNodes = this.getMenuListNode(Menus)
    }

    getMenuListNode = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.map(item=>{
            if (!item.children) {
                return (
                    <Item key={item.key}>
                        <NavLink to={item.key}>
                            <Icon type={item.icon} /><span>{item.title}</span>
                        </NavLink>
                    </Item>
                )
            } else {
                //找到有打开子项目的SubMenu
                var subItem = item.children.find(subItem => path.indexOf(subItem.key) > -1);
                if (subItem) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuListNode(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    render() {
        let path = this.props.location.pathname;
        if (path.indexOf("/product") > -1) {
            path = "/product"
        }
        return (
            <div className={"left-nav"}>
                <NavLink to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h2>管理员后台</h2>
                </NavLink>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav);