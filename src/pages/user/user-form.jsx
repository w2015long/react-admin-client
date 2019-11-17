import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Form, Input,Select  } from 'antd';
const { Option } = Select
const {Item}  = Form;

class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
        this.props.getForm(this.props.form)
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { roles ,user} = this.props;
        return (
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                <Item label="用户名">
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [{ required: true, message: '请输入角色名称!' }],
                    })(<Input placeholder='请输入角色名称'/>)}
                </Item>
                {
                    user._id ? null : (
                        <Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(<Input type="password" placeholder='请输入密码'/>)}
                        </Item>
                    )
                }

                <Item label="手机号">
                    {getFieldDecorator('phone', {
                        initialValue: user.phone,
                        rules: [{ required: true, message: '请输入手机号!' }],
                    })(<Input placeholder='请输入手机号'/>)}
                </Item>
                <Item label="邮箱">
                    {getFieldDecorator('email', {
                        initialValue: user.email,
                        rules: [{ required: true, message: '请输入邮箱!' }],
                    })(<Input placeholder='请输入邮箱'/>)}
                </Item>
                <Item label="角色">
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                        rules: [{ required: true, message: '请选择角色!' }],
                    })(
                        <Select placeholder="请选择角色">
                            {
                                roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                            }
                        </Select>
                    )}
                </Item>
            </Form>
        )
    }
}

UserForm.propTypes = {
    getForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
};

export default Form.create()(UserForm);;