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
const serviceStatus = {

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
export const fServiceStatus = (status)=>{
    var str = ''
    switch (+status) {
        case 1:
            str = '待分配'
            break;
        case 2:
            str = '未开始'
            break;
        case 3:
            str = '外勤服务'
            break;
        case 4:
            str = '外勤会计服务'
            break;
        case 5:
            str = '会计服务'
            break;
        case 7:
            str = '结束'
            break;
        case 8:
            str = '中止'
            break;
    }
    return str
}
export const fCheckStatus = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '待审核'
            break;
        case 2:
            str = '已审核'
            break;
        case 3:
            str = '已驳回'
            break;
        case 4:
            str = '外勤提交'
            break;
        case 5:
            str = '部分确认'
            break;
        case 6:
            str = '已提交'
            break;
        case 7:
            str = '已结束'
            break;
        case 8:
            str = '已中止'
            break;
    }
    return str
}
export const fPartTax = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '国税报道'
            break;
        case 2:
            str = '地税报道'
            break;
    }
    return str
}
export const fMainTaskStatus = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '待分配'
            break;
        case 2:
            str = '待处理'
            break;
        case 3:
            str = '进行中'
            break;
        case 4:
            str = '已完成'
            break;
        case 5:
            str = '已取消'
            break;
    }
    return str
}
export const fSubTaskStatus = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '待分配'
            break;
        case 2:
            str = '待处理'
            break;
        case 3:
            str = '进行中'
            break;
        case 4:
            str = '已完成'
            break;
        case 5:
            str = '已取消'
            break;
    }
    return str
}

export const fSubTaskDetailStatus = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '待分配'
            break;
        case 2:
            str = '待处理'
            break;
        case 3:
            str = '进行中'
            break;
        case 4:
            str = '已取消'
            break;
        case 5:
            str = '已完成'
            break;
    }
    return str;
}
export const fOutworkStatus = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '启用'
            break;
        case 2:
            str = '停用'

            break;
    }
    return str
}
export const fOrderSource = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '电商'
            break;
        case 2:
            str = '天猫'

            break;
    }
    return str
}
export const fOrderStatus = function(status) {
    var str = ''
    switch (+status) {
        case 1:
            str = '审单待审核'
            break;
        case 2:
            str = '审单已审核'
            break;
        case 3:
            str = '审单驳回'
            break;
        case 4:
            str = '财务已审核/网店到款'
            break;
        case 5:
            str = '财务已驳回'
            break;
        case 6:
            str = '财务确认'
            break;
    }
    return str;
}

// 日期类
export const fDate =(val)=>{
    if((!val) || val.length<10 || val.substr(0,4)==='0001') return '';
    return val.substr(0, 10);
}

// 类型
export const fBusinessType = function(type) {
    var str = ''
    switch (+type) {
        case 1:
            str = '税务'
            break;
        case 2:
            str = '工商'
            break;
        case 3:
            str = '其他'
            break;
    }
    return str
}

// 费用类
export const fPrice =(val)=>{
    return '￥' + val.toFixed(2)
}
