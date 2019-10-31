import React, {Component} from 'react';

import { Menu, Dropdown, Icon } from 'antd';

import './index.less'

const menu = (
    <Menu>
        <Menu.Item>
            <span>退出登录</span>
        </Menu.Item>
    </Menu>
);



class Header extends Component{
    constructor (props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className="header">
                <div className="admin-user">
                    <Dropdown overlay={menu} trigger={['click']} className="dropdown">
                        <span className="ant-dropdown-link">
                            admin <Icon type="down" />
                        </span>
                    </Dropdown>
                </div>
                <div className="weather-info">
                    <div className="weather-info-left">
                        首页
                    </div>
                    <div className="weather-info-right">
                        <span>{'currentTime'}</span>
                        {/*<img src={dayPictureUrl} alt="weather"/>*/}
                        <span>{'weather'}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default Header;