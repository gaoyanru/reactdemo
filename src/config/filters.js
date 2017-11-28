const contractType = {
    1: '新增',
    2: '续费'
}
const contractStatus = { //合同，财务状态
    2: '待审核',
    3: '已审核',
    4: '已驳回',
    5: '已结束',
    8: '已中止'
}

//权限类
export const powerList = (plist)=>{
    if(Array.isArray(plist)){
        return (key)=>{ return plist.map(p=>p.FunctionKey).indexOf(key)>-1;}
    }
    return ()=>false;
}

// 状态类
export const fContractType = (val)=>{
    return contractType[val]||''
}
export const fContractStatus =(val)=>{
    return contractStatus[val]||''
}
export const fFinancialAuditStatus =(val)=>{
    return contractStatus[val]||''
}

// 日期类
export const fDate =(val)=>{
    if((!val) || val.length<10 || val.substr(0,4)==='0001') return '';
    return val.substr(0, 10);
}
