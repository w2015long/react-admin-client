import React, {Component} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';

import ProductHome from './home';
import AddUpdate from './add-update';
import ProductDetail from './detail';

import './product.less'

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Switch>
                <Route path="/product" exact component={ProductHome}/>
                <Route path="/product/addupdate" component={AddUpdate}/>
                <Route path="/product/detail" component={ProductDetail}/>
                <Redirect to="/product"/>
            </Switch>
        )
    }
}

export default Product;