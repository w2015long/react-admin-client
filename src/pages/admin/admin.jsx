import React, {Component} from 'react';

class Admin extends Component{
    constructor (props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className="admin">
                <h1>admin</h1>
                {
                    console.log(this.props)
                }
            </div>
        )
    }
}
export default Admin;