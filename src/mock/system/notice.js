import Mock from 'mockjs'
import { param2Obj } from '@/utils'
const noticeData = []
noticeData.push({
  id: 0,
  title: '我们',
  content: '<p>ppjfdxfkopuasi</p>',
  creationTime: Mock.mock('@now()')
})
var data
export default {
  // 获取公告
  getNoticeData: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    const pageList = noticeData.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 0,
      total: noticeData.length, // 线报总数
      items: pageList // 每一页显示的数据
    }
  },
  // 添加公告
  addNotice: config => {
    const { title, content } = JSON.parse(config.body)
    var idArry = []
    noticeData.forEach(item => {
      idArry.push(item.id)
    })

    if (idArry.length == 0) {
      var newId = 0
    } else if (idArry.length > 0) {
      var maxId = idArry.sort().reverse()[0]
      var newId = maxId + 1
    }

    if (title != null) {
      var addData = {
        id: newId,
        title: title,
        content: content,
        creationTime: Mock.mock('@now()')
      }
      noticeData.splice(0, 0, addData)
      data = {
        code: 0,
        msg: '添加成功'
      }
    } else {
      data = {
        code: 1,
        msg: '参数错误'
      }
    }
    return data
  },
  // 修改公告
  changeNotice: config => {
    const { id, title, content } = JSON.parse(config.body)
    noticeData.some(item => {
      if (item.id === id) {
        item.title = title,
        item.content = content
        data = {
          code: 0,
          msg: '修改成功'
        }
        return true
      } else {
        data = {
          code: 1,
          msg: '修改失败'
        }
        return false
      }
    })
    return data
  },
  // 删除公告
  deleteNotice: config => {
    const { id } = JSON.parse(config.body)
    var idArry = []
    noticeData.some(item => {
      idArry
      idArry.push(item.id)
      if (item.id === id) {
        var index = idArry.indexOf(id)
        noticeData.splice(index, 1)
        data = {
          code: 0,
          msg: '删除成功'
        }
      } else {
        data = {
          code: 1,
          msg: '参数错误'
        }
      }
    })
    return data
  }
}
