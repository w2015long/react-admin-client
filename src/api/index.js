import ajax from './ajax'
import jsonp from 'jsonp';
import {message} from "antd"

//用户登录
export const reqLogin = (username,password) => ajax({url:'/login',data:{username,password},method:"post"});
//天气信息
export const reqWeather = (city) => {
    return new Promise((resolve,reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,{},(err,data) => {
            if (!err && data.status==='success') {
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            } else {
                message.error('获取天气信息失败')
            }
        })
    })
}

//获取一级或某个二级分类列表
export const reqCategories = (parentId) => ajax({url:"/manage/category/list",data:{parentId}})

//添加分类
export const addCategory = (parentId,categoryName) => ajax({url:"/manage/category/add",method: "post",data:{parentId,categoryName}})

//更新品类名称
export const updateCategoryName = (categoryId,categoryName) => ajax({url:"/manage/category/update",method: "post",data:{categoryId,categoryName}})

//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax({url:"/manage/product/list",data:{pageNum,pageSize}})

//根据ID/Name搜索产品分页列表
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax({url:"/manage/product/search",data:{pageNum,pageSize,[searchType]:searchName}})

//对商品进行上架/下架处理
export const reqUpdateStatus = (productId,status) => ajax({url:"/manage/product/updateStatus",data:{productId,status},method:'post'})

//根据分类ID获取分类
export const reqCategory = (categoryId) => ajax({url:"/manage/category/info",data:{categoryId}})

//删除图片 /manage/img/delete
export const reqDelImg = (name) => ajax({url:"/manage/img/delete",data:{name},method:'post'})

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax({url:`/manage/product/${product._id?'update':'add'}`,data:{product},method:'post'})

//获取角色列表
export const reqRoles = () => ajax({url:"/manage/role/list"})

//添加角色
export const reqAddRole = (roleName) => ajax({url:"/manage/role/add",data:{roleName},method:'post'})

//更新角色(给角色设置权限)
export const reqUpdateRoleAuth = (role) => ajax({url:"/manage/role/update",data:role,method:'post'})

//获取所有用户列表
export const reqUsers = () => ajax({url:"/manage/user/list"})

//删除用户
export const reqDelUser = (userId) => ajax({url:"/manage/user/delete",data:{userId},method:'post'})

//添加用户/更新用户
export const reqAddUpdateUser = (user) => ajax({url:`/manage/user/${user._id?'update':'add'}`,data:user,method:'post'})





/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */
