import React, {Component} from 'react';
import {Card,Button,Table,Modal,message } from 'antd'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from "../../utils/constants";
import {reqUsers, reqDelUser,reqAddUpdateUser} from '../../api'
import UserForm from "./user-form";

const {confirm} = Modal

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowForm:false,
            users:[],
            roles:[],
            user:{},//当前更新的用户
        }

        this.initColumns();

    }

    componentDidMount() {
        this.getUsers()
    }

    initColumns = () => {
        this.columns = [
            {title:'用户名',dataIndex:'username'},
            {title:'邮箱',dataIndex:'email'},
            {title:'电话',dataIndex:'phone'},
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:(create_time) => new Date(create_time).format('yyyy-MM-dd hh:mm:ss')
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render: (role_id) => this.roleName[role_id]
            },
            {
                title:'操作',
                render:(text,user) => (
                    <span>
                        <LinkButton onClick={()=>this.showUpdateUser(user)} >修改</LinkButton>
                        <LinkButton onClick={()=>this.delUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    getUsers = async () => {
        const result = await reqUsers();
        if (result.status===0) {
            const {roles,users} = result.data;

            this.formatRoleName(roles);
            this.setState({
                users,
                roles
            })

        }
    }

    //根据roles的数组, 生成包含所有角色名的对象(属性名用角色id值)
    formatRoleName = (roles) => {
        this.roleName = roles.reduce((pre, cur) => {
            pre[cur._id] = cur.name
            return pre
        }, {})
    }
    //删除用户
    delUser = (user) => {
        confirm({
            title: `你确定要删除${user.username}吗？`,
            // content: 'Some descriptions',
            onOk:async () => {
               const result = await reqDelUser(user._id);
               if (result.status===0) {
                   message.success('删除用户成功');
                   this.getUsers()
               } else {
                   message.error('删除用户失败')
               }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    //隐藏模态框
    hideModal = () => {
        this.form.resetFields();
        this.setState({
            isShowForm:false
        })
    }

    //添加/更新用户
    addOrUpdateUser = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const {user,users} = this.state
                if (user._id) {
                    values._id = user._id
                }

                const result = await reqAddUpdateUser(values);
                this.hideModal()
                if (result.status===0) {
                    message.success(`${user._id?'修改':'添加'}用户成功`);
                    this.getUsers()
          /*          if (user._id) {//修改
                        const index = users.findIndex(u=>u._id = user._id);
                        users.splice(index,1,result.data)
                        this.setState(state=>({
                            users:[...state.users]
                        }))
                    } else {//添加
                        this.setState(state=>({
                            users:[...state.users,result.data]
                        }))
                    }*/


                } else {
                    message.error(`${user._id?'修改':'添加'}用户失败`)
                }
            }
        })
    }
    //显示添加用户模态框
    showAddUser = () => {
        this.setState({isShowForm:true,user:{}})
    }

    //显示更新用户模态框
    showUpdateUser = user => {
        //保存用户信息 请求更新接口时使用
        this.setState({isShowForm:true,user});
    }

    render() {
        const {users,isShowForm,roles,user} = this.state

        const title = (<span>
            <Button type="primary" onClick={()=>this.showAddUser()} >添加用户</Button>
        </span>)
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    rowKey='_id'
                    bordered
                    pagination={{
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper:true
                    }}
                    columns={this.columns}
                />

                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShowForm}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <UserForm
                        getForm={form => {this.form = form}}
                        roles={roles}
                        user={user}
                    />

                </Modal>

            </Card>
        )
    }
}

export default User;