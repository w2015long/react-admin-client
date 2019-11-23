import {combineReducers} from 'redux';

import {getUser} from "../utils/userStore";
import {
    SET_HEAD_TITLE,
    LOGIN_LOADING,
    LOGIN_DONE,
    RECEIVE_USER,
    RESET_USER
} from "./action-types";

/*
用来管理头部标题的reducer函数
 */

const initHederTitle = ''

function headTitle(state = initHederTitle,action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.payload;
            break;
        default:
            return state
    }
}

/*
用来管理当前登陆用户的reducer函数
 */

const initUser = {
    username:getUser(),
    isFetching:false,
    user:null
}

function userInfor(state = initUser,action) {
    switch (action.type) {
        case LOGIN_LOADING:
            return Object.assign({},state,{isFetching:true})
            break
        case LOGIN_DONE:
            return Object.assign({},state,{isFetching:false})
            break
        case RECEIVE_USER:
            return Object.assign({},state,{user:action.user})
            break;
        case RESET_USER:
            return Object.assign({},state,{user:null})
            break;
        default:
            return state
    }
}

/*
向外默认暴露的是合并产生的总的reducer函数
管理的总的state的结构:
  {
    headTitle: '首页',
    user: {}
  }
 */

export default combineReducers({
    headTitle,
    userInfor
})