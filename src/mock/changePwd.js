import Mock from 'mockjs'
import { param2Obj } from '@/utils'


export default {
  upPass: config => {
    const { OldPassword, NewPassword, ConfirmPassword } = JSON.parse(config.body)
    if (OldPassword != undefined && NewPassword != undefined && ConfirmPassword) {
      return {
        code: 0,
        msg: '"密码已修改", "您的密码已经修改成功，如非本人操作，请立即联系我们"'
      }
    } else {
      return {
        code: 1,
        msg: '非法表单'
      }
    }
  }

}