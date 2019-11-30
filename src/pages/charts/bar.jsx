import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {Card ,Button} from 'antd'

class Bar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sales:[5, 20, 36, 10, 10, 20], //销量
            stores: [10, 15, 50, 60, 30, 25], //库存
        }
    }


    getOptions = (sales,stores) => {
        return {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量','库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: sales
            },{
                name: '库存',
                type: 'bar',
                data: stores
            }],

        }
    }

    update = () => {
        this.setState(state=>({
            sales: state.sales.map(sale => ++sale),
            stores: state.stores.reduce((pre,store)=>{
                pre.push(--store)
                return pre
            },[])
        }))
    }

    render() {
        const {sales,stores} = this.state
        return (
            <>
                <Card>
                    <Button type="primary" onClick={this.update}>更新</Button>
                </Card>
                <Card title={'柱状图'}>
                    <ReactEcharts
                        option={this.getOptions(sales,stores)}
                    />
                </Card>
            </>
        )
    }
}

export default Bar;