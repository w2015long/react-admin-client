import React, {Component} from 'react';
import { Card ,Button,Table,Icon,message,Modal} from 'antd';
import LinkButton from '../../components/link-button'
import AddForm from './add-category';
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
        const result = await reqCategories('0');
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
    //显示指定一级分类对象的二子列表
    showSubCategories = (category) => {
        console.log(category);
        this.setState({
            parentId: category._id,
            parentName: category.name
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
                render: (category) => (
                    <span>
                        <LinkButton onClick={()=>{this.showSubCategories(category)}}>查看子分类</LinkButton>
                        <LinkButton >修改分类</LinkButton>
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
    //添加分类
    addCategoryHandle = () => {
        const {parentId,categoryName} = this.form.getFieldsValue();
        this.hideModal();
        const result = addCategory(parentId,categoryName);
        if (result.status===0) {

        } else {
            message.error('添加分类失败')
        }
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
        const {categories,loading,modalStatus,parentId,subCategories,parentName} = this.state;
        const title = parentId === '0' ? '一级分类':(
            <span>
                <LinkButton>查看子分类</LinkButton>
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
                    <p>更新分类</p>
                </Modal>
            </Card>
        )
    }
}

export default Category;