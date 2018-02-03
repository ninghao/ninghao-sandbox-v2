'use strict'

const logger       = use('App/Services/Logger')
const Config       = use('Config')
const moment       = use('moment')
const randomString = use('randomstring')
const queryString  = use('querystring')
const crypto       = use('crypto')
const convert      = use('xml-js')
const axios        = use('axios')

class CheckoutController {
  async query () {
    logger.info('请求查询 -----------------------')
    return '查询结果'
  }

  completed ({ view }) {
    return view.render('commerce.completed')
  }

  async pay ({ request }) {
    logger.info('请求支付 ------------------------')

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
    const trade_type = 'MWEB'

    // 用户 IP
    const spbill_create_ip = request.header('x-real-ip')

    // 商品 ID
    const product_id = 1

    // 通知地址
    const notify_url = Config.get('wxpay.notify_url')

    // 随机字符
    const nonce_str = randomString.generate(32)

    // 统一下单接口
    const unifiedOrderApi = Config.get('wxpay.api.unifiedorder')

    let order = {
      appid,
      mch_id,
      out_trade_no,
      body,
      total_fee,
      trade_type,
      product_id,
      notify_url,
      nonce_str,
      spbill_create_ip
    }

    const sign = this.wxPaySign(order, key)

    const xmlOrder = this.orderToXML(order, sign)

    // 调用统一下单接口
    const wxPayResponse = await axios.post(unifiedOrderApi, xmlOrder)

    const data = this.xmlToJS(wxPayResponse.data)

    logger.debug(data)

    return data.mweb_url
  }

  xmlToJS (xmlData) {
    const _data = convert.xml2js(xmlData, {
      compact: true,
      cdataKey: 'value',
      textKey: 'value'
    }).xml

    const data = Object.keys(_data).reduce((accumulator, key) => {
      accumulator[key] = _data[key].value
      return accumulator
    }, {})

    return data
  }

  orderToXML (order, sign) {
    order = {
      xml: {
        ...order,
        sign
      }
    }

    // 转换成 xml 格式
    const xmlOrder = convert.js2xml(order, {
      compact: true
    })

    return xmlOrder
  }

  wxPaySign (data, key) {
    // 1. 排序
    const sortedOrder = Object.keys(data).sort().reduce((accumulator, key) => {
      accumulator[key] = data[key]
      // logger.debug(accumulator)
      return accumulator
    }, {})

    // 2. 转换成地址查询符
    const stringOrder = queryString.stringify(sortedOrder, null, null, {
      encodeURIComponent: queryString.unescape
    })

    // 3. 结尾加上密钥
    const stringOrderWithKey = `${ stringOrder }&key=${ key }`

    // 4. md5 后全部大写
    const sign = crypto.createHash('md5').update(stringOrderWithKey).digest('hex').toUpperCase()

    return sign
  }

  async render ({ view }) {
    return view.render('commerce.checkout')
  }

  wxPayNotify ({ request }) {
    logger.warn('---------------------------------------------------')
    logger.info(request)

    // logger.debug(request)
    const _payment = convert.xml2js(request._raw, {
      compact: true,
      cdataKey: 'value',
      textKey: 'value'
    }).xml

    const payment = Object.keys(_payment).reduce((accumulator, key) => {
      accumulator[key] = _payment[key].value
      return accumulator
    }, {})

    logger.info('支付结果：', payment)

    const paymentSign = payment.sign

    logger.info('结果签名：', paymentSign)

    delete payment['sign']

    const key = Config.get('wxpay.key')

    const selfSign = this.wxPaySign(payment, key)

    logger.info('自制签名：', selfSign)

    const return_code = paymentSign === selfSign ? 'SUCCESS' : 'FAIL'

    logger.debug('回复代码：', return_code)

    const reply = {
      xml: {
        return_code
      }
    }

    return convert.js2xml(reply, {
      compact: true
    })
  }
}

module.exports = CheckoutController
