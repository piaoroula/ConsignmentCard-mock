export function cardsConvert(text) {
  if (text != null && text.length > 1) {
    // 非字母和数字 替换成空格
    text = text.replace(/[^a-zA-Z0-9\n]/gim, ' ')
    // 多个空格替换成一个空格
    text = text.replace(/ {2,}/gim, ' ')
    // 删除空行
    text = text.replace(/\n(\n)*( )*(\n)*\n/g, '\n')
    // 删首尾空
    text = text.replace(/(^\s*)|(\s*$)/gim, '')
    // 过滤重复
    var arr = text.split('\n')
    var newDataArr = []
    for (var i = 0; i < arr.length; i++) {
      var napArr = arr[i].split(' ')
      var nap = ''
      if (napArr.length >= 2) {
        if (napArr.length === 2) {
          // 符合卡密逻辑
          nap = arr[i]
        } else {
          var tempNapArr = []
          for (var j = 0; j < napArr.length; j++) {
            if (napArr[j].length >= 6 && napArr[j].length <= 20) {
              tempNapArr.push(napArr[j])
            }
            nap = tempNapArr.join(' ')
          }
          if (tempNapArr.length !== 2) {
            continue
          }
        }
      } else {
        continue
      }
      if (newDataArr.indexOf(nap) > -1) {
        continue
      } else {
        newDataArr.push(nap)
      }
    }
    return newDataArr
  }
  return null
}

export function productTempConvert(text) {
  if (text != null && text.length > 1) {
    // 多个空格替换成一个空格
    text = text.replace(/ {2,}/gim, ' ')
    // 删除空行
    text = text.replace(/\n(\n)*( )*(\n)*\n/g, '\n')
    // 删首尾空
    text = text.replace(/(^\s*)|(\s*$)/gim, '')
    // 过滤重复
    var arr = text.split('\n')
    var newDataArr = []
    for (var i = 0; i < arr.length; i++) {
      var nap = arr[i]
      if (newDataArr.indexOf(nap) > -1) {
        continue
      } else {
        newDataArr.push(nap)
      }
    }
    return newDataArr
  }
  return null
}