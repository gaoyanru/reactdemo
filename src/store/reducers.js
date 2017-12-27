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
    },
    'ROLES': (state, { data }) => {
        return {
            ...state,
            roles: data
        }
    }, 
    'SALERS': (state, { data }) => {
        return {
            ...state,
            salers: data
        }
    }, 
    'CUSTOMER_TYPE': (state, { data }) => {
        return {
            ...state,
            customerTypes: data
        }
    }, 
    'CUSTOMER_TAGS': (state, { data }) => {
        return {
            ...state,
            tags: data
        }
    }, 
    'CUSTOMER_SOURCE': (state, { data }) => {
        return {
            ...state,
            customerSource: data
        }
    }, 
    
    'CURRENT_POWERLIST': (state, { data }) => {
        return {
            ...state,
            functions: data
        }
    },
    'users set departmentId': (state, { data }) => {
        return {
            ...state,
            users_departmentId: data
        }
    },
    'users set search params': (state, { data }) => {
        return {
            ...state,
            users_searchParams: data
        }
    },
    'users get user list': (state, { data }) =>{
        return {
            ...state,
            users_listData: data
        }
    },
    'get groups': (state, { data }) =>{
        return {
            ...state,
            groups: data
        }
    }
}, defaultState)

export default actions