'use strict'

const Env = use('Env')

const privateKey =
  '-----BEGIN RSA PRIVATE KEY-----\n' +
  Env.get('ALIPAY_APP_PRIVATE_KEY') +
  '\n-----END RSA PRIVATE KEY-----'

const aliPayPublicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  Env.get('ALIPAY_PUBLIC_KEY') +
  '\n-----END PUBLIC KEY-----'

module.exports = {
  privateKey,
  aliPayPublicKey,
  app_id: Env.get('ALIPAY_APP_ID'),
  notify_url: Env.get('ALIPAY_NOTIFY_URL'),
  return_url: Env.get('ALIPAY_RETURN_URL'),
  api: {
    gateway: Env.get('ALIPAY_GATEWAY')
  }
}
