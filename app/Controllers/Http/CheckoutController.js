'use strict'

const logger       = use('App/Services/Logger')
const Config       = use('Config')
const moment       = use('moment')
const randomString = use('randomstring')

class CheckoutController {
  render ({ view }) {
    // 公众账号 ID
    const appid = Config.get('wxpay.appid')

    // 商户号
    const mch_id = Config.get('wxpay.mch_id')

    // 密钥
    const key = Config.get('wxpay.key')

    // 商户订单号
    const out_trade_no = moment().local().format('YYYYMMDDHHmmss')

    // 商品描述
    const body = 'ninghao'

    // 商品价格
    const total_fee = 3

    // 支付类型
    const trade_type = 'NATIVE'

    // 商品 ID
    const product_id = 1

    // 通知地址
    const notify_url = Config.get('wxpay.notify_url')

    // 随机字符
    const nonce_str = randomString.generate(32)

    let order = {
      appid,
      mch_id,
      out_trade_no,
      body,
      total_fee,
      product_id,
      notify_url,
      nonce_str
    }

    return view.render('commerce.checkout')
  }

  wxPayNotify () {

  }
}

module.exports = CheckoutController
