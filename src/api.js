import axios from 'axios'
import { message } from 'antd';

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
  return axios.get(`${base}/contract?offset=0&limit=15&contractNo=&companyname=&contact=&saleName=&contractStatus=0&contractType=0&financeStatus=0&starttime=&endtime=`).then(res => res.data)
}

// export const getContractManageList = params => {
//   return axios.get(`${base}/contract`, {params:params}).then(res => res.data)
// }
