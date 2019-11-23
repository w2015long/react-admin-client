
import {
    SET_HEAD_TITLE,
    LOGIN_LOADING,
    LOGIN_DONE,
    RECEIVE_USER,
    RESET_USER
} from "./action-types";
import {reqLogin} from "../api";
import {message} from 'antd'
import {setUser} from "../utils/userStore";



const loginLoading = () => ({type:LOGIN_LOADING});
const loginDone = () => ({type:LOGIN_DONE});
const receiveUser = (user) => ({type:RECEIVE_USER,user});


export const setTitleAction = payload => ({type:SET_HEAD_TITLE,payload});

export const loginAction = (username, password) => {
    return async dispatch => {
        dispatch(loginLoading())
        const ret = await reqLogin(username, password);
        dispatch(loginDone())
        if (ret.status === 0) {
            // 提示登陆成功
            message.success('登陆成功');
            const user = ret.data;
            //保存用户登录状态
            setUser(user.username);
            dispatch(receiveUser(user));

        } else {
            // 提示错误信息
            message.error(ret.msg)
        }
    }
}

export const resetUserAction = () => ({type:RESET_USER})