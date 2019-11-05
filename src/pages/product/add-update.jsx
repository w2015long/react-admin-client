import React, {Component} from 'react';
import { Card,Form, Input,Cascader,Icon ,InputNumber,Button } from 'antd';
import LinkButton from '../../components/link-button';
const {Item} = Form;
const { TextArea } = Input;

class AddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdate:false
        }
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
                                initialValue: '100',
                                rules: [
                                    {required: true, message: '必须输入商品价格'}
                                ]
                            })(<InputNumber/>)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: '一级分类',
                                rules: [
                                    {required: true, message: '必须指定商品分类'}
                                ]
                            })(<Cascader />)
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