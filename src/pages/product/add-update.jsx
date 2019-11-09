import React, {Component} from 'react';
import { Card,Form, Input,Cascader,Icon ,InputNumber,Button,message } from 'antd';
import LinkButton from '../../components/link-button';
import PicturesWall from '../../components/pictures-wall';
import RichEditor from '../../components/rich-editor'
import {reqCategories,reqAddOrUpdateProduct} from '../../api';

const {Item} = Form;
const { TextArea } = Input;


class AddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options:[]
        }
    }
    componentWillMount() {
        const product = this.props.location.state;
        //保存更新标识
        this.isUpdate = !!product;
        this.product = product || {}
    }

    componentDidMount() {
        this.getCategoryOptions('0');
    }
    initOptions = async (categories) => {
        const options = categories.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false
        }));
        // 如果是一个二级分类商品的更新
        const {pCategoryId} = this.product;
        if (this.isUpdate && pCategoryId !== '0') {
            const cOptions = await this.getCategoryOptions(pCategoryId);
            // 生成二级下拉列表的options
            const childOptions = cOptions.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }));
            // 找到当前商品对应的一级option对象
           const targetOption = options.find(c=>c.value===pCategoryId);
            // 二级分类关联对应的一级option上
           targetOption.children = childOptions
        }



        this.setState({options})
    }

    getCategoryOptions = async (parentId) => {
        const result = await reqCategories(parentId) // {status: 0, data: categorys}
        if (result.status === 0) {
            const categories = result.data;
            if (parentId === '0') {
                this.initOptions(categories)
            } else {
                return categories
            }
        }


    }

    /**
     *用加载下一级列表的回调函数
     */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        //loading二级分类
        targetOption.loading = true;
        const pId = targetOption.value;
        const cOptions = await this.getCategoryOptions(pId);

        targetOption.loading = false;
        if (cOptions && cOptions.length > 0) {//有二级分类
            const childOpts = cOptions.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true
            }));
            targetOption.children = childOpts
        } else {//当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }

        // 更新options状态
        this.setState({
            options: [...this.state.options],
        });
    }
    /*
    * 提交表单
    * */
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 1. 收集数据, 并封装成product对象
                const {name, desc, price, categoryIds} = values
                const imgs = this.pw.getImgs();
                const detail = this.editor.getDetail()
                let pCategoryId,categoryId;
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                } else {
                    pCategoryId = categoryIds[0];
                    categoryId = categoryIds[categoryIds.length - 1]
                }

                const product = {
                    name, desc, price,pCategoryId,categoryId,imgs,detail
                }
                console.log(product);
                // 如果是更新, 需要添加_id
                if (this.isUpdate) {
                    product._id = this.product._id;
                }
                const result = await reqAddOrUpdateProduct(product);
                // 3. 根据结果提示
                if (result.status===0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
                }

            }
        });
    }

    render() {
        const {product,isUpdate} = this;
        const {pCategoryId, categoryId,imgs, detail} = product;
        const categoryIds = [];
        if (isUpdate) {
            if (pCategoryId==='0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }



        // 头部左侧标题
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        );
        const {getFieldDecorator} = this.props.form;

        return (
            <Card title={title}>
                <Form
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 10 }}
                    onSubmit={this.handleSubmit}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: '必须输入商品名称'}
                                ]
                            })(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: '必须输入商品描述'}
                                ]
                            })(<TextArea placeholder='请输入商品名称' autoSize={{ minRows: 3, maxRows: 5 }}/>)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: '必须输入商品价格'}
                                ]
                            })(<InputNumber
                                style={{width:'100%'}}
                                min={0}
                                formatter={value => `${value}元`}
                                parser={value => value.replace('元', '')}
                            />)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {required: true, message: '必须指定商品分类'}
                                ]
                            })(<Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}/*需要显示的列表数据数组*/
                                loadData={this.loadData}/*当选择某个列表项, 加载下一级列表的监听回调*/
                            />)

                        }
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={el => this.pw = el} imgs={imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{ span: 2 }}
                          wrapperCol={{ span: 18 }}>
                        <RichEditor ref={el => this.editor = el} detail={detail} />
                    </Item>
                    <Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{width:'100%',marginLeft:"20%"}}
                            // loading={this.state.isFetching}
                        >
                            提交
                        </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(AddUpdate);;