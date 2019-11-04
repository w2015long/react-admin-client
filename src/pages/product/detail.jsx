import React, {Component} from 'react';
import {Card, List,Icon } from 'antd';
import LinkButton from '../../components/link-button';
import {BASE_IMG_URL} from '../../utils/constants'
const {Item}  = List;


class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        console.log(this.props.location.state);
    }

    render() {
        const {name,desc,detail,imgs,price} = this.props.location.state;
        const title = (
            <div>
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <Icon type="arrow-left" />
                </LinkButton>
                <span>商品详情</span>
            </div>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className="product-detail-left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">所属分类:</span>
                        <span>一级分类---二级</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品图片:</span>
                        <span>
                            {
                                imgs.map((img)=><img className="product-img" key={img} src={BASE_IMG_URL + img} alt="img"/>)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default Detail;