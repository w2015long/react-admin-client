import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';
const { Option } = Select;
const {Item}  = Form;

class UpdateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
        this.props.getForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {categoryName} = this.props
        return (
            <Form>
                <Item>
                    {getFieldDecorator('categoryName', {
                        initialValue:categoryName,
                        rules: [{ required: true, message: '请输入分类名称!' }],
                    })(<Input placeholder='请输入分类名称'/>)}
                </Item>
            </Form>
        )
    }
}

UpdateForm.propTypes = {
    categoryName: PropTypes.string.isRequired,
    getForm: PropTypes.func.isRequired
};

export default Form.create()(UpdateForm);;