'use strict'

const Env = use('Env')

module.exports = {
  app_id: Env.get('ALIPAY_APP_ID'),
  notify_url: Env.get('ALIPAY_NOTIFY_URL'),
  return_url: Env.get('ALIPAY_RETURN_URL'),
  api: {
    gateway: Env.get('ALIPAY_GATEWAY')
  }
}
