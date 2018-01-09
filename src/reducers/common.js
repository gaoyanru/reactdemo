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
    'LOGOUT': (state, { data }) => {
        sessionStorage.clear()
        return {}
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
    'AREAS': (state, { data }) =>{
        return {
            ...state,
            areas: data
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
    },
    'get main task list': (state, { data }) =>{
        return {
            ...state,
            main_tasks: data
        }
    },
    'get sub task list': (state, { data }) =>{
        return {
            ...state,
            sub_task: data
        }
    },

    'get outworkers': (state, { data }) =>{
        return {
            ...state,
            outworkers: data
        }
    },
    'BELONG_COMPANY': (state, { data }) => {
        return {
            ...state,
            belongCompany: data
        }
    },
    'get signkey': (state, { data }) =>{
        return {
            ...state,
            signkey: data
        }
    },
    'remove signkey': (state, { data }) =>{
        return {
            ...state,
            signkey: data
        }
    },
    'getMainItemList': (state, { data }) =>{
        return {
            ...state,
            contractItems: data
        }
    }
}, defaultState)

export default actions
