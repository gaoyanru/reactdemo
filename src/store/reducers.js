import { handleActions } from 'redux-actions'

var user =  sessionStorage.getItem('user');
var defaultState = {
    user: user? JSON.parse(user):{},
    token: sessionStorage.getItem('token'),
    loading: false,
    isLogin: !!(user && sessionStorage.getItem('token'))
}


const actions = handleActions({
    'LOADING': (state, action) => {
        return {
            ...state,
            loading: action.data
        }
    },
    'IS_LOGIN': (state, { data }) => {
        return {
            ...state,
            isLogin: data
        }
    },
    'LOGIN_USER': (state, { data }) => {
        return {
            ...state,
            user: data,
            token: data.Token,
            isLogin: true,
            loading: false
        }
    },
    'DEPARTMENTS': (state, { data }) => {
        return {
            ...state,
            departments: data
        }
    }
}, defaultState)

export default actions