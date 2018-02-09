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
  /**
   * 支付。
   */
  async pay () {

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
