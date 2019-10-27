import ajax from './ajax';

//用户登录
export const reqLogin = (username,password) => ajax({url:'/login',data:{username,password},method:"post"});