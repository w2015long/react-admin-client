

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from './reducer'

const myReducer = persistReducer({
    key: 'root',
    storage
}, reducer);

export default createStore(myReducer,composeWithDevTools(applyMiddleware(thunk)));