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

const parseIntAndGetMax = function (val1, val2) {
  return Math.max(parseInt(val1, 10), parseInt(val2, 10))
}

/**
 * image size
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export const getImageSize = (url, callback) => {
  const img = document.createElement('img')

  function done(width, height) {
    if (img.parentNode) {
      img.parentNode.removeChild(img)
    }

    callback({ width, height })
  }

  img.onload = function () {
    const width = parseIntAndGetMax(img.width, img.clientWidth)
    const height = parseIntAndGetMax(img.height, img.clientHeight)
    done(width, height)
  }

  img.onerror = function () {
    done(0, 0)
  }

  const style = img.style
  style.visibility = 'hidden'
  style.position = 'fixed'
  style.bottom = style.left = '0px'
  style.width = style.height = 'auto'

  document.body.appendChild(img)
  img.src = url
}