import React, {Component} from 'react';
import {Card,Select ,Table,Input ,Button,Icon,Switch,message} from 'antd';
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api';
import {PAGE_SIZE} from '../../utils/constants';
import LinkButton from "../../components/link-button";

const { Option } = Select;
const { Search } = Input;
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            total:0,
            products:[],//商品数据
            searchType:'productName',
            keyword:''//搜索关键字
        }
    }
    componentWillMount () {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    //获取商品列表
    getProducts = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        this.setState({loading: true}) // 显示loading
        const {keyword,searchType} = this.state;
        let result
        if (!keyword) {
            result = await reqProducts(pageNum,PAGE_SIZE);
        } else {
            //{pageNum, pageSize, searchName, searchType}
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName:keyword,searchType});
        }
        if (result.status===0) {
            const {total,list} = result.data;
            this.setState({
                loading:false,
                total,
                products:list
            });
        }
    }
    //更新商品状态reqUpdateStatus
    handleStatus = async (productId,status) => {
        console.log(productId, status);
        const result = await reqUpdateStatus(productId,status);
        if(result.status===0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    //初始化列表
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render:(status,record)=>(
                    <span>
                        <Switch
                            checkedChildren='在售'
                            unCheckedChildren='下架'
                            checked={status===1?true:false}
                            onChange={
                                (checked)=>{
                                    this.handleStatus(record._id,checked?1:2)
                                }
                            }
                        />
		  	        </span>
                )
            },
            {
                title: '操作',
                width:120,
                dataIndex: 'Action',
                key: 'x',
                render: (text,record) => (
                    <div>
                        <LinkButton onClick={()=>{this.props.history.push('/product/detail',record)}}>详情</LinkButton>
                        <LinkButton onClick={()=>{this.props.history.push('/product/addupdate')}}>编辑</LinkButton>
                    </div>
                ),
            }
        ]
    }
    render() {
        const {loading,products,total,searchType,keyword} = this.state;

        const title = (
            <span>
                <Select
                    value={searchType}
                    onChange={(searchType) => {this.setState({searchType})}}
                    style={{ width: 130 }}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Search style={{ width: 200 ,marginLeft:10}}
                    placeholder="input search text"
                    enterButton="Search"
                    onSearch={value => {
                        this.setState({keyword:value});
                        this.getProducts(1)
                    }}
                />
            </span>
        )

        const extra = (
            <span>
                <Button type="primary" onClick={()=>{this.props.history.push('/product/addupdate')}}>
                    <Icon type='plus'/>
                    添加商品
                </Button>
            </span>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    //表格数据
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current:this.pageNum,
                        pageSize:PAGE_SIZE,
                        total:total,
                        // onChange: pageNum => {this.getProducts(pageNum)}
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}

export default Home;