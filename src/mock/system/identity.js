import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { UsersData, count } from './users'
var data
let identityData = []
for (var i = 0; i < count; i++) {
  identityData.push(Mock.mock({
    'id': i,
    'idCard': /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    'idImgFront|1': ['', "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536063806967&di=7d3b746a9de0ed3b1a9de2733b7f2ef4&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fupload%2F20170704%2F945018652b30453787e994e01b382f10_th.jpg"],

    'idImgBack|1': ['', "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536063806967&di=8f7926cb5cbb2b46c17b78cabc472063&imgtype=0&src=http%3A%2F%2Fs9.rr.itc.cn%2Fr%2FwapChange%2F20173_30_0%2Fa582am0432890537985.jpeg"],
    'idImgHold|1': ['', "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536063806967&di=7a6a4eaf99ca6f1262677f00f19820a7&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F015f8158d1ff0da801219c77f3b7fe.png%401280w_1l_2o_100sh.png"],
    'userId': 0,
  }))
}
identityData.forEach(items => {
  switch (items.idImgFront) {
    case '':
      items.idImgBack = ''
      items.idImgHold = ''
      break;
    case 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536063806967&di=7d3b746a9de0ed3b1a9de2733b7f2ef4&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fupload%2F20170704%2F945018652b30453787e994e01b382f10_th.jpg':
      items.idImgBack = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536063806967&di=8f7926cb5cbb2b46c17b78cabc472063&imgtype=0&src=http%3A%2F%2Fs9.rr.itc.cn%2Fr%2FwapChange%2F20173_30_0%2Fa582am0432890537985.jpeg'
      items.idImgHold = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536063806967&di=7a6a4eaf99ca6f1262677f00f19820a7&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F015f8158d1ff0da801219c77f3b7fe.png%401280w_1l_2o_100sh.png'
      break;
  }
})
export default {
  getIdentity: config => {
    const { id } = param2Obj(config.url)
    UsersData.some(k => {
      identityData.some(items => {
        if (k.id === JSON.parse(id)) {
          if (items.idImgFront != '') {
            data = {
              code: 0,
              data: items
            }
            return true
          } else if (items.idImgFront == '') {
            data = {
              code: 0,
              data: null
            }
            return true
          }
        } else {
          data = {
            code: 1,
            msg: '参数错误'
          }
          return false
        }
      })
    })
    return data
  }
}