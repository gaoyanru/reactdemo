import { requestLogin, fetchList} from '@/api'


export const login = (payload) => (dispatch) => {
    dispatch({type: 'LOADING', data: true})
    requestLogin(payload).then(res => {
        if (res.status) {
            sessionStorage.setItem('token',res.data.Token)
            sessionStorage.setItem('user', JSON.stringify(res.data))
            dispatch({type: 'LOGIN_USER', data: res.data})
        }else{
            dispatch({type: 'LOADING', data: false})
        }
    })
}

export const getList = ({url,params}) => (dispatch) => {
    dispatch({type: 'LOADING', data: true})
    fetchList(url,params).then(res => {
        if (res.status) {
            dispatch({type: 'PAGE_LIST_DATA', data: res.data})
        }
    })
}