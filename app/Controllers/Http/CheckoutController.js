'use strict'

const logger       = use('App/Services/Logger')
const Config       = use('Config')
const moment       = use('moment')
const randomString = use('randomstring')
const queryString  = use('querystring')
const crypto       = use('crypto')
const axios        = use('axios')

/**
 * 结账控制器。
 */
class CheckoutController {
  aliPayRequestUrl (requestParams, sign) {
    const gateway = Config.get('alipay.api.gateway')

    const requestParamsString = queryString.stringify({
      ...requestParams,
      sign
    })

    const requestUrl = `${ gateway }?${ requestParamsString }`

    return requestUrl
  }

  aliPayPreSign (data) {
    const sortedData = Object.keys(data).sort().reduce((accumulator, key) => {
      const itemValue = data[key].trim()

      if (!itemValue) {
        return accumulator
      }

      accumulator[key] = itemValue

      return accumulator
    }, {})

    const dataString = queryString.stringify(sortedData, null, null, {
      encodeURIComponent: queryString.unescape
    })

    return dataString
  }

  aliPaySign (data, preProcess = this.aliPayPreSign) {
    const privateKey = Config.get('alipay.privateKey')
    const dataString = preProcess(data)

    const sign = crypto.createSign('sha256')
      .update(dataString)
      .sign(privateKey, 'base64')

    return sign
  }

  aliPayCommonParams (method) {
    const app_id = Config.get('alipay.app_id')
    const charset = 'utf-8'
    const sign_type = 'RSA2'
    const timestamp = moment().local().format('YYYY-MM-DD HH:mm:ss')
    const version = '1.0'

    const notify_url = Config.get('alipay.notify_url')
    const return_url = Config.get('alipay.return_url')

    let commonParams = {
      app_id,
      charset,
      sign_type,
      timestamp,
      version,
      method
    }

    switch (method) {
      case 'alipay.trade.page.pay':
        commonParams = {
          ...commonParams,
          notify_url,
          return_url
        }
        break
    }

    return commonParams
  }

  /**
   * 支付。
   */
  async pay () {
    /**
     * 公共参数
     */
    const commonParams = this.aliPayCommonParams('alipay.trade.page.pay')
    logger.debug('公共参数：', commonParams)

    /**
     * 请求参数
     */
    const out_trade_no = moment().local().format('YYYYMMDDHHmmss')
    const product_code = 'FAST_INSTANT_TRADE_PAY'
    const total_amount = '0.03'
    const subject = 'ninghao'

    const biz_content = JSON.stringify({
      out_trade_no,
      product_code,
      total_amount,
      subject
    })

    const requestParams = {
      ...commonParams,
      biz_content
    }

    logger.debug('请求参数：', requestParams)

    /**
     * 签名
     */
    const sign = this.aliPaySign(requestParams)
    logger.debug('签名：', sign)

    /**
     * 请求地址
     */
    const requestUrl = this.aliPayRequestUrl(requestParams, sign)

    return requestUrl
  }

  /**
   * 处理支付结果通知。
   */
  aliPayNotify () {

  }

  /**
   * 查询。
   */
  async query ({ session }) {

  }

  /**
   * 订单完成提示。
   */
  completed ({ view }) {
    /**
     * 返回渲染视图。
     */
    return view.render('commerce.completed')
  }

  /**
   * 结账页面。
   */
  async render ({ view }) {
    /**
     * 渲染结账页面视图。
     */
    return view.render('commerce.checkout')
  }
}

module.exports = CheckoutController
