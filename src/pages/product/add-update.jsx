import React, {Component} from 'react';
import { Card,Form, Input,Cascader,Icon ,InputNumber,Button } from 'antd';
import LinkButton from '../../components/link-button';

import {reqCategories} from '../../api';

const {Item} = Form;
const { TextArea } = Input;


class AddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdate:false,
            options
        }
    }
    componentDidMount() {

    }
    getCategoryOptions = async (parentId) => {
        const result = await reqCategories(parentId) // {status: 0, data: categorys}
        if (result.status === 0) {
            const categories = result.data;
            if (parentId === '0') {

            } else {

            }
        }


    }

    /**
     *用加载下一级列表的回调函数
     */
    loadData = selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `${targetOption.label} aaaaaa 1`,
                    value: 'dynamic1',
                },
                {
                    label: `${targetOption.label} bbbbb 2`,
                    value: 'dynamic2',
                },
            ];
            this.setState({
                options: [...this.state.options],
            });
        }, 150);
    }

    render() {
        // 头部左侧标题
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>{'isUpdate' ? '修改商品' : '添加商品'}</span>
            </span>
        );
        const {getFieldDecorator} = this.props.form;
        // const {} = this.product
        return (
            <Card title={title}>
                <Form
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 10 }}
                    onSubmit={this.handleSubmit}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: 'product.name',
                                rules: [
                                    {required: true, message: '必须输入商品名称'}
                                ]
                            })(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: 'product.name',
                                rules: [
                                    {required: true, message: '必须输入商品描述'}
                                ]
                            })(<TextArea placeholder='请输入商品名称' autoSize={{ minRows: 3, maxRows: 5 }}/>)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: 'price',
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
                            // getFieldDecorator('categoryIds', {
                            //     initialValue: '一级分类',
                            //     rules: [
                            //         {required: true, message: '必须指定商品分类'}
                            //     ]
                            // })()
                            <Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}/*需要显示的列表数据数组*/
                                loadData={this.loadData}/*当选择某个列表项, 加载下一级列表的监听回调*/
                            />
                        }
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