import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import {reqWeather} from '../../api';
import menuList from '../../config/menuConfig';
import '../../utils';
import './index.less'



class Header extends Component{
    constructor (props) {
        super(props);
        this.state = {
            dayPictureUrl:'',
            weather:'',
            currentTime:new Date().format('yyyy-MM-dd hh:mm:ss')
        }
    }

    /*
    第一次render()之后执行一次
    一般在此执行异步操作: 发ajax请求/启动定时器
     */
    componentDidMount() {
        this.getWeather();
        this.getTimer();
    }

    getTimer = () => {
        setInterval(()=>{
            this.setState({
                currentTime:new Date().format('yyyy-MM-dd hh:mm:ss')
            })
        },1000)
    }
    getWeather = async () => {
        const {dayPictureUrl, weather} = await reqWeather('广州');
        this.setState({dayPictureUrl, weather});
    }
    getTitle = () => {
        const path = this.props.location.pathname;
        let title
        menuList.forEach(item=>{
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem=>cItem.key===path);
                if (cItem) title = cItem.title
            }
        });
        return title
    }

    render() {
        const {dayPictureUrl,currentTime,weather} = this.state;
        const title = this.getTitle();
        const menu = (
            <Menu onClick={this.handleLogout}>
                <Menu.Item key="0">
                    <a href="javascript:;"><Icon type="logout" />退出</a>
                </Menu.Item>
            </Menu>
        );
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
                        {title}
                    </div>
                    <div className="weather-info-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);