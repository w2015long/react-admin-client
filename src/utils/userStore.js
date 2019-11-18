
export const getUser = ()=>{
    return localStorage.getItem('user_key')
}
export const setUser = (username)=>{
    localStorage.setItem('user_key',username);
}
export const removeUser = () => {
    localStorage.removeItem('user_key')
}


export const setLS = function (key, value) {
        if (arguments.length === 2) {
            var v = value;
            if (typeof v == 'object') {
                v = JSON.stringify(v);
                v = 'obj-' + v;
            } else {
                v = 'str-' + v;
            }
            var ls = localStorage;
            if (ls) {
                ls.setItem(key, v);
            }
        }
    }
export const getLS = function (key) {
        var ls = localStorage;
        if (ls) {
            var v = ls.getItem(key);
            if (!v) {
                return;
            }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        }
    }
export const  rmLS = function (key) {
        var ls = localStorage;
        if (ls && key) ls.removeItem(key);
    }
export const  clearLS = function () {
        var ls = localStorage;
        if (ls) ls.clear();
    }
