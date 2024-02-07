import moment from 'moment'

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
export const dateFormate: any = (date: any, format: any = null, shift: any = null) => {
    // 判断 format 的类型
    format = type.isString(format) ? format : 'YYYY-MM-DD HH:mm:ss'
    // 格式化字段
    shift = type.isFunction(shift) ? shift : (m: any) => m
    return date && shift(moment(date)).format(format)
  }

  export const timedeltaFormate: any = (timedelta: any) => {
    const oneMinute = 60
    const oneHour = 60 * oneMinute
    const oneDay = 24 * oneHour
    let intTimedelta = parseInt(timedelta)
    if (intTimedelta >= oneDay) {
      const days = Math.floor(intTimedelta / oneDay)
      intTimedelta = Math.floor(intTimedelta % oneDay)
      const hours = Math.floor(intTimedelta / oneHour)
      intTimedelta = Math.floor(intTimedelta % oneHour)
      const minutes = Math.floor(intTimedelta / oneMinute)
      return `${days}天${hours}时${minutes}分`
    } else if (intTimedelta >= oneHour) {
      const hours = Math.floor(intTimedelta / oneHour)
      intTimedelta = Math.floor(intTimedelta % oneHour)
      const minutes = Math.floor(intTimedelta / oneMinute)
      const seconds = Math.floor(intTimedelta % oneMinute)
      return `${hours}时${minutes}分${seconds}秒`
    } else if (intTimedelta >= oneMinute) {
      const minutes = Math.floor(intTimedelta / oneMinute)
      const seconds = Math.floor(intTimedelta % oneMinute)
      return `${minutes}分${seconds}秒`
    }
  }



