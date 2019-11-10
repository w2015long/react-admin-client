import React, {Component} from 'react';
import {Card ,Table,Modal ,Button, message} from 'antd';
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles,reqAddRole, reqUpdateRoleAuth} from '../../api'
import AddForm from "./add-form";
import AuthForm from "./auth-form";

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStatus:0,// 0:隐藏 1:显示添加角色 2:显示设置权限界面
            role:{},
            roles:[
                {
                    "menus": [
                        "/role",
                        "/charts/bar",
                        "/home",
                        "/category"
                    ],
                    "_id": "5ca9eaa1b49ef916541160d3",
                    "name": "测试",
                    "create_time": 1554639521749,
                    "__v": 0,
                    "auth_time": 1558679920395,
                    "auth_name": "test007"
                },
                {
                    "menus": [
                        "/role",
                        "/charts/bar",
                        "/home",
                        "/charts/line",
                        "/category",
                        "/product",
                        "/products"
                    ],
                    "_id": "5ca9eab0b49ef916541160d4",
                    "name": "经理",
                    "create_time": 1554639536419,
                    "__v": 0,
                    "auth_time": 1558506990798,
                    "auth_name": "test008"
                },
                {
                    "menus": [
                        "/home",
                        "/products",
                        "/category",
                        "/product",
                        "/role"
                    ],
                    "_id": "5ca9eac0b49ef916541160d5",
                    "name": "角色1",
                    "create_time": 1554639552758,
                    "__v": 0,
                    "auth_time": 1557630307021,
                    "auth_name": "admin"
                }
            ]
        }
    }

    componentWillMount() {
        console.log(this.form);
        this.initColumn()
    }

    componentDidMount() {
        // this.getRoles()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time'
            },            {
                title: '授权时间',
                dataIndex: 'auth_time'
            },            {
                title: '授权人',
                dataIndex: 'auth_name'
            },

        ]
    }
    getRoles = async () =>{
        const result = await reqRoles()
        if (result.status===0) {
            const roles = result.data;
            this.setState({
                roles
            })
        }
    }


    onRow = (record,index) => {
        return {
            onClick: event => {// 点击行
                this.setState({role:record})
            },
        }
    }

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

    updateRoleAuth = async () => {
        const menus = this.auth.getMenus();
        const {role} = this.state;
        role.menus = menus;
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