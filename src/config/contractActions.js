import React, { Component } from 'react'
import Dialog from '@/container/Dialog'
import Prompt from '@/component/Prompt'
import AddRemark from '@/container/Contract/AddRemark'
import { message } from 'antd'
import { getListData, postData, putData } from '@/api'
import store from '@/store'

export const mark = (data)=>{ //标记，取消标记 data：公司信息
    if(!data.RemarkSignId){
        let markform
        return Dialog({
            content: <AddRemark wrappedComponentRef={crmform =>{markform = crmform}}/>,
            width: 540,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    let form_data = markform.getFieldsValue();
                    const state = store.getState();
                    if(form_data){
                        form_data.CustomerId = data.Id;
                        form_data.Remark = form_data.Remark + '{' + state.user.RealName + '}';
                        putData("companySign", form_data).then(res=>{
                            if(res.status){
                                resolve()
                            }else{
                                reject()
                            }
                        },()=>reject())
                    }else{
                        reject()
                    }
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "标记-"+ data.CompanyName 
        }).result;

    }else{
        return putData('cancelcompanysign?customerId='+ data.Id)
    }
}
export const hangUp = (row)=>{  //挂起
    return new Promise((resolve, reject) => {
        Prompt({
            title: '挂起原因',
            handleOk: (res)=>{
                putData('order/expire/suspend',{
                    CompanyId: row.Id,
                    Description: res
                }).then(res=>{
                    if(res.status){
                        message.info('挂起成功！');
                        resolve();
                    }
                })
            }
        });
    });
}