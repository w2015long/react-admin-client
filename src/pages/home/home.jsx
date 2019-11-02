import React, {Component} from 'react';
import './index.less'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="home">
                <h1>欢迎使用react中后台管理系统</h1>
            </div>
        )
    }
}

export default Home;