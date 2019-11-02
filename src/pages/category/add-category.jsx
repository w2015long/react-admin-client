import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';
const { Option } = Select;
const {Item}  = Form;

class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
        this.props.getForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {categories,parentId} = this.props
        return (
            <Form>
                <Item>
                    {getFieldDecorator('parentId', {
                        initialValue:parentId
                    })(<Select
                    >
                        <Option value="0" key='0'>一级分类</Option>
                        {
                            categories.map(item=><Option key={item._id} value={item._id}>{item.name}</Option>)
                        }

                    </Select>)}

                </Item>
                <Item>
                    {getFieldDecorator('categoryName', {
                        required: true, message: '分类名称必须输入'
                    })(<Input placeholder='请输入分类名称'/>)}
                </Item>
            </Form>
        )
    }
}

AddCategory.propTypes = {
    categories: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
    getForm: PropTypes.func.isRequired
};

export default Form.create()(AddCategory);;