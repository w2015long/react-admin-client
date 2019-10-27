import axios from 'axios';
import {message} from "antd"

 const ajax = (options)=>{
    return new Promise((resolve,reject)=>{
        const obj = {
            method:options.method || 'get',
            url:options.url || '',
            // data:options.data || null,
            // withCredentials: true
        }
        switch(obj.method.toUpperCase()){
            //GET 与 DELETE请求发送数据为 params
            //其他请求(post,put)请求时发送数据用data
            case 'GET':
            case 'DELETE':
                obj.params = options.data
                break;
            default:
                obj.data = options.data

        }
        axios(obj)
            .then(response=>{
                resolve(response.data)
            })
            .catch(err=>{
                // reject(err)
                console.log('catch:',err);
                message.error('请求出错了：' + err.message)
            })
    })
}

export default ajax;
