'use strict'

const logger = use('App/Services/Logger')

class CheckoutController {
  render ({ view }) {
    logger.debug('debug log ~')
    logger.info('info log ~')
    logger.warn('warn log ~')
    logger.error('error log ~')
    logger.fatal('fatal log ~')

    return view.render('commerce.checkout')
  }
}

module.exports = CheckoutController
