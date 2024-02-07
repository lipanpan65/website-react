// 获取cookie
export const getCookie: (any | null) = (name?: any) => {
  const cookies = document.cookie
  const list = cookies.split("; ")
  for (let i = 0; i < list.length; i++) {
    const arr = list[i].split("=")
    if (arr[0] === name) {
      return decodeURIComponent(arr[1],)
    }
  }
  return null
}
// 清除所有 cookie
//清空cookie
export const clearCookie = () => {
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()//清除当前域名下的,例如：m.kevis.com
      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()//清除当前域名下的，例如 .m.kevis.com
      document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString()//清除一级域名下的或指定的，例如 .kevis.com
    }
  }
}
