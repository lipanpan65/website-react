
export const type = {
    isFunction(v: any) {
      return typeof (v) === 'function'
    },
    isString(v: any) {
      return typeof (v) === 'string'
    },
    isArray(v: any) {
      return v instanceof Array
    },
    isObject(v: any) {
      return typeof (v) === 'object'
    }
  }

// 格式化时间
const dateFormate: any = (date: any, format: any = null, shift: any = null) => {
    // 判断 format 的类型
    format = type.isString(format) ? format : 'YYYY-MM-DD HH:mm:ss'
    // 格式化字段
    shift = type.isFunction(shift) ? shift : (m: any) => m
    return date && shift(moment(date)).format(format)
  }