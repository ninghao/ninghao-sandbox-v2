'use strict'

const Env = use('Env')

module.exports = {
  // 公众账号 ID
  appid: Env.get('WXPAY_APP_ID'),

  // 商户号
  mch_id: Env.get('WXPAY_MCH_ID'),

  // 密钥
  key: Env.get('WXPAY_KEY')
}
