import { requestLogin, getListData, postData, deleteData } from '@/api'

export const login = (payload) => (dispatch) => {
    dispatch({ type: 'LOADING', data: true })
    requestLogin(payload).then(loginRes => {
        if (loginRes.status) {
            sessionStorage.setItem('token', loginRes.data.Token)
            getListData('mycity').then(res=>{
                if(res.status){
                    loginRes.data.CityCode = res.data.Code
                    sessionStorage.setItem('user', JSON.stringify(loginRes.data))
                    dispatch({ type: 'LOGIN_USER', data: loginRes.data })
                }
            })
        } else {
            dispatch({ type: 'LOADING', data: false })
        }
    })
}

export function getAllDepartments(payload) {
    return (dispatch,getState) => {
        getListData('departmentscenter').then(res => {
            if (res.status) {
                dispatch({ type: 'DEPARTMENTS', data: res.data.list })
            }
        })
    }
}

export function getAllRoles(payload,getState) {
    return (dispatch, getState) => {
        getListData('roles').then(res => {
            if (res.status) {
                dispatch({ type: 'ROLES', data: res.data.list })
            }
        })
    }
}
export function getAllSalers(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.salers && !force){
            return null;
        }
        getListData('contract/sales').then(res => {
            if (res.status) {
                dispatch({ type: 'SALERS', data: res.data })
            }
        })
    }
}
export function getOutworkers(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.outworkers && !force){
            return null;
        }
        getListData('outworkers').then(res => {
            if (res.status) {
                dispatch({ type: 'get outworkers', data: res.data.list })
            }
        })
    }
}

export function getAreas(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.areas && !force){
            return null;
        }
        getListData('code/area').then(res => {
            if (res.status) {
                console.log(res.data )
                dispatch({ type: 'AREAS', data: res.data })
            }
        })
    }
}

export function getCustomerType(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.customerTypes && !force){
            return null;
        }
        getListData('cuscategory').then(res => {
            if (res.status) {
                dispatch({ type: 'CUSTOMER_TYPE', data: res.data })
            }
        })
    }
}

export function getTags(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.tags && !force){
            return null;
        }
        getListData('tag').then(res => {
            if (res.status) {
                dispatch({ type: 'CUSTOMER_TAGS', data: res.data })
            }
        })
    }
}
export function getCustomerSource(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.customerSource && !force){
            return null;
        }
        getListData('customersource').then(res => {
            if (res.status) {
                dispatch({ type: 'CUSTOMER_SOURCE', data: res.data })
            }
        })
        dispatch({ type: 'CUSTOMER_SOURCE', data: [] })
    }
}
export function getMainTask(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.main_tasks && !force){
            return null;
        }
        getListData('commontask').then(res => {
            if (res.status) {
                dispatch({ type: 'get main task list', data: res.data })
            }
        })
        // dispatch({ type: 'get main task list', data: [] })
    }
}
export function getSubTask(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.sub_task && !force){
            return null;
        }
        getListData('outertasksub', {offset:0,limit:9999}).then(res => {
            if (res.status) {
                dispatch({ type: 'get sub task list', data: res.data.list })
            }
        })
    }
}


export function setPowerList(payload) {
    return (dispatch) => {
        dispatch({ type: 'CURRENT_POWERLIST', data: payload })
    }
}

export const getGroups = (force) => (dispatch, getState) => {
    dispatch({ type: 'LOADING', data: true })
    const state = getState();
    if(state.groups && !force){
        return null;
    }
    getListData('departments').then(res => {
        dispatch({ type: 'LOADING', data: false })
        if(res.status){
            dispatch({ type: 'get groups', data: res.data})
        }
    })
}

export const deleteGroup = (payload) => (dispatch, state) =>{
    dispatch({ type: 'LOADING', data: true })
    deleteData('departments/' + payload).then(res => {
        dispatch(getGroups(true))
    })
}

export const addGroup = (payload) => (dispatch, state) =>{
    dispatch({ type: 'LOADING', data: true })
    postData('departments', payload).then(res => {
        dispatch(getGroups(true))
    })
}