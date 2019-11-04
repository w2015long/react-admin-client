import React, {Component} from 'react';
import { Card ,Button,Table,Icon,message,Modal} from 'antd';
import LinkButton from '../../components/link-button'
import AddForm from './add-category';
import UpdateForm from './update-category';
import {reqCategories,addCategory,updateCategoryName} from '../../api';


class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            categories:[],// 一级分类列表
            subCategories:[],// 二级分类列表
            parentId:'0',//当前需要显示的分类列表的父分类ID
            parentName:'',// 当前需要显示的分类列表的父分类名称
            modalStatus:0,// 0:隐藏 1:显示添加分类 2:显示更新分类
        }
    }
    componentWillMount() {
        this.getColumns();
    }

    componentDidMount() {
        this.getCategories();
    }
    /*------------事件处理--------------*/
    //异步获取一级/二级分类列表显示
    getCategories = async (parentId) => {
        this.setState({loading:true})
        parentId = parentId || this.state.parentId;
        const result = await reqCategories(parentId);
        console.log(result);
        if (result.status === 0) {
            this.setState({loading:false})
            const categories = result.data;
            if (parentId === '0') {//一级分类
                this.setState({categories})
            } else {//二级分类
                this.setState({subCategories:categories})
            }
        } else {
            message.error('获取分类失败')
        }
    }
    // 显示指定一级分类列表
    showCategories = () => {
        this.setState({
            parentId:'0',
            parentName:'',
            subCategories:[]
        })
    }
    //显示指定一级分类对象的二子列表
    showSubCategories = (id,name) => {
        this.setState({
            parentId: id,
            parentName: name
        },()=>{
            this.getCategories()
        })
    }
    //初始化列数据
    getColumns = () => {
         this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
                key: 'name',
            },
            {
                title: '操作',
                width:300,
                dataIndex: 'Action',
                key: 'x',
                render: (text,record) => (
                    <span>
                        {
                            this.state.parentId==='0'?
                                <LinkButton onClick={()=>{this.showSubCategories(record._id,record.name)}}>查看子分类</LinkButton>
                                :null
                        }
                        <LinkButton onClick={()=>{this.showUpdateModal(record._id,record.name)}}>修改分类</LinkButton>
                    </span>
                ),
            }
        ];
    }
    //显示添加模态框
    addShow = () => {
        this.setState({
            modalStatus:1
        })
    }
    //显示更新模态框
    showUpdateModal = (categoryId,categoryName) => {
        this.setState({
            modalStatus:2
        });
        //保存当前要更新的分类数据
        this.categoryId = categoryId;
        this.categoryName =categoryName;
    }
    //添加分类
    addCategoryHandle =  () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const {parentId,categoryName} = values;
                this.hideModal();
                const result = await addCategory(parentId,categoryName);
                if (result.status===0) {
                    // 添加的分类就是当前分类列表下的分类
                    if (parentId===this.state.parentId) {
                        //刷新当前列表
                        this.getCategories();
                    }//二级分类下添加一级分类 (获取一级分类但不更新页面)
                    else if (parentId==='0') {
                        this.getCategories('0');
                    }
                } else {
                    message.error('添加分类失败')
                }
            }
        });

    }
    //更新分类名称
    updateCategory = () => {
        this.form.validateFields(async (err,value)=>{
            if (!err) {
                const {categoryName} = value;
                this.hideModal();
                const result = await updateCategoryName(this.categoryId,categoryName);
                if (result.status===0) {
                    //刷新当前列表
                    this.getCategories();
                } else {
                    message.error('更新分类名称失败')
                }
            }
        })


    }
    //隐藏模态框
    hideModal = () => {
        // 清除输入数据
        this.form.resetFields()
        this.setState({
            modalStatus:0
        })
    }



    render() {
        const {
            categories,
            loading,
            modalStatus,
            parentId,
            subCategories,
            parentName
        } = this.state;
        const title = parentId === '0' ? '一级分类':(
            <span>
                <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button type="primary" onClick={this.addShow}>
                <Icon type="plus"/> 添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0'?categories:subCategories}
                    loading={loading}
                    rowKey='_id'
                    bordered
                    pagination={{
                        defaultPageSize:5,
                        showQuickJumper:true
                    }}
                    columns={this.columns} />
                <Modal
                    title="添加分类"
                    visible={modalStatus===1}
                    onOk={this.addCategoryHandle}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <AddForm
                        getForm={form => {this.form = form}}
                        categories={categories}
                        parentId={parentId}/>

                </Modal>
                <Modal
                    title="更新分类"
                    visible={modalStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <UpdateForm
                        categoryName={this.categoryName}
                        getForm={form => {this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}

export default Category;