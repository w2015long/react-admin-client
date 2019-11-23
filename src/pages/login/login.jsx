import React, {Component} from 'react';
import { Form, Icon, Input, Button,message } from 'antd';
import {reqLogin} from "../../api";
import {setUser,setLS} from "../../utils/userStore";

import logo from '../../assets/images/logo.png';
import './login.less';

class Login extends Component{
    constructor (props) {
        super(props);
        this.state = {
            isFetching:false
        }
    }
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码')
        } else if (value.length < 4) {
            callback('密码至少4位')
        } else if (value.length > 14) {
            callback('密码至多14位')
        } else if (!/^[0-9a-z_]+$/i.test(value)) {
            callback('密码必须是英文数字下划线')
        } else {
            callback()
        }
    }

    //登录
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username,password} = values;
                this.setState(state => ({isFetching: true}));
                const ret = await reqLogin(username,password);
                console.log(ret);
                if (ret.status === 0) {
                    this.setState(state => ({isFetching: false}));
                    // 提示登陆成功
                    message.success('登陆成功');
                    const user = ret.data;
                    //保存用户登录状态
                    setUser(user.username);
                    setLS('user',user)
                    //跳转首页
                    window.location.href = '/home';
                } else {
                    // 提示错误信息
                    message.error(ret.msg)
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2 className={"login-title"}>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [//声名式验证
                                    { required: true, message: '请输入用户名' },
                                    { min: 4, message: '用户名至少4位' },
                                    { max: 14, message: '用户名至多14位' },
                                    { pattern: /^[0-9a-zA-Z_]+$/, message: '用户名必须是英文数字下划线' },
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [//自定义校验（注意，callback 必须被调用）
                                    { validator: this.validatePwd }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                loading={this.state.isFetching}
                            >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
const LoginForm = Form.create()(Login);
export default LoginForm;