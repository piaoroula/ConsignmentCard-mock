import request from '@/utils/request'
/*
    查询所有的销卡渠道
 */
export function listConsumptionAll() {
    return request({
        url: '/api/manage/listConsumptionAll',
        method: 'get'
    })
}

/*
    查询通道可用的销卡渠道
 */
export function listConsumptionFaceValue(channelId) {
    return request({
        url: '/api/manage/listConsumptionFaceValue',
        method: 'get',
        params:{channelId}
    })
}


/*
     获取渠道和通道的对应关系
 */
export function listFaceValueJoinConsumption(consumptionId) {
    return request({
        url: '/api/manage/listFaceValueJoinConsumption',
        method: 'get',
        params:{consumptionId}
    })
}

/*
    打开某渠道支持通道
 */
export function openConsumptionChannel(consumptionId,channelId) {
    return request({
        url: '/api/manage/openConsumptionChannel',
        method: 'post',
        params:{consumptionId,channelId}
    })
}

/*
    关闭某渠道支持通道
 */
export function closeConsumptionChannel(consumptionId,channelId) {
    return request({
        url: '/api/manage/closeConsumptionChannel',
        method: 'post',
        params:{consumptionId,channelId}
    })
}

/*
    设置通道的渠道消耗顺序
 */
export function updateConsumptionFaceValueOrderBy(data) {
    return request({
        url: '/api/manage/updateConsumptionFaceValueOrderBy',
        method: 'post',
        data
    })
}


// /*
//     添加销卡渠道
//  */
// export function addConsumption(name) {
//     return request({
//         url: '/api/manage/addConsumption',
//         method: 'post',
//         data: { name: name }
//     })
// }
// /*
//     启用销卡渠道
//  */
// export function openConsumption(consumptionId) {
//     return request({
//         url: '/api/manage/getConsumptionLimit',
//         method: 'post',
//         data: { id: consumptionId, state: 'Y' }
//     })
// }
// /*
//    禁用销卡渠道
//  */
// export function closeConsumption(consumptionId) {
//     return request({
//         url: '/api/manage/updateConsumptionState',
//         method: 'post',
//         data: { id: consumptionId, state: 'N' }
//     })
// }
// /*
//     根据渠道Id查询可销卡面额
//  */
// export function getConsumptionFaceValues(consumptionId) {
//     return request({
//         url: '/api/manage/getConsumptionFaceValues',
//         method: 'get',
//         params: { consumptionId }
//     })
// }
// /*
//     添加可销卡面额
//  */
// export function addConsumptionFaceValue() {
//     return request({
//         url: '/api/manage/getConsumptionFaceValues',
//         method: 'post',
//         params
//     })
// }