import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const {Item}  = Form;

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
        this.props.getForm(this.props.form)
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Item label="添加角色"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('roleName', {
                        rules: [{ required: true, message: '请输入角色名称!' }],
                    })(<Input placeholder='请输入角色名称'/>)}
                </Item>
            </Form>
        )
    }
}

AddForm.propTypes = {
    getForm: PropTypes.func.isRequired
};

export default Form.create()(AddForm);;