import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Tree } from 'antd';
import menuList from '../../config/menuConfig';


const { TreeNode } = Tree;
const {Item}  = Form;

class AuthForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys:[]
        }
        this.treeNode = this.getTreeNode(menuList);
    }

    // 根据新传入的role来更新checkedKeys状态
    /*
    当组件接收到新的属性时自动调用
     */
    componentWillReceiveProps(nextProps) {
        const {menus} = nextProps.role;
        this.setState({
            checkedKeys: menus
        })
    }

    getMenus = () => this.state.checkedKeys;

    getTreeNode = list => {
        return list.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNode(item.children) :null}
                </TreeNode>
            )
            return pre
        },[])
    }

    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    }


    render() {
        console.log('auth_form:: render()')
        const { name } = this.props.role;
        const {checkedKeys} = this.state;

        return (
            <div>
                <Item label="角色名称"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}>
                    <Input value={name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNode}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}

AuthForm.propTypes = {
    role: PropTypes.object
};

export default AuthForm;;