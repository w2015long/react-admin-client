
export const getUser = ()=>{
    return localStorage.getItem('user_key')
}
export const setUser = (username)=>{
    localStorage.setItem('user_key',username);
}
export const removeUser = () => {
    localStorage.removeItem('user_key')
}
