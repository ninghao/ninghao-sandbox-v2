'use strict'

const Env = use('Env')

module.exports = {
  appSecret: Env.get('WXMP_APP_SECRET'),
  open: {
    auth: 'https://open.weixin.qq.com/connect/oauth2/authorize'
  },
  api: {
    accessToken: 'https://api.weixin.qq.com/sns/oauth2/access_token'
  }
}
