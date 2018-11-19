/**
 * 指定区域外点击 触发回调
 * @param cname                   require           点击区域最外层dom class name
 * @param done                    require           区域外点击执行回调
 */
export const domClickHandle = (cname, done) => {
  try {
    document.addEventListener('click', function (e) {
      let classNameArr = []
      for (let item of e.path) {
        item.className && classNameArr.push(item.className)
      }
      if (!String(classNameArr).includes(cname)) {
        if (done) done()
      }
    })
  } catch (err) {
    console.log('domClickHandle:error', err)
  }
}