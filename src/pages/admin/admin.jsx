import React, {Component} from 'react';
import { Layout } from 'antd';
import {Route,Switch,Redirect} from 'react-router-dom';

import Header from '../../components/header';
import LeftNav from '../../components/left-nav';
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
// import NotFound from '../not-found/not-found'
import Order from '../order/order'

const {  Footer, Sider, Content } = Layout;

class Admin extends Component{
    constructor (props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <Layout>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 500,}}>
                        <Switch>
                            <Redirect from='/' exact to='/home'/>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Route path="/charts/line" component={Line}/>
                            <Route path="/order" component={Order}/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default Admin;