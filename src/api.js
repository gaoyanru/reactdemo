import axios from 'axios'
import { message } from 'antd';
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.interceptors.request.use(function(config) {
  if(sessionStorage.getItem('token')){
    config.headers.common['Authorize'] = sessionStorage.getItem('token')
  }
  return config
}, function(error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function(response) {
  if (!response.data.status) {
    message.error(response.data.message);
  }
  return response
}, function(error) {
  if (error.response && error.response.status === 403){
    sessionStorage.removeItem('token')
    window.location.replace('/login')
  }
  if(typeof error.response.data === "object"){
    message.error(error.response.data.message)
  }
  return Promise.reject(error)
})

const base = '/api'
export const requestLogin = params => {
  return axios.post(`${base}/security/login`, params).then(res => res.data)
}

export const getSalers = params => {
  return axios.get(`${base}/contract/sales`).then(res => res.data)
}

export const getContractManageList = params => {
  return axios.get(`${base}/contract`,{params: params}).then(res => res.data)
}

export const getListData = (url,params) => {
  return axios.get(`${base}/${url}`, {params:params}).then(res => res.data)
}

export const fetchUserInfo  = params => {
  return axios.get(`${base}/users/${params}`).then(res => res.data)
}

export const postData = (url, params) => {
  return axios.post(`${base}/${url}`,params).then(res => res.data)
}

export const putData = (url, params) => {
  return axios.put(`${base}/${url}`,params).then(res => res.data)
}

export const deleteData = (url, params) => {
  return axios.delete(`${base}/${url}`,params).then(res => res.data)
}

