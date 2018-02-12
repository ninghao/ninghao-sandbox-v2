'use strict'

const logger       = use('App/Services/Logger')
const Config       = use('Config')
const moment       = use('moment')
const randomString = use('randomstring')
const queryString  = use('querystring')
const crypto       = use('crypto')
const axios        = use('axios')
const useragent    = use('useragent')

/**
 * 结账控制器。
 */
class CheckoutController {
  aliPayVerifySign (data, preProcess = this.aliPayPreSign) {
    const aliPayPublicKey = Config.get('alipay.aliPayPublicKey')
    const sign = data.sign
    delete data.sign
    delete data.sign_type

    const dataString = preProcess(data)

    const result = crypto.createVerify('sha256')
      .update(dataString)
      .verify(aliPayPublicKey, sign, 'base64')

    return result
  }

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
      case 'alipay.trade.wap.pay':
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
  async pay ({ request }) {
    const userBrowser = useragent.is(request.header('user-agent'))
    logger.debug('userBrowser: ', userBrowser)
    const method = (userBrowser.mobile_safari || userBrowser.android) ?
      'alipay.trade.wap.pay' : 'alipay.trade.page.pay'

    /**
     * 公共参数
     */
    const commonParams = this.aliPayCommonParams(method)
    logger.debug('公共参数：', commonParams)

    /**
     * 请求参数
     */
    const out_trade_no = moment().local().format('YYYYMMDDHHmmss')
    const product_code = (userBrowser.mobile_safari || userBrowser.android) ?
      'QUICK_WAP_WAY' : 'FAST_INSTANT_TRADE_PAY'
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
  aliPayNotify ({ request }) {
    const paymentNotification = request.all()
    logger.debug('支付结果通知：', paymentNotification)

    const signVerified = this.aliPayVerifySign(paymentNotification)
    logger.debug('验证签名的结果：', signVerified)

    if (!signVerified) {
      return 'failure'
    }

    return 'success'
  }

  /**
   * 查询。
   */
  async query ({ session }) {
    const commonParams = this.aliPayCommonParams('alipay.trade.query')
    const trade_no = session.get('trade_no')
    const biz_content = JSON.stringify({
      trade_no
    })

    const requestParams = {
      ...commonParams,
      biz_content
    }
    const sign = this.aliPaySign(requestParams)

    const requestUrl = this.aliPayRequestUrl(requestParams, sign)

    const _response = await axios.post(requestUrl)
    logger.debug('交易查询结果：', _response.data)
    const aliPayTradeQueryResponse = _response.data.alipay_trade_query_response

    if (aliPayTradeQueryResponse.code === '10000') {
      switch (aliPayTradeQueryResponse.trade_status) {
        case 'TRADE_SUCCESS':
          return 'success'
          break
      }
    }

    return 'failure'
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
  async render ({ view, request, session }) {
    const returnUrlData = request.all()
    logger.debug('返回地址上的数据：', returnUrlData)

    const trade_no = request.input('trade_no')

    if (trade_no) {
      session.put('trade_no', trade_no)
    }

    /**
     * 渲染结账页面视图。
     */
    return view.render('commerce.checkout')
  }
}

module.exports = CheckoutController
