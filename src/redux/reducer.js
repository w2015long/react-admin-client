import {combineReducers} from 'redux';

import {getUser} from "../utils/userStore";
import {SET_HEAD_TITLE} from "./action-types";

/*
用来管理头部标题的reducer函数
 */

const initHederTitle = ''

function headTitle(state = initHederTitle,action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.payload
        default:
            return state
    }
}

/*
用来管理当前登陆用户的reducer函数
 */

const initUser = getUser();

function user(state = initUser,action) {
    switch (action.type) {
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
    user
})