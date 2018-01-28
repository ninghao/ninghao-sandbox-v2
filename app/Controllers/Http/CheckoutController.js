'use strict'

const logger = use('App/Services/Logger')
const Config = use('Config')

class CheckoutController {
  render ({ view }) {
    // 公众账号 ID
    const appid = Config.get('wxpay.appid')

    // 商户号
    const mch_id = Config.get('wxpay.mch_id')

    // 密钥
    const key = Config.get('wxpay.key')

    return view.render('commerce.checkout')
  }
}

module.exports = CheckoutController
