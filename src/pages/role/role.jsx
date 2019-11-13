import React, {Component} from 'react';
import {Card ,Table,Modal ,Button, message} from 'antd';
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles,reqAddRole, reqUpdateRoleAuth} from '../../api'
import {getUser} from '../../utils/userStore'
import AddForm from "./add-form";
import AuthForm from "./auth-form";

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStatus:0,// 0:隐藏 1:显示添加角色 2:显示设置权限界面
            role:{},
            roles:[],
        }
    }

    componentWillMount() {
        console.log(this.form);
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (text) => new Date(text).format('yyyy-MM-dd hh:mm:ss')
            },            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:(auth_time) => new Date(auth_time).format('yyyy-MM-dd hh:mm:ss')
            },            {
                title: '授权人',
                dataIndex: 'auth_name'
            },

        ]
    }
    //获取角色列表
    getRoles = async () =>{
        const result = await reqRoles()
        if (result.status===0) {
            const roles = result.data;
            this.setState({
                roles
            })
        }
    }

    //点击选中行
    onRow = (record,index) => {
        return {
            onClick: event => {// 点击行
                this.setState({role:record})
            },
        }
    }
    //添加角色
    addRoleHandle = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const {roleName} = values;
                const result = await reqAddRole(roleName);
                this.hideModal()
                if (result.status===0) {
                    message.success('添加角色成功');
               /*   const roles = [...this.state.roles];
                    roles.push(result.data);
                    this.setState({roles})*/

                    // 更新roles状态: 基于原本状态数据更新
                    this.setState((state)=>({
                        roles:[...state.roles,result.data]
                    }))
                } else {
                    message.error('添加角色失败')
                }
            }
        })
    }

    //更新权限信息
    updateRoleAuth = async () => {
        const menus = this.auth.getMenus();
        const {role} = this.state;
        role.auth_time = Date.now();
        role.menus = menus;
        role.auth_name = getUser();
        this.hideModal();
        const result = await reqUpdateRoleAuth(role);
        if (result.status===0) {
            message.success('更新角色权限成功');
            this.setState(state=>({
                roles:[...state.roles]
            }))
        } else {
            message.error('更新角色权限失败')
        }
    }

    //隐藏模态框
    hideModal = () => {
        //清除输入数据
        if (this.state.modalStatus===1) {
            this.form.resetFields();
        }
        this.setState({
            modalStatus:0
        })
    }

    render() {
        const {roles,role,modalStatus} = this.state;
        const title = (
            <span>
                <Button type="primary" onClick={()=>this.setState({modalStatus:1})} >创建角色</Button>&nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={()=>this.setState({modalStatus:2})}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    //表格数据
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{
                        pageSize:PAGE_SIZE,
                    }}
                    rowSelection={{
                        type:"radio",
                        selectedRowKeys:[role._id]
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加分类"
                    visible={modalStatus===1}
                    onOk={this.addRoleHandle}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <AddForm
                        getForm={form => {this.form = form}}
                    />

                </Modal>

                <Modal
                    title="权限管理"
                    visible={modalStatus===2}
                    onOk={this.updateRoleAuth}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <AuthForm
                        role={role}
                        ref={el=>this.auth = el}
                    />

                </Modal>
            </Card>
        )
    }
}

export default Role;